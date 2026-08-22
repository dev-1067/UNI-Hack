from fastapi import APIRouter, HTTPException, status, Depends
from typing import List, Dict, Any, Optional
from sqlalchemy.orm import Session

from backend.database import get_db
from backend.schemas import ApiResponse, EnrichmentGenerateRequest, EnrichmentResponse
from backend.services.enrichment_service import EnrichmentService

router = APIRouter(prefix="/enrichment", tags=["AI Enrichment"])

@router.get("", response_model=ApiResponse[List[Dict[str, Any]]], summary="List Products for AI Enrichment")
async def list_enrichment_candidates(db: Optional[Session] = Depends(get_db)):
    """
    Retrieve products eligible for AI content and metadata enrichment from Supabase PostgreSQL.
    """
    candidates = EnrichmentService.get_candidates(db=db)
    return ApiResponse(success=True, data=candidates, message="Retrieved enrichment candidates")

@router.post("/generate", response_model=ApiResponse[EnrichmentResponse], summary="Generate AI Content")
async def generate_enrichment(
    request: EnrichmentGenerateRequest,
    db: Optional[Session] = Depends(get_db)
):
    """
    Generate optimized descriptions, channel-tailored bullet points, and SEO metadata, saving a draft in Supabase.
    """
    response_data = EnrichmentService.generate(
        product_id=request.productId,
        tone=request.tone,
        language=request.language,
        channel=request.channel,
        db=db
    )
    return ApiResponse(success=True, data=response_data, message="Enriched content generated")

@router.post("/{id}/approve", response_model=ApiResponse[Dict[str, Any]], summary="Approve AI Enrichment")
async def approve_enrichment(id: str, db: Optional[Session] = Depends(get_db)):
    """
    Accept generated AI content, mark enrichment approved, and update product description and ai_enriched status in Supabase.
    """
    result = EnrichmentService.approve(identifier=id, db=db)
    return ApiResponse(
        success=True,
        data=result,
        message="AI content approved and saved to product catalog"
    )

@router.post("/{id}/reject", response_model=ApiResponse[Dict[str, Any]], summary="Reject AI Enrichment")
async def reject_enrichment(id: str, db: Optional[Session] = Depends(get_db)):
    """
    Discard generated draft content without updating the product record in Supabase.
    """
    result = EnrichmentService.reject(identifier=id, db=db)
    return ApiResponse(
        success=True,
        data=result,
        message="Enrichment draft discarded"
    )
