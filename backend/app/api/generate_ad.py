# backend/app/api/generate_ad.py
from fastapi import APIRouter, HTTPException
from app.schemas.GA_schemas import GenerateAdRequest, BusinessHours
from app.services.GA_Service import generate_ad_copy

router = APIRouter()

@router.post("/generate")
async def generate(request: GenerateAdRequest):
    try:
        return await generate_ad_copy(request)
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
