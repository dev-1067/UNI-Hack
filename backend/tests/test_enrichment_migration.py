import pytest
from sqlalchemy.pool import StaticPool
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from fastapi.testclient import TestClient

from backend.database import Base, get_db
from backend.models.db_models import Product, Enrichment
from backend.api import app

@pytest.fixture
def enrichment_test_setup():
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

def test_enrichment_migration_lifecycle(enrichment_test_setup):
    client, TestingSessionLocal = enrichment_test_setup

    # 1. Seed a test product in the DB
    db = TestingSessionLocal()
    product = Product(
        sku="NXR-ENR-001",
        name="Precision CNC Carbide End Mill",
        brand="TitanCut",
        category="Machinery / Cutting Tools",
        description="Basic end mill cutter",
        price="$64.50",
        stock=40,
        quality_score=70,
        status="Review",
        ai_enriched=False,
        attributes={"Diameter": "1/2 in.", "Flutes": "4"}
    )
    db.add(product)
    db.commit()
    db.refresh(product)
    prod_id = str(product.id)
    db.close()

    # 2. Test GET /api/enrichment (Candidates List)
    list_res = client.get("/api/enrichment")
    assert list_res.status_code == 200
    res_data = list_res.json()
    assert res_data["success"] is True
    assert any(p["sku"] == "NXR-ENR-001" for p in res_data["data"])

    # 3. Test POST /api/enrichment/generate (Professional English)
    gen_en_res = client.post(
        "/api/enrichment/generate",
        json={
            "productId": prod_id,
            "tone": "Professional",
            "language": "English",
            "channel": "Shopify"
        }
    )
    assert gen_en_res.status_code == 200
    en_data = gen_en_res.json()["data"]
    assert "Precision CNC Carbide End Mill" in en_data["description"]
    assert "Engineered for superior performance" in en_data["description"]
    assert en_data["qualityScore"] >= 94

    # 4. Verify Tone and Language affect generation output (Spanish & Technical)
    gen_es_res = client.post(
        "/api/enrichment/generate",
        json={
            "productId": prod_id,
            "tone": "Technical",
            "language": "Spanish",
            "channel": "Amazon"
        }
    )
    assert gen_es_res.status_code == 200
    es_data = gen_es_res.json()["data"]
    assert "Dispositivo de alta precisión" in es_data["description"]
    assert es_data["description"] != en_data["description"]

    # 5. Test POST /api/enrichment/{id}/approve
    approve_res = client.post(f"/api/enrichment/{prod_id}/approve")
    assert approve_res.status_code == 200
    assert approve_res.json()["success"] is True
    assert approve_res.json()["data"]["status"] == "Approved"

    # Verify associated Product in DB was updated
    prod_check = client.get(f"/api/products/{prod_id}")
    assert prod_check.status_code == 200
    updated_prod = prod_check.json()["data"]
    assert updated_prod["ai_enriched"] is True
    assert updated_prod["quality"] >= 94
    assert "Dispositivo de alta precisión" in updated_prod["description"]

    # 6. Test Reject workflow on a new product
    db = TestingSessionLocal()
    prod_reject = Product(
        sku="NXR-REJ-002",
        name="Standard Safety Goggles",
        description="Original short description",
        quality_score=65,
        ai_enriched=False
    )
    db.add(prod_reject)
    db.commit()
    db.refresh(prod_reject)
    rej_id = str(prod_reject.id)
    db.close()

    # Generate draft
    client.post(
        "/api/enrichment/generate",
        json={
            "productId": rej_id,
            "tone": "Engaging",
            "language": "English",
            "channel": "Shopify"
        }
    )

    # Reject draft
    rej_res = client.post(f"/api/enrichment/{rej_id}/reject")
    assert rej_res.status_code == 200
    assert rej_res.json()["data"]["status"] == "Rejected"

    # Verify Product in DB was NOT modified by rejected draft
    rej_prod_check = client.get(f"/api/products/{rej_id}")
    assert rej_prod_check.status_code == 200
    assert rej_prod_check.json()["data"]["description"] == "Original short description"
    assert rej_prod_check.json()["data"]["ai_enriched"] is False

    # 7. Test Error Handling for Invalid Product ID
    err_res = client.post(
        "/api/enrichment/generate",
        json={
            "productId": "non_existent_id_9999",
            "tone": "Professional",
            "language": "English",
            "channel": "Shopify"
        }
    )
    assert err_res.status_code == 404
    assert err_res.json()["success"] is False
