"""
Module 7: Chat Engine (PTIT Edition)
Kết nối: Retrieval → Prompt → Gemini → Response

PTIT System Prompt được tối ưu để:
- Không hallucinate số liệu điểm chuẩn, học phí
- Phân biệt 2 cơ sở HN và HCM
- Hướng dẫn thủ tục nhập học rõ ràng
"""
import json
from typing import AsyncIterator, List, Optional

from google import genai
from google.genai import types

from .hybrid_retriever import HybridRetriever


class PromptBuilder:
    """Xây dựng prompt từ query + RAG context + conversation history."""

    SYSTEM = """Bạn là chuyên viên tư vấn tuyển sinh thông minh của Học viện Công nghệ Bưu chính Viễn thông (PTIT).

QUY TẮC TRẢ LỜI:
1. Sử dụng THÔNG TIN trong phần ngữ cảnh để trả lời. Được phép tổng hợp, sắp xếp lại và trình bày rõ ràng hơn — không cần sao chép nguyên văn.
2. KHÔNG bịa đặt số liệu không có trong ngữ cảnh. Nếu thiếu dữ liệu cụ thể, hãy nói rõ và hướng dẫn liên hệ: tuyensinh@ptit.edu.vn hoặc hotline 024.3756.2186.
3. PHÂN BIỆT rõ ràng Cơ sở Hà Nội (BVH) và Cơ sở TP.HCM (BVS) khi trình bày.
4. Khi câu hỏi có nhiều số liệu (danh sách ngành, chỉ tiêu...), LUÔN trình bày dưới dạng bảng hoặc danh sách có thứ tự — KHÔNG viết thành đoạn văn dài.
5. Nếu ngữ cảnh có nhiều nguồn trùng thông tin, hãy gộp lại và trình bày một lần duy nhất (tránh lặp).
6. Câu trả lời phải ngắn gọn, súc tích, đúng trọng tâm. Không thêm lời dẫn dài dòng.
7. Kết thúc bằng gợi ý hành động cụ thể nếu phù hợp (ví dụ: "Bạn có muốn biết thêm về điểm chuẩn ngành này không?").

ĐỊNH DẠNG ƯU TIÊN:
- Không dùng dạng bảng
- Dùng danh sách gạch đầu dòng khi liệt kê
- In đậm các số liệu quan trọng (chỉ tiêu, điểm chuẩn, học phí)"""

    def build(
        self,
        query: str,
        context_chunks: List[str],
        history: Optional[List[dict]] = None,
    ) -> str:
        if context_chunks:
            context = "\n\n---\n\n".join(
                f"[Nguồn {i+1}]\n{chunk}"
                for i, chunk in enumerate(context_chunks)
            )
        else:
            context = "Không tìm thấy thông tin liên quan trong cơ sở dữ liệu."

        history_str = ""
        if history:
            turns = history[-6:]  # sliding window 3 turns (6 messages)
            for turn in turns:
                role = "Người dùng" if turn["role"] == "user" else "Trợ lý"
                history_str += f"\n{role}: {turn['content']}"

        prompt = f"""{self.SYSTEM}

=== THÔNG TIN TUYỂN SINH (NGỮ CẢNH) ===
{context}
"""
        if history_str:
            prompt += f"\n=== LỊCH SỬ HỘI THOẠI ==={history_str}\n"

        prompt += f"\n=== CÂU HỎI ===\nNgười dùng: {query}\nTrợ lý:"
        return prompt


def _make_gemini_client(api_key: str) -> genai.Client:
    """Tạo Gemini client với api_key."""
    return genai.Client(api_key=api_key)


def _make_gemini_config() -> types.GenerateContentConfig:
    """Cấu hình generation cho Gemini."""
    return types.GenerateContentConfig(
        temperature=0.2,
        top_p=0.8,
        max_output_tokens=4096 * 3,
    )


class ChatEngine:
    def __init__(
        self,
        retriever: HybridRetriever,
        api_key: str = "",
        provider: str = "gemini",
        model_name: str = "gemini-3.1-flash-lite-preview",
    ):
        self.retriever = retriever
        self.prompt_builder = PromptBuilder()
        self.provider = provider.lower()
        self.model_name = model_name
        self.api_key = api_key

        if self.provider == "gemini":
            if not api_key:
                print("  [WARN] GEMINI_API_KEY missing. ChatEngine will fail.")
            # ✅ Dùng Client thay vì configure() + GenerativeModel
            self.gemini_client = _make_gemini_client(api_key)
            self.gemini_config = _make_gemini_config()
            print(f"  [INFO] ChatEngine using Gemini ({model_name})")

        elif self.provider == "openrouter":
            import httpx
            self.openrouter_client = httpx.Client(
                base_url="https://openrouter.ai/api/v1", timeout=60.0
            )
            self.openrouter_api_key = api_key
            print(f"  [INFO] ChatEngine using OpenRouter ({model_name})")

        elif self.provider == "ollama":
            import httpx
            self.ollama_client = httpx.Client(
                base_url="http://localhost:11434", timeout=60.0
            )
            print(f"  [INFO] ChatEngine using Ollama Local ({model_name})")

    def chat(
        self,
        query: str,
        history: Optional[List[dict]] = None,
        k: int = 5,
    ) -> dict:
        # 1. Retrieve
        results = self.retriever.retrieve(query, k=k)
        context_chunks = [chunk for chunk, _ in results]
        scores = [round(float(score), 4) for _, score in results]

        # 2. Build prompt
        prompt = self.prompt_builder.build(query, context_chunks, history)

        # 3. Generate
        if self.provider == "gemini":
            # ✅ Dùng client.models.generate_content
            response = self.gemini_client.models.generate_content(
                model=self.model_name,
                contents=prompt,
                config=self.gemini_config,
            )
            answer = response.text.strip()

        elif self.provider == "openrouter":
            resp = self.openrouter_client.post(
                "/chat/completions",
                headers={
                    "Authorization": f"Bearer {self.openrouter_api_key}",
                    "HTTP-Referer": "http://localhost:3000",
                    "X-Title": "PTIT Chatbot",
                },
                json={
                    "model": self.model_name,
                    "messages": [{"role": "user", "content": prompt}],
                    "temperature": 0.2,
                },
            )
            data = resp.json()
            if "choices" in data and len(data["choices"]) > 0:
                answer = data["choices"][0]["message"]["content"].strip()
            else:
                answer = f"Lỗi từ OpenRouter API: {data}"

        else:
            # Ollama
            resp = self.ollama_client.post(
                "/api/generate",
                json={
                    "model": self.model_name,
                    "prompt": prompt,
                    "stream": False,
                    "options": {"temperature": 0.2},
                },
            )
            answer = resp.json().get("response", "").strip()

        return {
            "answer": answer,
            "sources": context_chunks[:3],
            "num_sources": len(context_chunks),
            "retrieval_scores": scores,
        }

    async def stream_chat(
        self,
        query: str,
        history: Optional[List[dict]] = None,
        k: int = 5,
        **kwargs,
    ) -> AsyncIterator[str]:
        # 0. Override config nếu có
        provider = kwargs.get("provider", self.provider).lower()
        api_key = kwargs.get("api_key", self.api_key)
        model_name = kwargs.get("model_name", self.model_name)

        # 1. Retrieve + build prompt
        results = self.retriever.retrieve(query, k=k)
        context_chunks = [chunk for chunk, _ in results]
        prompt = self.prompt_builder.build(query, context_chunks, history)

        # 2. Trả sources đầu tiên
        yield json.dumps({"sources": context_chunks[:3]}, ensure_ascii=False)

        if provider == "gemini":
            # ✅ Dùng client mới, hỗ trợ stream
            client = _make_gemini_client(api_key) if api_key else self.gemini_client
            config = _make_gemini_config()

            for chunk in client.models.generate_content_stream(
                model=model_name,
                contents=prompt,
                config=config,
            ):
                if chunk.text:
                    yield json.dumps({"token": chunk.text}, ensure_ascii=False)

        elif provider == "openrouter":
            import httpx
            used_api_key = api_key or getattr(self, "openrouter_api_key", None)
            async with httpx.AsyncClient(
                base_url="https://openrouter.ai/api/v1", timeout=60.0
            ) as client:
                async with client.stream(
                    "POST",
                    "/chat/completions",
                    headers={
                        "Authorization": f"Bearer {used_api_key}",
                        "HTTP-Referer": "http://localhost:3000",
                        "X-Title": "PTIT Chatbot",
                    },
                    json={
                        "model": model_name,
                        "messages": [{"role": "user", "content": prompt}],
                        "temperature": 0.2,
                        "stream": True,
                    },
                ) as resp:
                    async for line in resp.aiter_lines():
                        if line.startswith("data: "):
                            data_str = line[6:]
                            if data_str.strip() == "[DONE]":
                                break
                            try:
                                data = json.loads(data_str)
                                if "choices" in data and len(data["choices"]) > 0:
                                    delta = data["choices"][0].get("delta", {})
                                    if "content" in delta:
                                        yield json.dumps(
                                            {"token": delta["content"]},
                                            ensure_ascii=False,
                                        )
                            except Exception:
                                pass

        else:
            # Ollama
            import httpx
            async with httpx.AsyncClient(
                base_url="http://localhost:11434", timeout=60.0
            ) as client:
                async with client.stream(
                    "POST",
                    "/api/generate",
                    json={
                        "model": model_name,
                        "prompt": prompt,
                        "stream": True,
                        "options": {"temperature": 0.2},
                    },
                ) as resp:
                    async for line in resp.aiter_lines():
                        if line:
                            data = json.loads(line)
                            token = data.get("response", "")
                            if token:
                                yield json.dumps(
                                    {"token": token}, ensure_ascii=False
                                )