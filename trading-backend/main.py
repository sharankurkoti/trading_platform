from fastapi import FastAPI  # ✅ This is all you need (remove "Import FastAPI")
from routers import lc, auth  # ✅ Your custom routers
from routers import auth

app = FastAPI()

# Include routers
app.include_router(lc.router, prefix="/lc", tags=["Letter of Credit"])
app.include_router(auth.router, prefix="/auth", tags=["Authentication"])
