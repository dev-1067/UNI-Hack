from fastapi import APIRouter, HTTPException, status, Depends
from typing import List, Dict, Any, Optional
from sqlalchemy.orm import Session

from backend.database import get_db
from backend.schemas import ApiResponse, DashboardMetrics
from backend.services.dashboard_service import DashboardService

router = APIRouter(prefix="/dashboard", tags=["Dashboard"])

@router.get("", response_model=ApiResponse[DashboardMetrics], summary="Get Live Dashboard KPIs")
async def get_dashboard_metrics(db: Optional[Session] = Depends(get_db)):
    """
    Retrieve real-time catalog analytics and health KPIs computed from Supabase PostgreSQL.
    """
    metrics = DashboardService.get_metrics(db=db)
    return ApiResponse(
        success=True,
        data=metrics,
        message="Dashboard metrics computed successfully"
    )

@router.get("/chart", response_model=ApiResponse[List[Dict[str, Any]]], summary="Get 7-Day Health Trend Chart")
async def get_dashboard_chart(db: Optional[Session] = Depends(get_db)):
    """
    Retrieve 7-day rolling data health and quality distribution chart points based on Supabase catalog state.
    """
    chart_data = DashboardService.get_chart_data(days=7, db=db)
    return ApiResponse(
        success=True,
        data=chart_data,
        message="7-day health trend retrieved successfully"
    )

@router.get("/attention", response_model=ApiResponse[List[Dict[str, Any]]], summary="Get Products Needing Attention")
async def get_attention_products(db: Optional[Session] = Depends(get_db)):
    """
    Retrieve lowest quality products and items requiring attribute enrichment from Supabase PostgreSQL.
    """
    attention_list = DashboardService.get_attention_products(limit=5, db=db)
    return ApiResponse(
        success=True,
        data=attention_list,
        message="Products needing attention retrieved"
    )
