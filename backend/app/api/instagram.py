# backend/app/api/instagram.py
from fastapi import APIRouter, HTTPException, Depends
from pydantic import BaseModel, HttpUrl, field_validator
from typing import Optional, List
import os
import httpx
import json

from sqlalchemy.ext.asyncio import AsyncSession
from app.db.database import get_session
from app.repositories.ad_repo import AdRepo
from dotenv import load_dotenv

load_dotenv()

router = APIRouter()

IG_USER_ID = os.getenv("IG_USER_ID")
IG_ACCESS_TOKEN = os.getenv("IG_ACCESS_TOKEN")
GRAPH_BASE = "https://graph.facebook.com/v19.0"

if not IG_USER_ID or not IG_ACCESS_TOKEN:
    raise RuntimeError("IG_USER_ID/IG_ACCESS_TOKEN 환경변수를 설정하세요 (.env).")

class PublishRequest(BaseModel):
    # 1) 바로 캡션 주는 방식
    caption: Optional[str] = None
    # 2) 사용자가 고른 것을 DB에서 가져오는 방식
    session_id: Optional[str] = None

    # 이미지 URL
    image_url: HttpUrl

    # 테스트용
    dry_run: bool = False

    # 콜라보 계정 username 리스트
    collaborators: Optional[List[str]] = None

    @field_validator("collaborators")
    @classmethod
    def _validate_collaborators(cls, v):
        if not v:
            return v
        if len(v) > 3:
            raise ValueError("collaborators는 최대 3명까지 가능합니다.")
        cleaned = []
        for u in v:
            u = u.strip()
            if u.startswith("@"):
                u = u[1:]
            if not u:
                raise ValueError("빈 username은 허용되지 않습니다.")
            cleaned.append(u)
        return cleaned

async def _resolve_caption(db: AsyncSession, req: PublishRequest) -> str:
    if req.caption:
        return req.caption.strip()

    if req.session_id:
        row = await AdRepo.get_choice(db, req.session_id)
        if row and row.content:
            return row.content.strip()
        raise HTTPException(status_code=400, detail="해당 session_id로 저장된 사용자의 선택본이 없습니다.")
    raise HTTPException(status_code=400, detail="caption 또는 session_id 중 하나는 필요합니다.")

@router.post("/ig/publish")
async def ig_publish(req: PublishRequest, db: AsyncSession = Depends(get_session)):
    caption = await _resolve_caption(db, req)

    # (1) 컨테이너 생성 -> (2) 발행 -> (3) (옵션) 콜라보 상태 조회/폴백
    async with httpx.AsyncClient(timeout=60) as client:
        # 1) media 컨테이너 생성
        params = {
            "image_url": str(req.image_url),
            "caption": caption,
            "access_token": IG_ACCESS_TOKEN,
        }

        # collaborators를 지원하는 환경이면 생성 단계에서 함께 전달
        if req.collaborators:
            # Graph API는 JSON 문자열 배열 형식을 기대하므로 dump
            params["collaborators"] = json.dumps(req.collaborators)

        r1 = await client.post(f"{GRAPH_BASE}/{IG_USER_ID}/media", params=params)
        if r1.status_code >= 400:
            raise HTTPException(status_code=502, detail=f"IG media 생성 실패: {r1.text}")
        creation_id = r1.json().get("id")
        if not creation_id:
            raise HTTPException(status_code=502, detail="IG creation_id 응답 누락")

        if req.dry_run:
            return {"ok": True, "creation_id": creation_id, "published": False}

        # 2) 발행
        r2 = await client.post(
            f"{GRAPH_BASE}/{IG_USER_ID}/media_publish",
            params={"creation_id": creation_id, "access_token": IG_ACCESS_TOKEN},
        )
        if r2.status_code >= 400:
            raise HTTPException(status_code=502, detail=f"IG 게시 실패: {r2.text}")
        media_id = r2.json().get("id")

        # permalink 조회
        permalink = None
        if media_id:
            r3 = await client.get(
                f"{GRAPH_BASE}/{media_id}",
                params={"fields": "permalink", "access_token": IG_ACCESS_TOKEN},
            )
            if r3.status_code < 400:
                permalink = r3.json().get("permalink")

        # 3) (옵션) 콜라보 확인 및 폴백
        collaborators_status = None
        if media_id and req.collaborators:
            # 우선 초대 현황 조회
            r4 = await client.get(
                f"{GRAPH_BASE}/{media_id}/collaborators",
                params={"access_token": IG_ACCESS_TOKEN},
            )
            if r4.status_code < 400:
                collaborators_status = r4.json().get("data", [])

            # 생성단계 전달이 미반영(빈 배열 등)인 경우 폴백으로 POST 시도
            need_fallback = not collaborators_status
            if need_fallback:
                r5 = await client.post(
                    f"{GRAPH_BASE}/{media_id}/collaborators",
                    params={
                        "access_token": IG_ACCESS_TOKEN,
                        # usernames 파라미터(JSON 배열 문자열) 사용
                        "usernames": json.dumps(req.collaborators),
                    },
                )
                # 실패하더라도 본문은 성공적으로 퍼블리시되었으니 오류로 치진 않음
                if r5.status_code < 400:
                    # 다시 상태 조회
                    r6 = await client.get(
                        f"{GRAPH_BASE}/{media_id}/collaborators",
                        params={"access_token": IG_ACCESS_TOKEN},
                    )
                    if r6.status_code < 400:
                        collaborators_status = r6.json().get("data", [])

        return {
            "ok": True,
            "media_id": media_id,
            "permalink": permalink,
            "collaborators": req.collaborators or [],
            "collaborators_status": collaborators_status,  # [{"id","username","invite_status"}...]
        }
