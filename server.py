from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
from typing import List, Optional

from rag.rag import ask

app = FastAPI(
    title="Hospital RAG API",
    version="1.0"
)

from fastapi.middleware.cors import CORSMiddleware

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],  # Your frontend URL
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# ---------- MODELS ----------
class ChatRequest(BaseModel):
    message: str
    top_k: int = 5

class ContextItem(BaseModel):
    content: str
    score: Optional[float] = None

class ChatResponse(BaseModel):
    answer: str
    contexts: List[ContextItem]

# ---------- ROUTES ----------
@app.post("/chat", response_model=ChatResponse)
def chat(request: ChatRequest):
    try:
        result = ask(
            query=request.message,
            top_k=request.top_k
        )

        # Extract context items from result
        contexts = []
        if hasattr(result, 'retriever_result') and result.retriever_result:
            contexts = [
                ContextItem(
                    content=item.content,
                    score=getattr(item, 'score', None)
                )
                for item in result.retriever_result.items
            ]

        return ChatResponse(
            answer=result.answer if hasattr(result, 'answer') else str(result),
            contexts=contexts
        )

    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=f"Error processing request: {str(e)}"
        )


@app.get("/health")
def health():
    return {"status": "ok"}


if __name__ == "__main__":
    import uvicorn 
    uvicorn.run(
        "server:app",
        host="0.0.0.0",
        port=8000,
        reload=True
    )