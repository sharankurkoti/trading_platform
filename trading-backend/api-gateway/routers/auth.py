from fastapi import Depends, APIRouter, HTTPException, status
from fastapi.security import OAuth2PasswordBearer, OAuth2PasswordRequestForm
from typing import List
from pydantic import BaseModel
from enum import Enum
from jose import jwt, JWTError
from datetime import datetime, timedelta

router = APIRouter()

# Define roles
class UserRole(str, Enum):
    IMPORTER = "importer"
    BANK = "bank"
    EXPORTER = "exporter"

# User model
class User(BaseModel):
    username: str
    roles: List[UserRole]

# Fake users
fake_users = {
    "alice": {"username": "alice", "roles": [UserRole.IMPORTER]},
    "bob": {"username": "bob", "roles": [UserRole.BANK]},
    "carol": {"username": "carol", "roles": [UserRole.EXPORTER]},
}

# JWT config
SECRET_KEY = "your-secret-key"  # 🔐 Replace in production
ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_MINUTES = 30

oauth2_scheme = OAuth2PasswordBearer(tokenUrl="/authToken")

def create_access_token(data: dict, expires_delta: timedelta | None = None):
    to_encode = data.copy()
    expire = datetime.utcnow() + (expires_delta or timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES))
    to_encode.update({"exp": expire})
    return jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)

def authenticate_user(username: str, password: str):
    user = fake_users.get(username)
    if not user or password != "password":  # Replace with hashed check
        return None
    return User(**user)

async def get_current_user(token: str = Depends(oauth2_scheme)):
    credentials_exception = HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Could not validate credentials",
        headers={"WWW-Authenticate": "Bearer"},
    )
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        username: str = payload.get("sub")
        roles = payload.get("roles")
        if username is None or roles is None:
            raise credentials_exception
    except JWTError:
        raise credentials_exception
    user = fake_users.get(username)
    if user is None:
        raise credentials_exception
    return User(username=username, roles=roles)

def require_roles(required: List[UserRole]):
    async def role_checker(user: User = Depends(get_current_user)):
        if not any(role in user.roles for role in required):
            raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Insufficient privileges")
        return user
    return role_checker

@router.post("/authToken")
async def login(form_data: OAuth2PasswordRequestForm = Depends()):
    user = authenticate_user(form_data.username, form_data.password)
    if not user:
        raise HTTPException(status_code=400, detail="Incorrect username or password")
    
    access_token = create_access_token(data={
        "sub": user.username,
        "roles": user.roles
    })

    return {
        "access_token": access_token,
        "token_type": "bearer"
    }

@router.get("/me")
async def read_current_user(current_user: User = Depends(get_current_user)):
    return current_user