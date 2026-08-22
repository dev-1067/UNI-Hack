import uuid
from typing import List, Optional, Dict, Any
from datetime import datetime, timezone
from sqlalchemy.orm import Session

from backend.models.db_models import ActivityLog, User

# Initial seed activities
DEFAULT_ACTIVITIES = [
    {
        "id": "act_1",
        "action": "Product Created",
        "user": "Aarav Sharma",
        "target": "Diablo Steel Demon 5-3/8 in. Saw Blade",
        "entity_type": "product",
        "entity_id": "DCB518ASTS06G",
        "time": "12 min ago",
        "metadata": {"sku": "DCB518ASTS06G", "category": "Power Tools"}
    },
    {
        "id": "act_2",
        "action": "Connected Channel",
        "user": "System Admin",
        "target": "Shopify Storefront",
        "entity_type": "integration",
        "entity_id": "shopify",
        "time": "1 hr ago",
        "metadata": {"channel": "Shopify", "status": "connected"}
    },
    {
        "id": "act_3",
        "action": "AI Enriched Product",
        "user": "Alex Morgan",
        "target": "Ergonomic Office Chair Pro",
        "entity_type": "enrichment",
        "entity_id": "OFF-CHR-002",
        "time": "2 hrs ago",
        "metadata": {"tone": "Professional", "language": "English"}
    },
    {
        "id": "act_4",
        "action": "Fixed Quality Issue",
        "user": "AI Governance",
        "target": "Wireless Charging Pad Qi2",
        "entity_type": "quality_issue",
        "entity_id": "WIR-CHG-003",
        "time": "3 hrs ago",
        "metadata": {"attribute": "Output Voltage", "applied_value": "9V Fast Charge"}
    }
]

_IN_MEMORY_ACTIVITIES: List[Dict[str, Any]] = [dict(a) for a in DEFAULT_ACTIVITIES]

class ActivityService:
    @staticmethod
    def get_all(
        db: Optional[Session] = None,
        limit: int = 100,
        offset: int = 0,
        entity_type: Optional[str] = None
    ) -> List[Dict[str, Any]]:
        if db is not None:
            try:
                query = db.query(ActivityLog)
                if entity_type:
                    query = query.filter(ActivityLog.entity_type.ilike(entity_type))
                
                db_logs = query.order_by(ActivityLog.created_at.desc()).offset(offset).limit(limit).all()

                results = []
                for item in db_logs:
                    meta = item.metadata_json or {}
                    user_str = meta.get("user") or (item.user.name if item.user else "Alex Morgan")
                    target_str = meta.get("target") or item.entity_id or item.action
                    time_str = item.created_at.strftime("%b %d, %H:%M") if item.created_at else "Just now"

                    results.append({
                        "id": str(item.id),
                        "action": item.action,
                        "user": user_str,
                        "target": target_str,
                        "product": target_str,
                        "sku": meta.get("sku", item.entity_id or "N/A"),
                        "entity_type": item.entity_type or "product",
                        "entity_id": item.entity_id,
                        "time": time_str,
                        "timestamp": time_str,
                        "metadata": meta,
                        "created_at": item.created_at.isoformat() if item.created_at else datetime.now(timezone.utc).isoformat()
                    })
                return results
            except Exception as e:
                print(f"⚠️ DB Query failed in ActivityService.get_all: {e}")

        # Fallback
        return _IN_MEMORY_ACTIVITIES

    @staticmethod
    def create(
        action: str,
        entity_type: str = "product",
        entity_id: Optional[str] = None,
        user_id: Optional[str] = None,
        user_name: Optional[str] = None,
        target: Optional[str] = None,
        metadata: Optional[Dict[str, Any]] = None,
        db: Optional[Session] = None
    ) -> Dict[str, Any]:
        now = datetime.now(timezone.utc)
        meta_dict = dict(metadata or {})
        if user_name:
            meta_dict["user"] = user_name
        if target:
            meta_dict["target"] = target
        elif entity_id:
            meta_dict["target"] = entity_id

        if db is not None:
            try:
                # If user_id is provided, verify it exists or leave None
                verified_user_id = None
                if user_id:
                    u = db.query(User).filter(User.id == user_id).first()
                    if u:
                        verified_user_id = u.id

                new_log = ActivityLog(
                    user_id=verified_user_id,
                    action=action,
                    entity_type=entity_type,
                    entity_id=entity_id,
                    metadata_json=meta_dict,
                    created_at=now
                )
                db.add(new_log)
                db.commit()
                db.refresh(new_log)

                return {
                    "id": str(new_log.id),
                    "action": new_log.action,
                    "entity_type": new_log.entity_type,
                    "entity_id": new_log.entity_id,
                    "user": user_name or "Alex Morgan",
                    "target": meta_dict.get("target", action),
                    "time": "Just now",
                    "created_at": now.isoformat(),
                    "metadata": meta_dict
                }
            except Exception as e:
                db.rollback()
                print(f"⚠️ DB Insert failed in ActivityService.create: {e}")

        # Fallback
        entry = {
            "id": f"act_{uuid.uuid4()}",
            "action": action,
            "entity_type": entity_type,
            "entity_id": entity_id,
            "user": user_name or "Alex Morgan",
            "target": target or entity_id or action,
            "time": "Just now",
            "metadata": meta_dict,
            "created_at": now.isoformat()
        }
        _IN_MEMORY_ACTIVITIES.insert(0, entry)
        return entry
