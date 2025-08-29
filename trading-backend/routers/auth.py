# routers/auth.py
from fastapi import Depends, APIRouter , HTTPException, status
from fastapi.security import OAuth2PasswordBearer
from typing import List
from pydantic import BaseModel
from enum import Enum

oauth2_scheme = OAuth2PasswordBearer(tokenUrl="token")
router = APIRouter()

class UserRole(str, Enum):
    IMPORTER = "importer"
    BANK = "bank"
    EXPORTER = "exporter"

class User(BaseModel):
    username: str
    roles: List[UserRole]

fake_users = {
    "alice": {"username": "alice", "roles": [UserRole.IMPORTER]},
    "bob": {"username": "bob", "roles": [UserRole.BANK]},
    "carol": {"username": "carol", "roles": [UserRole.EXPORTER]},
}

async def get_current_user(token: str = Depends(oauth2_scheme)):
    user = fake_users.get(token)
    if not user:
        raise HTTPException(status_code=401, detail="Invalid credentials")
    return User(**user)

def require_roles(required: List[UserRole]):
    async def role_checker(user: User = Depends(get_current_user)):
        if not any(role in user.roles for role in required):
            raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Insufficient privileges")
        return user
    return role_checker


@router.get("/me")
async def read_current_user():
    return {"message": "Authenticated user info goes here"}