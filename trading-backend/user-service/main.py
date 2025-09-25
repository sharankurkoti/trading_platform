
from fastapi import FastAPI, HTTPException, Depends
from pydantic import BaseModel, EmailStr
from typing import Optional, Dict
from uuid import uuid4, UUID
import firebase_admin
from firebase_admin import credentials, firestore
import os

app = FastAPI()

# Firebase Admin SDK initialization
FIREBASE_KEY_PATH = "/app/secrets/firebase-key.json"
if not firebase_admin._apps:
    cred = credentials.Certificate(FIREBASE_KEY_PATH)
    firebase_admin.initialize_app(cred)
db = firestore.client()

class UserCreate(BaseModel):
    username: str
    email: EmailStr
    password: str
    role: str

class User(BaseModel):
    id: str
    username: str
    email: EmailStr
    role: str
    kyc_status: str = "pending"

class LoginRequest(BaseModel):
    username: str
    password: str

class LoginResponse(BaseModel):
    access_token: str
    token_type: str = "bearer"

class KYCRequest(BaseModel):
    documents: dict

class KYCStatus(BaseModel):
    user_id: UUID
    status: str
    remarks: Optional[str] = None

@app.get("/")
def root():
    return {"message": "User Service running!"}

@app.post("/users", response_model=User)
def register_user(user: UserCreate):
    user_id = str(uuid4())
    user_obj = User(id=user_id, username=user.username, email=user.email, role=user.role)
    db.collection("users").document(user_id).set(user_obj.dict())
    return user_obj

@app.post("/login", response_model=LoginResponse)
def login(req: LoginRequest):
    users_ref = db.collection("users")
    query = users_ref.where("username", "==", req.username).stream()
    for doc in query:
        user = doc.to_dict()
        # For demo, accept any password
        if user["username"] == req.username:
            return LoginResponse(access_token="fake-jwt-token-for-" + req.username)
    raise HTTPException(status_code=401, detail="Invalid credentials")

@app.get("/users/{user_id}", response_model=User)
def get_user(user_id: str):
    doc = db.collection("users").document(user_id).get()
    if not doc.exists:
        raise HTTPException(status_code=404, detail="User not found")
    return doc.to_dict()

@app.post("/users/{user_id}/kyc", response_model=KYCStatus)
def submit_kyc(user_id: str, kyc: KYCRequest):
    user_doc = db.collection("users").document(user_id)
    if not user_doc.get().exists:
        raise HTTPException(status_code=404, detail="User not found")
    kyc_data = {"status": "under_review", "remarks": None, "documents": kyc.documents}
    db.collection("kyc").document(user_id).set(kyc_data)
    user_doc.update({"kyc_status": "under_review"})
    return KYCStatus(user_id=user_id, status="under_review")

@app.get("/users/{user_id}/kyc", response_model=KYCStatus)
def get_kyc_status(user_id: str):
    doc = db.collection("kyc").document(user_id).get()
    if not doc.exists:
        raise HTTPException(status_code=404, detail="KYC not found")
    kyc = doc.to_dict()
    return KYCStatus(user_id=user_id, status=kyc["status"], remarks=kyc["remarks"])
