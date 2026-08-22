import uuid
from typing import List, Optional, Dict, Any
from datetime import datetime, timezone
from sqlalchemy.orm import Session
from sqlalchemy import func
from fastapi import HTTPException, status

from backend.models.db_models import Integration, SyncJob

# Standard channel metadata definitions
CHANNEL_DEFINITIONS = [
    {
        "id": "shopify",
        "name": "Shopify",
        "channel": "Shopify",
        "default_status": "disconnected",
        "description": "Sync products, variants, and collections to your Shopify store."
    },
    {
        "id": "amazon",
        "name": "Amazon Vendor Central",
        "channel": "Amazon",
        "default_status": "disconnected",
        "description": "Export A+ content and A9-optimized product listings."
    },
    {
        "id": "google",
        "name": "Google Merchant Center",
        "channel": "Google Shopping",
        "default_status": "disconnected",
        "description": "Sync product feeds for Google Shopping."
    },
    {
        "id": "flipkart",
        "name": "Flipkart Marketplace",
        "channel": "Flipkart",
        "default_status": "disconnected",
        "description": "Sync catalog and pricing to Flipkart seller platform."
    },
    {
        "id": "salesforce",
        "name": "Salesforce Commerce",
        "channel": "Salesforce Commerce",
        "default_status": "disconnected",
        "description": "Enterprise catalog sync for B2B and B2C storefronts."
    }
]

def _normalize_channel_name(channel: str) -> str:
    c = channel.strip().lower()
    if "shopify" in c:
        return "Shopify"
    elif "amazon" in c:
        return "Amazon"
    elif "google" in c:
        return "Google Shopping"
    elif "flipkart" in c:
        return "Flipkart"
    elif "salesforce" in c:
        return "Salesforce Commerce"
    elif "custom" in c or "webhook" in c:
        return "Custom API / Webhook"
    return channel.title()

def _slug_for_channel(channel: str) -> str:
    return channel.lower().replace(" / ", "-").replace(" ", "-")

_IN_MEMORY_INTEGRATIONS: Dict[str, Dict[str, Any]] = {
    def_item["channel"]: {
        "id": def_item["id"],
        "name": def_item["name"],
        "channel": def_item["channel"],
        "status": def_item["default_status"],
        "last_sync_at": None,
        "sync_status": "idle",
        "description": def_item["description"],
        "sync_jobs": []
    }
    for def_item in CHANNEL_DEFINITIONS
}

class IntegrationService:
    @staticmethod
    def get_all(db: Optional[Session] = None) -> List[Dict[str, Any]]:
        if db is not None:
            try:
                db_integrations = db.query(Integration).all()
                if not db_integrations:
                    # Seed standard channels into DB
                    for def_item in CHANNEL_DEFINITIONS:
                        init_int = Integration(
                            channel=def_item["channel"],
                            status=def_item["default_status"],
                            sync_status="idle",
                            last_sync_at=None,
                            config={"description": def_item["description"]}
                        )
                        db.add(init_int)
                    db.commit()
                    db_integrations = db.query(Integration).all()

                results = []
                for item in db_integrations:
                    slug = _slug_for_channel(item.channel)
                    last_sync_str = item.last_sync_at.isoformat() if item.last_sync_at else "Never"
                    results.append({
                        "id": slug,
                        "name": item.channel,
                        "channel": item.channel,
                        "status": item.status or "disconnected",
                        "last_sync_at": last_sync_str,
                        "lastSync": "Just now" if item.last_sync_at else "Never",
                        "sync_status": item.sync_status or "idle",
                        "description": (item.config or {}).get("description", f"Integration with {item.channel}")
                    })
                return results
            except Exception as e:
                print(f"⚠️ DB Query failed in IntegrationService.get_all: {e}")

        # Fallback
        return [
            {
                "id": v["id"],
                "name": v["name"],
                "channel": v["channel"],
                "status": v["status"],
                "last_sync_at": v["last_sync_at"] or "Never",
                "lastSync": "Just now" if v["last_sync_at"] else "Never",
                "sync_status": v["sync_status"],
                "description": v["description"]
            }
            for v in _IN_MEMORY_INTEGRATIONS.values()
        ]

    @staticmethod
    def connect(channel: str, db: Optional[Session] = None) -> Dict[str, Any]:
        norm_channel = _normalize_channel_name(channel)
        now = datetime.now(timezone.utc)

        if db is not None:
            try:
                integ = db.query(Integration).filter(
                    func.lower(Integration.channel) == norm_channel.lower()
                ).first()

                if not integ:
                    integ = Integration(
                        channel=norm_channel,
                        status="connected",
                        sync_status="idle",
                        created_at=now,
                        updated_at=now
                    )
                    db.add(integ)
                else:
                    integ.status = "connected"
                    integ.updated_at = now

                db.commit()
                db.refresh(integ)
                return {
                    "id": _slug_for_channel(integ.channel),
                    "channel": integ.channel,
                    "status": "connected",
                    "sync_status": integ.sync_status or "idle",
                    "updated_at": integ.updated_at.isoformat()
                }
            except Exception as e:
                db.rollback()
                print(f"⚠️ DB Connect failed in IntegrationService: {e}")

        # Fallback
        if norm_channel in _IN_MEMORY_INTEGRATIONS:
            _IN_MEMORY_INTEGRATIONS[norm_channel]["status"] = "connected"
        else:
            _IN_MEMORY_INTEGRATIONS[norm_channel] = {
                "id": _slug_for_channel(norm_channel),
                "name": norm_channel,
                "channel": norm_channel,
                "status": "connected",
                "last_sync_at": None,
                "sync_status": "idle",
                "description": f"Integration with {norm_channel}",
                "sync_jobs": []
            }
        return {
            "channel": norm_channel,
            "status": "connected",
            "sync_status": "idle"
        }

    @staticmethod
    def disconnect(channel: str, db: Optional[Session] = None) -> Dict[str, Any]:
        norm_channel = _normalize_channel_name(channel)
        now = datetime.now(timezone.utc)

        if db is not None:
            try:
                integ = db.query(Integration).filter(
                    func.lower(Integration.channel) == norm_channel.lower()
                ).first()

                if integ:
                    integ.status = "disconnected"
                    integ.updated_at = now
                    db.commit()
                    db.refresh(integ)
                    return {
                        "id": _slug_for_channel(integ.channel),
                        "channel": integ.channel,
                        "status": "disconnected",
                        "sync_status": integ.sync_status,
                        "updated_at": integ.updated_at.isoformat()
                    }
            except Exception as e:
                db.rollback()
                print(f"⚠️ DB Disconnect failed in IntegrationService: {e}")

        # Fallback
        if norm_channel in _IN_MEMORY_INTEGRATIONS:
            _IN_MEMORY_INTEGRATIONS[norm_channel]["status"] = "disconnected"
        return {
            "channel": norm_channel,
            "status": "disconnected"
        }

    @staticmethod
    def sync(
        channel: str,
        fail: bool = False,
        db: Optional[Session] = None
    ) -> Dict[str, Any]:
        norm_channel = _normalize_channel_name(channel)
        now = datetime.now(timezone.utc)
        job_id = f"job_{uuid.uuid4()}"

        if db is not None:
            try:
                integ = db.query(Integration).filter(
                    func.lower(Integration.channel) == norm_channel.lower()
                ).first()

                if not integ:
                    integ = Integration(
                        channel=norm_channel,
                        status="connected",
                        created_at=now,
                        updated_at=now
                    )
                    db.add(integ)
                    db.flush()

                # Create SyncJob row
                sync_job = SyncJob(
                    id=job_id,
                    integration_id=integ.id,
                    started_at=now
                )

                if fail:
                    sync_job.status = "failed"
                    sync_job.error_message = "Gateway synchronization timeout"
                    integ.sync_status = "failed"
                else:
                    sync_job.status = "completed"
                    sync_job.completed_at = now
                    integ.sync_status = "completed"
                    integ.last_sync_at = now

                integ.updated_at = now
                db.add(sync_job)
                db.commit()
                db.refresh(integ)

                return {
                    "job_id": job_id,
                    "channel": integ.channel,
                    "status": sync_job.status,
                    "error_message": sync_job.error_message,
                    "last_sync_at": integ.last_sync_at.isoformat() if integ.last_sync_at else None,
                    "sync_status": integ.sync_status
                }
            except Exception as e:
                db.rollback()
                print(f"⚠️ DB Sync failed in IntegrationService: {e}")

        # Fallback
        if norm_channel in _IN_MEMORY_INTEGRATIONS:
            if not fail:
                _IN_MEMORY_INTEGRATIONS[norm_channel]["last_sync_at"] = now.isoformat()
                _IN_MEMORY_INTEGRATIONS[norm_channel]["sync_status"] = "completed"
            else:
                _IN_MEMORY_INTEGRATIONS[norm_channel]["sync_status"] = "failed"
            
            _IN_MEMORY_INTEGRATIONS[norm_channel]["sync_jobs"].append({
                "job_id": job_id,
                "status": "failed" if fail else "completed",
                "timestamp": now.isoformat()
            })

        return {
            "job_id": job_id,
            "channel": norm_channel,
            "status": "failed" if fail else "completed",
            "last_sync_at": now.isoformat() if not fail else None,
            "sync_status": "failed" if fail else "completed"
        }
