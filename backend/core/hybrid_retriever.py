"""
Module 6: Hybrid Retriever
Kết hợp Dense (FAISS) + Sparse (BM25) bằng Reciprocal Rank Fusion.

Reciprocal Rank Fusion (RRF):
  RRF_score(doc) = Σ 1 / (k + rank_i)
  
  Trong đó:
  - k = 60 (hằng số làm mịn, từ paper gốc Cormack et al. 2009)
  - rank_i = thứ hạng của doc trong retriever thứ i
  
Ưu điểm RRF vs score normalization:
  - Không cần normalize scores từ các nguồn khác scale
  - Robust: doc xuất hiện top ở nhiều retriever → rank cuối cao
  - Đơn giản, hiệu quả, không cần hyperparameter tuning

Paper: "Reciprocal Rank Fusion outperforms Condorcet and individual Rank-Learning Methods"
"""
from typing import Dict, List, Tuple

import numpy as np

from .bm25_retriever import BM25Retriever
from .embedder import EmbeddingEngine
from .vector_store import VectorStore


class HybridRetriever:

    def __init__(
        self,
        vector_store: VectorStore,
        bm25: BM25Retriever,
        embedder: EmbeddingEngine,
        rrf_k: int = 60,
    ):
        self.vs = vector_store
        self.bm25 = bm25
        self.embedder = embedder
        self.rrf_k = rrf_k

    # Bảng viết tắt phổ biến → mở rộng để BM25 và Dense match tốt hơn
    _ABBREVIATIONS = {
        "CNTT": "Công nghệ thông tin CNTT",
        "ATTT": "An toàn thông tin ATTT",
        "CLB": "câu lạc bộ CLB",
        "CLC": "chất lượng cao CLC",
        "ĐGNL": "đánh giá năng lực ĐGNL",
        "THPT": "thi tốt nghiệp THPT trung học phổ thông",
        "BVH": "cơ sở Hà Nội BVH",
        "BVS": "cơ sở TP.HCM BVS HCM",
        "AI": "trí tuệ nhân tạo AI",
        "IoT": "Internet vạn vật IoT",
        "AIoT": "trí tuệ nhân tạo vạn vật AIoT",
        "PR": "quan hệ công chúng PR",
    }

    def _expand_query(self, query: str) -> str:
        """Mở rộng viết tắt trong query để BM25/Dense match tốt hơn."""
        expanded = query
        for abbr, full in self._ABBREVIATIONS.items():
            # Chỉ replace nếu là từ độc lập (tránh replace bên trong từ khác)
            import re
            expanded = re.sub(rf'\b{re.escape(abbr)}\b', full, expanded)
        return expanded

    def retrieve(self, query: str, k: int = 5) -> List[Tuple[str, float]]:
        """
        Hybrid retrieval = Dense + Sparse → Weighted RRF fusion.
        Tăng trọng số cho Sparse (BM25) để bắt trúng từ khóa/mã ngành.
        """
        # 0. Expand abbreviations
        expanded_query = self._expand_query(query)

        # 1. Dense (Semantic) — dùng query gốc cho embedding tự nhiên hơn
        q_emb = self.embedder.encode(expanded_query)
        dense_results = self.vs.search(q_emb, k=k * 3)

        # 2. Sparse (Keywords) — dùng expanded query để BM25 match đúng
        sparse_results = self.bm25.search(expanded_query, k=k * 3)

        # 3. Fuse với trọng số: Sparse (1.2) > Dense (1.0)
        # BM25 vẫn ưu tiên hơn Dense nhưng không quá mạnh để tránh gây nhiễu
        fused = self._reciprocal_rank_fusion(
            [dense_results, sparse_results],
            weights=[1.0, 1.2]
        )

        return fused[:k]

    def retrieve_debug(self, query: str, k: int = 5) -> Dict:
        """
        Trả về kết quả chi tiết của từng retriever để debug và so sánh.
        Hữu ích khi viết experiment cho đồ án.
        """
        expanded = self._expand_query(query)
        q_emb = self.embedder.encode(expanded)
        dense_results = self.vs.search(q_emb, k=k)
        sparse_results = self.bm25.search(expanded, k=k)
        hybrid_results = self.retrieve(query, k=k)

        return {
            "query": query,
            "expanded_query": expanded,
            "dense": dense_results,
            "sparse": sparse_results,
            "hybrid": hybrid_results,
        }

    def _reciprocal_rank_fusion(
        self,
        result_lists: List[List[Tuple[str, float]]],
        weights: List[float] = None,
    ) -> List[Tuple[str, float]]:
        """
        Weighted RRF: score(doc) = Σ_i  w_i * (1 / (rrf_k + rank_i(doc)))
        """
        if weights is None:
            weights = [1.0] * len(result_lists)
            
        scores: Dict[str, float] = {}

        for i, results in enumerate(result_lists):
            w = weights[i]
            for rank, (chunk, _) in enumerate(results):
                scores[chunk] = scores.get(chunk, 0.0) + w * (1.0 / (self.rrf_k + rank + 1))

        sorted_items = sorted(scores.items(), key=lambda x: x[1], reverse=True)
        return sorted_items
