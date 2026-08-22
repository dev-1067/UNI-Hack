from fastapi import APIRouter, HTTPException, status, Query, Depends
from typing import List, Dict, Any, Optional
from pydantic import BaseModel
from sqlalchemy.orm import Session

from backend.database import get_db
from backend.schemas import ApiResponse, ActivityLog as ActivityLogSchema
from backend.services.activity_service import ActivityService

router = APIRouter(prefix="/activity", tags=["Activity"])

class ActivityCreateRequest(BaseModel):
    action: str
    entity_type: Optional[str] = "product"
    entity_id: Optional[str] = None
    user_id: Optional[str] = None
    user_name: Optional[str] = None
    target: Optional[str] = None
    metadata: Optional[Dict[str, Any]] = None

@router.get("", response_model=ApiResponse[List[Dict[str, Any]]], summary="List Audit Activity Logs")
async def list_activity(
    limit: int = Query(50, ge=1, le=200),
    offset: int = Query(0, ge=0),
    entity_type: Optional[str] = Query(None, description="Filter by entity type"),
    db: Optional[Session] = Depends(get_db)
):
    """
    Retrieve real-time audit logs in reverse chronological order from Supabase PostgreSQL.
    """
    logs = ActivityService.get_all(
        db=db,
        limit=limit,
        offset=offset,
        entity_type=entity_type
    )
    return ApiResponse(
        success=True,
        data=logs,
        message=f"Retrieved {len(logs)} activity logs"
    )

@router.post("", response_model=ApiResponse[Dict[str, Any]], status_code=status.HTTP_201_CREATED, summary="Log Activity Event")
async def log_activity(
    request: ActivityCreateRequest,
    db: Optional[Session] = Depends(get_db)
):
    """
    Record an administrative or workflow audit event in Supabase PostgreSQL.
    """
    log_entry = ActivityService.create(
        action=request.action,
        entity_type=request.entity_type or "product",
        entity_id=request.entity_id,
        user_id=request.user_id,
        user_name=request.user_name,
        target=request.target,
        metadata=request.metadata,
        db=db
    )
    return ApiResponse(
        success=True,
        data=log_entry,
        message="Activity event logged successfully"
    )
