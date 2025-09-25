# WebSocket proxy for real-time price streaming from trade-exchange-service
import os
from fastapi import WebSocket, FastAPI
app = FastAPI()
import asyncio
from fastapi.middleware.cors import CORSMiddleware

@app.websocket("/ws/loc/price")
async def ws_loc_price(websocket: WebSocket, country: str, commodity: str):
    await websocket.accept()
    await websocket.send_text("Connected to price feed")
    # Connect to trade-exchange-service WebSocket
    import websockets
    trade_ws_url = f"ws://localhost:8003/ws/prices"
    try:
        async with websockets.connect(trade_ws_url) as trade_ws:
            while True:
                msg = await trade_ws.recv()
                await websocket.send_text(msg)
    except Exception as e:
        await websocket.close(code=1011, reason=str(e))

from fastapi import FastAPI, HTTPException, Depends, status
from fastapi.security import OAuth2PasswordBearer
from pydantic import BaseModel
from typing import List, Optional
from sqlalchemy.ext.asyncio import AsyncSession, create_async_engine, async_sessionmaker
from sqlalchemy.orm import declarative_base, mapped_column
from sqlalchemy import Integer, String, Float, DateTime, Enum as SqlEnum, select
# import httpx
TRADE_EXCHANGE_URL = os.getenv("TRADE_EXCHANGE_URL", "http://localhost:8003")
@app.get("/loc/price")
async def get_real_time_price(country: str, commodity: str):
    """Proxy to trade-exchange-service for real-time commodity price feed."""
    async with httpx.AsyncClient() as client:
        resp = await client.get(f"{TRADE_EXCHANGE_URL}/prices", params={"country": country, "commodity": commodity})
        if resp.status_code != 200:
            raise HTTPException(status_code=502, detail="Failed to fetch price from trade exchange service")
        return resp.json()
from enum import Enum
from datetime import datetime
import os

DATABASE_URL = os.getenv("LOC_DATABASE_URL", "postgresql+asyncpg://trading:secret@postgres:5432/tradingdb")
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
         from_attributes = True  # Instead of orm_mode = True

app = FastAPI()

oauth2_scheme = OAuth2PasswordBearer(tokenUrl="token")

# Dummy JWT decode and role extraction (replace with real logic)
def get_current_user_role(token: str = Depends(oauth2_scheme)):
    # In production, decode JWT and extract user/role
    # For demo, accept token as role string
    return token

@app.on_event("startup")
async def on_startup():
    async with engine.begin() as conn:
        await conn.run_sync(Base.metadata.create_all)

@app.post("/loc/apply", response_model=LoCOut)
async def apply_for_loc(loc: LoCRequest, role: str = Depends(get_current_user_role)):
    if role != "buyer":
        raise HTTPException(status_code=403, detail="Only buyers can apply for LoC.")
    # Fetch latest price from trade-exchange-service
    async with httpx.AsyncClient() as client:
        price_resp = await client.get(f"{TRADE_EXCHANGE_URL}/prices", params={"country": "IN", "commodity": loc.commodity})
        latest_price = None
        if price_resp.status_code == 200:
            price_data = price_resp.json()
            if price_data and isinstance(price_data, list):
                latest = price_data[-1] if price_data else None
                if latest and "price" in latest:
                    latest_price = latest["price"]
    async with SessionLocal() as session:
        db_loc = LoC(**loc.dict(), latest_price=latest_price)
        session.add(db_loc)
        await session.commit()
        await session.refresh(db_loc)
        return db_loc

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

@app.get("/")
def read_root():
    return {"message": "LOC Service Running"}

# Allow React frontend to talk to this API
origins = [
    "http://localhost:3000",  # React dev server
    # Add other origins if needed (e.g., deployed frontend)
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,            # Accept requests from these origins
    allow_credentials=True,
    allow_methods=["*"],              # Allow all HTTP methods (GET, POST, etc.)
    allow_headers=["*"],              # Allow all headers
)

# Example route
@app.get("/ping")
async def ping():
    return {"message": "pong"}