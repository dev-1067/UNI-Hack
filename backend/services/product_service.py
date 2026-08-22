from typing import List, Optional, Dict, Any
from sqlalchemy.orm import Session
from sqlalchemy import or_
from fastapi import HTTPException, status

from backend.models.db_models import Product
from backend.schemas import ProductCreate, ProductUpdate, ProductResponse

# In-memory storage cache as seamless fallback when DB is unconfigured or in memory
_IN_MEMORY_PRODUCTS: List[Dict[str, Any]] = [
    {
        "id": "prod_1",
        "sku": "DCB518ASTS06G",
        "name": "Diablo Steel Demon 5-3/8 in. Saw Blade",
        "description": "Premium industrial grade thick metal cutting circular saw blade with TiCo carbide teeth.",
        "brand": "Diablo",
        "category": "Power Tools / Saw Blades",
        "price": "$45.00",
        "stock": 120,
        "quality": 95,
        "quality_score": 95,
        "status": "Active",
        "readiness": 96,
        "ai_enriched": True,
        "attributes": {
            "Diameter": "5-3/8 in.",
            "Teeth": "50",
            "Arbor": "20mm",
            "Material Application": "Metal"
        }
    },
    {
        "id": "prod_2",
        "sku": "OFF-CHR-002",
        "name": "Ergonomic Office Chair Pro",
        "description": "High-back mesh ergonomic office chair with adjustable lumbar support.",
        "brand": "ErgoFlex",
        "category": "Office Furniture",
        "price": "$289.00",
        "stock": 45,
        "quality": 88,
        "quality_score": 88,
        "status": "Active",
        "readiness": 85,
        "ai_enriched": False,
        "attributes": {
            "Material": "Breathable Mesh",
            "Weight Capacity": "300 lbs"
        }
    },
    {
        "id": "prod_3",
        "sku": "WIR-CHG-003",
        "name": "Wireless Charging Pad Qi2",
        "description": "15W fast wireless charging pad compatible with all Qi-enabled smartphones.",
        "brand": "PowerVolt",
        "category": "Electronics",
        "price": "$34.99",
        "stock": 350,
        "quality": 92,
        "quality_score": 92,
        "status": "Active",
        "readiness": 90,
        "ai_enriched": True,
        "attributes": {
            "Wattage": "15W",
            "Standard": "Qi2 Fast Charge"
        }
    }
]

def _orm_to_pydantic(p: Product) -> ProductResponse:
    return ProductResponse(
        id=str(p.id),
        name=p.name,
        sku=p.sku,
        category=p.category or "General",
        brand=p.brand or "NEXORA",
        description=p.description or "",
        price=p.price or "$0.00",
        stock=p.stock if p.stock is not None else 100,
        quality=p.quality_score if p.quality_score is not None else 75,
        status=p.status or "Active",
        readiness=min(100, (p.quality_score or 75) + 5),
        ai_enriched=bool(p.ai_enriched),
        attributes=p.attributes or {}
    )

def _dict_to_pydantic(p: Dict[str, Any]) -> ProductResponse:
    quality = p.get("quality_score", p.get("quality", 75))
    return ProductResponse(
        id=str(p.get("id", "")),
        name=p.get("name", ""),
        sku=p.get("sku", ""),
        category=p.get("category", "General"),
        brand=p.get("brand", "NEXORA"),
        description=p.get("description", ""),
        price=str(p.get("price", "$0.00")),
        stock=int(p.get("stock", 100)),
        quality=int(quality),
        status=p.get("status", "Active"),
        readiness=int(p.get("readiness", min(100, quality + 5))),
        ai_enriched=bool(p.get("ai_enriched", False)),
        attributes=p.get("attributes", {})
    )


class ProductService:
    @staticmethod
    def get_all(
        db: Optional[Session] = None,
        category: Optional[str] = None,
        status_filter: Optional[str] = None,
        search: Optional[str] = None
    ) -> List[ProductResponse]:
        if db is not None:
            try:
                query = db.query(Product)
                if category and category != "All":
                    query = query.filter(Product.category.ilike(f"%{category}%"))
                if status_filter and status_filter != "All":
                    query = query.filter(Product.status.ilike(status_filter))
                if search:
                    term = f"%{search.lower()}%"
                    query = query.filter(
                        or_(
                            Product.name.ilike(term),
                            Product.sku.ilike(term),
                            Product.brand.ilike(term),
                            Product.category.ilike(term)
                        )
                    )
                db_prods = query.order_by(Product.created_at.desc()).all()
                return [_orm_to_pydantic(p) for p in db_prods]
            except Exception as e:
                print(f"⚠️ DB Query failed in ProductService.get_all: {e}")

        # Fallback to in-memory store
        results = _IN_MEMORY_PRODUCTS
        if category and category != "All":
            results = [p for p in results if category.lower() in p.get("category", "").lower()]
        if status_filter and status_filter != "All":
            results = [p for p in results if p.get("status", "").lower() == status_filter.lower()]
        if search:
            q = search.lower()
            results = [
                p for p in results
                if q in p.get("name", "").lower() or q in p.get("sku", "").lower() or q in p.get("brand", "").lower()
            ]
        return [_dict_to_pydantic(p) for p in results]

    @staticmethod
    def get_by_id_or_sku(product_id: str, db: Optional[Session] = None) -> ProductResponse:
        if db is not None:
            try:
                db_prod = db.query(Product).filter(
                    or_(Product.id == product_id, Product.sku == product_id)
                ).first()
                if db_prod:
                    return _orm_to_pydantic(db_prod)
                raise HTTPException(
                    status_code=status.HTTP_404_NOT_FOUND,
                    detail=f"Product with ID or SKU '{product_id}' not found"
                )
            except HTTPException:
                raise
            except Exception as e:
                print(f"⚠️ DB Query failed in ProductService.get_by_id_or_sku: {e}")

        # Fallback
        for p in _IN_MEMORY_PRODUCTS:
            if p.get("id") == product_id or p.get("sku") == product_id:
                return _dict_to_pydantic(p)

        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Product with ID or SKU '{product_id}' not found"
        )

    @staticmethod
    def create(product_in: ProductCreate, db: Optional[Session] = None) -> ProductResponse:
        # Check SKU uniqueness
        if db is not None:
            try:
                existing = db.query(Product).filter(Product.sku == product_in.sku).first()
                if existing:
                    raise HTTPException(
                        status_code=status.HTTP_400_BAD_REQUEST,
                        detail=f"Product with SKU '{product_in.sku}' already exists"
                    )

                new_product = Product(
                    name=product_in.name,
                    sku=product_in.sku,
                    category=product_in.category or "General",
                    brand=product_in.brand or "NEXORA",
                    description=product_in.description or "",
                    price=product_in.price or "$0.00",
                    stock=product_in.stock if product_in.stock is not None else 100,
                    quality_score=product_in.quality or 75,
                    status=product_in.status or "Active",
                    attributes=product_in.attributes or {}
                )
                db.add(new_product)
                db.commit()
                db.refresh(new_product)

                # Keep in-memory cache synchronized
                _IN_MEMORY_PRODUCTS.insert(0, {
                    "id": str(new_product.id),
                    "sku": new_product.sku,
                    "name": new_product.name,
                    "description": new_product.description,
                    "brand": new_product.brand,
                    "category": new_product.category,
                    "price": new_product.price,
                    "stock": new_product.stock,
                    "quality": new_product.quality_score,
                    "quality_score": new_product.quality_score,
                    "status": new_product.status,
                    "readiness": min(100, new_product.quality_score + 5),
                    "attributes": new_product.attributes
                })

                return _orm_to_pydantic(new_product)
            except HTTPException:
                raise
            except Exception as e:
                db.rollback()
                print(f"⚠️ DB Insert failed in ProductService.create: {e}")

        # In-memory creation fallback
        for p in _IN_MEMORY_PRODUCTS:
            if p.get("sku", "").lower() == product_in.sku.lower():
                raise HTTPException(
                    status_code=status.HTTP_400_BAD_REQUEST,
                    detail=f"Product with SKU '{product_in.sku}' already exists"
                )

        new_dict = {
            "id": f"prod_{len(_IN_MEMORY_PRODUCTS) + 1}",
            "sku": product_in.sku,
            "name": product_in.name,
            "category": product_in.category or "General",
            "brand": product_in.brand or "NEXORA",
            "description": product_in.description or "",
            "price": product_in.price or "$0.00",
            "stock": product_in.stock if product_in.stock is not None else 100,
            "quality": product_in.quality or 75,
            "quality_score": product_in.quality or 75,
            "status": product_in.status or "Active",
            "readiness": min(100, (product_in.quality or 75) + 5),
            "attributes": product_in.attributes or {}
        }
        _IN_MEMORY_PRODUCTS.insert(0, new_dict)
        return _dict_to_pydantic(new_dict)

    @staticmethod
    def update(product_id: str, updates: ProductUpdate, db: Optional[Session] = None) -> ProductResponse:
        update_data = updates.model_dump(exclude_unset=True)

        if db is not None:
            try:
                db_prod = db.query(Product).filter(
                    or_(Product.id == product_id, Product.sku == product_id)
                ).first()
                if db_prod:
                    if "quality" in update_data:
                        update_data["quality_score"] = update_data.pop("quality")
                    for k, v in update_data.items():
                        setattr(db_prod, k, v)
                    db.commit()
                    db.refresh(db_prod)

                    # Update in-memory sync
                    for idx, p in enumerate(_IN_MEMORY_PRODUCTS):
                        if p.get("id") == product_id or p.get("sku") == product_id:
                            _IN_MEMORY_PRODUCTS[idx] = {**p, **update_data}
                            break

                    return _orm_to_pydantic(db_prod)
            except Exception as e:
                db.rollback()
                print(f"⚠️ DB Update failed in ProductService.update: {e}")

        # In-memory update
        for idx, p in enumerate(_IN_MEMORY_PRODUCTS):
            if p.get("id") == product_id or p.get("sku") == product_id:
                if "quality" in update_data:
                    update_data["quality_score"] = update_data["quality"]
                _IN_MEMORY_PRODUCTS[idx] = {**p, **update_data}
                return _dict_to_pydantic(_IN_MEMORY_PRODUCTS[idx])


        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Product '{product_id}' not found"
        )

    @staticmethod
    def delete(product_id: str, db: Optional[Session] = None) -> bool:
        found = False
        if db is not None:
            try:
                db_prod = db.query(Product).filter(
                    or_(Product.id == product_id, Product.sku == product_id)
                ).first()
                if db_prod:
                    db.delete(db_prod)
                    db.commit()
                    found = True
            except Exception as e:
                db.rollback()
                print(f"⚠️ DB Delete failed in ProductService.delete: {e}")

        # In-memory delete
        global _IN_MEMORY_PRODUCTS
        initial_len = len(_IN_MEMORY_PRODUCTS)
        _IN_MEMORY_PRODUCTS = [
            p for p in _IN_MEMORY_PRODUCTS
            if p.get("id") != product_id and p.get("sku") != product_id
        ]
        if len(_IN_MEMORY_PRODUCTS) < initial_len:
            found = True

        if not found:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail=f"Product '{product_id}' not found"
            )
        return True
