# backend/app/api/generate_ad.py
from fastapi import APIRouter, HTTPException, Depends, Body
from pydantic import BaseModel, Field
from typing import List, Optional, Dict, Any
from sqlalchemy.ext.asyncio import AsyncSession
from anyio import to_thread

from app.schemas.GA_schemas import GenerateAdRequest
from app.services.GA_Service import generate_ad_copy
from app.db.database import get_session
from app.repository.ad_repo import AdRepo
from app.api.compose import compose_card_v2_core as compose_card_core, ComposeCardV2 as ComposeInput
from app.api.instagram import PublishRequest as IgPublishRequest, ig_publish_core
from app.api.auth import get_current_user

router = APIRouter()

class ChooseRequest(BaseModel):
    variant_id: str
    content: str

class PublishRequest(BaseModel):
    variant_id: str
    content: Optional[str] = None
    image_keys: List[str]
    collaborators: Optional[List[str]] = None
    dry_run: Optional[bool] = False
    store_name: Optional[str] = None
    area_keywords: Optional[List[str]] = None

@router.post("/generate")
async def generate(
    request: GenerateAdRequest,
    db: AsyncSession = Depends(get_session),
    current_user = Depends(get_current_user),
):
    try:
        # 1) 카피 생성
        out = await generate_ad_copy(request)

        # 2) 요청 payload 저장 (user_id 기준)
        payload = request.model_dump(mode="json", exclude_none=True)
        req_id = await AdRepo.save_request(db, user_id=current_user.id, payload=payload)

        # 3) 생성된 variant들을 요청에 연결해 저장
        await AdRepo.save_variants(db, request_id=req_id, variants=out["variants"])

        await db.commit()
        return {
            "user_id": current_user.id,
            **out,
        }
    except Exception as e:
        await db.rollback()
        raise HTTPException(status_code=500, detail=str(e))
    

@router.post("/choose")
async def choose(
    req: ChooseRequest,
    db: AsyncSession = Depends(get_session),
    current_user = Depends(get_current_user),
):
    try:
        await AdRepo.choose(db, user_id=current_user.id, variant_id=req.variant_id, content=req.content)
        await db.commit()
        return {"ok": True}
    except Exception as e:
        await db.rollback()
        raise HTTPException(status_code=500, detail=str(e))

@router.get("/choice/me")
async def get_choice(
    db: AsyncSession = Depends(get_session),
    current_user = Depends(get_current_user),
):
    row = await AdRepo.get_choice(db, user_id=current_user.id)
    if not row:
        return {"ok": False, "message": "no selection"}
    return {
        "ok": True,
        "user_id": current_user.id,
        "variant_id": row.variant_id,
        "content": row.content,
    }

@router.post("/choose-publish")
async def choose_and_publish(
    req: PublishRequest,
    db: AsyncSession = Depends(get_session),
    current_user = Depends(get_current_user),
):
    if not req.image_keys:
        raise HTTPException(status_code=400, detail="image_keys가 비었습니다. /files/upload 응답의 rel 값을 보내주세요.")

    latest = await AdRepo.get_latest_request(db, user_id=current_user.id)
    if not latest or not latest.payload:
        raise HTTPException(status_code=400, detail="최근 생성한 요청이 없습니다.")
    payload = latest.payload

    store_name = (payload.get("store_name") or "").strip()
    area_keywords = payload.get("area_keywords") or []
    instagram_id = (payload.get("instagram_id") or "").strip()
    if not store_name or not area_keywords:
        raise HTTPException(status_code=400, detail="payload에 store_name/area_keywords가 없습니다.")

    variant = await AdRepo.get_variant_for_user(
        db,
        user_id=current_user.id,
        variant_id=req.variant_id,
        request_id=latest.id,
    )
    if not variant:
        raise HTTPException(status_code=404, detail="선택한 문안을 찾을 수 없습니다(요청 불일치).")

    content = (req.content or getattr(variant, "content", "") or "").strip()
    if not content:
        chosen = await AdRepo.get_choice(db, user_id=current_user.id)
        content = (getattr(chosen, "content", "") or "").strip()
    if not content:
        raise HTTPException(status_code=400, detail="게시 캡션이 비어 있습니다. 먼저 문안을 선택해주세요.")
    if len(content) > 2200:
        content = content[:2190].rstrip() + "…"

    # 3) 선택 반영
    try:
        await AdRepo.choose(db, user_id=current_user.id, variant_id=req.variant_id, content=content)
        await db.commit()
    except Exception as e:
        await db.rollback()
        raise HTTPException(status_code=500, detail=f"choose failed: {e}")

    # 4) 커버 합성
    final_image_keys = list(req.image_keys)
    try:
        comp_in = ComposeInput(
            image_key=final_image_keys[0],
            store_name=store_name,
            area_keywords=[str(x).strip() for x in area_keywords if str(x).strip()],
        )
        comp_out = await to_thread.run_sync(compose_card_core, comp_in)
        cover_key = comp_out.get("rel")
        if cover_key:
            final_image_keys = [cover_key] + final_image_keys[1:]
    except Exception as e:
        print(f"[choose-publish] compose failed, keep originals: {e}", flush=True)

    # 5) collaborators
    auto_collabs = [instagram_id] if instagram_id else []
    if req.collaborators:
        auto_collabs = list({*auto_collabs, *[c.strip() for c in req.collaborators if c and c.strip()]})

    ig_req = IgPublishRequest(
        image_keys=final_image_keys,
        collaborators=auto_collabs,
        dry_run=bool(req.dry_run),
        caption=content,
    )
    return await ig_publish_core(ig_req, db)
