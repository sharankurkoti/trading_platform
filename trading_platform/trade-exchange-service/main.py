

from fastapi import FastAPI, Query, WebSocket, WebSocketDisconnect
from typing import Dict, Optional, List
import httpx
import os
import asyncio
from datetime import datetime

app = FastAPI()

# In-memory price history: {(country, commodity): [ {"timestamp": ..., "price": ...}, ... ]}
PRICE_HISTORY: Dict[str, List[dict]] = {}

TWELVE_DATA_API_KEY = os.getenv("TWELVE_DATA_API_KEY", "your-twelve-data-api-key")

COUNTRY_COMMODITY_MAP = {
    ("IN", "wheat"): {"symbol": "WHEAT/USD"},
    ("US", "wheat"): {"symbol": "ZW1!"},
    ("IN", "gold"): {"symbol": "XAU/INR"},
    ("US", "gold"): {"symbol": "XAU/USD"},
}

subscribers: List[WebSocket] = []

async def fetch_and_store_prices():
    while True:
        for (country, commodity), meta in COUNTRY_COMMODITY_MAP.items():
            # For demo, generate random price
            import random
            price = round(random.uniform(5, 10), 2) if commodity == "wheat" else round(random.uniform(2000, 2500), 2)
            entry = {"timestamp": datetime.utcnow().isoformat(), "price": price}
            key = f"{country}:{commodity}"
            PRICE_HISTORY.setdefault(key, []).append(entry)
            # Keep only last 100 entries
            PRICE_HISTORY[key] = PRICE_HISTORY[key][-100:]
            # Notify subscribers
            for ws in subscribers:
                try:
                    asyncio.create_task(ws.send_json({"country": country, "commodity": commodity, "price": price, "timestamp": entry["timestamp"]}))
                except Exception:
                    pass
        await asyncio.sleep(10)  # fetch every 10 seconds

@app.on_event("startup")
async def startup_event():
    asyncio.create_task(fetch_and_store_prices())

@app.get("/")
def root():
    return {"message": "Trade Exchange Service running!"}

@app.get("/prices")
def get_prices(country: str, commodity: str):
    key = f"{country.upper()}:{commodity.lower()}"
    return PRICE_HISTORY.get(key, [])

@app.websocket("/ws/prices")
async def websocket_prices(ws: WebSocket):
    await ws.accept()
    subscribers.append(ws)
    try:
        while True:
            await ws.receive_text()  # keep connection open
    except WebSocketDisconnect:
        subscribers.remove(ws)

@app.get("/rates")
async def get_currency_rates(base: str = Query("USD")) -> Dict[str, float]:
    # Fetch live rates from Twelve Data
    url = f"https://api.twelvedata.com/currencies?apikey={TWELVE_DATA_API_KEY}"
    async with httpx.AsyncClient() as client:
        resp = await client.get(url)
        data = resp.json()
    rates = {}
    if "data" in data:
        for item in data["data"]:
            if item["currency_base"] == base.upper():
                rates[item["currency_quote"]] = float(item["close"])
    if not rates:
        # fallback demo data
        rates = {"USD": 1.0, "INR": 83.0, "EUR": 0.92, "GBP": 0.78}
    return rates


# (Removed /commodities and /rules endpoints as COMMODITY_PRICES and TRADE_RULES are not defined)

@app.get("/convert")
async def convert_currency(from_: str = Query(..., alias="from"), to: str = Query(...), amount: float = Query(...)) -> dict:
    # Fetch live rates from Twelve Data
    url = f"https://api.twelvedata.com/currencies?apikey={TWELVE_DATA_API_KEY}"
    async with httpx.AsyncClient() as client:
        resp = await client.get(url)
        data = resp.json()
    rates = {}
    if "data" in data:
        for item in data["data"]:
            if item["currency_base"] == from_.upper():
                rates[item["currency_quote"]] = float(item["close"])
    from_rate = 1.0
    to_rate = rates.get(to.upper())
    if to_rate is None:
        # fallback demo rates
        fallback = {"USD": 1.0, "INR": 83.0, "EUR": 0.92, "GBP": 0.78}
        to_rate = fallback.get(to.upper())
        if to_rate is None:
            return {"error": "Invalid currency code"}
    converted = amount * to_rate
    return {"from": from_, "to": to, "amount": amount, "converted": converted}
