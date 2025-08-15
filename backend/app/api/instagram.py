# backend/app/api/instagram.py
from fastapi import APIRouter, HTTPException, Depends
from pydantic import BaseModel, HttpUrl, field_validator
from typing import Optional, List
import os
import httpx
import json
from datetime import datetime, timezone
import hmac, hashlib
from typing import Union
from sqlalchemy.ext.asyncio import AsyncSession
from app.db.database import get_session
from app.repository.ad_repo import AdRepo
from dotenv import load_dotenv

load_dotenv()

S3_BUCKET = os.getenv("S3_BUCKET")
S3_REGION = os.getenv("S3_REGION", "kr-standard")
S3_ENDPOINT = os.getenv("S3_ENDPOINT", "https://kr.object.ncloudstorage.com")
S3_ACCESS_KEY = os.getenv("S3_ACCESS_KEY")
S3_SECRET_KEY = os.getenv("S3_SECRET_KEY")

def _sign(key: bytes, msg: str) -> bytes:
    return hmac.new(key, msg.encode(), hashlib.sha256).digest()

def _presigned_get_url(key: str, expires: int = 900) -> str:
    """NCP(Object Storage) presigned GET URL 생성. key = 'uploads/.../file.png'"""
    service = "s3"
    algorithm = "AWS4-HMAC-SHA256"
    now = datetime.now(timezone.utc)
    amz_date = now.strftime("%Y%m%dT%H%M%SZ")
    date_stamp = now.strftime("%Y%m%d")
    credential_scope = f"{date_stamp}/{S3_REGION}/{service}/aws4_request"
    host = S3_ENDPOINT.replace("https://","").replace("http://","")
    path = f"/{S3_BUCKET}/{key}"

    qs = {
        "X-Amz-Algorithm": algorithm,
        "X-Amz-Credential": f"{S3_ACCESS_KEY}/{credential_scope}",
        "X-Amz-Date": amz_date,
        "X-Amz-Expires": str(expires),
        "X-Amz-SignedHeaders": "host",
    }
    import urllib.parse
    canonical_query = "&".join(
        f"{urllib.parse.quote(k, safe='~')}={urllib.parse.quote(v, safe='~')}"
        for k, v in sorted(qs.items())
    )
    canonical_headers = f"host:{host}\n"
    signed_headers = "host"
    payload_hash = "UNSIGNED-PAYLOAD"
    canonical_request = f"GET\n{path}\n{canonical_query}\n{canonical_headers}\n{signed_headers}\n{payload_hash}"
    string_to_sign = (
        f"{algorithm}\n{amz_date}\n{credential_scope}\n"
        f"{hashlib.sha256(canonical_request.encode()).hexdigest()}"
    )
    k_date = _sign(("AWS4" + S3_SECRET_KEY).encode(), date_stamp)
    k_region = _sign(k_date, S3_REGION)
    k_service = _sign(k_region, service)
    k_signing = _sign(k_service, "aws4_request")
    signature = hmac.new(k_signing, string_to_sign.encode(), hashlib.sha256).hexdigest()
    final_qs = canonical_query + f"&X-Amz-Signature={signature}"
    return f"{S3_ENDPOINT}{path}?{final_qs}"

router = APIRouter()

IG_USER_ID = os.getenv("IG_USER_ID")
IG_ACCESS_TOKEN = os.getenv("IG_ACCESS_TOKEN")
GRAPH_BASE = "https://graph.facebook.com/v19.0"

if not IG_USER_ID or not IG_ACCESS_TOKEN:
    raise RuntimeError("IG_USER_ID/IG_ACCESS_TOKEN 환경변수를 설정하세요 (.env).")

class PublishRequest(BaseModel):
    caption: Optional[str] = None
    session_id: Optional[str] = None
    image_urls: Optional[List[HttpUrl]] = None
    image_keys: Optional[List[str]] = None
    dry_run: bool = False
    collaborators: Optional[List[str]] = None

    @field_validator("collaborators")
    @classmethod
    def _validate_collaborators(cls, v):
        if not v:
            return v
        if len(v) > 3:
            raise ValueError("collaborators는 최대 3명까지 가능합니다.")
        return [u.lstrip("@").strip() for u in v if u.strip()]

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

    if req.dry_run:
        if not req.image_urls and not req.image_keys:
            raise HTTPException(status_code=400, detail="image_urls 또는 image_keys 중 하나는 필요합니다.")
        if req.image_urls:
            img_urls = [str(u) for u in req.image_urls]
        else:
            img_urls = [_presigned_get_url(k, expires=900) for k in req.image_keys]
        return {
            "ok": True,
            "dry_run": True,
            "caption": caption,
            "image_urls": img_urls,
            "collaborators": req.collaborators or [],
            "note": "No call to Instagram Graph API (dry-run)."
        }

    if not req.image_urls and not req.image_keys:
        raise HTTPException(status_code=400, detail="image_urls 또는 image_keys 중 하나는 필요합니다.")

    # 이미지 URL 생성
    if req.image_urls:
        img_urls = [str(u) for u in req.image_urls]
    else:
        img_urls = [_presigned_get_url(k, expires=900) for k in req.image_keys]

    async with httpx.AsyncClient(timeout=60) as client:
        creation_ids = []
        # 1장씩 media 생성
        for img_url in img_urls:
            params = {
                "image_url": img_url,
                "access_token": IG_ACCESS_TOKEN
            }
            if len(img_urls) == 1:
                params["caption"] = caption
                if req.collaborators:
                    params["collaborators"] = json.dumps(req.collaborators)
            else:
                params["is_carousel_item"] = "true"

            r = await client.post(f"{GRAPH_BASE}/{IG_USER_ID}/media", params=params)
            if r.status_code >= 400:
                raise HTTPException(status_code=502, detail=f"IG media 생성 실패: {r.text}")
            creation_ids.append(r.json()["id"])

        # 캐러셀 parent 생성
        if len(creation_ids) > 1:
            params = {
                "media_type": "CAROUSEL",
                "children": json.dumps(creation_ids),
                "caption": caption,
                "access_token": IG_ACCESS_TOKEN,
            }
            if req.collaborators:
                params["collaborators"] = json.dumps(req.collaborators)

            r = await client.post(f"{GRAPH_BASE}/{IG_USER_ID}/media", params=params)
            if r.status_code >= 400:
                raise HTTPException(status_code=502, detail=f"IG carousel 생성 실패: {r.text}")
            parent_creation_id = r.json()["id"]
        else:
            parent_creation_id = creation_ids[0]

        # 발행
        r_pub = await client.post(
            f"{GRAPH_BASE}/{IG_USER_ID}/media_publish",
            params={"creation_id": parent_creation_id, "access_token": IG_ACCESS_TOKEN},
        )
        if r_pub.status_code >= 400:
            raise HTTPException(status_code=502, detail=f"IG 게시 실패: {r_pub.text}")

        media_id = r_pub.json()["id"]

        # 폴백 공동소유자 설정
        collaborators_status = None
        if req.collaborators:
            usernames_str = ",".join(req.collaborators)
            r_c = await client.post(
                f"{GRAPH_BASE}/{media_id}/collaborators",
                params={
                    "access_token": IG_ACCESS_TOKEN,
                    "usernames": usernames_str,
                },
            )
            if r_c.status_code < 400:
                collaborators_status = r_c.json()



        # permalink 조회
        permalink = None
        r_link = await client.get(
            f"{GRAPH_BASE}/{media_id}",
            params={"fields": "permalink", "access_token": IG_ACCESS_TOKEN},
        )
        if r_link.status_code < 400:
            permalink = r_link.json().get("permalink")

        return {
            "ok": True,
            "media_id": media_id,
            "permalink": permalink,
            "collaborators": req.collaborators or [],
            "collaborators_status": collaborators_status,
        }