"""
Debug script — test retriever trực tiếp, không cần server.
Chạy: python3 -m backend.debug_retriever
"""
import sys
from pathlib import Path

ROOT = Path(__file__).parent.parent
sys.path.insert(0, str(ROOT))

from backend.core.bm25_retriever import BM25Retriever
from backend.core.embedder import EmbeddingEngine
from backend.core.hybrid_retriever import HybridRetriever
from backend.core.vector_store import VectorStore

def load_retriever():
    embedder = EmbeddingEngine()
    vs = VectorStore(dim=768)
    bm25 = BM25Retriever()
    vs.load()
    bm25.load()
    return HybridRetriever(vs, bm25, embedder)

def test(retriever, query: str, k: int = 5):
    print(f"\n{'='*60}")
    print(f"QUERY: {query}")
    print(f"{'='*60}")

    debug = retriever.retrieve_debug(query, k=k)

    print(f"\n🔵 DENSE top-{k}:")
    for i, (chunk, score) in enumerate(debug["dense"][:k]):
        preview = chunk[:80].replace('\n', ' ')
        print(f"  [{i+1}] score={score:.4f} | {preview}...")

    print(f"\n🟡 SPARSE/BM25 top-{k}:")
    for i, (chunk, score) in enumerate(debug["sparse"][:k]):
        preview = chunk[:80].replace('\n', ' ')
        print(f"  [{i+1}] score={score:.4f} | {preview}...")

    print(f"\n🟢 HYBRID top-{k}:")
    for i, (chunk, score) in enumerate(debug["hybrid"][:k]):
        preview = chunk[:120].replace('\n', ' ')
        print(f"  [{i+1}] rrf={score:.5f} | {preview}...")

if __name__ == "__main__":
    print("Loading indexes...")
    retriever = load_retriever()
    print("Done!\n")

    queries = [
        "câu lạc bộ PTIT có những gì",
        "chỉ tiêu ngành Công nghệ thông tin 2025",
        "chỉ tiêu CNTT Hà Nội",
        "điểm chuẩn ngành An toàn thông tin",
        "tỷ lệ sinh viên có việc làm sau khi ra trường",
        "học phí PTIT",
    ]

    for q in queries:
        test(retriever, q, k=4)
