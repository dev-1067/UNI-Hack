from pydantic import BaseModel, Field, ConfigDict
from typing import Optional, Dict, Any, List, Generic, TypeVar

T = TypeVar('T')

# --- Standard Response Envelopes ---
class ApiResponse(BaseModel, Generic[T]):
    success: bool = True
    data: Optional[T] = None
    message: Optional[str] = None

class ApiErrorDetails(BaseModel):
    code: str
    message: str
    details: Optional[Any] = None

class ApiErrorResponse(BaseModel):
    success: bool = False
    error: ApiErrorDetails

# --- Authentication Schemas ---
class LoginRequest(BaseModel):
    email: str
    password: str

class SignupRequest(BaseModel):
    name: str
    email: str
    password: str
    company: Optional[str] = None

class UserResponse(BaseModel):
    id: str
    name: str
    email: str
    role: str = "Administrator"
    company: str = "NEXORA Enterprise"

class TokenResponse(BaseModel):
    access_token: str
    token_type: str = "bearer"
    user: UserResponse

# --- Product Schemas ---
class ProductCreate(BaseModel):
    name: str
    sku: str
    category: str = "General"
    brand: str = "NEXORA"
    description: str = ""
    price: Optional[str] = "$0.00"
    stock: Optional[int] = 100
    quality: Optional[int] = 75
    status: Optional[str] = "Active"
    attributes: Optional[Dict[str, Any]] = None

class ProductUpdate(BaseModel):
    name: Optional[str] = None
    sku: Optional[str] = None
    category: Optional[str] = None
    brand: Optional[str] = None
    description: Optional[str] = None
    price: Optional[str] = None
    stock: Optional[int] = None
    quality: Optional[int] = None
    status: Optional[str] = None
    attributes: Optional[Dict[str, Any]] = None

class ProductResponse(BaseModel):
    id: str
    name: str
    sku: str
    category: str
    brand: str
    description: str
    price: str
    stock: int
    quality: int
    status: str
    readiness: int = 80
    ai_enriched: bool = False
    attributes: Optional[Dict[str, Any]] = None


# --- Catalog Schemas ---
class CatalogProcessRequest(BaseModel):
    mfg_part_num: str
    part_desc: str = ""
    e1_brand: str = ""
    unilog_brand: str = ""
    dib_brand: str = ""
    part_manuf: str = ""
    pdf_path: Optional[str] = None

class CatalogExtractionResponse(BaseModel):
    success: bool = True
    mfg_part_num: str
    part_desc: str
    e1_brand: str
    category_name: str
    sub_category: str
    specifications: Dict[str, Any]
    features: List[str]
    confidence: int = 95
    export_columns: Optional[Dict[str, Any]] = None

class CatalogApproveRequest(BaseModel):
    document_id: Optional[str] = None
    product_data: Optional[Dict[str, Any]] = None

# --- Data Quality Schemas ---
class QualityIssue(BaseModel):
    id: str
    productId: str
    product: str
    sku: str
    category: str
    issue: str
    attribute: str
    severity: str = "high" # high | medium | low
    suggestion: str = ""
    status: str = "Unresolved"

class QualityFixRequest(BaseModel):
    attribute: str
    value: str
    apply_to_all_similar: bool = False

# --- AI Enrichment Schemas ---
class EnrichmentGenerateRequest(BaseModel):
    productId: str
    tone: str = "Professional"
    language: str = "English"
    channel: str = "Shopify"

class EnrichmentResponse(BaseModel):
    title: str
    description: str
    bullets: List[str]
    seoTags: List[str]
    qualityScore: int = 94

# --- Integrations Schemas ---
class IntegrationChannel(BaseModel):
    id: str
    name: str
    status: str = "connected" # connected | disconnected | syncing
    lastSync: str = "Just now"
    productCount: int = 0

class IntegrationStatus(BaseModel):
    id: str
    channel: str
    status: str
    sync_status: Optional[str] = "idle"
    last_sync_at: Optional[str] = None

class IntegrationSyncRequest(BaseModel):
    channel: str
    action: str = "sync" # sync | connect | disconnect


# --- Reports Schemas ---
class ReportItem(BaseModel):
    id: str
    name: str
    date: str
    type: str
    status: str = "Ready"

class ReportExportRequest(BaseModel):
    reportType: str = "catalog"
    dateRange: str = "Last 30 days"
    format: str = "csv"

# --- Activity Schemas ---
class ActivityLog(BaseModel):
    id: str
    action: str
    product: str
    sku: str
    user: str = "Alex Morgan"
    timestamp: str = "Just now"
    details: Optional[str] = None

# --- Dashboard Schemas ---
class DashboardMetrics(BaseModel):
    totalProducts: int = 0
    activeProducts: int = 0
    reviewProducts: int = 0
    draftProducts: int = 0
    avgQuality: int = 0
    enrichedCount: int = 0
    pendingEnrichment: int = 0
    issuesCount: int = 0
    highSeverityIssues: int = 0
    connectedIntegrations: int = 0
    channelsCount: int = 0

class DashboardChartPoint(BaseModel):
    label: str
    complete: int
    review: int
    missing: int
    quality: Optional[int] = None
    avgQuality: Optional[int] = None

