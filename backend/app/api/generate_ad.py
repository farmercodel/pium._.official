# backend/app/api/generate_ad.py
from fastapi import APIRouter, HTTPException, Depends
from pydantic import BaseModel
from typing import List, Optional
from sqlalchemy.ext.asyncio import AsyncSession
from app.schemas.GA_schemas import GenerateAdRequest
from app.services.GA_Service import generate_ad_copy
from app.db.database import get_session
from app.repository.ad_repo import AdRepo
from app.api.instagram import ig_publish as ig_publish_route
from app.api.instagram import PublishRequest as IgPublishRequest
from app.api.compose import compose_card_v2 as compose_card_route
from app.api.compose import ComposeCardV2 as ComposeInput
from anyio import to_thread
import os, uuid

router = APIRouter()

class ChooseRequest(BaseModel):
    session_id: str
    variant_id: str
    content: str

class PublishRequest(BaseModel):
    session_id: str
    variant_id: str
    content: str
    image_keys: List[str]
    collaborators: Optional[List[str]] = None
    dry_run: Optional[bool] = False
    store_name: Optional[str] = None
    area_keywords: Optional[List[str]] = None

@router.post("/generate")
async def generate(request: GenerateAdRequest, db: AsyncSession = Depends(get_session)):
    try:
        out = await generate_ad_copy(request)  
        sid = request.session_id or "no-session"

        payload = request.model_dump(mode="json", exclude_none=True)

        req_id = await AdRepo.save_request(db, sid, payload)
        await AdRepo.save_variants(db, req_id, out["variants"])
        await db.commit()
        return {"session_id": sid, **out}
    except Exception as e:
        await db.rollback()
        raise HTTPException(status_code=500, detail=str(e))

@router.post("/choose")
async def choose(req: ChooseRequest, db: AsyncSession = Depends(get_session)):
    try:
        await AdRepo.choose(db, req.session_id, req.variant_id, req.content)
        await db.commit()
        return {"ok": True}
    except Exception as e:
        await db.rollback()
        raise HTTPException(status_code=500, detail=str(e))

@router.get("/choice/{session_id}")
async def get_choice(session_id: str, db: AsyncSession = Depends(get_session)):
    row = await AdRepo.get_choice(db, session_id)
    if not row:
        return {"ok": False, "message": "no selection"}
    return {"ok": True, "session_id": row.session_id, "variant_id": row.variant_id, "content": row.content}

# 요걸로 사용자 답변 선택 -> 바로 발행 처리할 수 있음 !!
@router.post("/choose-publish")
async def choose_and_publish(req: PublishRequest, db: AsyncSession = Depends(get_session)):
    try:
        await AdRepo.choose(db, req.session_id, req.variant_id, req.content)
        await db.commit()
    except Exception as e:
        await db.rollback()
        raise HTTPException(status_code=500, detail=f"choose failed: {e}")

    store_name = (req.store_name or "").strip()
    area_keywords = req.area_keywords or []

    if not (store_name and area_keywords):
        latest = await AdRepo.get_latest_request(db, req.session_id)
        if not store_name:
            store_name = (
                (latest.payload.get("store_name") or "").strip()
                if latest and latest.payload else ""
            )
        if not area_keywords:
            area_keywords = (
                latest.payload.get("area_keywords") if latest and latest.payload else []
            ) or []

    final_image_keys = list(req.image_keys or [])
    if final_image_keys and store_name and area_keywords:
        try:
            comp_in = ComposeInput(
                image_key=final_image_keys[0],
                store_name=store_name,
                area_keywords=[str(x).strip() for x in area_keywords if str(x).strip()],
                session_id=req.session_id, 
            )
            comp_out = await to_thread.run_sync(compose_card_route, comp_in)
            cover_key = comp_out.get("rel")
            if cover_key:
                final_image_keys = [cover_key] + final_image_keys[1:]
        except Exception as e:
            print(f"[choose-publish] compose failed, keep originals: {e}", flush=True)

    ig_req = IgPublishRequest(
        session_id=req.session_id,     
        image_keys=final_image_keys,
        collaborators=req.collaborators or [],
        dry_run=bool(req.dry_run),
    )
    return await ig_publish_route(ig_req, db)