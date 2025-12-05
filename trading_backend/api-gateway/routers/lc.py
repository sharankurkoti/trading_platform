# trading_backend/api-gateway/routers/lc.py
from fastapi import APIRouter, HTTPException, Request, UploadFile, File, Depends
import os, shutil, httpx
from routers.auth import require_roles, UserRole

router = APIRouter()

# ==========================================================
# File Upload Endpoint
# ==========================================================
@router.post("/upload-document/")
async def upload_document(lc_id: int, file: UploadFile = File(...)):
    upload_dir = f"uploads/lc_{lc_id}"
    os.makedirs(upload_dir, exist_ok=True)
    destination = os.path.join(upload_dir, file.filename)

    with open(destination, "wb") as buffer:
        shutil.copyfileobj(file.file, buffer)

    return {"filename": file.filename, "lc_id": lc_id}


# ==========================================================
# LOC Service Integration (Real backend communication)
# ==========================================================
LOC_SERVICE_URL = "http://loc-service:8001"  # Internal Docker service name

@router.post("/apply")
async def apply_for_loc(request: Request):
    """Forward LOC creation to LOC microservice"""
    try:
        data = await request.json()
        headers = {"Authorization": request.headers.get("Authorization", "")}
        async with httpx.AsyncClient() as client:
            resp = await client.post(f"{LOC_SERVICE_URL}/loc/apply", json=data, headers=headers)
        if resp.status_code != 200:
            raise HTTPException(status_code=resp.status_code, detail=resp.text)
        return resp.json()
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@router.get("/")
async def list_locs():
    """Get all LOCs"""
    async with httpx.AsyncClient() as client:
        resp = await client.get(f"{LOC_SERVICE_URL}/loc")
    if resp.status_code != 200:
        raise HTTPException(status_code=resp.status_code, detail=resp.text)
    return resp.json()


@router.get("/{loc_id}")
async def get_loc(loc_id: int):
    """Get single LOC by ID"""
    async with httpx.AsyncClient() as client:
        resp = await client.get(f"{LOC_SERVICE_URL}/loc/{loc_id}")
    if resp.status_code != 200:
        raise HTTPException(status_code=resp.status_code, detail=resp.text)
    return resp.json()


# ==========================================================
# Approve Endpoint Example (with role-based access)
# ==========================================================
@router.post("/approve")
async def approve_lc(user=Depends(require_roles([UserRole.BANK]))):
    return {"message": f"Approved by {user.username}"}


# ==========================================================
# Mock LOC listing (temporary)
# ==========================================================
@router.get("/mock")
async def list_mock_lcs(applicant: str = None, status: str = None):
    mock_data = [
        {"lc_id": 1, "applicant": "CompanyA", "status": "Approved"},
        {"lc_id": 2, "applicant": "CompanyB", "status": "Pending"},
    ]
    return [
        lc for lc in mock_data
        if (not applicant or lc["applicant"] == applicant)
        and (not status or lc["status"] == status)
    ]