from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from fastapi.params import Depends
from fastapi.security import OAuth2PasswordRequestForm
from routers import auth  # 👈 Import the entire auth module
from routers import lc  # 👈 Assuming lc.py exists in routers
from pydantic import BaseModel
import logging
import sys

print(sys.path)

logging.basicConfig(level=logging.INFO)

app = FastAPI()

# ✅ Allow CORS from your frontend (React dev server)
origins = [
    "http://localhost:3000",
    "http://127.0.0.1:3000",
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# ✅ Dummy auth endpoint for testing
class AuthRequest(BaseModel):
    username: str
    password: str

TEST_USER = {"username": "test", "password": "password"}

# @app.post("/authToken")
# async def auth_token(req: AuthRequest):
#     logging.info("authToken called for %s", req.username)
#     if req.username == TEST_USER["username"] and req.password == TEST_USER["password"]:
#         return {"access_token": "dummy-token", "token_type": "bearer"}
#     raise HTTPException(status_code=401, detail="Invalid credentials")

# @app.post("/authToken")
# async def login(form_data: OAuth2PasswordRequestForm = Depends()):
#     username = form_data.username
#     password = form_data.password
#     if username != "alice" or password != "password":
#         raise HTTPException(status_code=400, detail="Incorrect username or password")
#     return {"access_token": "token123", "token_type": "bearer"}

# ✅ Include routers
app.include_router(auth.router, prefix="", tags=["Authentication"])
app.include_router(lc.router, prefix="/lc", tags=["Letter of Credit"])

@app.get("/")
async def root():
    return {"message": "Welcome to the API"}

@app.on_event("startup")
def show_routes():
    print("Registered routes:")
    for route in app.routes:
        print(f"{route.path} - {route.methods}")

@app.post("/ping")
async def ping():
    return {"message": "pong"}
