import os
from typing import List
from dotenv import load_dotenv

# Load local .env if available
load_dotenv()

class Settings:
    PROJECT_NAME: str = "NEXORA AI Product Intelligence API"
    VERSION: str = "1.0.0"
    API_PREFIX: str = "/api"
    
    # AI Credentials (kept server-side only)
    OPENAI_API_KEY: str = os.getenv("OPENAI_API_KEY", "")
    TAVILY_API_KEY: str = os.getenv("TAVILY_API_KEY", "")
    LLAMA_CLOUD_API_KEY: str = os.getenv("LLAMA_CLOUD_API_KEY", "")
    
    # Database Configuration (for upcoming DB migration phase)
    DATABASE_URL: str = os.getenv("DATABASE_URL", "")
    
    # Auth & Security
    JWT_SECRET: str = os.getenv("JWT_SECRET", "nexora-super-secret-dev-key-change-in-production")
    JWT_ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 60 * 24 * 7 # 7 days
    
    # CORS Configuration
    @property
    def CORS_ORIGINS(self) -> List[str]:
        raw_origins = os.getenv("CORS_ORIGINS", "http://localhost:5173,http://localhost:3000,http://127.0.0.1:5173")
        if raw_origins == "*":
            return ["*"]
        return [origin.strip() for origin in raw_origins.split(",") if origin.strip()]

settings = Settings()
