import uuid
from datetime import datetime, timezone
from sqlalchemy import (
    Column, String, Text, Integer, Boolean, DateTime, ForeignKey, JSON
)
from sqlalchemy.orm import relationship
from backend.database import Base

def generate_uuid() -> str:
    return str(uuid.uuid4())

def get_utc_now() -> datetime:
    return datetime.now(timezone.utc)

# 1. Users Table
class User(Base):
    __tablename__ = "users"

    id = Column(String(64), primary_key=True, default=generate_uuid)
    email = Column(String(255), unique=True, index=True, nullable=False)
    password_hash = Column(String(255), nullable=False)
    name = Column(String(255), nullable=False)
    role = Column(String(64), default="Administrator")
    company = Column(String(255), default="NEXORA Enterprise")
    created_at = Column(DateTime, default=get_utc_now, nullable=False)
    updated_at = Column(DateTime, default=get_utc_now, onupdate=get_utc_now, nullable=False)

    # Relationships
    activity_logs = relationship("ActivityLog", back_populates="user", cascade="all, delete-orphan")

# 2. Products Table
class Product(Base):
    __tablename__ = "products"

    id = Column(String(64), primary_key=True, default=generate_uuid)
    sku = Column(String(128), unique=True, index=True, nullable=False)
    name = Column(String(255), nullable=False)
    description = Column(Text, default="")
    brand = Column(String(128), default="NEXORA")
    category = Column(String(128), default="General")
    price = Column(String(32), default="$0.00")
    stock = Column(Integer, default=100)
    status = Column(String(32), default="Active") # Active, Review, Inactive
    quality_score = Column(Integer, default=75)
    ai_enriched = Column(Boolean, default=False)
    attributes = Column(JSON, default=dict)
    created_at = Column(DateTime, default=get_utc_now, nullable=False)
    updated_at = Column(DateTime, default=get_utc_now, onupdate=get_utc_now, nullable=False)

    # Relationships
    quality_issues = relationship("QualityIssue", back_populates="product", cascade="all, delete-orphan")
    enrichments = relationship("Enrichment", back_populates="product", cascade="all, delete-orphan")

# 3. Quality Issues Table
class QualityIssue(Base):
    __tablename__ = "quality_issues"

    id = Column(String(64), primary_key=True, default=generate_uuid)
    product_id = Column(String(64), ForeignKey("products.id", ondelete="CASCADE"), index=True, nullable=False)
    issue_type = Column(String(128), nullable=False)
    field_name = Column(String(128), nullable=False)
    severity = Column(String(32), default="high") # high, medium, low
    message = Column(Text, nullable=False)
    suggestion = Column(Text, default="")
    status = Column(String(32), default="Unresolved") # Unresolved, Resolved
    created_at = Column(DateTime, default=get_utc_now, nullable=False)
    resolved_at = Column(DateTime, nullable=True)

    # Relationships
    product = relationship("Product", back_populates="quality_issues")

# 4. Enrichments Table
class Enrichment(Base):
    __tablename__ = "enrichments"

    id = Column(String(64), primary_key=True, default=generate_uuid)
    product_id = Column(String(64), ForeignKey("products.id", ondelete="CASCADE"), index=True, nullable=False)
    tone = Column(String(64), default="Professional")
    language = Column(String(64), default="English")
    generated_content = Column(JSON, default=dict)
    quality_score = Column(Integer, default=94)
    status = Column(String(32), default="Draft") # Draft, Approved, Rejected
    created_at = Column(DateTime, default=get_utc_now, nullable=False)
    updated_at = Column(DateTime, default=get_utc_now, onupdate=get_utc_now, nullable=False)

    # Relationships
    product = relationship("Product", back_populates="enrichments")

# 5. Catalog Documents Table
class CatalogDocument(Base):
    __tablename__ = "catalog_documents"

    id = Column(String(64), primary_key=True, default=generate_uuid)
    filename = Column(String(255), nullable=False)
    file_type = Column(String(32), default="PDF")
    processing_status = Column(String(64), default="Pending") # Pending, Processing, Extracted, Approved, Failed
    extraction_data = Column(JSON, default=dict)
    confidence_score = Column(Integer, default=95)
    created_at = Column(DateTime, default=get_utc_now, nullable=False)
    updated_at = Column(DateTime, default=get_utc_now, onupdate=get_utc_now, nullable=False)

# 6. Integrations Table
class Integration(Base):
    __tablename__ = "integrations"

    id = Column(String(64), primary_key=True, default=generate_uuid)
    channel = Column(String(64), unique=True, index=True, nullable=False) # shopify, amazon, google, flipkart
    status = Column(String(32), default="disconnected") # connected, disconnected, syncing
    last_sync_at = Column(DateTime, nullable=True)
    sync_status = Column(String(64), default="Idle")
    created_at = Column(DateTime, default=get_utc_now, nullable=False)
    updated_at = Column(DateTime, default=get_utc_now, onupdate=get_utc_now, nullable=False)

    # Relationships
    sync_jobs = relationship("SyncJob", back_populates="integration", cascade="all, delete-orphan")

# 7. Sync Jobs Table
class SyncJob(Base):
    __tablename__ = "sync_jobs"

    id = Column(String(64), primary_key=True, default=generate_uuid)
    integration_id = Column(String(64), ForeignKey("integrations.id", ondelete="CASCADE"), index=True, nullable=False)
    status = Column(String(32), default="Pending") # Pending, Running, Success, Failed
    started_at = Column(DateTime, default=get_utc_now, nullable=False)
    completed_at = Column(DateTime, nullable=True)
    error_message = Column(Text, nullable=True)

    # Relationships
    integration = relationship("Integration", back_populates="sync_jobs")

# 8. Activity Logs Table
class ActivityLog(Base):
    __tablename__ = "activity_logs"

    id = Column(String(64), primary_key=True, default=generate_uuid)
    user_id = Column(String(64), ForeignKey("users.id", ondelete="SET NULL"), nullable=True)
    action = Column(String(128), nullable=False)
    entity_type = Column(String(64), nullable=False) # product, document, quality, integration
    entity_id = Column(String(64), nullable=False)
    metadata_json = Column(JSON, default=dict)
    created_at = Column(DateTime, default=get_utc_now, nullable=False)

    # Relationships
    user = relationship("User", back_populates="activity_logs")

# 9. Reports Table
class Report(Base):
    __tablename__ = "reports"

    id = Column(String(64), primary_key=True, default=generate_uuid)
    name = Column(String(255), nullable=False)
    report_type = Column(String(64), default="catalog") # catalog, quality, channel, ai
    created_at = Column(DateTime, default=get_utc_now, nullable=False)
