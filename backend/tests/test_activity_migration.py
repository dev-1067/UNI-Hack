import pytest
from sqlalchemy.pool import StaticPool
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from fastapi.testclient import TestClient

from backend.database import Base, get_db
from backend.models.db_models import ActivityLog, User
from backend.api import app

@pytest.fixture
def activity_test_setup():
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

def test_activity_migration_lifecycle(activity_test_setup):
    client, TestingSessionLocal = activity_test_setup

    # 1. Test GET /api/activity (Seed & List initial logs)
    list_res = client.get("/api/activity")
    assert list_res.status_code == 200
    res_data = list_res.json()
    assert res_data["success"] is True
    assert len(res_data["data"]) >= 0

    # 2. Test POST /api/activity (Create Product Log)
    prod_log = client.post(
        "/api/activity",
        json={
            "action": "Product Created",
            "entity_type": "product",
            "entity_id": "NXR-ACT-001",
            "user_name": "Nitin Singh",
            "target": "Industrial Laser Distance Meter",
            "metadata": {"sku": "NXR-ACT-001", "price": "$189.00"}
        }
    )
    assert prod_log.status_code == 201
    created_data = prod_log.json()["data"]
    assert created_data["action"] == "Product Created"
    assert created_data["entity_id"] == "NXR-ACT-001"
    log_id = created_data["id"]

    # 3. Test Newest-First Ordering
    # Create another log
    qlt_log = client.post(
        "/api/activity",
        json={
            "action": "Fixed Quality Issue",
            "entity_type": "quality_issue",
            "entity_id": "q99",
            "user_name": "AI Governance",
            "target": "Industrial Laser Distance Meter: Beam Accuracy",
            "metadata": {"attribute": "Beam Accuracy", "applied_value": "±1.5mm"}
        }
    )
    assert qlt_log.status_code == 201

    # Retrieve all logs and verify newest event is at index 0
    refreshed_list = client.get("/api/activity")
    assert refreshed_list.status_code == 200
    all_logs = refreshed_list.json()["data"]
    assert all_logs[0]["action"] == "Fixed Quality Issue"
    assert all_logs[1]["action"] == "Product Created"

    # 4. Verify DB direct persistence & nullable user_id
    db = TestingSessionLocal()
    db_entry = db.query(ActivityLog).filter(ActivityLog.id == log_id).first()
    assert db_entry is not None
    assert db_entry.action == "Product Created"
    assert db_entry.user_id is None # Nullable user_id as per specs
    assert db_entry.metadata_json["sku"] == "NXR-ACT-001"
    db.close()

    # 5. Test AI Enrichment Activity Creation
    enr_log = client.post(
        "/api/activity",
        json={
            "action": "AI Enriched Product",
            "entity_type": "enrichment",
            "entity_id": "NXR-ACT-001",
            "user_name": "Aarav Sharma",
            "target": "Industrial Laser Distance Meter (Professional/English)",
            "metadata": {"tone": "Professional", "language": "English"}
        }
    )
    assert enr_log.status_code == 201

    # 6. Test Integration Activity Creation
    int_log = client.post(
        "/api/activity",
        json={
            "action": "Connected Channel",
            "entity_type": "integration",
            "entity_id": "shopify",
            "user_name": "System Admin",
            "target": "Shopify Storefront",
            "metadata": {"channel": "Shopify", "status": "connected"}
        }
    )
    assert int_log.status_code == 201

    # 7. Test Catalog Approval Activity Creation
    cat_log = client.post(
        "/api/activity",
        json={
            "action": "Processed Catalog Document",
            "entity_type": "catalog",
            "entity_id": "spec_sheet_laser_meter.pdf",
            "user_name": "Nitin Singh",
            "target": "spec_sheet_laser_meter.pdf",
            "metadata": {"extracted_fields": 28, "confidence": 0.94}
        }
    )
    assert cat_log.status_code == 201

    # 8. Test Entity Type Filtering
    filter_res = client.get("/api/activity?entity_type=integration")
    assert filter_res.status_code == 200
    integration_logs = filter_res.json()["data"]
    assert len(integration_logs) >= 1
    assert all(item["entity_type"] == "integration" for item in integration_logs)
