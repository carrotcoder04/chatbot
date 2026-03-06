"""App configuration từ .env file."""
import os
from pathlib import Path
from dotenv import load_dotenv
from pydantic_settings import BaseSettings

env_path = Path(__file__).parent / ".env"
load_dotenv(dotenv_path=env_path)

class Settings(BaseSettings):
    bm25_weight: float = 0.5
    semantic_weight: float = 0.5
    GEMINI_API_KEY: str = ""
    OPENROUTER_API_KEY: str = ""
    OPENROUTER_MODEL: str = "arcee-ai/trinity-large-preview:free"
    LLM_PROVIDER: str = "gemini"  # Default fallback if .env fails
    LLM_MODEL: str = "gemini-2.0-flash"  # Model mặc định
    OLLAMA_MODEL: str = "qwen2.5:7b"
    EMBEDDING_MODEL: str = "keepitreal/vietnamese-sbert"
    CHUNK_SIZE: int = 256
    CHUNK_OVERLAP: int = 50
    TOP_K: int = 8
    DATABASE_URL: str = "sqlite:///./chatbot.db"
    HOST: str = "[IP_ADDRESS]"
    PORT: int = 8000

settings = Settings()