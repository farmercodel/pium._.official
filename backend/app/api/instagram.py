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
from app.api.auth import get_current_user  # 인증 유지
import time

load_dotenv()

IG_HTTP_TIMEOUT = float(os.getenv("IG_HTTP_TIMEOUT_SEC", "20"))   # 백엔드 HTTP 타임아웃 (초)
IG_LATEST_TTL_SEC = int(os.getenv("IG_LATEST_TTL_SEC", "60"))     # 최신글 캐시 TTL (초)

# username별 간단 캐시
_latest_cache: dict[str, dict] = {}

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

# instagram.py
async def _resolve_caption(db: AsyncSession, req: PublishRequest, *, user_id: int | None = None) -> str:
    if req.caption and req.caption.strip():
        return req.caption.strip()

    if user_id is not None:
        row = await AdRepo.get_choice(db, user_id=user_id)
        if row and row.content:
            return row.content.strip()
        
    raise HTTPException(status_code=400, detail="caption 또는 session_id 중 하나는 필요합니다.")

async def ig_publish_core(req: PublishRequest, db: AsyncSession):
    caption = req.caption.strip() if (req.caption and req.caption.strip()) else await _resolve_caption(db, req)

    if req.dry_run:
        if not req.image_urls and not req.image_keys:
            raise HTTPException(status_code=400, detail="image_urls 또는 image_keys 중 하나는 필요합니다.")
        img_urls = [str(u) for u in req.image_urls] if req.image_urls else [_presigned_get_url(k, expires=900) for k in req.image_keys]
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

    img_urls = [str(u) for u in req.image_urls] if req.image_urls else [_presigned_get_url(k, expires=900) for k in req.image_keys]

    async with httpx.AsyncClient(timeout=60) as client:
        creation_ids = []
        for img_url in img_urls:
            params = {"image_url": img_url, "access_token": IG_ACCESS_TOKEN}
            if len(img_urls) == 1:
                params["caption"] = caption
                if req.collaborators:
                    # 최신 API에서는 일부 지역에서 container 생성 시 collaborators 파라미터를 허용하기도 하나,
                    # 미지원 환경일 수 있으므로 실패 시 나중에 /{media_id}/collaborators로 보강합니다.
                    params["collaborators"] = json.dumps(req.collaborators)
            else:
                params["is_carousel_item"] = "true"

            r = await client.post(f"{GRAPH_BASE}/{IG_USER_ID}/media", params=params)
            if r.status_code >= 400:
                raise HTTPException(status_code=502, detail=f"IG media 생성 실패: {r.text}")
            creation_ids.append(r.json()["id"])

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

        r_pub = await client.post(
            f"{GRAPH_BASE}/{IG_USER_ID}/media_publish",
            params={"creation_id": parent_creation_id, "access_token": IG_ACCESS_TOKEN},
        )

        if r_pub.status_code >= 400:
            # ⚠️ 보완: code=4(앱 레이트리밋)이면 실제로 올라갔는지 최근 피드에서 확인
            err = {}
            try:
                err = r_pub.json().get("error", {})
            except Exception:
                pass

            if err.get("code") == 4:  # Application request limit reached
                # 최근 게시물 조회해서 방금 캡션과 일치하면 "성공"으로 간주
                r_recent = await client.get(
                    f"{GRAPH_BASE}/{IG_USER_ID}/media",
                    params={
                        "fields": "id,caption,permalink,timestamp",
                        "limit": "10",
                        "access_token": IG_ACCESS_TOKEN,
                    },
                )
                if r_recent.status_code < 400:
                    data = (r_recent.json() or {}).get("data", [])
                    from datetime import datetime, timezone, timedelta
                    now = datetime.now(timezone.utc)
                    matched = None
                    for item in data:
                        cap = (item.get("caption") or "").strip()
                        if cap == caption:
                            # 15분 이내 게시물로 한 번 더 필터
                            ts = item.get("timestamp")
                            try:
                                t = datetime.fromisoformat(ts.replace("Z", "+00:00"))
                            except Exception:
                                t = None
                            if not t or (now - t) <= timedelta(minutes=15):
                                matched = item
                                break
                    if matched:
                        media_id = matched["id"]
                        # 협업자 추가(있을 때)
                        collaborators_status = None
                        if req.collaborators:
                            usernames_str = ",".join(req.collaborators)
                            r_c = await client.post(
                                f"{GRAPH_BASE}/{media_id}/collaborators",
                                params={"access_token": IG_ACCESS_TOKEN, "usernames": usernames_str},
                            )
                            if r_c.status_code < 400:
                                collaborators_status = r_c.json()

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
                            "note": "media_publish=rate_limited(code=4), but verified via recent feed",
                        }

            raise HTTPException(status_code=502, detail=f"IG 게시 실패: {r_pub.text}")

        media_id = r_pub.json()["id"]

        collaborators_status = None
        if req.collaborators:
            usernames_str = ",".join(req.collaborators)
            r_c = await client.post(
                f"{GRAPH_BASE}/{media_id}/collaborators",
                params={"access_token": IG_ACCESS_TOKEN, "usernames": usernames_str},
            )
            if r_c.status_code < 400:
                collaborators_status = r_c.json()

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

# --- 여기부터 최신 게시물 조회 영역 ---

def _shortcode_from_permalink(url: str) -> str:
    """Graph API에는 shortcode 필드가 없으므로 permalink에서 유도"""
    if not url:
        return ""
    try:
        from urllib.parse import urlparse
        path = urlparse(url).path.rstrip("/")
        parts = [p for p in path.split("/") if p]
        return parts[-1] if parts else ""
    except Exception:
        return ""

def _normalize_username(u: Optional[str]) -> str:
    return (u or "").lstrip("@").strip()

async def _fetch_self_latest(client: httpx.AsyncClient):
    """액세스 토큰이 연결된 IG_USER_ID(너희 계정)의 최신 게시물 1건"""
    params = {
        "fields": "id,permalink,timestamp,caption,media_type,media_url,thumbnail_url",
        "limit": "1",
        "access_token": IG_ACCESS_TOKEN,
    }
    r = await client.get(f"{GRAPH_BASE}/{IG_USER_ID}/media", params=params)
    if r.status_code >= 400:
        raise HTTPException(status_code=r.status_code, detail=r.text)
    items = (r.json() or {}).get("data") or []
    if not items:
        raise HTTPException(status_code=404, detail="No media found for IG_USER_ID")
    return items[0]

async def _fetch_discovery_latest(client: httpx.AsyncClient, username: str):
    """
    Business Discovery API로 임의 username의 최신 게시물 1건.
    주의: 호출 계정이 Business/Creator 이어야 하고, 대상 계정이 공개/디스커버리 가능해야 함.
    """
    uname = _normalize_username(username)
    fields = (
        f"business_discovery.username({uname})"
        "{media.limit(1){id,permalink,timestamp,caption}}"
    )
    params = {"fields": fields, "access_token": IG_ACCESS_TOKEN}
    r = await client.get(f"{GRAPH_BASE}/{IG_USER_ID}", params=params)
    if r.status_code >= 400:
        raise HTTPException(status_code=r.status_code, detail=r.text)

    bd = (r.json() or {}).get("business_discovery") or {}
    media = (bd.get("media") or {}).get("data") or []
    if not media:
        raise HTTPException(status_code=404, detail="No media found for the given username")
    return media[0]

@router.get("/instagram/latest-post")
async def latest_post(
    username: str | None = None,
):
    """
    - username 미지정: 토큰 연결된 IG_USER_ID의 최신글
    - username 지정: Business Discovery로 해당 공개 비즈/크리에이터 계정의 최신글
    응답: {"id","shortcode","permalink","caption","timestamp"}
    """
    key = _normalize_username(username) or "__self__"
    now = time.time()

    # 캐시 적중 시 반환
    cached = _latest_cache.get(key)
    if cached and now - cached["ts"] < IG_LATEST_TTL_SEC:
        return cached["data"]

    async with httpx.AsyncClient(timeout=IG_HTTP_TIMEOUT) as client:
        if username:
            media = await _fetch_discovery_latest(client, key)
        else:
            media = await _fetch_self_latest(client)

    permalink = media.get("permalink")
    data = {
        "id": media.get("id"),
        "shortcode": _shortcode_from_permalink(permalink),
        "permalink": permalink,
        "caption": (media.get("caption") or "").strip(),
        "timestamp": media.get("timestamp"),
    }
    _latest_cache[key] = {"data": data, "ts": now}
    return data
