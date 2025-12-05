from sqlalchemy import Column, String, Integer, Float, ForeignKey, DateTime, Enum
from sqlalchemy.orm import relationship, declarative_base
from datetime import datetime
import enum

Base = declarative_base()

# Enum for transaction status
class TransactionStatus(str, enum.Enum):
    approved = "Approved"
    in_process = "In Process"
    rejected = "Rejected"
    pending_docs = "Pending Docs"
    funded = "Funded"
    shipped = "Shipped"
    settled = "Settled"

# -------------------------
# Customer Table
# -------------------------
class Customer(Base):
    __tablename__ = "customers"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, nullable=False, unique=True)
    email = Column(String, nullable=True)
    phone = Column(String, nullable=True)
    company_code = Column(String, nullable=True)  # optional field
    created_at = Column(DateTime, default=datetime.utcnow)

    # Relationship
    transactions = relationship("Transaction", back_populates="customer")


# -------------------------
# Transaction Table
# -------------------------
class Transaction(Base):
    __tablename__ = "transactions"

    id = Column(Integer, primary_key=True, index=True)
    reference_id = Column(String, unique=True, nullable=False)  # e.g., LOC-20250901-001
    transaction_type = Column(String, nullable=False)  # "Letter of Credit" or "Trade Finance"
    amount = Column(Float, nullable=False)
    currency = Column(String, default="USD")
    status = Column(Enum(TransactionStatus), default=TransactionStatus.in_process)
    remarks = Column(String, nullable=True)

    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

    # Foreign key to customer
    customer_id = Column(Integer, ForeignKey("customers.id"), nullable=False)

    # Relationship
    customer = relationship("Customer", back_populates="transactions")