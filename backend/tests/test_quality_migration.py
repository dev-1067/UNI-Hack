import pytest
from sqlalchemy.pool import StaticPool
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from fastapi.testclient import TestClient

from backend.database import Base, get_db
from backend.models.db_models import Product, QualityIssue
from backend.api import app

@pytest.fixture
def quality_test_setup():
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

def test_quality_migration_lifecycle(quality_test_setup):
    client, TestingSessionLocal = quality_test_setup

    # 1. Seed a test product and associated quality issue in the test DB
    db = TestingSessionLocal()
    test_prod = Product(
        sku="NXR-QLT-001",
        name="Industrial Air Compressor 50L",
        brand="AirForce Pro",
        category="Machinery / Compressors",
        price="$549.00",
        stock=25,
        quality_score=72,
        status="Review",
        attributes={"Tank Capacity": "50L"}
    )
    db.add(test_prod)
    db.commit()
    db.refresh(test_prod)

    test_issue = QualityIssue(
        product_id=test_prod.id,
        issue_type="Missing Attribute",
        field_name="Max Pressure PSI",
        severity="high",
        message="Missing required Max Pressure specification",
        suggestion="115 PSI",
        status="Unresolved"
    )
    db.add(test_issue)
    db.commit()
    db.refresh(test_issue)
    issue_id = str(test_issue.id)
    prod_id = str(test_prod.id)
    db.close()

    # 2. Test GET /api/quality
    list_res = client.get("/api/quality")
    assert list_res.status_code == 200
    res_data = list_res.json()
    assert res_data["success"] is True
    assert any(q["id"] == issue_id for q in res_data["data"])

    # 3. Test GET /api/quality/{id}
    get_res = client.get(f"/api/quality/{issue_id}")
    assert get_res.status_code == 200
    assert get_res.json()["data"]["attribute"] == "Max Pressure PSI"
    assert get_res.json()["data"]["status"] == "Unresolved"

    # 4. Test POST /api/quality/{id}/fix (Manual Resolution & Score Recalculation)
    fix_res = client.post(
        f"/api/quality/{issue_id}/fix",
        json={
            "attribute": "Max Pressure PSI",
            "value": "125 PSI"
        }
    )
    assert fix_res.status_code == 200
    assert fix_res.json()["success"] is True
    assert fix_res.json()["data"]["status"] == "Resolved"
    assert fix_res.json()["data"]["applied_value"] == "125 PSI"

    # Verify Product score was boosted and attribute was saved
    prod_res = client.get(f"/api/products/{prod_id}")
    assert prod_res.status_code == 200
    updated_prod = prod_res.json()["data"]
    assert updated_prod["quality"] >= 80
    assert updated_prod["attributes"]["Max Pressure PSI"] == "125 PSI"

    # 5. Test AI Auto-Fix
    db = TestingSessionLocal()
    test_issue_2 = QualityIssue(
        product_id=prod_id,
        issue_type="Missing Standard",
        field_name="Noise Level",
        severity="medium",
        message="Noise level specification missing",
        suggestion="68 dB(A) Ultra Quiet",
        status="Unresolved"
    )
    db.add(test_issue_2)
    db.commit()
    db.refresh(test_issue_2)
    issue_2_id = str(test_issue_2.id)
    db.close()

    ai_fix_res = client.post(f"/api/quality/{issue_2_id}/fix-ai")
    assert ai_fix_res.status_code == 200
    assert ai_fix_res.json()["success"] is True
    assert ai_fix_res.json()["data"]["status"] == "Resolved"
    assert "68 dB(A)" in ai_fix_res.json()["data"]["ai_inferred_value"]

    # 6. Test Error Handling (Invalid Issue ID)
    not_found_res = client.post("/api/quality/non_existent_issue_id/fix", json={"attribute": "test", "value": "val"})
    assert not_found_res.status_code == 404
    assert not_found_res.json()["success"] is False
