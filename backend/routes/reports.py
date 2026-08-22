from fastapi import APIRouter, HTTPException, status, Response, Depends
from typing import List, Dict, Any, Optional
from sqlalchemy.orm import Session

from backend.database import get_db
from backend.schemas import ApiResponse, ReportItem, ReportExportRequest
from backend.services.report_service import ReportService

router = APIRouter(prefix="/reports", tags=["Reports"])

@router.get("", response_model=ApiResponse[Dict[str, Any]], summary="List Available Reports and Analytics")
async def list_reports(db: Optional[Session] = Depends(get_db)):
    """
    Retrieve report audit history, summary metrics, and quality trends from Supabase PostgreSQL.
    """
    data = ReportService.get_all(db=db)
    return ApiResponse(success=True, data=data, message="Reports retrieved successfully")

@router.get("/{report_id}", response_model=ApiResponse[Dict[str, Any]], summary="Get Report Details")
async def get_report_details(report_id: str, db: Optional[Session] = Depends(get_db)):
    """
    Retrieve real database-backed aggregate metrics and statistics for a specific report.
    """
    data = ReportService.get_by_id(report_id=report_id, db=db)
    return ApiResponse(success=True, data=data, message="Report details retrieved successfully")

@router.post("/export", summary="Export Report as CSV")
async def export_report(
    request: ReportExportRequest,
    db: Optional[Session] = Depends(get_db)
):
    """
    Generate and download live database-backed CSV export for Catalog, Quality, AI Enrichment, or Integrations.
    """
    csv_content, filename = ReportService.export_csv(
        report_type=request.reportType,
        date_range=request.dateRange,
        db=db
    )
    
    # Save a record of the generated report in Supabase
    try:
        ReportService.add_report_entry(
            name=f"{request.reportType.title()} Export ({request.dateRange})",
            report_type=request.reportType,
            db=db
        )
    except Exception as e:
        print(f"⚠️ Notice: Report entry logging skipped: {e}")

    return Response(
        content=csv_content,
        media_type="text/csv",
        headers={"Content-Disposition": f"attachment; filename={filename}"}
    )
