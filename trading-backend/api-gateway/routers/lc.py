# routers/lc.py
from fastapi import APIRouter, UploadFile, File
import os
import shutil
from fastapi import Depends


router = APIRouter()

@router.post("/upload-document/")
async def upload_document(lc_id: int, file: UploadFile = File(...)):
    upload_dir = f"uploads/lc_{lc_id}"
    os.makedirs(upload_dir, exist_ok=True)
    destination = os.path.join(upload_dir, file.filename)

    with open(destination, "wb") as buffer:
        shutil.copyfileobj(file.file, buffer)

    return {"filename": file.filename, "lc_id": lc_id}

from routers.auth import require_roles, UserRole

@router.post("/lc/approve")
async def approve_lc(user = Depends(require_roles([UserRole.BANK]))):
    return {"message": f"Approved by {user.username}"}

@router.get("/lcs/")
async def list_lcs(applicant: str = None, status: str = None):
    # Placeholder logic; replace with real DB logic
    mock_data = [
        {"lc_id": 1, "applicant": "CompanyA", "status": "Approved"},
        {"lc_id": 2, "applicant": "CompanyB", "status": "Pending"},
    ]
    return [lc for lc in mock_data if
            (not applicant or lc["applicant"] == applicant) and
            (not status or lc["status"] == status)]
