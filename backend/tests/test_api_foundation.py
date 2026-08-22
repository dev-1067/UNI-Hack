import pytest
from unittest.mock import patch, MagicMock
from fastapi.testclient import TestClient
from backend.api import app

client = TestClient(app)

# 1. Health Check Test
def test_health_check():
    response = client.get("/health")
    assert response.status_code == 200
    data = response.json()
    assert data["status"] == "healthy"
    assert data["service"] == "nexora-api"
    assert "version" in data

# 2. Authentication Tests
def test_auth_login_success():
    payload = {"email": "alex@nexora.ai", "password": "password123"}
    response = client.post("/api/auth/login", json=payload)
    assert response.status_code == 200
    res = response.json()
    assert res["success"] is True
    assert "access_token" in res["data"]
    assert res["data"]["user"]["email"] == "alex@nexora.ai"

def test_auth_login_failure():
    payload = {"email": "alex@nexora.ai", "password": "wrongpassword"}
    response = client.post("/api/auth/login", json=payload)
    assert response.status_code == 401
    res = response.json()
    assert res["success"] is False
    assert res["error"]["code"] == "HTTP_401"

def test_auth_me():
    # Login first to obtain bearer token
    login_res = client.post("/api/auth/login", json={"email": "alex@nexora.ai", "password": "password123"})
    token = login_res.json()["data"]["access_token"]
    response = client.get("/api/auth/me", headers={"Authorization": f"Bearer {token}"})
    assert response.status_code == 200
    res = response.json()
    assert res["success"] is True
    assert res["data"]["name"] == "Alex Morgan"


# 3. Product Catalog Tests
def test_products_crud():
    # List products
    response = client.get("/api/products")
    assert response.status_code == 200
    res = response.json()
    assert res["success"] is True
    assert len(res["data"]) >= 1

    # Create product
    new_prod = {
        "name": "Industrial Test Wrench",
        "sku": "TST-WRN-999",
        "category": "Hand Tools",
        "brand": "NEXORA Pro",
        "description": "Heavy-duty drop forged steel wrench",
        "price": "$29.99",
        "stock": 50,
        "quality": 88
    }
    create_res = client.post("/api/products", json=new_prod)
    assert create_res.status_code == 201
    created_data = create_res.json()["data"]
    prod_id = created_data["id"]
    assert created_data["sku"] == "TST-WRN-999"

    # Get single product
    get_res = client.get(f"/api/products/{prod_id}")
    assert get_res.status_code == 200
    assert get_res.json()["data"]["name"] == "Industrial Test Wrench"

    # Update product
    update_res = client.put(f"/api/products/{prod_id}", json={"price": "$34.99", "quality": 95})
    assert update_res.status_code == 200
    assert update_res.json()["data"]["price"] == "$34.99"
    assert update_res.json()["data"]["quality"] == 95

    # Delete product
    del_res = client.delete(f"/api/products/{prod_id}")
    assert del_res.status_code == 200
    assert del_res.json()["success"] is True

# 4. Catalog AI Processing Test (Mocked AI Pipeline)
@patch("backend.routes.catalog.run_agent_pipeline")
def test_catalog_process(mock_pipeline):
    mock_record = MagicMock()
    mock_record.ref_url = "https://example.com/spec"
    mock_record.attributes = [
        MagicMock(attribute_label="Diameter", value="5-3/8", uom="in."),
        MagicMock(attribute_label="Teeth", value="50", uom="")
    ]
    mock_pipeline.return_value = mock_record

    payload = {
        "mfg_part_num": "DCB518ASTS06G",
        "part_desc": "Diablo Steel Demon Saw Blade",
        "e1_brand": "Diablo",
        "part_manuf": "Diablo"
    }
    response = client.post("/api/catalog/process", json=payload)
    assert response.status_code == 200
    res = response.json()
    assert res["success"] is True
    assert res["mfg_part_num"] == "DCB518ASTS06G"
    assert "specifications" in res

# 5. Data Quality Tests
def test_quality_endpoints():
    list_res = client.get("/api/quality")
    assert list_res.status_code == 200
    assert list_res.json()["success"] is True

    fix_res = client.post("/api/quality/q1/fix", json={"attribute": "Coating Type", "value": "Perma-Shield"})
    assert fix_res.status_code == 200
    assert fix_res.json()["data"]["status"] == "Resolved"

# 6. AI Enrichment Tests
def test_enrichment_generate():
    payload = {
        "productId": "prod_1",
        "tone": "Professional",
        "language": "English",
        "channel": "Shopify"
    }
    response = client.post("/api/enrichment/generate", json=payload)
    assert response.status_code == 200
    res = response.json()
    assert res["success"] is True
    assert "description" in res["data"]
    assert res["data"]["qualityScore"] >= 90

# 7. Integrations Tests
def test_integrations_sync():
    list_res = client.get("/api/integrations")
    assert list_res.status_code == 200

    sync_res = client.post("/api/integrations/shopify/sync")
    assert sync_res.status_code == 200
    assert sync_res.json()["data"]["status"] in ["completed", "connected"]


# 8. Reports Tests
def test_reports_export():
    list_res = client.get("/api/reports")
    assert list_res.status_code == 200

    export_res = client.post("/api/reports/export", json={"reportType": "catalog", "dateRange": "30d", "format": "csv"})
    assert export_res.status_code == 200
    assert export_res.headers["content-type"].startswith("text/csv")
    assert "SKU,Product Name" in export_res.text

# 9. Activity Tests
def test_activity_logging():
    list_res = client.get("/api/activity")
    assert list_res.status_code == 200

    log_entry = {
        "id": "act_test",
        "action": "Product Verified",
        "product": "Test Item",
        "sku": "TST-01"
    }
    create_res = client.post("/api/activity", json=log_entry)
    assert create_res.status_code == 201
    assert create_res.json()["data"]["action"] == "Product Verified"

# 10. Dashboard Analytics Tests
def test_dashboard_endpoints():
    metrics_res = client.get("/api/dashboard")
    assert metrics_res.status_code == 200
    assert metrics_res.json()["data"]["totalProducts"] >= 0

    chart_res = client.get("/api/dashboard/chart")
    assert chart_res.status_code == 200
    assert len(chart_res.json()["data"]) == 7

# 11. Error Handling & Validation Tests
def test_error_handling():
    # 404 test
    not_found_res = client.get("/api/products/non_existent_id")
    assert not_found_res.status_code == 404
    assert not_found_res.json()["success"] is False
    assert not_found_res.json()["error"]["code"] == "HTTP_404"

    # 422 Validation Error test
    invalid_res = client.post("/api/products", json={"invalid_field": 123})
    assert invalid_res.status_code == 422
    assert invalid_res.json()["success"] is False
    assert invalid_res.json()["error"]["code"] == "VALIDATION_ERROR"
