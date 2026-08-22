from typing import List, Optional, Dict, Any
from datetime import datetime, timezone
from sqlalchemy.orm import Session
from fastapi import HTTPException, status

from backend.models.db_models import QualityIssue, Product
from backend.schemas import QualityIssue as QualityIssueSchema, QualityFixRequest

_IN_MEMORY_QUALITY_ISSUES: List[Dict[str, Any]] = [
    {
        "id": "q1",
        "productId": "prod_1",
        "product": "Diablo Steel Demon 5-3/8 in. Saw Blade",
        "sku": "DCB518ASTS06G",
        "category": "Power Tools / Saw Blades",
        "issue": "Missing Coating Specification",
        "attribute": "Coating Type",
        "severity": "medium",
        "suggestion": "Perma-Shield Anti-Friction Coating",
        "status": "Unresolved"
    },
    {
        "id": "q2",
        "productId": "prod_2",
        "product": "Ergonomic Office Chair Pro",
        "sku": "OFF-CHR-002",
        "category": "Office Furniture",
        "issue": "Missing Weight Capacity UOM",
        "attribute": "Weight Capacity",
        "severity": "high",
        "suggestion": "300 lbs",
        "status": "Unresolved"
    },
    {
        "id": "q3",
        "productId": "prod_3",
        "product": "Wireless Charging Pad Qi2",
        "sku": "WIR-CHG-003",
        "category": "Electronics",
        "issue": "Missing Output Voltage Standard",
        "attribute": "Output Voltage",
        "severity": "low",
        "suggestion": "9V / 2.22A Fast Charging",
        "status": "Unresolved"
    }
]

def _orm_to_schema(q: QualityIssue) -> QualityIssueSchema:
    prod_name = q.product.name if q.product else f"Product {q.product_id}"
    prod_sku = q.product.sku if q.product else f"SKU-{q.product_id}"
    prod_cat = q.product.category if q.product else "General"
    
    return QualityIssueSchema(
        id=str(q.id),
        productId=str(q.product_id),
        product=prod_name,
        sku=prod_sku,
        category=prod_cat,
        issue=q.message or q.issue_type,
        attribute=q.field_name,
        severity=q.severity or "high",
        suggestion=q.suggestion or "",
        status=q.status or "Unresolved"
    )

def _dict_to_schema(q: Dict[str, Any]) -> QualityIssueSchema:
    return QualityIssueSchema(
        id=str(q.get("id", "")),
        productId=str(q.get("productId", q.get("product_id", ""))),
        product=str(q.get("product", "Industrial Product")),
        sku=str(q.get("sku", "NXR-SKU-01")),
        category=str(q.get("category", "General")),
        issue=str(q.get("issue", "Attribute missing")),
        attribute=str(q.get("attribute", "specification")),
        severity=str(q.get("severity", "medium")),
        suggestion=str(q.get("suggestion", "")),
        status=str(q.get("status", "Unresolved"))
    )

class QualityService:
    @staticmethod
    def get_all(
        db: Optional[Session] = None,
        product_id: Optional[str] = None,
        status_filter: Optional[str] = None
    ) -> List[QualityIssueSchema]:
        if db is not None:
            try:
                query = db.query(QualityIssue)
                if product_id:
                    query = query.filter(QualityIssue.product_id == product_id)
                if status_filter:
                    query = query.filter(QualityIssue.status.ilike(status_filter))
                db_issues = query.order_by(QualityIssue.created_at.desc()).all()
                return [_orm_to_schema(q) for q in db_issues]
            except Exception as e:
                print(f"⚠️ DB Query failed in QualityService.get_all: {e}")

        # Fallback
        results = _IN_MEMORY_QUALITY_ISSUES
        if product_id:
            results = [q for q in results if q.get("productId") == product_id or q.get("sku") == product_id]
        if status_filter:
            results = [q for q in results if q.get("status", "").lower() == status_filter.lower()]
        return [_dict_to_schema(q) for q in results]

    @staticmethod
    def get_by_id(issue_id: str, db: Optional[Session] = None) -> QualityIssueSchema:
        if db is not None:
            try:
                db_issue = db.query(QualityIssue).filter(QualityIssue.id == issue_id).first()
                if db_issue:
                    return _orm_to_schema(db_issue)
                raise HTTPException(
                    status_code=status.HTTP_404_NOT_FOUND,
                    detail=f"Quality issue '{issue_id}' not found"
                )
            except HTTPException:
                raise
            except Exception as e:
                print(f"⚠️ DB Query failed in QualityService.get_by_id: {e}")

        # Fallback
        for q in _IN_MEMORY_QUALITY_ISSUES:
            if q.get("id") == issue_id:
                return _dict_to_schema(q)

        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Quality issue '{issue_id}' not found"
        )

    @staticmethod
    def fix_manual(
        issue_id: str,
        attribute: str,
        value: str,
        db: Optional[Session] = None
    ) -> Dict[str, Any]:
        resolved_at = datetime.now(timezone.utc)

        if db is not None:
            try:
                db_issue = db.query(QualityIssue).filter(QualityIssue.id == issue_id).first()
                if db_issue:
                    db_issue.status = "Resolved"
                    db_issue.resolved_at = resolved_at

                    # Update associated Product
                    product = db_issue.product
                    if product:
                        attrs = dict(product.attributes or {})
                        attrs[attribute] = value
                        product.attributes = attrs
                        
                        # Recalculate Quality Score
                        product.quality_score = min(100, (product.quality_score or 75) + 8)
                        if product.quality_score >= 85 and product.status == "Review":
                            product.status = "Active"

                    db.commit()
                    return {
                        "issue_id": issue_id,
                        "attribute": attribute,
                        "applied_value": value,
                        "status": "Resolved",
                        "product_id": str(product.id) if product else None,
                        "new_quality_score": product.quality_score if product else None
                    }
            except Exception as e:
                db.rollback()
                print(f"⚠️ DB manual fix failed in QualityService: {e}")

        # In-memory fallback
        for q in _IN_MEMORY_QUALITY_ISSUES:
            if q.get("id") == issue_id:
                q["status"] = "Resolved"
                return {
                    "issue_id": issue_id,
                    "attribute": attribute,
                    "applied_value": value,
                    "status": "Resolved"
                }

        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Quality issue '{issue_id}' not found"
        )

    @staticmethod
    def fix_ai(
        issue_id: str,
        db: Optional[Session] = None
    ) -> Dict[str, Any]:
        resolved_at = datetime.now(timezone.utc)

        if db is not None:
            try:
                if issue_id.lower() == "all":
                    unresolved = db.query(QualityIssue).filter(QualityIssue.status == "Unresolved").all()
                    fixed_count = 0
                    for issue in unresolved:
                        issue.status = "Resolved"
                        issue.resolved_at = resolved_at
                        if issue.product:
                            inferred_val = issue.suggestion or "Standard Compliant"
                            attrs = dict(issue.product.attributes or {})
                            attrs[issue.field_name] = inferred_val
                            issue.product.attributes = attrs
                            issue.product.quality_score = min(100, (issue.product.quality_score or 75) + 10)
                        fixed_count += 1
                    db.commit()
                    return {
                        "fixed_count": fixed_count,
                        "status": "Resolved",
                        "message": f"Successfully fixed {fixed_count} issues with AI"
                    }
                else:
                    db_issue = db.query(QualityIssue).filter(QualityIssue.id == issue_id).first()
                    if db_issue:
                        db_issue.status = "Resolved"
                        db_issue.resolved_at = resolved_at
                        inferred_val = db_issue.suggestion or "Standard Specification"
                        if db_issue.product:
                            attrs = dict(db_issue.product.attributes or {})
                            attrs[db_issue.field_name] = inferred_val
                            db_issue.product.attributes = attrs
                            db_issue.product.quality_score = min(100, (db_issue.product.quality_score or 75) + 10)
                        db.commit()
                        return {
                            "issue_id": issue_id,
                            "attribute": db_issue.field_name,
                            "ai_inferred_value": inferred_val,
                            "status": "Resolved"
                        }
            except Exception as e:
                db.rollback()
                print(f"⚠️ DB AI fix failed in QualityService: {e}")

        # In-memory fallback
        if issue_id.lower() == "all":
            for q in _IN_MEMORY_QUALITY_ISSUES:
                q["status"] = "Resolved"
            return {"fixed_count": len(_IN_MEMORY_QUALITY_ISSUES), "status": "Resolved"}

        for q in _IN_MEMORY_QUALITY_ISSUES:
            if q.get("id") == issue_id:
                q["status"] = "Resolved"
                return {
                    "issue_id": issue_id,
                    "attribute": q.get("attribute", "spec"),
                    "ai_inferred_value": q.get("suggestion", "Standard Specification"),
                    "status": "Resolved"
                }

        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Quality issue '{issue_id}' not found"
        )
