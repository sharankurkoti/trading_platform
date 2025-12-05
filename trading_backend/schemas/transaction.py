from pydantic import BaseModel
from datetime import datetime
from enum import Enum
from typing import Optional

class TransactionStatus(str, Enum):
    approved = "Approved"
    in_process = "In Process"
    rejected = "Rejected"
    pending_docs = "Pending Docs"
    funded = "Funded"
    shipped = "Shipped"
    settled = "Settled"

# Base schema shared by create and update operations
class TransactionBase(BaseModel):
    reference_id: str
    transaction_type: str
    amount: float
    currency: Optional[str] = "USD"
    status: Optional[TransactionStatus] = TransactionStatus.in_process
    remarks: Optional[str] = None
    customer_id: int

# Schema for creating a transaction
class TransactionCreate(TransactionBase):
    pass

# Schema for reading (output) a transaction with extra fields
class TransactionOut(TransactionBase):
    id: int
    created_at: datetime
    updated_at: datetime

    class Config:
        orm_mode = True