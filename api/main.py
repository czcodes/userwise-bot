from fastapi import FastAPI, HTTPException, Depends, status, Header, Body
from fastapi.middleware.cors import CORSMiddleware
from fastapi.security import OAuth2PasswordBearer, OAuth2PasswordRequestForm
from pydantic import BaseModel, Field, EmailStr
from typing import List, Optional, Dict, Any
from datetime import datetime, timedelta
import uuid
import json
import hashlib
import base64
import secrets

# Security configuration
SECRET_KEY = secrets.token_hex(32)  # Generate a random secret key
ACCESS_TOKEN_EXPIRE_MINUTES = 30

# Initialize FastAPI app
app = FastAPI(title="DevOps Bot API")

# Enable CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # For production, specify your frontend domain
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Simple token generation
# Change the tokenUrl to match what the frontend expects
oauth2_scheme = OAuth2PasswordBearer(tokenUrl="token")

# Models
class Token(BaseModel):
    access_token: str
    token_type: str
    user_id: str
    name: str
    email: str
    role: str

class TokenData(BaseModel):
    username: Optional[str] = None

class UserBase(BaseModel):
    name: str
    email: str
    role: str
    status: str

class UserCreate(UserBase):
    password: str

class User(UserBase):
    id: str
    lastActive: str
    
    class Config:
        from_attributes = True

class UserInDB(User):
    password_hash: str

# Chat models
class Message(BaseModel):
    id: str
    user_id: str
    content: str
    timestamp: str
    type: str = "user"  # "user" or "bot"

class ChatSession(BaseModel):
    id: str
    user_id: str
    title: str
    created_at: str
    updated_at: str
    messages: List[Message] = []

# Credential models
class Credential(BaseModel):
    id: str
    user_id: str
    service: str
    details: Dict[str, Any]
    created_at: str
    updated_at: str

# Simple password hashing
def hash_password(password: str) -> str:
    return hashlib.sha256((password + SECRET_KEY).encode()).hexdigest()

def verify_password(plain_password: str, hashed_password: str) -> bool:
    return hash_password(plain_password) == hashed_password

# Mock database
mock_users = [
    {
        "id": "1",
        "name": "John Doe",
        "email": "john@example.com",
        "role": "Admin",
        "status": "Active",
        "lastActive": "2023-07-15T14:30:00",
        "password_hash": hash_password("password123")
    },
    {
        "id": "2",
        "name": "Jane Smith",
        "email": "jane@example.com",
        "role": "User",
        "status": "Active",
        "lastActive": "2023-07-15T10:15:00",
        "password_hash": hash_password("password456")
    },
    {
        "id": "3",
        "name": "Robert Johnson",
        "email": "robert@example.com",
        "role": "User",
        "status": "Inactive",
        "lastActive": "2023-07-10T09:45:00",
        "password_hash": hash_password("password789")
    },
    {
        "id": "4",
        "name": "Sarah Williams",
        "email": "sarah@example.com",
        "role": "User",
        "status": "Active",
        "lastActive": "2023-07-14T16:20:00",
        "password_hash": hash_password("passwordabc")
    },
    {
        "id": "5",
        "name": "Michael Brown",
        "email": "michael@example.com",
        "role": "User",
        "status": "Active",
        "lastActive": "2023-07-15T11:05:00",
        "password_hash": hash_password("passworddef")
    },
]

# Mock chat sessions
mock_chat_sessions = [
    {
        "id": "1",
        "user_id": "1",
        "title": "Kubernetes Deployment Help",
        "created_at": "2023-07-15T14:30:00",
        "updated_at": "2023-07-15T15:00:00",
        "messages": [
            {
                "id": "101",
                "user_id": "1",
                "content": "How do I deploy a new container to Kubernetes?",
                "timestamp": "2023-07-15T14:30:00",
                "type": "user"
            },
            {
                "id": "102",
                "user_id": "system",
                "content": "To deploy a container to Kubernetes, you'll need to create a deployment YAML file first. Would you like me to show you an example?",
                "timestamp": "2023-07-15T14:31:00",
                "type": "bot"
            }
        ]
    },
    {
        "id": "2",
        "user_id": "2",
        "title": "MongoDB Connection Issues",
        "created_at": "2023-07-14T10:15:00",
        "updated_at": "2023-07-14T10:45:00",
        "messages": [
            {
                "id": "201",
                "user_id": "2",
                "content": "I'm having trouble connecting to my MongoDB cluster.",
                "timestamp": "2023-07-14T10:15:00",
                "type": "user"
            },
            {
                "id": "202",
                "user_id": "system",
                "content": "Let's troubleshoot your MongoDB connection. Can you share the connection string you're using (without passwords)?",
                "timestamp": "2023-07-14T10:16:00",
                "type": "bot"
            }
        ]
    }
]

# Mock credentials
mock_credentials = [
    {
        "id": "1",
        "user_id": "1",
        "service": "airflow",
        "details": {
            "url": "https://airflow.example.com",
            "username": "admin"
        },
        "created_at": "2023-07-10T09:00:00",
        "updated_at": "2023-07-10T09:00:00"
    },
    {
        "id": "2",
        "user_id": "1",
        "service": "mongodb",
        "details": {
            "uri": "mongodb://localhost:27017",
            "username": "admin"
        },
        "created_at": "2023-07-10T09:15:00",
        "updated_at": "2023-07-10T09:15:00"
    }
]

# Analytics data for admin dashboard
mock_analytics = {
    "daily_sessions": [
        {"day": "Mon", "count": 24},
        {"day": "Tue", "count": 18},
        {"day": "Wed", "count": 30},
        {"day": "Thu", "count": 26},
        {"day": "Fri", "count": 32},
        {"day": "Sat", "count": 15},
        {"day": "Sun", "count": 10}
    ],
    "user_activity": {
        "active_users": 42,
        "total_messages": 256,
        "average_session_duration": "12m 30s"
    },
    "system_metrics": {
        "cpu_usage": 42,
        "memory_usage": 65,
        "storage_usage": 37,
        "network_bandwidth": 28
    }
}

# Simple token generation and validation
def create_access_token(data: dict, expires_delta: Optional[timedelta] = None):
    expire = datetime.utcnow() + (expires_delta or timedelta(minutes=15))
    to_encode = data.copy()
    to_encode.update({"exp": int(expire.timestamp())})
    
    # Convert token data to string and encode
    token_data = json.dumps(to_encode).encode()
    token = base64.urlsafe_b64encode(token_data).decode()
    return token

async def get_current_user(token: str = Depends(oauth2_scheme)):
    credentials_exception = HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Could not validate credentials",
        headers={"WWW-Authenticate": "Bearer"},
    )
    
    try:
        # Decode the token
        token_bytes = base64.urlsafe_b64decode(token)
        payload = json.loads(token_bytes.decode())
        
        # Check token expiration
        if "exp" not in payload or datetime.utcnow().timestamp() > payload["exp"]:
            raise credentials_exception
            
        username: str = payload.get("sub")
        if username is None:
            raise credentials_exception
    except Exception:
        raise credentials_exception
        
    user = get_user(username)
    if user is None:
        raise credentials_exception
        
    # Update lastActive timestamp
    user["lastActive"] = datetime.now().isoformat()
    return user

# Security helper functions
def get_user(email: str):
    for user in mock_users:
        if user["email"] == email:
            return user
    return None

def authenticate_user(email: str, password: str):
    user = get_user(email)
    if not user:
        return False
    if not verify_password(password, user["password_hash"]):
        return False
    return user

async def get_current_active_user(current_user: dict = Depends(get_current_user)):
    if current_user["status"] == "Inactive":
        raise HTTPException(status_code=400, detail="Inactive user")
    return current_user

# API Routes
@app.get("/")
def read_root():
    return {"message": "Welcome to DevOps Bot API"}

# Authentication routes
@app.post("/token", response_model=Token)
async def login_for_access_token(form_data: OAuth2PasswordRequestForm = Depends()):
    user = authenticate_user(form_data.username, form_data.password)
    if not user:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect username or password",
            headers={"WWW-Authenticate": "Bearer"},
        )
    access_token_expires = timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    access_token = create_access_token(
        data={"sub": user["email"]}, expires_delta=access_token_expires
    )
    return {
        "access_token": access_token,
        "token_type": "bearer",
        "user_id": user["id"],
        "name": user["name"],
        "email": user["email"],
        "role": user["role"]
    }

@app.post("/register", response_model=User, status_code=status.HTTP_201_CREATED)
async def register_user(user: UserCreate):
    # Check if email already exists
    if get_user(user.email):
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Email already registered"
        )
    
    # Create new user
    new_user = user.dict()
    new_user["id"] = str(uuid.uuid4())
    new_user["lastActive"] = datetime.now().isoformat()
    new_user["password_hash"] = hash_password(user.password)
    del new_user["password"]  # Remove plain password
    
    mock_users.append(new_user)
    
    # Return user without password_hash
    user_response = {k: v for k, v in new_user.items() if k != "password_hash"}
    return user_response

# User management routes
@app.get("/users", response_model=List[User])
async def get_users(current_user: dict = Depends(get_current_active_user)):
    # Only admin users can view all users
    if current_user["role"] != "Admin":
        raise HTTPException(status_code=403, detail="Not authorized to view all users")
    
    # Return users without password_hash
    return [{k: v for k, v in user.items() if k != "password_hash"} for user in mock_users]

@app.get("/users/me", response_model=User)
async def get_current_user_profile(current_user: dict = Depends(get_current_active_user)):
    return {k: v for k, v in current_user.items() if k != "password_hash"}

@app.get("/users/{user_id}", response_model=User)
async def get_user_by_id(user_id: str, current_user: dict = Depends(get_current_active_user)):
    # Check if admin or requesting own profile
    if current_user["role"] != "Admin" and current_user["id"] != user_id:
        raise HTTPException(status_code=403, detail="Not authorized to view this user")
    
    for user in mock_users:
        if user["id"] == user_id:
            return {k: v for k, v in user.items() if k != "password_hash"}
    
    raise HTTPException(status_code=404, detail="User not found")

@app.post("/users", response_model=User, status_code=status.HTTP_201_CREATED)
async def create_user(user: UserCreate, current_user: dict = Depends(get_current_active_user)):
    # Only admin users can create new users
    if current_user["role"] != "Admin":
        raise HTTPException(status_code=403, detail="Not authorized to create users")
    
    # Check if email already exists
    if get_user(user.email):
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Email already registered"
        )
    
    # Create new user
    new_user = user.dict()
    new_user["id"] = str(uuid.uuid4())
    new_user["lastActive"] = datetime.now().isoformat()
    new_user["password_hash"] = hash_password(user.password)
    del new_user["password"]  # Remove plain password
    
    mock_users.append(new_user)
    
    # Return user without password_hash
    user_response = {k: v for k, v in new_user.items() if k != "password_hash"}
    return user_response

@app.delete("/users/{user_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_user(user_id: str, current_user: dict = Depends(get_current_active_user)):
    # Only admin users can delete users
    if current_user["role"] != "Admin":
        raise HTTPException(status_code=403, detail="Not authorized to delete users")
    
    for i, user in enumerate(mock_users):
        if user["id"] == user_id:
            mock_users.pop(i)
            return
    
    raise HTTPException(status_code=404, detail="User not found")

@app.patch("/users/{user_id}/status", response_model=User)
async def update_user_status(user_id: str, current_user: dict = Depends(get_current_active_user)):
    # Only admin users can update user status
    if current_user["role"] != "Admin":
        raise HTTPException(status_code=403, detail="Not authorized to update user status")
    
    for user in mock_users:
        if user["id"] == user_id:
            user["status"] = "Inactive" if user["status"] == "Active" else "Active"
            return {k: v for k, v in user.items() if k != "password_hash"}
    
    raise HTTPException(status_code=404, detail="User not found")

# Chat routes
@app.get("/chat/sessions", response_model=List[ChatSession])
async def get_chat_sessions(current_user: dict = Depends(get_current_active_user)):
    user_sessions = [session for session in mock_chat_sessions if session["user_id"] == current_user["id"]]
    return user_sessions

@app.get("/chat/sessions/{session_id}", response_model=ChatSession)
async def get_chat_session(session_id: str, current_user: dict = Depends(get_current_active_user)):
    for session in mock_chat_sessions:
        if session["id"] == session_id and session["user_id"] == current_user["id"]:
            return session
    
    raise HTTPException(status_code=404, detail="Chat session not found")

@app.post("/chat/sessions", response_model=ChatSession, status_code=status.HTTP_201_CREATED)
async def create_chat_session(title: str = Body(...), current_user: dict = Depends(get_current_active_user)):
    new_session = {
        "id": str(uuid.uuid4()),
        "user_id": current_user["id"],
        "title": title,
        "created_at": datetime.now().isoformat(),
        "updated_at": datetime.now().isoformat(),
        "messages": []
    }
    
    mock_chat_sessions.append(new_session)
    return new_session

@app.post("/chat/sessions/{session_id}/messages", response_model=Message)
async def add_chat_message(
    session_id: str, 
    content: str = Body(...), 
    current_user: dict = Depends(get_current_active_user)
):
    # Find the session
    session = None
    for s in mock_chat_sessions:
        if s["id"] == session_id and s["user_id"] == current_user["id"]:
            session = s
            break
    
    if not session:
        raise HTTPException(status_code=404, detail="Chat session not found")
    
    # Log user input to console for debugging and processing
    print(f"\n[USER INPUT] User {current_user['name']} ({current_user['id']}) sent: {content}")
    
    # Process the user message based on content
    # Add user message
    user_message = {
        "id": str(uuid.uuid4()),
        "user_id": current_user["id"],
        "content": content,
        "timestamp": datetime.now().isoformat(),
        "type": "user"
    }
    
    session["messages"].append(user_message)
    session["updated_at"] = datetime.now().isoformat()
    
    # Generate bot response based on user input
    bot_response = process_user_input(content)
    
    # Add bot response
    bot_message = {
        "id": str(uuid.uuid4()),
        "user_id": "system",
        "content": bot_response,
        "timestamp": datetime.now().isoformat(),
        "type": "bot"
    }
    
    session["messages"].append(bot_message)
    
    return user_message

def process_user_input(user_input: str) -> str:
    """Process user input and generate an appropriate response"""
    # Convert to lowercase for easier matching
    input_lower = user_input.lower()
    
    # Log the processing
    print(f"[PROCESSING] Processing user input: '{user_input}'")
    
    # Simple keyword-based responses
    if any(word in input_lower for word in ["hello", "hi", "hey", "greetings"]):
        return "Hello! I'm your DevOps assistant. How can I help you today?"
    
    elif any(word in input_lower for word in ["kubernetes", "k8s", "cluster"]):
        return "I see you're asking about Kubernetes. I can help with cluster management, pod deployment, and troubleshooting. What specific aspect are you interested in?"
    
    elif any(word in input_lower for word in ["docker", "container", "image"]):
        return "Docker containers are a core part of modern DevOps. I can help with container creation, management, and optimization. What are you trying to accomplish?"
    
    elif any(word in input_lower for word in ["mongodb", "database", "nosql"]):
        return "MongoDB is a popular NoSQL database. I can help with connection issues, query optimization, and data modeling. What's your specific question?"
    
    elif any(word in input_lower for word in ["ci", "cd", "pipeline", "jenkins", "github actions"]):
        return "Continuous Integration and Deployment pipelines are essential for modern development. Would you like help setting up a pipeline or troubleshooting an existing one?"
    
    elif any(word in input_lower for word in ["error", "issue", "problem", "bug", "fix"]):
        return "I'm sorry to hear you're experiencing an issue. Could you provide more details about the error message or symptoms you're seeing?"
    
    elif any(word in input_lower for word in ["thanks", "thank you", "thx"]):
        return "You're welcome! Is there anything else I can help you with?"
    
    # If no specific keywords are matched, provide a general response
    else:
        print(f"[NO MATCH] No specific pattern matched for: '{user_input}'")
        return f"I've received your message about '{user_input}'. Can you provide more details so I can assist you better?"

# Credential management routes
@app.get("/credentials", response_model=List[Credential])
async def get_credentials(current_user: dict = Depends(get_current_active_user)):
    user_credentials = [cred for cred in mock_credentials if cred["user_id"] == current_user["id"]]
    return user_credentials

@app.post("/credentials", response_model=Credential, status_code=status.HTTP_201_CREATED)
async def add_credential(
    service: str = Body(...),
    details: Dict[str, Any] = Body(...),
    current_user: dict = Depends(get_current_active_user)
):
    new_credential = {
        "id": str(uuid.uuid4()),
        "user_id": current_user["id"],
        "service": service,
        "details": details,
        "created_at": datetime.now().isoformat(),
        "updated_at": datetime.now().isoformat()
    }
    
    mock_credentials.append(new_credential)
    return new_credential

@app.delete("/credentials/{credential_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_credential(credential_id: str, current_user: dict = Depends(get_current_active_user)):
    for i, cred in enumerate(mock_credentials):
        if cred["id"] == credential_id and cred["user_id"] == current_user["id"]:
            mock_credentials.pop(i)
            return
    
    raise HTTPException(status_code=404, detail="Credential not found")

# Admin analytics routes
@app.get("/admin/analytics")
async def get_admin_analytics(current_user: dict = Depends(get_current_active_user)):
    # Only admin users can access analytics
    if current_user["role"] != "Admin":
        raise HTTPException(status_code=403, detail="Not authorized to access analytics")
    
    return mock_analytics

# Run with: uvicorn main:app --reload
