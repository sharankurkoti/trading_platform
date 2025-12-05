from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from trading_backend.routers import transaction, customer
from trading_backend.database.session import engine
from trading_backend.models import models

# Create database tables on startup
models.Base.metadata.create_all(bind=engine)

app = FastAPI(
    title="Trading Platform API",
    version="1.0.0"
)

# Add CORS middleware here
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],  # your React frontend URL
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include routers
app.include_router(customer.router, prefix="/customers", tags=["Customers"])
app.include_router(transaction.router, prefix="/transactions", tags=["Transactions"])