from fastapi import FastAPI, Request, HTTPException, status, UploadFile, File, Form
from fastapi.responses import JSONResponse
from fastapi.exceptions import RequestValidationError
from fastapi.middleware.cors import CORSMiddleware
from typing import Optional, Dict, Any

from backend.config import settings
from backend.routes import (
    auth,
    products,
    catalog,
    quality,
    enrichment,
    integrations,
    reports,
    activity,
    dashboard
)

app = FastAPI(
    title=settings.PROJECT_NAME,
    description="Backend API and AI Product Intelligence Engine for the NEXORA Industrial Commerce platform.",
    version=settings.VERSION,
    docs_url="/docs",
    redoc_url="/redoc",
    openapi_url="/openapi.json"
)

# --- CORS Middleware ---
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.CORS_ORIGINS if settings.CORS_ORIGINS != ["*"] else ["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# --- Centralized Exception Handlers ---
@app.exception_handler(HTTPException)
async def http_exception_handler(request: Request, exc: HTTPException):
    return JSONResponse(
        status_code=exc.status_code,
        content={
            "success": False,
            "error": {
                "code": f"HTTP_{exc.status_code}",
                "message": exc.detail
            }
        }
    )

@app.exception_handler(RequestValidationError)
async def validation_exception_handler(request: Request, exc: RequestValidationError):
    errors = []
    for err in exc.errors():
        loc = " -> ".join(str(l) for l in err.get("loc", []))
        errors.append(f"{loc}: {err.get('msg', 'Invalid value')}")
    
    return JSONResponse(
        status_code=status.HTTP_422_UNPROCESSABLE_ENTITY,
        content={
            "success": False,
            "error": {
                "code": "VALIDATION_ERROR",
                "message": "Request validation failed",
                "details": errors
            }
        }
    )

@app.exception_handler(Exception)
async def generic_exception_handler(request: Request, exc: Exception):
    # Log internal error on server without leaking details or secrets to client
    print(f"❌ Internal Server Error: {str(exc)}")
    return JSONResponse(
        status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
        content={
            "success": False,
            "error": {
                "code": "INTERNAL_SERVER_ERROR",
                "message": "An unexpected error occurred during processing."
            }
        }
    )

# --- Include Modular API Routers ---
app.include_router(auth.router, prefix=settings.API_PREFIX)
app.include_router(products.router, prefix=settings.API_PREFIX)
app.include_router(catalog.router, prefix=settings.API_PREFIX)
app.include_router(quality.router, prefix=settings.API_PREFIX)
app.include_router(enrichment.router, prefix=settings.API_PREFIX)
app.include_router(integrations.router, prefix=settings.API_PREFIX)
app.include_router(reports.router, prefix=settings.API_PREFIX)
app.include_router(activity.router, prefix=settings.API_PREFIX)
app.include_router(dashboard.router, prefix=settings.API_PREFIX)

# --- Backward Compatible Endpoints (Direct Aliases) ---
@app.post("/api/process", summary="Process a product into a 252-column CSV record (Legacy Alias)", tags=["Catalog Workspace"])
async def process_product_legacy(request: catalog.CatalogProcessRequest):
    return await catalog.process_catalog_json(request)

@app.post("/api/process-file", summary="Upload a document for AI extraction (Legacy Alias)", tags=["Catalog Workspace"])
async def process_file_legacy(
    file: UploadFile = File(...),
    mfg_part_num: Optional[str] = Form(None),
    part_desc: Optional[str] = Form(None),
    part_manuf: Optional[str] = Form(None)
):
    return await catalog.process_catalog_file(
        file=file,
        mfg_part_num=mfg_part_num,
        part_desc=part_desc,
        part_manuf=part_manuf
    )

# --- Health Check Endpoint ---
@app.get("/health", summary="API Health Check", tags=["Health"])
def health_check() -> Dict[str, str]:
    from backend.database import check_database_connection
    db_status = check_database_connection()
    return {
        "status": "healthy",
        "service": "nexora-api",
        "version": settings.VERSION,
        "database": db_status
    }

