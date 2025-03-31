
from fastapi import FastAPI, HTTPException, Depends, status
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import List, Optional
from datetime import datetime
import uuid

app = FastAPI(title="DevOps Bot API")

# Enable CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # For production, specify your frontend domain
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Models
class UserBase(BaseModel):
    name: str
    email: str
    role: str
    status: str

class UserCreate(UserBase):
    pass

class User(UserBase):
    id: str
    lastActive: str
    
    class Config:
        orm_mode = True

# Mock database
mock_users = [
    {
        "id": "1",
        "name": "John Doe",
        "email": "john@example.com",
        "role": "Admin",
        "status": "Active",
        "lastActive": "2023-07-15T14:30:00",
    },
    {
        "id": "2",
        "name": "Jane Smith",
        "email": "jane@example.com",
        "role": "User",
        "status": "Active",
        "lastActive": "2023-07-15T10:15:00",
    },
    {
        "id": "3",
        "name": "Robert Johnson",
        "email": "robert@example.com",
        "role": "User",
        "status": "Inactive",
        "lastActive": "2023-07-10T09:45:00",
    },
    {
        "id": "4",
        "name": "Sarah Williams",
        "email": "sarah@example.com",
        "role": "User",
        "status": "Active",
        "lastActive": "2023-07-14T16:20:00",
    },
    {
        "id": "5",
        "name": "Michael Brown",
        "email": "michael@example.com",
        "role": "User",
        "status": "Active",
        "lastActive": "2023-07-15T11:05:00",
    },
]

# API Routes
@app.get("/")
def read_root():
    return {"message": "Welcome to DevOps Bot API"}

@app.get("/users", response_model=List[User])
def get_users():
    return mock_users

@app.get("/users/{user_id}", response_model=User)
def get_user(user_id: str):
    for user in mock_users:
        if user["id"] == user_id:
            return user
    raise HTTPException(status_code=404, detail="User not found")

@app.post("/users", response_model=User, status_code=status.HTTP_201_CREATED)
def create_user(user: UserCreate):
    new_user = user.dict()
    new_user["id"] = str(uuid.uuid4())
    new_user["lastActive"] = datetime.now().isoformat()
    mock_users.append(new_user)
    return new_user

@app.delete("/users/{user_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_user(user_id: str):
    for i, user in enumerate(mock_users):
        if user["id"] == user_id:
            mock_users.pop(i)
            return
    raise HTTPException(status_code=404, detail="User not found")

@app.patch("/users/{user_id}/status", response_model=User)
def update_user_status(user_id: str):
    for user in mock_users:
        if user["id"] == user_id:
            user["status"] = "Inactive" if user["status"] == "Active" else "Active"
            return user
    raise HTTPException(status_code=404, detail="User not found")

# Run with: uvicorn main:app --reload
