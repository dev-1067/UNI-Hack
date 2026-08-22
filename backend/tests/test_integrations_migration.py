import pytest
from sqlalchemy.pool import StaticPool
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from fastapi.testclient import TestClient

from backend.database import Base, get_db
from backend.models.db_models import Integration, SyncJob
from backend.api import app

@pytest.fixture
def integrations_test_setup():
    test_engine = create_engine(
        "sqlite:///:memory:",
        connect_args={"check_same_thread": False},
        poolclass=StaticPool
    )
    Base.metadata.create_all(bind=test_engine)
    TestingSessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=test_engine)

    def override_get_db():
        db = TestingSessionLocal()
        try:
            yield db
        finally:
            db.close()

    app.dependency_overrides[get_db] = override_get_db
    with TestClient(app) as client:
        yield client, TestingSessionLocal
    app.dependency_overrides.clear()

def test_integrations_migration_lifecycle(integrations_test_setup):
    client, TestingSessionLocal = integrations_test_setup

    # 1. Test GET /api/integrations (Seed & List Channels)
    list_res = client.get("/api/integrations")
    assert list_res.status_code == 200
    res_data = list_res.json()
    assert res_data["success"] is True
    channels = [item["channel"] for item in res_data["data"]]
    assert "Shopify" in channels
    assert "Amazon" in channels

    # 2. Test POST /api/integrations/{channel}/connect
    conn_res = client.post("/api/integrations/amazon/connect")
    assert conn_res.status_code == 200
    assert conn_res.json()["success"] is True
    assert conn_res.json()["data"]["status"] == "connected"

    # Verify DB persistence of connected status
    db = TestingSessionLocal()
    db_amazon = db.query(Integration).filter(Integration.channel == "Amazon").first()
    assert db_amazon is not None
    assert db_amazon.status == "connected"
    amazon_id = db_amazon.id
    db.close()

    # 3. Duplicate Connect (Idempotent update)
    dup_conn = client.post("/api/integrations/amazon/connect")
    assert dup_conn.status_code == 200
    db = TestingSessionLocal()
    amazon_count = db.query(Integration).filter(Integration.channel == "Amazon").count()
    assert amazon_count == 1
    db.close()

    # 4. Test POST /api/integrations/{channel}/sync (Successful Sync)
    sync_res = client.post("/api/integrations/amazon/sync")
    assert sync_res.status_code == 200
    sync_data = sync_res.json()["data"]
    assert sync_data["status"] == "completed"
    assert sync_data["last_sync_at"] is not None

    # Verify SyncJob persistence in DB
    db = TestingSessionLocal()
    jobs = db.query(SyncJob).filter(SyncJob.integration_id == amazon_id).all()
    assert len(jobs) >= 1
    assert jobs[-1].status == "completed"
    assert jobs[-1].completed_at is not None
    db.close()

    # 5. Test Failed Sync Handling
    fail_res = client.post("/api/integrations/amazon/sync?fail=true")
    assert fail_res.status_code == 200
    fail_data = fail_res.json()["data"]
    assert fail_data["status"] == "failed"
    assert "timeout" in fail_data["error_message"]

    db = TestingSessionLocal()
    failed_jobs = db.query(SyncJob).filter(
        SyncJob.integration_id == amazon_id,
        SyncJob.status == "failed"
    ).all()
    assert len(failed_jobs) == 1
    assert "timeout" in failed_jobs[0].error_message
    db.close()

    # 6. Test Retry after failed sync
    retry_res = client.post("/api/integrations/amazon/sync")
    assert retry_res.status_code == 200
    assert retry_res.json()["data"]["status"] == "completed"

    # 7. Test POST /api/integrations/{channel}/disconnect
    disc_res = client.post("/api/integrations/amazon/disconnect")
    assert disc_res.status_code == 200
    assert disc_res.json()["data"]["status"] == "disconnected"

    # Verify Disconnect in DB and that historical sync jobs are preserved
    db = TestingSessionLocal()
    updated_amazon = db.query(Integration).filter(Integration.channel == "Amazon").first()
    assert updated_amazon.status == "disconnected"
    all_jobs = db.query(SyncJob).filter(SyncJob.integration_id == amazon_id).all()
    # At least 3 sync jobs (1 success, 1 fail, 1 retry) preserved in history
    assert len(all_jobs) >= 3
    db.close()

    # 8. Test Connecting a new custom channel
    custom_res = client.post("/api/integrations/flipkart/connect")
    assert custom_res.status_code == 200
    assert custom_res.json()["data"]["channel"] == "Flipkart"
    assert custom_res.json()["data"]["status"] == "connected"
