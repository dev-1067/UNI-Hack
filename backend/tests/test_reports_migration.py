import pytest
from sqlalchemy.pool import StaticPool
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from fastapi.testclient import TestClient

from backend.database import Base, get_db
from backend.models.db_models import Product, QualityIssue, Enrichment, Integration, Report
from backend.api import app

@pytest.fixture
def reports_test_setup():
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

def test_reports_migration_lifecycle(reports_test_setup):
    client, TestingSessionLocal = reports_test_setup

    # 1. Seed database with real test entities
    db = TestingSessionLocal()
    p1 = Product(
        sku="REP-SKU-001",
        name="Precision Torque Wrench 1/2 in.",
        category="Hand Tools / Torque",
        brand="TitanTorque",
        price="$129.99",
        stock=50,
        quality_score=94,
        status="Active",
        ai_enriched=True
    )
    p2 = Product(
        sku="REP-SKU-002",
        name="Industrial Safety Gloves (Pair)",
        category="Safety / PPE",
        brand="SafeGuard",
        price="$19.50",
        stock=200,
        quality_score=72,
        status="Review",
        ai_enriched=False
    )
    db.add_all([p1, p2])
    db.commit()

    q1 = QualityIssue(
        product_id=p2.id,
        issue_type="Missing Attribute",
        field_name="Material",
        severity="high",
        message="Missing glove material composition",
        status="Unresolved"
    )
    db.add(q1)

    i1 = Integration(
        channel="Shopify",
        status="connected",
        sync_status="completed"
    )
    db.add(i1)
    db.commit()
    db.close()

    # 2. Test GET /api/reports (Report List & Dynamic Trends)
    list_res = client.get("/api/reports")
    assert list_res.status_code == 200
    res_data = list_res.json()
    assert res_data["success"] is True
    assert "reports" in res_data["data"]
    assert len(res_data["data"]["reports"]) >= 1
    assert "chartData" in res_data["data"]
    assert len(res_data["data"]["chartData"]) == 7

    # 3. Test GET /api/reports/{id} (Live DB Statistics Verification)
    detail_res = client.get("/api/reports/rep_1")
    assert detail_res.status_code == 200
    detail_data = detail_res.json()["data"]
    stats = detail_data["statistics"]
    assert stats["products"]["total"] == 2
    assert stats["products"]["active"] == 1
    assert stats["products"]["review"] == 1
    assert stats["products"]["enriched"] == 1
    assert stats["products"]["avg_quality_score"] == 83
    assert stats["quality"]["open_issues_count"] == 1
    assert stats["quality"]["high_severity_count"] == 1
    assert stats["integrations"]["connected_channels"] == 1

    # 4. Test POST /api/reports/export - Catalog CSV
    exp_cat = client.post("/api/reports/export", json={"reportType": "catalog", "dateRange": "30d", "format": "csv"})
    assert exp_cat.status_code == 200
    assert exp_cat.headers["content-type"].startswith("text/csv")
    csv_text = exp_cat.text
    assert "REP-SKU-001" in csv_text
    assert "Precision Torque Wrench" in csv_text
    assert "REP-SKU-002" in csv_text

    # 5. Test POST /api/reports/export - Quality CSV
    exp_qlt = client.post("/api/reports/export", json={"reportType": "quality", "dateRange": "30d", "format": "csv"})
    assert exp_qlt.status_code == 200
    assert "Missing glove material composition" in exp_qlt.text
    assert "Material" in exp_qlt.text

    # 6. Test POST /api/reports/export - Enrichment CSV
    exp_enr = client.post("/api/reports/export", json={"reportType": "enrichment", "dateRange": "30d", "format": "csv"})
    assert exp_enr.status_code == 200
    assert "Enriched" in exp_enr.text
    assert "Pending" in exp_enr.text

    # 7. Test POST /api/reports/export - Channel Readiness CSV
    exp_chn = client.post("/api/reports/export", json={"reportType": "channels", "dateRange": "30d", "format": "csv"})
    assert exp_chn.status_code == 200
    assert "Shopify" in exp_chn.text

    # 8. Test Dynamic Update: Add a product and verify report statistics update reactively
    client.post("/api/products", json={
        "sku": "REP-SKU-003",
        "name": "Heavy Duty Bench Grinder",
        "brand": "NEXORA Pro",
        "category": "Machinery / Grinders",
        "price": "$349.00",
        "stock": 10,
        "quality": 95,
        "status": "Active"
    })

    updated_detail = client.get("/api/reports/rep_1")
    assert updated_detail.status_code == 200
    new_stats = updated_detail.json()["data"]["statistics"]
    assert new_stats["products"]["total"] == 3
    assert new_stats["products"]["active"] == 2
