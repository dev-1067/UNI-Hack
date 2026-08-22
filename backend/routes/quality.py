from fastapi import APIRouter, HTTPException, status, Depends
from typing import List, Dict, Any, Optional
from sqlalchemy.orm import Session

from backend.database import get_db
from backend.schemas import ApiResponse, QualityIssue, QualityFixRequest
from backend.services.quality_service import QualityService

router = APIRouter(prefix="/quality", tags=["Data Quality"])

@router.get("", response_model=ApiResponse[List[QualityIssue]], summary="List Data Quality Issues")
async def list_quality_issues(
    product_id: Optional[str] = None,
    status_filter: Optional[str] = None,
    db: Optional[Session] = Depends(get_db)
):
    """
    Retrieve all detected catalog data quality and standardization issues from Supabase PostgreSQL.
    """
    issues = QualityService.get_all(db=db, product_id=product_id, status_filter=status_filter)
    return ApiResponse(
        success=True,
        data=issues,
        message=f"Found {len(issues)} quality issues"
    )

@router.get("/{issue_id}", response_model=ApiResponse[QualityIssue], summary="Get Issue Details")
async def get_quality_issue(issue_id: str, db: Optional[Session] = Depends(get_db)):
    """
    Retrieve quality issue audit details by ID.
    """
    issue = QualityService.get_by_id(issue_id=issue_id, db=db)
    return ApiResponse(success=True, data=issue)

@router.post("/{issue_id}/fix", response_model=ApiResponse[Dict[str, Any]], summary="Manually Resolve Quality Issue")
async def fix_quality_issue(
    issue_id: str,
    request: QualityFixRequest,
    db: Optional[Session] = Depends(get_db)
):
    """
    Apply manual standard value to fix catalog quality issue and boost product quality score in Supabase.
    """
    result = QualityService.fix_manual(
        issue_id=issue_id,
        attribute=request.attribute,
        value=request.value,
        db=db
    )
    return ApiResponse(
        success=True,
        data=result,
        message=f"Resolved issue for attribute '{request.attribute}'"
    )

@router.post("/{issue_id}/fix-ai", response_model=ApiResponse[Dict[str, Any]], summary="Auto-Fix Issue via AI")
async def fix_quality_issue_ai(
    issue_id: str,
    db: Optional[Session] = Depends(get_db)
):
    """
    Use AI normalization to infer and standardize missing or invalid attributes in Supabase.
    """
    result = QualityService.fix_ai(issue_id=issue_id, db=db)
    return ApiResponse(
        success=True,
        data=result,
        message="AI standardization applied successfully"
    )
