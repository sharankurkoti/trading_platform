import os
import asyncio
from datetime import datetime
from enum import Enum
from typing import List, Optional

import httpx
import websockets
from fastapi import (
    FastAPI,
    WebSocket,
    WebSocketDisconnect,
    HTTPException,
    Depends,
)
from fastapi.middleware.cors import CORSMiddleware
from fastapi.security import OAuth2PasswordBearer
from pydantic import BaseModel
from sqlalchemy import Integer, String, Float, DateTime, Enum as SqlEnum, select
from sqlalchemy.ext.asyncio import create_async_engine, async_sessionmaker, AsyncSession
from sqlalchemy.orm import declarative_base, mapped_column
import logging
from starlette.requests import Request
from jose import JWTError, jwt

# ==========================================================
# LOGGING SETUP
# ==========================================================
logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s [%(levelname)s] %(name)s: %(message)s",
)
logging.getLogger("sqlalchemy.engine").setLevel(logging.INFO)
logging.getLogger("sqlalchemy.pool").setLevel(logging.WARNING)
logging.getLogger("uvicorn.error").setLevel(logging.INFO)
logging.getLogger("uvicorn.access").setLevel(logging.INFO)

# ==========================================================
# CONFIGURATION
# ==========================================================
TRADE_EXCHANGE_URL = os.getenv("TRADE_EXCHANGE_URL", "http://localhost:8003")
DATABASE_URL = os.getenv(
    "LOC_DATABASE_URL",
    "postgresql+asyncpg://trading:secret@postgres:5432/trading",
)
JWT_SECRET = os.getenv("JWT_SECRET", "supersecret")
JWT_ALGORITHM = os.getenv("JWT_ALGORITHM", "HS256")

# ==========================================================
# DATABASE SETUP
# ==========================================================
engine = create_async_engine(DATABASE_URL, echo=True)
SessionLocal = async_sessionmaker(engine, expire_on_commit=False)
Base = declarative_base()


class LoCStatus(str, Enum):
    PENDING = "PENDING"
    ISSUED = "ISSUED"
    VERIFIED = "VERIFIED"
    COMPLETED = "COMPLETED"


class LoC(Base):
    __tablename__ = "locs"

    id = mapped_column(Integer, primary_key=True, index=True)
    buyer_id = mapped_column(String, index=True)
    seller_id = mapped_column(String, index=True)
    amount = mapped_column(Float)
    commodity = mapped_column(String)
    latest_price = mapped_column(Float, nullable=True)
    status = mapped_column(SqlEnum(LoCStatus), default=LoCStatus.PENDING)
    created_at = mapped_column(DateTime, default=datetime.utcnow)


# ==========================================================
# Pydantic Schemas
# ==========================================================
class LoCRequest(BaseModel):
    buyer_id: str
    seller_id: str
    amount: float
    commodity: str


class LoCOut(BaseModel):
    id: int
    buyer_id: str
    seller_id: str
    amount: float
    commodity: str
    latest_price: Optional[float] = None
    status: LoCStatus
    created_at: datetime

    class Config:
        from_attributes = True


# ==========================================================
# FASTAPI APP SETUP
# ==========================================================
app = FastAPI(title="LOC Service")
oauth2_scheme = OAuth2PasswordBearer(tokenUrl="token")


# ==========================================================
# UTILS: JWT ROLE CHECK
# ==========================================================
def get_current_user_role(token: str = Depends(oauth2_scheme)) -> str:
    """Decode JWT token and return user role"""
    try:
        payload = jwt.decode(token, JWT_SECRET, algorithms=[JWT_ALGORITHM])
        role = payload.get("role")
        if role is None:
            logging.warning("JWT decoded but role missing")
            raise HTTPException(status_code=403, detail="Role not found in token")
        return role
    except JWTError as e:
        logging.warning(f"JWT decode error: {str(e)}")
        raise HTTPException(status_code=403, detail="Invalid authentication token")


# ==========================================================
# STARTUP EVENT
# ==========================================================
@app.on_event("startup")
async def on_startup():
    async with engine.begin() as conn:
        await conn.run_sync(Base.metadata.create_all)


# ==========================================================
# CORS FOR FRONTEND
# ==========================================================
origins = ["http://localhost:3000"]
app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


# ==========================================================
# WebSocket: Real-time Price Proxy
# ==========================================================
@app.websocket("/ws/loc/price")
async def ws_loc_price(websocket: WebSocket, country: str, commodity: str):
    await websocket.accept()
    await websocket.send_text("Connected to price feed")
    trade_ws_url = f"ws://trade-exchange-service:8000/ws/prices"
    try:
        async with websockets.connect(trade_ws_url) as trade_ws:
            while True:
                msg = await trade_ws.recv()
                await websocket.send_text(msg)
    except WebSocketDisconnect:
        logging.info("Client disconnected")
    except Exception as e:
        await websocket.close(code=1011, reason=str(e))


# ==========================================================
# API ROUTES
# ==========================================================
@app.get("/")
async def root():
    return {"message": "LOC Service Running"}


@app.get("/ping")
async def ping():
    return {"message": "pong"}


@app.get("/loc/price")
async def get_real_time_price(country: str, commodity: str):
    async with httpx.AsyncClient() as client:
        resp = await client.get(
            f"{TRADE_EXCHANGE_URL}/prices",
            params={"country": country, "commodity": commodity},
        )
        if resp.status_code != 200:
            raise HTTPException(status_code=502, detail="Failed to fetch price feed")
        return resp.json()


# ==========================================================
# LoC Endpoints
# ==========================================================
@app.post("/loc/apply", response_model=LoCOut)
async def apply_for_loc(loc: LoCRequest, role: str = Depends(get_current_user_role)):
    if role != "buyer":
        raise HTTPException(status_code=403, detail="Only buyers can apply for LoC.")

    # Fetch latest commodity price
    latest_price = None
    async with httpx.AsyncClient() as client:
        resp = await client.get(
            f"{TRADE_EXCHANGE_URL}/prices",
            params={"country": "IN", "commodity": loc.commodity},
        )
        if resp.status_code == 200:
            data = resp.json()
            if isinstance(data, list) and data:
                latest_price = data[-1].get("price")

    async with SessionLocal() as session:
        db_loc = LoC(**loc.dict(), latest_price=latest_price)
        session.add(db_loc)
        try:
            await session.commit()
            await session.refresh(db_loc)
            return db_loc
        except Exception as e:
            await session.rollback()
            logging.exception("Error committing LoC to DB")
            raise HTTPException(status_code=500, detail="Database error")


@app.post("/loc/issue/{loc_id}", response_model=LoCOut)
async def issue_loc(loc_id: int, role: str = Depends(get_current_user_role)):
    if role != "bank":
        raise HTTPException(status_code=403, detail="Only banks can issue LoC.")
    async with SessionLocal() as session:
        loc = await session.get(LoC, loc_id)
        if not loc:
            raise HTTPException(status_code=404, detail="LoC not found")
        loc.status = LoCStatus.ISSUED
        await session.commit()
        await session.refresh(loc)
        return loc


@app.post("/loc/verify/{loc_id}", response_model=LoCOut)
async def verify_loc(loc_id: int, role: str = Depends(get_current_user_role)):
    if role != "bank":
        raise HTTPException(status_code=403, detail="Only banks can verify LoC.")
    async with SessionLocal() as session:
        loc = await session.get(LoC, loc_id)
        if not loc:
            raise HTTPException(status_code=404, detail="LoC not found")
        loc.status = LoCStatus.VERIFIED
        await session.commit()
        await session.refresh(loc)
        return loc


@app.post("/loc/complete/{loc_id}", response_model=LoCOut)
async def complete_loc(loc_id: int, role: str = Depends(get_current_user_role)):
    if role != "seller":
        raise HTTPException(status_code=403, detail="Only sellers can complete LoC.")
    async with SessionLocal() as session:
        loc = await session.get(LoC, loc_id)
        if not loc:
            raise HTTPException(status_code=404, detail="LoC not found")
        loc.status = LoCStatus.COMPLETED
        await session.commit()
        await session.refresh(loc)
        return loc


@app.get("/loc/{loc_id}", response_model=LoCOut)
async def get_loc(loc_id: int):
    async with SessionLocal() as session:
        loc = await session.get(LoC, loc_id)
        if not loc:
            raise HTTPException(status_code=404, detail="LoC not found")
        return loc


@app.get("/loc", response_model=List[LoCOut])
async def list_locs():
    async with SessionLocal() as session:
        result = await session.execute(select(LoC))
        return result.scalars().all()


# ==========================================================
# HTTP Request Logging Middleware
# ==========================================================
@app.middleware("http")
async def log_requests(request: Request, call_next):
    logger = logging.getLogger("loc_service")
    logger.info(f"Incoming request: {request.method} {request.url}")
    try:
        response = await call_next(request)
        logger.info(f"Response status: {response.status_code}")
        return response
    except Exception as e:
        logger.exception(f"Unhandled error for request: {request.method} {request.url}")
        raise