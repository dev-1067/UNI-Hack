import pytest
from sqlalchemy.pool import StaticPool
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from fastapi.testclient import TestClient

from backend.database import Base, get_db
from backend.models.db_models import Product, QualityIssue, Enrichment, Integration
from backend.api import app

@pytest.fixture
def dashboard_test_setup():
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

def test_dashboard_migration_lifecycle(dashboard_test_setup):
    client, TestingSessionLocal = dashboard_test_setup

    # 1. Test Empty Database Safety
    empty_res = client.get("/api/dashboard")
    assert empty_res.status_code == 200
    empty_metrics = empty_res.json()["data"]
    assert empty_metrics["totalProducts"] == 0
    assert empty_metrics["avgQuality"] == 0

    empty_chart = client.get("/api/dashboard/chart")
    assert empty_chart.status_code == 200
    assert len(empty_chart.json()["data"]) == 7

    # 2. Seed initial catalog records in test DB
    db = TestingSessionLocal()
    p1 = Product(
        sku="DASH-SKU-001",
        name="Industrial Variable Speed Drill",
        category="Power Tools",
        brand="NEXORA Pro",
        price="$159.00",
        stock=30,
        quality_score=95,
        status="Active",
        ai_enriched=True
    )
    p2 = Product(
        sku="DASH-SKU-002",
        name="Heavy Duty Shop Vise 6 in.",
        category="Hand Tools",
        brand="IronClad",
        price="$89.00",
        stock=15,
        quality_score=68,
        status="Review",
        ai_enriched=False
    )
    db.add_all([p1, p2])
    db.commit()

    q1 = QualityIssue(
        product_id=p2.id,
        issue_type="Missing Attribute",
        field_name="Jaw Width",
        severity="high",
        message="Jaw width specification missing",
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
    p2_id = str(p2.id)
    q1_id = str(q1.id)
    db.close()

    # 3. Test GET /api/dashboard (Calculated KPIs)
    metrics_res = client.get("/api/dashboard")
    assert metrics_res.status_code == 200
    m = metrics_res.json()["data"]
    assert m["totalProducts"] == 2
    assert m["activeProducts"] == 1
    assert m["reviewProducts"] == 1
    assert m["enrichedCount"] == 1
    assert m["pendingEnrichment"] == 1
    assert m["avgQuality"] == 82
    assert m["issuesCount"] == 1
    assert m["connectedIntegrations"] == 1

    # 4. Test GET /api/dashboard/chart (7-day series)
    chart_res = client.get("/api/dashboard/chart")
    assert chart_res.status_code == 200
    chart_data = chart_res.json()["data"]
    assert len(chart_data) == 7
    # Day 0 (today) matches current state
    assert chart_data[-1]["complete"] == 50
    assert chart_data[-1]["missing"] == 50
    assert chart_data[-1]["quality"] == 82

    # 5. Test Reactivity: Add a product and verify Total Products increments
    client.post("/api/products", json={
        "sku": "DASH-SKU-003",
        "name": "Laser Measurement Tool 50m",
        "category": "Measuring Tools",
        "brand": "OptiMeasure",
        "price": "$79.00",
        "stock": 45,
        "quality": 92,
        "status": "Active"
    })


    updated_m1 = client.get("/api/dashboard").json()["data"]
    assert updated_m1["totalProducts"] == 3
    assert updated_m1["activeProducts"] == 2
    assert updated_m1["avgQuality"] >= 85

    # 6. Test Reactivity: Fix quality issue and verify open issues decrease
    client.post(f"/api/quality/{q1_id}/fix", json={
        "attribute": "Jaw Width",
        "value": "6 inches"
    })

    updated_m2 = client.get("/api/dashboard").json()["data"]
    assert updated_m2["issuesCount"] == 0

    # 7. Test Reactivity: Connect a new integration
    client.post("/api/integrations/amazon/connect")
    updated_m3 = client.get("/api/dashboard").json()["data"]
    assert updated_m3["connectedIntegrations"] == 2

    # 8. Test Reactivity: Delete a product
    client.delete(f"/api/products/{p2_id}")
    updated_m4 = client.get("/api/dashboard").json()["data"]
    assert updated_m4["totalProducts"] == 2
