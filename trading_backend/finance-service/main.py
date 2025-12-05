from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
from typing import List
from sqlalchemy.ext.asyncio import AsyncSession, create_async_engine, async_sessionmaker
from sqlalchemy.orm import declarative_base, mapped_column
from sqlalchemy import Integer, String, Float, DateTime, select
from datetime import datetime
from tenacity import retry, wait_fixed, stop_after_attempt
from fastapi.middleware.cors import CORSMiddleware

DATABASE_URL = "postgresql+asyncpg://trading:secret@postgres:5432/trading"
engine = create_async_engine(DATABASE_URL, echo=True)
SessionLocal = async_sessionmaker(engine, expire_on_commit=False)
Base = declarative_base()

@retry(wait=wait_fixed(2), stop=stop_after_attempt(10))
async def try_connect():
    async with engine.begin() as conn:
        await conn.run_sync(lambda conn: None)

app = FastAPI()

@app.on_event("startup")
async def on_startup():
    await try_connect()
    async with engine.begin() as conn:
        await conn.run_sync(Base.metadata.create_all)

class CreditLine(Base):
    __tablename__ = "credit_lines"
    id = mapped_column(Integer, primary_key=True, index=True)
    applicant = mapped_column(String, index=True)
    amount = mapped_column(Float)
    interest_rate = mapped_column(Float)
    status = mapped_column(String, default="pending")
    created_at = mapped_column(DateTime, default=datetime.utcnow)
    repaid_amount = mapped_column(Float, default=0.0)

class CreditLineCreate(BaseModel):
    applicant: str
    amount: float
    interest_rate: float

class CreditLineOut(BaseModel):
    id: int
    applicant: str
    amount: float
    interest_rate: float
    status: str
    created_at: datetime
    repaid_amount: float

    class Config:
        from_attributes = True

# CORS
origins = ["http://localhost:3000"]
app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"]
)

@app.get("/")
def root():
    return {"message": "Finance Service running!"}

@app.post("/credit-lines", response_model=CreditLineOut)
async def apply_credit_line(credit: CreditLineCreate):
    async with SessionLocal() as session:
        db_credit = CreditLine(**credit.dict())
        session.add(db_credit)
        await session.commit()
        await session.refresh(db_credit)
        return db_credit

@app.get("/credit-lines", response_model=List[CreditLineOut])
async def list_credit_lines():
    async with SessionLocal() as session:
        result = await session.execute(select(CreditLine))
        return result.scalars().all()

@app.get("/credit-lines/{credit_id}/interest")
async def calculate_interest(credit_id: int, days: int = 30):
    async with SessionLocal() as session:
        credit = await session.get(CreditLine, credit_id)
        if not credit:
            raise HTTPException(status_code=404, detail="Credit line not found")
        interest = credit.amount * (credit.interest_rate / 100) * (days / 365)
        return {"credit_id": credit_id, "interest": interest, "days": days}

@app.post("/credit-lines/{credit_id}/repay")
async def repay_credit(credit_id: int, amount: float):
    async with SessionLocal() as session:
        credit = await session.get(CreditLine, credit_id)
        if not credit:
            raise HTTPException(status_code=404, detail="Credit line not found")
        credit.repaid_amount += amount
        await session.commit()
        return {"credit_id": credit_id, "repaid_amount": credit.repaid_amount}

@app.get("/credit-lines/{credit_id}/risk-score")
async def risk_score(credit_id: int):
    return {"credit_id": credit_id, "risk_score": 0.8}

@app.get("/ping")
async def ping():
    return {"message": "pong"}