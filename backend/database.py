import os
from sqlalchemy import create_engine, text
from sqlalchemy.orm import declarative_base, sessionmaker
from backend.config import settings

# Base class for all SQLAlchemy ORM models
Base = declarative_base()

# Prepare engine and sessionmaker
DATABASE_URL = settings.DATABASE_URL

# Normalize postgres:// -> postgresql:// for SQLAlchemy 2.0+
if DATABASE_URL and DATABASE_URL.startswith("postgres://"):
    DATABASE_URL = DATABASE_URL.replace("postgres://", "postgresql+psycopg2://", 1)
elif DATABASE_URL and DATABASE_URL.startswith("postgresql://") and "+psycopg2" not in DATABASE_URL:
    DATABASE_URL = DATABASE_URL.replace("postgresql://", "postgresql+psycopg2://", 1)

engine = None
SessionLocal = None

if DATABASE_URL:
    try:
        engine = create_engine(
            DATABASE_URL,
            pool_pre_ping=True,
            pool_size=5,
            max_overflow=10,
            connect_args={"connect_timeout": 5} if "postgresql" in DATABASE_URL else {}
        )
        SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
    except Exception as e:
        print(f"⚠️ Could not initialize database engine: {e}")
        engine = None
        SessionLocal = None

def get_db():
    """
    FastAPI dependency that provides a database session.
    """
    if SessionLocal is None:
        yield None
        return

    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

def check_database_connection() -> str:
    """
    Safely verifies database connectivity without leaking credentials or stack traces.
    Returns: 'connected' | 'disconnected' | 'unconfigured'
    """
    if not DATABASE_URL:
        return "unconfigured"
    if engine is None:
        return "disconnected"
    
    try:
        with engine.connect() as connection:
            connection.execute(text("SELECT 1"))
        return "connected"
    except Exception:
        return "disconnected"
