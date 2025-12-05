from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List
from enum import Enum

from app.schemas.transaction import TransactionCreate, TransactionOut, TransactionStatus
from app.crud import transaction as crud_transaction
from app.database.session import SessionLocal

router = APIRouter(prefix="/transactions", tags=["Transactions"])

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

@router.post("/", response_model=TransactionOut)
def create_transaction(transaction: TransactionCreate, db: Session = Depends(get_db)):
    # Optional: Check if customer exists before creating transaction
    return crud_transaction.create_transaction(db, transaction)

@router.get("/", response_model=List[TransactionOut])
def list_transactions(skip: int = 0, limit: int = 10, db: Session = Depends(get_db)):
    return crud_transaction.get_transactions(db, skip=skip, limit=limit)

@router.get("/{transaction_id}", response_model=TransactionOut)
def get_transaction(transaction_id: int, db: Session = Depends(get_db)):
    transaction = crud_transaction.get_transaction(db, transaction_id)
    if not transaction:
        raise HTTPException(status_code=404, detail="Transaction not found")
    return transaction

@router.patch("/{transaction_id}/status", response_model=TransactionOut)
def update_transaction_status(transaction_id: int, status: TransactionStatus, db: Session = Depends(get_db)):
    transaction = crud_transaction.update_transaction_status(db, transaction_id, status)
    if not transaction:
        raise HTTPException(status_code=404, detail="Transaction not found")
    return transaction

@router.delete("/{transaction_id}", response_model=TransactionOut)
def delete_transaction(transaction_id: int, db: Session = Depends(get_db)):
    transaction = crud_transaction.delete_transaction(db, transaction_id)
    if not transaction:
        raise HTTPException(status_code=404, detail="Transaction not found")
    return transaction