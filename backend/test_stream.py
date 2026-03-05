import asyncio
from backend.core.chat_engine import ChatEngine
from backend.core.hybrid_retriever import HybridRetriever
from backend.core.vector_store import VectorStore
from backend.core.bm25_retriever import BM25Retriever
from backend.core.embedder import EmbeddingEngine

async def main():
    vs = VectorStore(dim=768)
    bm25 = BM25Retriever()
    vs.load()
    bm25.load()
    embedder = EmbeddingEngine()
    retriever = HybridRetriever(vs, bm25, embedder)
    
    engine = ChatEngine(retriever, provider="ollama", model_name="llama3.2")
    
    # gemini engine requires api_key from .env
    import os
    from dotenv import load_dotenv
    load_dotenv()
    engine_gemini = ChatEngine(retriever, api_key=os.environ.get("GEMINI_API_KEY", ""), provider="gemini", model_name="gemini-2.5-flash")

    print("Testing Gemini stream...")
    try:
        async for chunk in engine_gemini.stream_chat("Năm 2025 điểm chuẩn CNTT là bao nhiêu?", k=3):
            print(chunk)
    except Exception as e:
        print(f"Error: {e}")

if __name__ == "__main__":
    asyncio.run(main())
