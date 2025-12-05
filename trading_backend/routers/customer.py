from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List

from app.schemas.customer import CustomerCreate, CustomerOut
from app.crud import customer as crud_customer
from app.database.session import SessionLocal

router = APIRouter(prefix="/customers", tags=["Customers"])

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

@router.post("/", response_model=CustomerOut)
def create_customer(customer: CustomerCreate, db: Session = Depends(get_db)):
    # Optional: Add logic to check if customer exists by name or email
    return crud_customer.create_customer(db, customer)

@router.get("/", response_model=List[CustomerOut])
def list_customers(skip: int = 0, limit: int = 10, db: Session = Depends(get_db)):
    return crud_customer.get_customers(db, skip=skip, limit=limit)

@router.get("/{customer_id}", response_model=CustomerOut)
def get_customer(customer_id: int, db: Session = Depends(get_db)):
    customer = crud_customer.get_customer(db, customer_id)
    if not customer:
        raise HTTPException(status_code=404, detail="Customer not found")
    return customer