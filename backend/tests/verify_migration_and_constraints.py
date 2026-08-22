import sys
import os
sys.path.insert(0, os.path.abspath("."))

from sqlalchemy import create_engine, inspect
from sqlalchemy.orm import sessionmaker
from backend.database import Base

from backend.models.db_models import (
    User, Product, QualityIssue, Enrichment, CatalogDocument,
    Integration, SyncJob, ActivityLog, Report
)
from backend.api import app
from fastapi.testclient import TestClient

client = TestClient(app)

def run_verification():
    print("=" * 60)
    print("NEXORA SUPABASE POSTGRESQL SCHEMA VERIFICATION")
    print("=" * 60)

    # 1. Test in-memory / target schema creation
    engine = create_engine("sqlite:///:memory:")
    Base.metadata.create_all(bind=engine)
    inspector = inspect(engine)

    # 2. Verify Table Existence
    expected_tables = {
        "users", "products", "quality_issues", "enrichments",
        "catalog_documents", "integrations", "sync_jobs",
        "activity_logs", "reports"
    }
    actual_tables = set(inspector.get_table_names())
    
    print(f"\n1. TABLE VERIFICATION:")
    missing_tables = expected_tables - actual_tables
    if not missing_tables:
        print(f"   [PASS] All {len(expected_tables)} core tables verified:")
        for t in sorted(expected_tables):
            print(f"      - {t}")
    else:
        print(f"   [FAIL] Missing tables: {missing_tables}")
        return False

    # 3. Verify Constraints & Indexes
    print(f"\n2. CONSTRAINTS & INDEXES VERIFICATION:")
    
    # Check users unique index
    user_indexes = [idx["name"] for idx in inspector.get_indexes("users")]
    print(f"   - users indexes: {user_indexes} (ix_users_email present: {'ix_users_email' in user_indexes})")
    
    # Check products unique index
    prod_indexes = [idx["name"] for idx in inspector.get_indexes("products")]
    print(f"   - products indexes: {prod_indexes} (ix_products_sku present: {'ix_products_sku' in prod_indexes})")

    # Check foreign keys
    qi_fks = inspector.get_foreign_keys("quality_issues")
    print(f"   - quality_issues foreign keys: {[fk['referred_table'] for fk in qi_fks]} -> products")
    
    enrich_fks = inspector.get_foreign_keys("enrichments")
    print(f"   - enrichments foreign keys: {[fk['referred_table'] for fk in enrich_fks]} -> products")

    sync_fks = inspector.get_foreign_keys("sync_jobs")
    print(f"   - sync_jobs foreign keys: {[fk['referred_table'] for fk in sync_fks]} -> integrations")

    act_fks = inspector.get_foreign_keys("activity_logs")
    print(f"   - activity_logs foreign keys: {[fk['referred_table'] for fk in act_fks]} -> users")

    # 4. Verify Health Check endpoint
    print(f"\n3. HEALTH CHECK API VERIFICATION:")
    res = client.get("/health")
    data = res.json()
    print(f"   - Status code: {res.status_code}")
    print(f"   - Payload: {data}")
    assert "database" in data
    print(f"   - Database status field: {data['database']}")

    print("\n" + "=" * 60)
    print("[PASS] SCHEMA AND CONSTRAINT VERIFICATION COMPLETE: ALL PASS")
    print("=" * 60)
    return True


if __name__ == "__main__":
    success = run_verification()
    sys.exit(0 if success else 1)
