import io
import csv
import uuid
from typing import List, Optional, Dict, Any, Tuple
from datetime import datetime, timezone
from sqlalchemy.orm import Session
from sqlalchemy import func

from backend.models.db_models import Report, Product, QualityIssue, Enrichment, Integration, SyncJob

# Initial standard report catalog
STANDARD_REPORTS = [
    {
        "id": "rep_1",
        "name": "Complete Product Catalog Audit",
        "type": "Product Catalog",
        "date": "2026-08-22",
        "status": "Ready",
        "by": "NEXORA System",
        "description": "Full export of all SKU specifications, taxonomies, price, and status."
    },
    {
        "id": "rep_2",
        "name": "Data Quality & Standardization Health",
        "type": "Product Quality",
        "date": "2026-08-22",
        "status": "Ready",
        "by": "AI Governance",
        "description": "Analysis of missing attributes, unit mismatches, and compliance scores."
    },
    {
        "id": "rep_3",
        "name": "AI Content & Copy Enrichment Audit",
        "type": "AI Enrichment",
        "date": "2026-08-22",
        "status": "Ready",
        "by": "Content Team",
        "description": "Tracking of AI-generated descriptions, bullet points, and SEO metadata."
    },
    {
        "id": "rep_4",
        "name": "Omnichannel Marketplace Readiness",
        "type": "Channel Readiness",
        "date": "2026-08-22",
        "status": "Ready",
        "by": "Integration Gateway",
        "description": "Catalog readiness compliance across Shopify, Amazon, and Google Shopping."
    }
]

_IN_MEMORY_REPORTS: List[Dict[str, Any]] = [dict(r) for r in STANDARD_REPORTS]

class ReportService:
    @staticmethod
    def get_all(db: Optional[Session] = None) -> Dict[str, Any]:
        reports_list = []
        if db is not None:
            try:
                db_reports = db.query(Report).order_by(Report.created_at.desc()).all()
                if not db_reports:
                    # Seed standard reports into Supabase
                    for rep_def in STANDARD_REPORTS:
                        new_rep = Report(
                            name=rep_def["name"],
                            report_type=rep_def["type"]
                        )
                        db.add(new_rep)
                    db.commit()
                    db_reports = db.query(Report).order_by(Report.created_at.desc()).all()

                for r in db_reports:
                    reports_list.append({
                        "id": str(r.id),
                        "name": r.name,
                        "type": r.report_type,
                        "date": r.created_at.strftime("%b %d, %Y") if r.created_at else "Today",
                        "status": "Ready",
                        "by": "NEXORA System",
                        "description": f"Audit report on {r.report_type}"
                    })
            except Exception as e:
                pass

        if not reports_list:
            reports_list = _IN_MEMORY_REPORTS

        # Calculate live trend chart metrics
        chart_data = ReportService._calculate_chart_data(db)

        return {
            "reports": reports_list,
            "chartData": chart_data
        }

    @staticmethod
    def get_by_id(report_id: str, db: Optional[Session] = None) -> Dict[str, Any]:
        # Fetch live database aggregate statistics
        stats = ReportService.get_statistics(db=db)

        if db is not None:
            try:
                db_rep = db.query(Report).filter(
                    Report.id == report_id
                ).first()
                if db_rep:
                    return {
                        "id": str(db_rep.id),
                        "name": db_rep.name,
                        "type": db_rep.report_type,
                        "created_at": db_rep.created_at.isoformat() if db_rep.created_at else None,
                        "metadata": {},
                        "statistics": stats
                    }
            except Exception as e:
                pass

        for r in _IN_MEMORY_REPORTS:
            if str(r.get("id")) == str(report_id):
                return {
                    "id": r["id"],
                    "name": r["name"],
                    "type": r["type"],
                    "created_at": datetime.now(timezone.utc).isoformat(),
                    "statistics": stats
                }

        # If general report lookup
        return {
            "id": report_id,
            "name": f"Audit Report {report_id}",
            "type": "Product Quality",
            "created_at": datetime.now(timezone.utc).isoformat(),
            "statistics": stats
        }

    @staticmethod
    def get_statistics(db: Optional[Session] = None) -> Dict[str, Any]:
        total_products = 0
        active_products = 0
        review_products = 0
        enriched_products = 0
        avg_quality = 0
        total_issues = 0
        high_severity_issues = 0
        active_integrations = 0

        if db is not None:
            try:
                # Products metrics
                total_products = db.query(Product).count()
                active_products = db.query(Product).filter(Product.status.ilike("active")).count()
                review_products = db.query(Product).filter(Product.status.ilike("review")).count()
                enriched_products = db.query(Product).filter(Product.ai_enriched == True).count()
                
                avg_q = db.query(func.avg(Product.quality_score)).scalar()
                if avg_q is not None:
                    avg_quality = int(round(avg_q))

                # Quality metrics
                total_issues = db.query(QualityIssue).filter(QualityIssue.status == "Unresolved").count()
                high_severity_issues = db.query(QualityIssue).filter(
                    QualityIssue.status == "Unresolved",
                    QualityIssue.severity.ilike("high")
                ).count()

                # Integration metrics
                active_integrations = db.query(Integration).filter(Integration.status.ilike("connected")).count()

                return {
                    "products": {
                        "total": total_products,
                        "active": active_products,
                        "review": review_products,
                        "enriched": enriched_products,
                        "avg_quality_score": avg_quality,
                        "enrichment_rate_pct": int(round((enriched_products / total_products * 100))) if total_products > 0 else 0
                    },
                    "quality": {
                        "open_issues_count": total_issues,
                        "high_severity_count": high_severity_issues,
                        "system_health_score": avg_quality
                    },
                    "integrations": {
                        "connected_channels": active_integrations
                    }
                }
            except Exception as e:
                pass

        # Fallback statistics
        return {
            "products": {
                "total": 0,
                "active": 0,
                "review": 0,
                "enriched": 0,
                "avg_quality_score": 0,
                "enrichment_rate_pct": 0
            },
            "quality": {
                "open_issues_count": 0,
                "high_severity_count": 0,
                "system_health_score": 0
            },
            "integrations": {
                "connected_channels": 0
            }
        }

    @staticmethod
    def export_csv(
        report_type: str = "catalog",
        date_range: str = "30d",
        db: Optional[Session] = None
    ) -> Tuple[str, str]:
        output = io.StringIO()
        writer = csv.writer(output, quoting=csv.QUOTE_MINIMAL)
        timestamp = datetime.now(timezone.utc).strftime("%Y%m%d_%H%M%S")
        rt = (report_type or "catalog").strip().lower()

        if "quality" in rt or "health" in rt:
            filename = f"nexora_quality_report_{timestamp}.csv"
            writer.writerow(["Issue ID", "Product SKU", "Product Name", "Issue Description", "Attribute", "Severity", "Status"])

            if db is not None:
                try:
                    issues = db.query(QualityIssue).all()
                    for q in issues:
                        p_sku = q.product.sku if q.product else "N/A"
                        p_name = q.product.name if q.product else "N/A"
                        writer.writerow([
                            str(q.id),
                            p_sku,
                            p_name,
                            q.message or q.issue_type,
                            q.field_name or "General",
                            q.severity or "medium",
                            q.status or "Unresolved"
                        ])
                except Exception as e:
                    pass

        elif "enrichment" in rt or "ai" in rt:
            filename = f"nexora_enrichment_report_{timestamp}.csv"
            writer.writerow(["Product SKU", "Product Name", "Category", "Quality Score", "AI Enriched", "Status", "Description"])

            if db is not None:
                try:
                    products = db.query(Product).all()
                    for p in products:
                        writer.writerow([
                            p.sku,
                            p.name,
                            p.category or "General",
                            p.quality_score or 75,
                            "Enriched" if p.ai_enriched else "Pending",
                            p.status or "Active",
                            (p.description or "")[:150]
                        ])
                except Exception as e:
                    pass

        elif "channel" in rt or "integration" in rt:
            filename = f"nexora_integrations_report_{timestamp}.csv"
            writer.writerow(["Channel Name", "Status", "Sync Status", "Last Synchronized At"])

            if db is not None:
                try:
                    integrations = db.query(Integration).all()
                    for i in integrations:
                        writer.writerow([
                            i.channel,
                            i.status or "disconnected",
                            i.sync_status or "idle",
                            i.last_sync_at.isoformat() if i.last_sync_at else "Never"
                        ])
                except Exception as e:
                    pass

        else: # Default: Catalog
            filename = f"nexora_catalog_report_{timestamp}.csv"
            writer.writerow(["SKU", "Product Name", "Category", "Brand", "Price", "Stock", "Quality Score (%)", "Status", "AI Enriched"])

            if db is not None:
                try:
                    products = db.query(Product).order_by(Product.sku.asc()).all()
                    for p in products:
                        writer.writerow([
                            p.sku,
                            p.name,
                            p.category or "General",
                            p.brand or "NEXORA",
                            p.price or "$0.00",
                            p.stock if p.stock is not None else 0,
                            p.quality_score or 75,
                            p.status or "Active",
                            "Yes" if p.ai_enriched else "No"
                        ])
                except Exception as e:
                    pass

        return output.getvalue(), filename

    @staticmethod
    def add_report_entry(
        name: str,
        report_type: str,
        db: Optional[Session] = None
    ) -> Dict[str, Any]:
        now = datetime.now(timezone.utc)
        if db is not None:
            try:
                new_rep = Report(
                    name=name,
                    report_type=report_type
                )
                db.add(new_rep)
                db.commit()
                db.refresh(new_rep)
                return {
                    "id": str(new_rep.id),
                    "name": new_rep.name,
                    "type": new_rep.report_type,
                    "status": "Ready"
                }
            except Exception as e:
                db.rollback()

        # Fallback
        entry = {
            "id": f"rep_{uuid.uuid4()}",
            "name": name,
            "type": report_type,
            "date": "Today",
            "status": "Ready",
            "by": "User Export"
        }
        _IN_MEMORY_REPORTS.insert(0, entry)
        return entry

    @staticmethod
    def _calculate_chart_data(db: Optional[Session] = None) -> List[Dict[str, Any]]:
        from backend.services.dashboard_service import DashboardService
        return DashboardService.get_chart_data(days=7, db=db)
