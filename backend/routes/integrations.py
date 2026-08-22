from fastapi import APIRouter, HTTPException, status, Query, Depends
from typing import List, Dict, Any, Optional
from sqlalchemy.orm import Session

from backend.database import get_db
from backend.schemas import ApiResponse, IntegrationStatus
from backend.services.integration_service import IntegrationService

router = APIRouter(prefix="/integrations", tags=["Integrations"])

@router.get("", response_model=ApiResponse[List[Dict[str, Any]]], summary="List Channel Integrations")
async def list_integrations(db: Optional[Session] = Depends(get_db)):
    """
    Retrieve configured sales channels and sync statuses from Supabase PostgreSQL.
    """
    integrations = IntegrationService.get_all(db=db)
    return ApiResponse(
        success=True,
        data=integrations,
        message=f"Retrieved {len(integrations)} integrations"
    )

@router.post("/{channel}/connect", response_model=ApiResponse[Dict[str, Any]], summary="Connect Sales Channel")
async def connect_integration(channel: str, db: Optional[Session] = Depends(get_db)):
    """
    Connect and activate a marketplace channel integration in Supabase PostgreSQL.
    """
    result = IntegrationService.connect(channel=channel, db=db)
    return ApiResponse(
        success=True,
        data=result,
        message=f"Connected {channel} successfully"
    )

@router.post("/{channel}/disconnect", response_model=ApiResponse[Dict[str, Any]], summary="Disconnect Sales Channel")
async def disconnect_integration(channel: str, db: Optional[Session] = Depends(get_db)):
    """
    Disconnect a marketplace sales channel while preserving historical sync jobs in Supabase.
    """
    result = IntegrationService.disconnect(channel=channel, db=db)
    return ApiResponse(
        success=True,
        data=result,
        message=f"Disconnected {channel}"
    )

@router.post("/{channel}/sync", response_model=ApiResponse[Dict[str, Any]], summary="Sync Channel Catalog")
async def sync_channel(
    channel: str,
    fail: bool = Query(False, description="Simulate sync failure for recovery testing"),
    db: Optional[Session] = Depends(get_db)
):
    """
    Trigger catalog sync for a sales channel, creating a SyncJob record in Supabase PostgreSQL.
    """
    result = IntegrationService.sync(channel=channel, fail=fail, db=db)
    return ApiResponse(
        success=result.get("status") == "completed",
        data=result,
        message=f"Sync {result.get('status')} for {channel}"
    )
