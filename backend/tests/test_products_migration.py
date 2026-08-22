import pytest
from sqlalchemy.pool import StaticPool
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from fastapi.testclient import TestClient

from backend.database import Base, get_db
from backend.models.db_models import Product
from backend.api import app

@pytest.fixture
def products_test_setup():
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

def test_product_migration_lifecycle(products_test_setup):
    client, TestingSessionLocal = products_test_setup

    # 1. Create Product
    product_payload = {
        "sku": "NXR-MIG-001",
        "name": "Heavy Duty Magnetic Drill Press",
        "brand": "NEXORA Pro",
        "category": "Machinery / Drills",
        "description": "Industrial 1200W magnetic drill press for steel fabrication.",
        "price": "$899.00",
        "stock": 15,
        "quality": 95,
        "status": "Active",
        "attributes": {
            "Motor": "1200W",
            "Magnetic Force": "13000N",
            "Max Cut Depth": "50mm"
        }
    }
    create_res = client.post("/api/products", json=product_payload)
    assert create_res.status_code == 201
    created_data = create_res.json()
    assert created_data["success"] is True
    assert created_data["data"]["sku"] == "NXR-MIG-001"
    assert created_data["data"]["quality"] == 95
    assert created_data["data"]["attributes"]["Motor"] == "1200W"
    prod_id = created_data["data"]["id"]

    # 2. Get Product by ID and SKU
    get_by_id_res = client.get(f"/api/products/{prod_id}")
    assert get_by_id_res.status_code == 200
    assert get_by_id_res.json()["data"]["name"] == "Heavy Duty Magnetic Drill Press"

    get_by_sku_res = client.get("/api/products/NXR-MIG-001")
    assert get_by_sku_res.status_code == 200
    assert get_by_sku_res.json()["data"]["id"] == prod_id

    # 3. List & Filter by Search, Category, Status
    list_all = client.get("/api/products")
    assert list_all.status_code == 200
    skus = [p["sku"] for p in list_all.json()["data"]]
    assert "NXR-MIG-001" in skus

    search_res = client.get("/api/products?search=Magnetic")
    assert search_res.status_code == 200
    assert any(p["sku"] == "NXR-MIG-001" for p in search_res.json()["data"])

    cat_res = client.get("/api/products?category=Machinery")
    assert cat_res.status_code == 200
    assert any(p["sku"] == "NXR-MIG-001" for p in cat_res.json()["data"])

    status_res = client.get("/api/products?status=Active")
    assert status_res.status_code == 200
    assert any(p["sku"] == "NXR-MIG-001" for p in status_res.json()["data"])

    # 4. Edit / Update Product
    update_res = client.put(
        f"/api/products/{prod_id}",
        json={
            "name": "Heavy Duty Magnetic Drill Press 2.0",
            "price": "$949.00",
            "stock": 20,
            "quality": 98
        }
    )
    assert update_res.status_code == 200
    updated_data = update_res.json()["data"]
    assert updated_data["name"] == "Heavy Duty Magnetic Drill Press 2.0"
    assert updated_data["price"] == "$949.00"
    assert updated_data["quality"] == 98

    # 5. Enforce Duplicate SKU prevention
    dup_res = client.post("/api/products", json=product_payload)
    assert dup_res.status_code == 400
    assert dup_res.json()["success"] is False
    assert "already exists" in dup_res.json()["error"]["message"]

    # 6. Delete Product
    del_res = client.delete(f"/api/products/{prod_id}")
    assert del_res.status_code == 200
    assert del_res.json()["success"] is True

    # 7. Verify 404 after Deletion
    get_deleted = client.get(f"/api/products/{prod_id}")
    assert get_deleted.status_code == 404
    assert get_deleted.json()["success"] is False
