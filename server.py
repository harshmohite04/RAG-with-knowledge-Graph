import uvicorn
import os
import requests
import re
from fastapi import FastAPI, HTTPException, Header, Body
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, Field
from typing import Optional, List, Dict
from pymongo import MongoClient
from datetime import datetime
from uuid import uuid4
from urllib.parse import unquote

# Import your ask() function from your RAG script
from rag.rag import ask   # <-- change to your actual filename (e.g., rag_app, graph_rag, etc.)

# MongoDB connection
MONGO_URI = os.getenv('MONGO_URI', 'mongodb://localhost:27017/rag_company')
client = MongoClient(MONGO_URI)

# Use a consistent database name
if 'rag-auth' in MONGO_URI:
    db = client['rag-auth']
else:
    db = client['rag_company']

# Collections
session_collection = db["sessionManagement"]
chat_sessions_collection = db["chatsessions"]

# -------------------------
# FASTAPI APP
# -------------------------
app = FastAPI(title="Hospital RAG Chat API", version="1.0")

# CORS origins
origins = [
    "http://localhost:5173",
    "http://127.0.0.1:5173",
    "http://localhost:4173",
    "http://127.0.0.1:4173",
    "http://localhost:8000",
    "http://127.0.0.1:8000",
    "http://localhost:4000",
    "http://127.0.0.1:4000",
]

# Allow frontend requests
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],          # switch to origins for production
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Utility functions
def is_valid_email(email: str) -> bool:
    if not isinstance(email, str):
        return False
    email = email.strip()
    pattern = r"^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$"
    return re.match(pattern, email) is not None

# Request Models
class ChatRequest(BaseModel):
    query: str = Field(description="User query for the chat")
    session_id: str = Field(description="Session ID")
    top_k: int = Field(default=5, description="Number of top results to retrieve")

class SessionCreate(BaseModel):
    account_id: str = Field(description="Email address of the user (used as account_id)")
    session_name: str = Field(description="A friendly name for the session")
    time_stamp: Optional[datetime] = Field(default_factory=datetime.utcnow, description="Client-side timestamp")
    last_activity: Optional[datetime] = Field(default_factory=datetime.utcnow, description="Client-side last activity timestamp")

class SessionCreateRequest(BaseModel):
    title: Optional[str] = Field(default="New Chat", description="Session title")

class SessionUpdateRequest(BaseModel):
    title: str = Field(description="New session title")

class MessageRequest(BaseModel):
    sender: str = Field(description="Message sender: user or bot")
    text: str = Field(description="Message content")

class Message(BaseModel):
    id: str
    sender: str  # 'user' or 'bot'
    text: str
    timestamp: datetime

class ChatSession(BaseModel):
    sessionId: str
    userId: str
    title: str
    messages: list
    createdAt: datetime
    updatedAt: datetime
    isActive: bool = True

# Helper function to verify JWT token with Node.js backend
async def verify_token(authorization: str):
    if not authorization or not authorization.startswith('Bearer '):
        raise HTTPException(status_code=401, detail="Missing or invalid authorization header")
    
    token = authorization.split(' ')[1]
    
    try:
        # Verify token with Node.js backend
        response = requests.get(
            'http://localhost:4000/api/auth/verify',
            headers={'Authorization': f'Bearer {token}'},
            timeout=5
        )
        
        if response.status_code != 200:
            raise HTTPException(status_code=401, detail="Invalid token")
        
        return response.json().get('user')
    except requests.RequestException:
        raise HTTPException(status_code=500, detail="Authentication service unavailable")

# Helper function to add message to MongoDB via Node.js backend
async def add_message_to_session(session_id: str, sender: str, text: str, token: str):
    try:
        response = requests.post(
            f'http://localhost:4000/api/chat/sessions/{session_id}/messages',
            headers={'Authorization': f'Bearer {token}'},
            json={'sender': sender, 'text': text},
            timeout=5
        )
        return response.status_code == 200
    except requests.RequestException:
        return False


# -------------------------
# ROOT AND HEALTH ENDPOINTS
# -------------------------

@app.get("/")
def read_root():
    return {"message": "Hospital RAG Chat API is running 🚀"}

@app.get("/api/health")
def health_check():
    return {
        "status": "ok",
        "message": "Python RAG Server is running",
        "port": 8000
    }

# -------------------------
# SESSION MANAGEMENT ENDPOINTS (Reference-based)
# -------------------------

@app.post("/session/create")
def create_session_account(data: SessionCreate):
    """Create a new session for an account (email-based)"""
    try:
        print(f"[session/create] account_id={data.account_id} name={data.session_name} time={data.time_stamp}")
    except Exception:
        pass
    
    # Validate and normalize email
    if not is_valid_email(data.account_id):
        raise HTTPException(status_code=400, detail="account_id must be a valid email address")
    
    normalized_email = data.account_id.strip().lower()
    session_id = str(uuid4())
    new_session = {
        "session_id": session_id,
        "session_name": data.session_name,
        "time_stamp": data.time_stamp,
        "last_activity": data.last_activity,
        "status": "active"
    }

    existing_account = session_collection.find_one({"account_id": normalized_email})
    if existing_account:
        session_collection.update_one(
            {"account_id": normalized_email},
            {"$push": {"sessions": new_session}}
        )
    else:
        session_collection.insert_one({
            "account_id": normalized_email,
            "sessions": [new_session]
        })

    return {"message": "Session created", "session_id": session_id}

@app.options("/session/{account_id}")
def options_session(account_id: str):
    return {}

@app.get("/session/{account_id}")
def get_sessions(account_id: str):
    """Get all sessions for an account"""
    account_id = unquote(account_id)
    
    if not is_valid_email(account_id):
        raise HTTPException(status_code=400, detail="account_id must be a valid email address")
    
    normalized_email = account_id.strip().lower()
    account = session_collection.find_one({"account_id": normalized_email}, {"_id": 0})
    if not account:
        raise HTTPException(status_code=404, detail="Account not found")
    return account

@app.put("/session/update/{account_id}/{session_id}")
def update_session_account(account_id: str, session_id: str, session_name: Optional[str] = None):
    """Update a session"""
    if not is_valid_email(account_id):
        raise HTTPException(status_code=400, detail="account_id must be a valid email address")
    
    normalized_email = account_id.strip().lower()
    update_fields = {"sessions.$.last_activity": datetime.utcnow()}
    if session_name:
        update_fields["sessions.$.session_name"] = session_name

    result = session_collection.update_one(
        {"account_id": normalized_email, "sessions.session_id": session_id},
        {"$set": update_fields}
    )

    if result.modified_count == 0:
        raise HTTPException(status_code=404, detail="Session not found")

    return {"message": "Session updated"}

@app.delete("/session/{account_id}/{session_id}")
def delete_session_account(account_id: str, session_id: str):
    """Delete a session"""
    if not is_valid_email(account_id):
        raise HTTPException(status_code=400, detail="account_id must be a valid email address")
    
    normalized_email = account_id.strip().lower()
    result = session_collection.update_one(
        {"account_id": normalized_email},
        {"$pull": {"sessions": {"session_id": session_id}}}
    )

    if result.modified_count == 0:
        raise HTTPException(status_code=404, detail="Session not found")

    return {"message": "Session deleted"}

# -------------------------
# CHAT SESSION MANAGEMENT (JWT-based)
# -------------------------

@app.post("/api/sessions/create")
async def create_session(data: SessionCreateRequest, authorization: str = Header(None)):
    """
    Create a new chat session for the authenticated user
    """
    try:
        # Verify authentication
        user = await verify_token(authorization)
        
        # Generate session ID
        session_id = str(uuid.uuid4())
        current_time = datetime.utcnow()
        
        # Create session document
        session_doc = {
            "sessionId": session_id,
            "userId": user["id"],
            "title": data.title,
            "messages": [],
            "createdAt": current_time,
            "updatedAt": current_time,
            "isActive": True
        }
        
        # Insert into MongoDB
        db.chatsessions.insert_one(session_doc)
        
        return {
            "success": True,
            "session": {
                "sessionId": session_id,
                "title": data.title,
                "createdAt": current_time.isoformat(),
                "updatedAt": current_time.isoformat(),
                "messageCount": 0
            }
        }
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to create session: {str(e)}")

@app.get("/api/sessions")
async def get_user_sessions(authorization: str = Header(None)):
    """
    Get all chat sessions for the authenticated user
    """
    try:
        # Verify authentication
        user = await verify_token(authorization)
        
        # Query sessions from MongoDB
        sessions = list(db.chatsessions.find(
            {"userId": user["id"], "isActive": True}
        ).sort("updatedAt", -1).limit(20))
        
        # Format response
        formatted_sessions = []
        for session in sessions:
            formatted_sessions.append({
                "sessionId": session["sessionId"],
                "title": session["title"],
                "createdAt": session["createdAt"].isoformat(),
                "updatedAt": session["updatedAt"].isoformat(),
                "messageCount": len(session.get("messages", []))
            })
        
        return {
            "success": True,
            "sessions": formatted_sessions
        }
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to fetch sessions: {str(e)}")

@app.get("/api/sessions/{session_id}")
async def get_session(session_id: str, authorization: str = Header(None)):
    """
    Get a specific chat session with messages
    """
    try:
        # Verify authentication
        user = await verify_token(authorization)
        
        # Query session from MongoDB
        session = db.chatsessions.find_one({
            "sessionId": session_id,
            "userId": user["id"],
            "isActive": True
        })
        
        if not session:
            raise HTTPException(status_code=404, detail="Chat session not found")
        
        # Format messages
        messages = []
        for msg in session.get("messages", []):
            messages.append({
                "id": msg.get("id", str(uuid.uuid4())),
                "sender": msg["sender"],
                "text": msg["text"],
                "timestamp": msg["timestamp"].isoformat() if isinstance(msg["timestamp"], datetime) else msg["timestamp"]
            })
        
        return {
            "success": True,
            "session": {
                "sessionId": session["sessionId"],
                "title": session["title"],
                "messages": messages,
                "createdAt": session["createdAt"].isoformat(),
                "updatedAt": session["updatedAt"].isoformat()
            }
        }
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to fetch session: {str(e)}")

class MessageRequest(BaseModel):
    sender: str
    text: str

@app.post("/api/sessions/{session_id}/messages")
async def add_message_to_session_direct(session_id: str, data: MessageRequest, authorization: str = Header(None)):
    """
    Add a message directly to a session in MongoDB
    """
    try:
        # Verify authentication
        user = await verify_token(authorization)
        
        # Create message document
        message = {
            "id": str(uuid.uuid4()),
            "sender": data.sender,
            "text": data.text,
            "timestamp": datetime.utcnow()
        }
        
        # Update session with new message
        result = db.chatsessions.update_one(
            {
                "sessionId": session_id,
                "userId": user["id"],
                "isActive": True
            },
            {
                "$push": {"messages": message},
                "$set": {"updatedAt": datetime.utcnow()}
            }
        )
        
        if result.matched_count == 0:
            raise HTTPException(status_code=404, detail="Chat session not found")
        
        return {
            "success": True,
            "message": "Message added successfully"
        }
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to add message: {str(e)}")

class SessionUpdateRequest(BaseModel):
    title: str

@app.patch("/api/sessions/{session_id}")
async def update_session(session_id: str, data: SessionUpdateRequest, authorization: str = Header(None)):
    """
    Update a chat session title
    """
    try:
        # Verify authentication
        user = await verify_token(authorization)
        
        # Update session
        result = db.chatsessions.update_one(
            {
                "sessionId": session_id,
                "userId": user["id"],
                "isActive": True
            },
            {
                "$set": {
                    "title": data.title,
                    "updatedAt": datetime.utcnow()
                }
            }
        )
        
        if result.matched_count == 0:
            raise HTTPException(status_code=404, detail="Chat session not found")
        
        return {
            "success": True,
            "session": {
                "sessionId": session_id,
                "title": data.title,
                "updatedAt": datetime.utcnow().isoformat()
            }
        }
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to update session: {str(e)}")

@app.delete("/api/sessions/{session_id}")
async def delete_session(session_id: str, authorization: str = Header(None)):
    """
    Delete a chat session (soft delete by setting isActive to False)
    """
    try:
        # Verify authentication
        user = await verify_token(authorization)
        
        # Soft delete session
        result = db.chatsessions.update_one(
            {
                "sessionId": session_id,
                "userId": user["id"],
                "isActive": True
            },
            {
                "$set": {
                    "isActive": False,
                    "updatedAt": datetime.utcnow()
                }
            }
        )
        
        if result.matched_count == 0:
            raise HTTPException(status_code=404, detail="Chat session not found")
        
        return {
            "success": True,
            "message": "Chat session deleted successfully"
        }
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to delete session: {str(e)}")


# -------------------------
# CHAT ENDPOINT (With Authentication & Session Management)
# -------------------------
@app.post("/api/chat")
async def chat_endpoint(data: ChatRequest, authorization: str = Header(None)):
    """
    Takes a query and returns RAG response from ask() with session management
    """
    try:
        # Verify authentication
        user = await verify_token(authorization)
        
        # Add user message to session directly
        user_message = {
            "id": str(uuid.uuid4()),
            "sender": "user",
            "text": data.query,
            "timestamp": datetime.utcnow()
        }
        
        # Update session with user message
        db.chatsessions.update_one(
            {
                "sessionId": data.session_id,
                "userId": user["id"],
                "isActive": True
            },
            {
                "$push": {"messages": user_message},
                "$set": {"updatedAt": datetime.utcnow()}
            }
        )
        
        # Get RAG response
        response = ask(data.query, data.top_k)
        
        # Add bot response to session directly
        bot_message = {
            "id": str(uuid.uuid4()),
            "sender": "bot",
            "text": response,
            "timestamp": datetime.utcnow()
        }
        
        # Update session with bot message
        db.chatsessions.update_one(
            {
                "sessionId": data.session_id,
                "userId": user["id"],
                "isActive": True
            },
            {
                "$push": {"messages": bot_message},
                "$set": {"updatedAt": datetime.utcnow()}
            }
        )
        
        return {
            "query": data.query,
            "response": response,
            "session_id": data.session_id
        }
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Chat error: {str(e)}")


# -------------------------
# RUN SERVER
# -------------------------
if __name__ == "__main__":
    PORT = int(os.getenv("PORT", 8000))
    uvicorn.run("server:app", host="0.0.0.0", port=PORT, reload=True)

