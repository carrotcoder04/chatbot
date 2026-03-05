"""App configuration từ .env file."""
from pydantic_settings import BaseSettings


class Settings(BaseSettings):
    bm25_weight: float = 0.5       # thêm dòng này
    semantic_weight: float = 0.5   # thêm dòng này
    GEMINI_API_KEY: str = ""
    OPENROUTER_API_KEY: str = ""
    OPENROUTER_MODEL: str = "arcee-ai/trinity-large-preview:free"
    LLM_PROVIDER: str = "openrouter"  # "gemini", "ollama", "openrouter"
    OLLAMA_MODEL: str = "qwen2.5:7b"
    EMBEDDING_MODEL: str = "keepitreal/vietnamese-sbert"
    CHUNK_SIZE: int = 256
    CHUNK_OVERLAP: int = 50
    TOP_K: int = 5
    DATABASE_URL: str = "sqlite:///./chatbot.db"
    HOST: str = "0.0.0.0"
    PORT: int = 8000

    class Config:
        import os
        from pathlib import Path
        env_file = Path(__file__).parent / ".env"


settings = Settings()
