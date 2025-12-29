from fastapi import FastAPI, HTTPException, UploadFile, File, Form
from fastapi.staticfiles import StaticFiles
from pydantic import BaseModel
from typing import List, Optional
import shutil
import os
from pymongo import MongoClient

from rag.rag import ask
from ingestion.injector import ingest_document

app = FastAPI(
    title="Hospital RAG API",
    version="1.0"
)

# ---------- MONGO DB ----------
MONGO_URI = "mongodb://localhost:27017"
mongo_client = MongoClient(MONGO_URI)
db = mongo_client["lawfirm"]
chat_collection = db["chat_history"]

from fastapi.middleware.cors import CORSMiddleware

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Allow all for dev
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# ---------- MODELS ----------
class ChatRequest(BaseModel):
    message: str
    caseId: str
    top_k: int = 5

class ContextItem(BaseModel):
    content: str
    source: Optional[str] = None
    metadata: Optional[dict] = None
    score: Optional[float] = None

class ChatResponse(BaseModel):
    answer: str
    contexts: List[ContextItem]

class Message(BaseModel):
    role: str
    content: str

class ChatHistoryResponse(BaseModel):
    history: List[Message]

# ---------- ROUTES ----------
import re

@app.get("/chat/history/{caseId}", response_model=ChatHistoryResponse)
def get_chat_history(caseId: str):
    try:
        case_doc = chat_collection.find_one({"case_id": caseId})
        if not case_doc or "messages" not in case_doc:
            return ChatHistoryResponse(history=[])
        
        # Convert to Message objects
        messages = [
            Message(role=m["role"], content=m["content"]) 
            for m in case_doc["messages"]
        ]
        return ChatHistoryResponse(history=messages)

    except Exception as e:
        print(f"Error fetching history: {e}")
        raise HTTPException(status_code=500, detail=str(e))


@app.post("/chat", response_model=ChatResponse)
def chat(request: ChatRequest):
    try:
        # 1. Fetch history from MongoDB
        case_doc = chat_collection.find_one({"case_id": request.caseId})
        history = case_doc["messages"] if case_doc else []
        
        # Limit history to last 10 messages to fit token limits
        recent_history = history[-10:]

        # 2. Get Answer from RAG
        result = ask(
            query=request.message,
            case_id=request.caseId,
            history=recent_history,
            top_k=request.top_k
        )

        # 3. Save to History
        new_user_msg = {"role": "user", "content": request.message}
        new_ai_msg = {"role": "assistant", "content": result.answer}
        
        # Update MongoDB (upsert)
        chat_collection.update_one(
            {"case_id": request.caseId},
            {"$push": {"messages": {"$each": [new_user_msg, new_ai_msg]}}},
            upsert=True
        )

        # Extract context items from result
        contexts = []
        if hasattr(result, 'retriever_result') and result.retriever_result:
            for item in result.retriever_result.items:
                content_str = item.content
                source = None
                text_content = content_str # Default to raw string

                # Try to extract source using regex
                source_match = re.search(r"['\"]source['\"]\s*:\s*['\"]([^'\"]+)['\"]", content_str)
                if source_match:
                    source = source_match.group(1)
                
                # Try to clean text
                text_match = re.search(r"['\"]text['\"]\s*:\s*['\"]((?:[^'\\]|\\.)*)['\"]", content_str)
                if text_match:
                     text_content = text_match.group(1).replace("\\n", "\n").replace("\\'", "'")

                contexts.append(
                    ContextItem(
                        content=text_content,
                        source=source,
                        metadata={"original_content": content_str},
                        score=getattr(item, 'score', None)
                    )
                )

        return ChatResponse(
            answer=result.answer,
            contexts=contexts
        )

    except Exception as e:
        print(f"Error: {e}")
        raise HTTPException(
            status_code=500,
            detail=f"Error processing request: {str(e)}"
        )


@app.post("/ingest")
async def ingest_file(file: UploadFile = File(...), caseId: str = Form(...)):
    try:
        # Save file locally
        file_location = f"documents/{file.filename}"
        with open(file_location, "wb+") as file_object:
            shutil.copyfileobj(file.file, file_object)
            
        # Read content
        with open(file_location, "r", encoding="utf-8") as f:
            text = f.read()

        # Ingest
        ingest_document(text, source_name=file.filename, case_id=caseId)
        
        return {"status": "success", "filename": file.filename, "caseId": caseId}

    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@app.get("/health")
def health():
    return {"status": "ok"}


# Mount the documents directory to serve static files
app.mount("/files", StaticFiles(directory="documents"), name="files")

if __name__ == "__main__":
    import uvicorn 
    uvicorn.run(
        "server:app",
        host="0.0.0.0",
        port=8000,
        reload=True
    )