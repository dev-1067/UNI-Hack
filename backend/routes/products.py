from fastapi import APIRouter, HTTPException, status, Query, Depends
from typing import List, Optional
from sqlalchemy.orm import Session

from backend.database import get_db
from backend.schemas import ApiResponse, ProductCreate, ProductUpdate, ProductResponse
from backend.services.product_service import ProductService

router = APIRouter(prefix="/products", tags=["Products"])

@router.get("", response_model=ApiResponse[List[ProductResponse]], summary="List Products")
async def list_products(
    category: Optional[str] = Query(None, description="Filter by category"),
    status: Optional[str] = Query(None, description="Filter by status"),
    search: Optional[str] = Query(None, description="Search term for SKU, Name, or Brand"),
    db: Optional[Session] = Depends(get_db)
):
    """
    Retrieve product catalog from Supabase PostgreSQL with optional search and filters.
    """
    prods = ProductService.get_all(
        db=db,
        category=category,
        status_filter=status,
        search=search
    )
    return ApiResponse(
        success=True,
        data=prods,
        message=f"Retrieved {len(prods)} products"
    )

@router.get("/{product_id}", response_model=ApiResponse[ProductResponse], summary="Get Product Details")
async def get_product(product_id: str, db: Optional[Session] = Depends(get_db)):
    """
    Get detailed product data by ID or SKU from Supabase PostgreSQL.
    """
    prod = ProductService.get_by_id_or_sku(product_id=product_id, db=db)
    return ApiResponse(success=True, data=prod)

@router.post("", response_model=ApiResponse[ProductResponse], status_code=status.HTTP_201_CREATED, summary="Create Product")
async def create_product(product: ProductCreate, db: Optional[Session] = Depends(get_db)):
    """
    Create a new product in Supabase PostgreSQL with SKU uniqueness enforcement.
    """
    created_prod = ProductService.create(product_in=product, db=db)
    return ApiResponse(
        success=True,
        data=created_prod,
        message="Product created successfully"
    )

@router.put("/{product_id}", response_model=ApiResponse[ProductResponse], summary="Update Product")
async def update_product(
    product_id: str,
    updates: ProductUpdate,
    db: Optional[Session] = Depends(get_db)
):
    """
    Update product attributes and specifications in Supabase PostgreSQL.
    """
    updated_prod = ProductService.update(
        product_id=product_id,
        updates=updates,
        db=db
    )
    return ApiResponse(
        success=True,
        data=updated_prod,
        message="Product updated successfully"
    )

@router.delete("/{product_id}", response_model=ApiResponse[bool], summary="Delete Product")
async def delete_product(product_id: str, db: Optional[Session] = Depends(get_db)):
    """
    Delete a product from Supabase PostgreSQL by ID or SKU.
    """
    ProductService.delete(product_id=product_id, db=db)
    return ApiResponse(
        success=True,
        data=True,
        message="Product deleted successfully"
    )
