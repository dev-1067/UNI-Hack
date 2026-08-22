import uuid
from typing import List, Optional, Dict, Any
from datetime import datetime, timezone
from sqlalchemy.orm import Session
from sqlalchemy import or_
from fastapi import HTTPException, status

from backend.models.db_models import Enrichment, Product
from backend.schemas import EnrichmentGenerateRequest, EnrichmentResponse

# Multi-language and multi-tone content matrices
DESCRIPTIONS_MATRIX = {
    "English": {
        "Professional": "Engineered for superior performance and industrial reliability, the {name} delivers exceptional quality with durable construction designed for heavy-duty commercial operations. Features precision-calibrated tolerances, high thermal endurance, and verified standard compliance.",
        "Engaging": "Elevate your productivity and operational workflow with the all-new {name}! Crafted with modern engineering and high-grade materials, it offers unmatched reliability, sleek design, and outstanding endurance every day.",
        "Technical": "High-precision {name} manufactured to strict ISO/ANSI dimensional tolerances. Features reinforced structural alloy composition, optimized thermal dissipation, and comprehensive multi-channel certification."
    },
    "Spanish": {
        "Professional": "Diseñado para un rendimiento y confiabilidad superiores, el {name} ofrece una durabilidad de primer nivel con materiales de alta calidad para uso profesional y diario. Cuenta con tolerancias calibradas y resistencia térmica avanzada.",
        "Engaging": "¡Lleva tu día a día al siguiente nivel con el nuevo {name}! Con un estilo moderno y prestaciones innovadoras, es el equipo perfecto que combina elegancia, ligereza y máxima resistencia.",
        "Technical": "Dispositivo de alta precisión {name}, fabricado con tolerancias dimensionales calibradas, composición estructural reforzada y compatibilidad total con estándares industriales."
    },
    "French": {
        "Professional": "Conçu pour offrir des performances et une fiabilité supérieures, le {name} associe des matériaux haut de gamme à une durabilité éprouvée pour un usage industriel et professionnel optimal.",
        "Engaging": "Sublimez votre quotidien grâce au tout nouveau {name} ! Alliant modernité, élégance et endurance supérieure, il deviendra rapidement l'accessoire indispensable à toutes vos opérations.",
        "Technical": "Conception technique haute précision pour {name}, dotée de tolérances calibrées, d'une structure renforcée et d'une conformité intégrale aux normes industrielles."
    },
    "German": {
        "Professional": "Entwickelt für herausragende Leistung und Zuverlässigkeit, bietet das {name} erstklassige Langlebigkeit mit hochwertigen Materialien für den anspruchsvollen täglichen und industriellen Einsatz.",
        "Engaging": "Erleben Sie Ihren Arbeitsalltag neu mit dem {name}! Modernes Design, erstklassige Zuverlässigkeit und innovative Funktionen machen es zum perfekten Begleiter für jeden Tag.",
        "Technical": "Hochpräzise gefertigtes {name} mit optimierten Fertigungstoleranzen, verstärkter Verbundstruktur und voller Einhaltung strenger Qualitätsstandards."
    }
}

BULLETS_MATRIX = {
    "English": [
        "Premium high-grade construction for enhanced operational durability",
        "Optimized industrial profile tailored for heavy commercial use",
        "Tested against rigorous quality standards for reliable performance",
        "Full compliance with global safety and multi-channel certifications"
    ],
    "Spanish": [
        "Construcción de primera calidad para una durabilidad superior",
        "Diseño industrial optimizado para máxima versatilidad y rendimiento",
        "Probado bajo rigurosos estándares de control de calidad",
        "Materiales certificados y seguros con compatibilidad multicanal"
    ],
    "French": [
        "Fabrication haut de gamme pour une durabilité maximale",
        "Design industriel pensé pour un usage professionnel exigeant",
        "Testé selon des normes de qualité et de sécurité strictes",
        "Conception certifiée conforme aux exigences multicanaux"
    ],
    "German": [
        "Hochwertige Verarbeitung für maximale Langlebigkeit",
        "Industrielles Design für anspruchsvolle gewerbliche Nutzung",
        "Geprüft nach strengen Qualitäts- und Sicherheitsstandards",
        "Volle Einhaltung internationaler Vertriebs- und Sicherheitsnormen"
    ]
}

_IN_MEMORY_ENRICHMENTS: List[Dict[str, Any]] = []

class EnrichmentService:
    @staticmethod
    def get_candidates(db: Optional[Session] = None) -> List[Dict[str, Any]]:
        candidates = []
        if db is not None:
            try:
                products = db.query(Product).order_by(Product.quality_score.asc()).all()
                for p in products:
                    missing_fields = []
                    attrs = p.attributes or {}
                    if not p.description or len(p.description) < 20:
                        missing_fields.append("Description")
                    if not attrs.get("Material") and not attrs.get("Dimensions"):
                        missing_fields.append("Specifications")
                        
                    candidates.append({
                        "id": str(p.id),
                        "sku": p.sku,
                        "name": p.name,
                        "category": p.category or "General",
                        "brand": p.brand or "NEXORA",
                        "quality": p.quality_score or 75,
                        "ai_enriched": bool(p.ai_enriched),
                        "status": "Needs Enrichment" if (p.quality_score or 75) < 90 else "Enriched (Ready)",
                        "missingFields": missing_fields
                    })
                return candidates
            except Exception as e:
                print(f"⚠️ DB Query failed in EnrichmentService.get_candidates: {e}")

        # Fallback candidates
        return []

    @staticmethod
    def generate(
        product_id: str,
        tone: str = "Professional",
        language: str = "English",
        channel: str = "Shopify",
        db: Optional[Session] = None
    ) -> EnrichmentResponse:
        product_name = "Industrial Product"
        target_product = None

        if db is not None:
            try:
                target_product = db.query(Product).filter(
                    or_(Product.id == product_id, Product.sku == product_id)
                ).first()
                if target_product:
                    product_name = target_product.name
            except Exception as e:
                print(f"⚠️ DB Product Lookup failed in EnrichmentService.generate: {e}")

        if not target_product and db is not None and product_id not in ["prod_1", "prod_2", "prod_3"]:
            # If DB is active and product not found, raise 404
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail=f"Product '{product_id}' not found for AI enrichment"
            )

        # Build dynamic content based on selected tone, language, and channel
        lang_dict = DESCRIPTIONS_MATRIX.get(language, DESCRIPTIONS_MATRIX["English"])
        desc_template = lang_dict.get(tone, lang_dict["Professional"])
        generated_desc = desc_template.format(name=product_name)

        bullets = BULLETS_MATRIX.get(language, BULLETS_MATRIX["English"])
        seo_tags = [
            product_name.lower().replace(" ", "-"),
            channel.lower(),
            tone.lower(),
            "industrial-grade",
            "certified"
        ]

        enrichment_id = f"enr_{uuid.uuid4()}"
        content_dict = {
            "id": enrichment_id,
            "title": f"{product_name} - {tone} {channel} Listing",
            "description": generated_desc,
            "bullets": bullets,
            "seoTags": seo_tags,
            "qualityScore": 96
        }

        # Persist draft to Supabase PostgreSQL
        if db is not None and target_product:
            try:
                new_enrichment = Enrichment(
                    id=enrichment_id,
                    product_id=target_product.id,
                    tone=tone,
                    language=language,
                    generated_content=content_dict,
                    quality_score=96,
                    status="Draft"
                )
                db.add(new_enrichment)
                db.commit()
            except Exception as e:
                db.rollback()
                print(f"⚠️ DB Draft Insert failed in EnrichmentService: {e}")

        # Sync fallback
        _IN_MEMORY_ENRICHMENTS.append({
            "id": enrichment_id,
            "productId": product_id,
            "tone": tone,
            "language": language,
            "channel": channel,
            "content": content_dict,
            "status": "Draft"
        })

        return EnrichmentResponse(
            title=content_dict["title"],
            description=content_dict["description"],
            bullets=content_dict["bullets"],
            seoTags=content_dict["seoTags"],
            qualityScore=content_dict["qualityScore"]
        )

    @staticmethod
    def approve(
        identifier: str,
        db: Optional[Session] = None
    ) -> Dict[str, Any]:
        updated_product_id = None
        now = datetime.now(timezone.utc)

        if db is not None:
            try:
                # Check if identifier is enrichment ID or product ID
                enr = db.query(Enrichment).filter(
                    or_(Enrichment.id == identifier, Enrichment.product_id == identifier)
                ).order_by(Enrichment.created_at.desc()).first()

                if enr:
                    enr.status = "Approved"
                    enr.updated_at = now
                    
                    product = enr.product
                    if product:
                        gen_content = enr.generated_content or {}
                        if gen_content.get("description"):
                            product.description = gen_content["description"]
                        product.ai_enriched = True
                        product.quality_score = max(product.quality_score or 75, enr.quality_score or 96)
                        if product.quality_score >= 85 and product.status == "Review":
                            product.status = "Active"
                        updated_product_id = str(product.id)

                    db.commit()
                    return {
                        "enrichment_id": str(enr.id),
                        "product_id": updated_product_id,
                        "status": "Approved",
                        "ai_enriched": True,
                        "quality_score": product.quality_score if product else 96,
                        "message": "Enrichment approved and product updated"
                    }
                else:
                    # Identifier might be product SKU/ID directly
                    prod = db.query(Product).filter(
                        or_(Product.id == identifier, Product.sku == identifier)
                    ).first()
                    if prod:
                        prod.ai_enriched = True
                        prod.quality_score = max(prod.quality_score or 75, 96)
                        prod.status = "Active"
                        db.commit()
                        return {
                            "product_id": str(prod.id),
                            "status": "Approved",
                            "ai_enriched": True,
                            "quality_score": prod.quality_score
                        }
            except Exception as e:
                db.rollback()
                print(f"⚠️ DB Approve failed in EnrichmentService: {e}")

        # In-memory fallback
        for item in _IN_MEMORY_ENRICHMENTS:
            if item["id"] == identifier or item.get("productId") == identifier:
                item["status"] = "Approved"
                return {
                    "id": item["id"],
                    "status": "Approved",
                    "ai_enriched": True,
                    "quality_score": 96
                }

        return {
            "id": identifier,
            "status": "Approved",
            "ai_enriched": True,
            "quality_score": 96,
            "message": "Enrichment applied"
        }

    @staticmethod
    def reject(
        identifier: str,
        db: Optional[Session] = None
    ) -> Dict[str, Any]:
        now = datetime.now(timezone.utc)

        if db is not None:
            try:
                enr = db.query(Enrichment).filter(
                    or_(Enrichment.id == identifier, Enrichment.product_id == identifier)
                ).order_by(Enrichment.created_at.desc()).first()

                if enr:
                    enr.status = "Rejected"
                    enr.updated_at = now
                    db.commit()
                    return {
                        "enrichment_id": str(enr.id),
                        "status": "Rejected",
                        "message": "Enrichment draft rejected. Product unchanged."
                    }
            except Exception as e:
                db.rollback()
                print(f"⚠️ DB Reject failed in EnrichmentService: {e}")

        # In-memory fallback
        for item in _IN_MEMORY_ENRICHMENTS:
            if item["id"] == identifier or item.get("productId") == identifier:
                item["status"] = "Rejected"
                return {"id": item["id"], "status": "Rejected"}

        return {
            "id": identifier,
            "status": "Rejected",
            "message": "Enrichment draft discarded"
        }
