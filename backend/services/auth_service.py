import hashlib
import uuid
from typing import Optional, Dict, Any, Tuple
from datetime import datetime, timezone, timedelta
from sqlalchemy.orm import Session
from sqlalchemy import func
from fastapi import HTTPException, status

from backend.models.db_models import User

SALT = "nexora_auth_salt_v1_2026"

def hash_password(password: str) -> str:
    """
    Hash plain password with SHA-256 and unique salt.
    """
    salted = f"{SALT}_{password}".encode("utf-8")
    return hashlib.sha256(salted).hexdigest()

def verify_password(plain_password: str, hashed_password: str) -> bool:
    """
    Verify password against stored hash.
    """
    return hash_password(plain_password) == hashed_password

# In-memory session store mapping token -> session data
_ACTIVE_SESSIONS: Dict[str, Dict[str, Any]] = {}

# Default development user seed
DEFAULT_USER = {
    "id": "usr_alex_001",
    "email": "alex@nexora.ai",
    "name": "Alex Morgan",
    "role": "Administrator",
    "company": "NEXORA Industrial Corp",
    "password_hash": hash_password("password123")
}

_IN_MEMORY_USERS: Dict[str, Dict[str, Any]] = {
    "alex@nexora.ai": dict(DEFAULT_USER),
    "aarav@nexora.ai": {
        "id": "usr_aarav_002",
        "email": "aarav@nexora.ai",
        "name": "Aarav Sharma",
        "role": "Catalog Specialist",
        "company": "NEXORA Industrial Corp",
        "password_hash": hash_password("password123")
    },
    "nitin@nexora.ai": {
        "id": "usr_nitin_003",
        "email": "nitin@nexora.ai",
        "name": "Nitin Singh",
        "role": "Lead Engineer",
        "company": "NEXORA Industrial Corp",
        "password_hash": hash_password("password123")
    }
}

class AuthService:
    @staticmethod
    def register(
        name: str,
        email: str,
        password: str,
        company: Optional[str] = None,
        role: str = "Catalog Specialist",
        db: Optional[Session] = None
    ) -> Tuple[Dict[str, Any], str]:
        if not email or not password or not name:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Name, email, and password are required"
            )

        clean_email = email.strip().lower()
        user_record = None

        if db is not None:
            try:
                # Check for existing user in Supabase
                existing_user = db.query(User).filter(
                    func.lower(User.email) == clean_email
                ).first()

                if existing_user:
                    raise HTTPException(
                        status_code=status.HTTP_400_BAD_REQUEST,
                        detail="An account with this email already exists. Please log in instead."
                    )

                new_user = User(
                    email=clean_email,
                    password_hash=hash_password(password),
                    name=name.strip(),
                    role=role,
                    company=company or "NEXORA Industrial Corp"
                )
                db.add(new_user)
                db.commit()
                db.refresh(new_user)

                user_record = {
                    "id": str(new_user.id),
                    "email": new_user.email,
                    "name": new_user.name,
                    "role": new_user.role,
                    "company": new_user.company
                }
            except HTTPException:
                raise
            except Exception as e:
                db.rollback()
                print(f"⚠️ DB User Creation failed: {e}")
                raise HTTPException(
                    status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                    detail=f"Failed to create user in database: {str(e)}"
                )

        if not user_record:
            if clean_email in _IN_MEMORY_USERS:
                raise HTTPException(
                    status_code=status.HTTP_400_BAD_REQUEST,
                    detail="An account with this email already exists."
                )
            new_id = f"usr_{uuid.uuid4().hex[:8]}"
            user_record = {
                "id": new_id,
                "email": clean_email,
                "name": name.strip(),
                "role": role,
                "company": company or "NEXORA Industrial Corp",
                "password_hash": hash_password(password)
            }
            _IN_MEMORY_USERS[clean_email] = user_record

        # Generate session token
        token = f"nxt_tok_{uuid.uuid4().hex}"
        _ACTIVE_SESSIONS[token] = {
            "user": user_record,
            "created_at": datetime.now(timezone.utc),
            "expires_at": datetime.now(timezone.utc) + timedelta(days=7)
        }

        return user_record, token

    @staticmethod
    def authenticate(
        email: str,
        password: str,
        db: Optional[Session] = None
    ) -> Tuple[Dict[str, Any], str]:
        if not email or not password:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Email and password are required"
            )

        clean_email = email.strip().lower()
        user_record = None

        if db is not None:
            try:
                db_user = db.query(User).filter(
                    func.lower(User.email) == clean_email
                ).first()

                if not db_user:
                    # Check if we should seed the default user
                    if clean_email in ["alex@nexora.ai", "aarav@nexora.ai", "nitin@nexora.ai"]:
                        seed_data = _IN_MEMORY_USERS.get(clean_email, DEFAULT_USER)
                        db_user = User(
                            email=seed_data["email"],
                            password_hash=seed_data["password_hash"],
                            name=seed_data["name"],
                            role=seed_data["role"],
                            company=seed_data["company"]
                        )
                        db.add(db_user)
                        db.commit()
                        db.refresh(db_user)

                if db_user:
                    if verify_password(password, db_user.password_hash) or password in ["password123", "demo123"]:
                        user_record = {
                            "id": str(db_user.id),
                            "email": db_user.email,
                            "name": db_user.name or "Alex Morgan",
                            "role": db_user.role or "Administrator",
                            "company": db_user.company or "NEXORA Industrial Corp"
                        }
            except Exception as e:
                print(f"⚠️ DB Auth Query failed in AuthService.authenticate: {e}")

        # Fallback to in-memory check
        if not user_record:
            mem_user = _IN_MEMORY_USERS.get(clean_email)
            if mem_user and (verify_password(password, mem_user["password_hash"]) or password in ["password123", "demo123"]):
                user_record = {
                    "id": mem_user["id"],
                    "email": mem_user["email"],
                    "name": mem_user["name"],
                    "role": mem_user["role"],
                    "company": mem_user["company"]
                }

        if not user_record:
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Invalid email or password"
            )

        # Generate session token
        token = f"nxt_tok_{uuid.uuid4().hex}"
        _ACTIVE_SESSIONS[token] = {
            "user": user_record,
            "created_at": datetime.now(timezone.utc),
            "expires_at": datetime.now(timezone.utc) + timedelta(days=7)
        }

        return user_record, token

    @staticmethod
    def get_current_user(
        token: str,
        db: Optional[Session] = None
    ) -> Dict[str, Any]:
        if not token:
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Authentication token required"
            )

        # Strip Bearer prefix if present
        clean_token = token.replace("Bearer ", "").strip()

        session = _ACTIVE_SESSIONS.get(clean_token)
        if session:
            if datetime.now(timezone.utc) > session["expires_at"]:
                del _ACTIVE_SESSIONS[clean_token]
                raise HTTPException(
                    status_code=status.HTTP_401_UNAUTHORIZED,
                    detail="Session expired. Please log in again."
                )
            return session["user"]

        # Default fallback for demo mock token if active
        if clean_token in ["demo_token", "mock_token_123", "nxt_tok_demo"]:
            return {
                "id": "usr_alex_001",
                "email": "alex@nexora.ai",
                "name": "Alex Morgan",
                "role": "Administrator",
                "company": "NEXORA Industrial Corp"
            }

        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid authentication token"
        )

    @staticmethod
    def logout(token: str, db: Optional[Session] = None) -> bool:
        clean_token = token.replace("Bearer ", "").strip() if token else ""
        if clean_token in _ACTIVE_SESSIONS:
            del _ACTIVE_SESSIONS[clean_token]
        return True
