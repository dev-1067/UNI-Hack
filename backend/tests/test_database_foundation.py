import pytest
from datetime import datetime, timezone
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from fastapi.testclient import TestClient

from backend.database import Base, check_database_connection
from backend.models.db_models import (
    User, Product, QualityIssue, Enrichment, CatalogDocument,
    Integration, SyncJob, ActivityLog, Report
)
from backend.api import app

client = TestClient(app)

from sqlalchemy.pool import StaticPool

# Create an isolated SQLite database engine for testing SQLAlchemy models
@pytest.fixture(scope="module")
def db_session():
    test_engine = create_engine(
        "sqlite:///:memory:",
        connect_args={"check_same_thread": False},
        poolclass=StaticPool
    )
    Base.metadata.create_all(bind=test_engine)
    TestingSessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=test_engine)
    session = TestingSessionLocal()

    
    yield session
    
    session.close()
    Base.metadata.drop_all(bind=test_engine)

# 1. Health Endpoint Database Status Test
def test_health_reports_database_status():
    response = client.get("/health")
    assert response.status_code == 200
    data = response.json()
    assert "database" in data
    assert data["database"] in ["connected", "disconnected", "unconfigured"]

# 2. User Model Test
def test_user_model(db_session):
    user = User(
        email="test_admin@nexora.ai",
        password_hash="$2b$12$e8Y7z7r0Q9m2...",
        name="Alex Morgan",
        role="Administrator",
        company="NEXORA Corp"
    )
    db_session.add(user)
    db_session.commit()
    db_session.refresh(user)

    assert user.id is not None
    assert user.email == "test_admin@nexora.ai"
    assert user.created_at is not None

# 3. Product & Relationships Test (Quality Issues + Enrichments)
def test_product_with_relationships(db_session):
    product = Product(
        sku="DCB518ASTS06G",
        name="Diablo Steel Demon 5-3/8 in. Saw Blade",
        description="Industrial grade circular saw blade",
        brand="Diablo",
        category="Power Tools / Saw Blades",
        price="$45.00",
        stock=120,
        quality_score=95,
        status="Active",
        attributes={"Diameter": "5-3/8 in.", "Teeth": "50", "Arbor": "20mm"}
    )
    db_session.add(product)
    db_session.commit()
    db_session.refresh(product)

    assert product.id is not None
    assert product.attributes["Teeth"] == "50"

    # Add associated Quality Issue
    issue = QualityIssue(
        product_id=product.id,
        issue_type="Missing Field",
        field_name="Coating Type",
        severity="medium",
        message="Coating type attribute missing",
        suggestion="Perma-Shield"
    )
    db_session.add(issue)
    
    # Add associated Enrichment
    enrichment = Enrichment(
        product_id=product.id,
        tone="Professional",
        language="English",
        generated_content={"bullets": ["Optimized blade", "Laser cut"]},
        quality_score=96,
        status="Approved"
    )
    db_session.add(enrichment)
    db_session.commit()
    db_session.refresh(product)

    # Verify relationships
    assert len(product.quality_issues) == 1
    assert product.quality_issues[0].field_name == "Coating Type"
    assert len(product.enrichments) == 1
    assert product.enrichments[0].quality_score == 96

# 4. Catalog Document Model Test
def test_catalog_document_model(db_session):
    doc = CatalogDocument(
        filename="spec_sheet_DCB518.pdf",
        file_type="PDF",
        processing_status="Extracted",
        extraction_data={"mfg_part_num": "DCB518ASTS06G", "brand": "Diablo"},
        confidence_score=95
    )
    db_session.add(doc)
    db_session.commit()
    db_session.refresh(doc)

    assert doc.id is not None
    assert doc.processing_status == "Extracted"
    assert doc.extraction_data["mfg_part_num"] == "DCB518ASTS06G"

# 5. Integration & Sync Job Relationship Test
def test_integration_and_sync_job(db_session):
    integration = Integration(
        channel="shopify",
        status="connected",
        sync_status="Success"
    )
    db_session.add(integration)
    db_session.commit()
    db_session.refresh(integration)

    sync_job = SyncJob(
        integration_id=integration.id,
        status="Success"
    )
    db_session.add(sync_job)
    db_session.commit()
    db_session.refresh(integration)

    assert len(integration.sync_jobs) == 1
    assert integration.sync_jobs[0].status == "Success"

# 6. Activity Log & Report Models Test
def test_activity_log_and_report(db_session):
    activity = ActivityLog(
        action="Product Approved",
        entity_type="product",
        entity_id="prod_test_01",
        metadata_json={"sku": "DCB518ASTS06G"}
    )
    report = Report(
        name="Catalog Health Q3",
        report_type="catalog"
    )
    db_session.add(activity)
    db_session.add(report)
    db_session.commit()
    db_session.refresh(activity)
    db_session.refresh(report)

    assert activity.id is not None
    assert activity.action == "Product Approved"
    assert report.id is not None
    assert report.report_type == "catalog"
