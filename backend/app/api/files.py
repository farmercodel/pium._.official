# backend/app/api/files.py
import os, uuid, hmac, hashlib, mimetypes
from datetime import datetime, timezone
import requests
from fastapi import APIRouter, UploadFile, File, HTTPException
from typing import List, Optional
import urllib.parse

router = APIRouter()

ALLOWED_MIME = {"image/jpeg", "image/png", "image/webp"}
MAX_SIZE_MB = int(os.getenv("MAX_SIZE_MB", "10"))

S3_BUCKET = os.getenv("S3_BUCKET", "pium-dev")
S3_REGION = os.getenv("S3_REGION", "kr-standard")
S3_ENDPOINT = os.getenv("S3_ENDPOINT", "https://kr.object.ncloudstorage.com")
S3_ACCESS_KEY = os.getenv("S3_ACCESS_KEY")
S3_SECRET_KEY = os.getenv("S3_SECRET_KEY")
MEDIA_BASE_URL = os.getenv("MEDIA_BASE_URL")  # 공개 버킷이면 https://kr.object.../bucket

def _chk_env():
    missing = [k for k in ["S3_BUCKET","S3_ENDPOINT","S3_ACCESS_KEY","S3_SECRET_KEY"] if not os.getenv(k)]
    if missing:
        raise HTTPException(500, f"환경변수 누락: {', '.join(missing)}")

def _ensure_allowed(content_type: str):
    if content_type not in ALLOWED_MIME:
        raise HTTPException(400, f"지원하지 않는 MIME: {content_type}")

def _ext(filename: Optional[str], content_type: str) -> str:
    if filename:
        ext = os.path.splitext(filename)[1].lower()
        if ext:
            return ext
    ext = mimetypes.guess_extension(content_type) or ".jpg"
    return ext if ext.startswith(".") else "." + ext

def _aws_v4_sign(path: str, body: bytes, content_type: str):
    """NCP 경로형(endpoint/bucket/key) 기준 서명 헤더 생성"""
    service = "s3"
    algorithm = "AWS4-HMAC-SHA256"
    now = datetime.now(timezone.utc)
    amz_date = now.strftime("%Y%m%dT%H%M%SZ")
    date_stamp = now.strftime("%Y%m%d")
    credential_scope = f"{date_stamp}/{S3_REGION}/{service}/aws4_request"

    payload_hash = hashlib.sha256(body).hexdigest()
    host = S3_ENDPOINT.replace("https://","").replace("http://","")

    canonical_headers = (
        f"host:{host}\n"
        f"x-amz-content-sha256:{payload_hash}\n"
        f"x-amz-date:{amz_date}\n"
    )
    signed_headers = "host;x-amz-content-sha256;x-amz-date"
    canonical_request = f"PUT\n{path}\n\n{canonical_headers}\n{signed_headers}\n{payload_hash}"
    string_to_sign = (
        f"{algorithm}\n{amz_date}\n{credential_scope}\n"
        f"{hashlib.sha256(canonical_request.encode()).hexdigest()}"
    )

    def _sign(key: bytes, msg: str) -> bytes:
        return hmac.new(key, msg.encode(), hashlib.sha256).digest()

    k_date = _sign(("AWS4" + S3_SECRET_KEY).encode(), date_stamp)
    k_region = _sign(k_date, S3_REGION)
    k_service = _sign(k_region, service)
    k_signing = _sign(k_service, "aws4_request")
    signature = hmac.new(k_signing, string_to_sign.encode(), hashlib.sha256).hexdigest()

    auth = (
        f"{algorithm} Credential={S3_ACCESS_KEY}/{credential_scope}, "
        f"SignedHeaders={signed_headers}, Signature={signature}"
    )
    return {
        "Authorization": auth,
        "x-amz-date": amz_date,
        "x-amz-content-sha256": payload_hash,
        "Content-Type": content_type,
    }

@router.post("/files/upload")
async def upload_files(
    files: List[UploadFile] = File(...),
    session_id: Optional[str] = None,
    subdir: Optional[str] = None,
):
    _chk_env()
    saved = []

    key_prefix = f"{subdir or 'uploads'}/{session_id or 'common'}".strip("/")

    for f in files:
        _ensure_allowed(f.content_type)

        size = 0
        buf = bytearray()
        while chunk := await f.read(1024 * 1024):
            size += len(chunk)
            if size > MAX_SIZE_MB * 1024 * 1024:
                raise HTTPException(413, f"파일이 {MAX_SIZE_MB}MB를 초과합니다.")
            buf.extend(chunk)

        ext = _ext(f.filename, f.content_type)
        final_name = f"{uuid.uuid4().hex}{ext}"
        key = f"{key_prefix}/{final_name}"

        path = f"/{S3_BUCKET}/{key}"
        url = f"{S3_ENDPOINT}{path}"

        headers = _aws_v4_sign(path, bytes(buf), f.content_type)
        resp = requests.put(url, data=bytes(buf), headers=headers)
        if resp.status_code not in (200, 201):
            raise HTTPException(500, detail={"upload_failed": resp.text, "status": resp.status_code})

        public_url = f"{MEDIA_BASE_URL.rstrip('/')}/{key}" if MEDIA_BASE_URL else None
        saved.append({
            "filename": final_name,
            "content_type": f.content_type,
            "size": size,
            "url": public_url,
            "rel": key,
            "backend": "ncp-object-storage",
        })

    return {"ok": True, "files": saved}

# ----- presigned GET (비공개 버킷에서도 열람용 임시 URL 발급) -----
import urllib.parse

@router.get("/files/presigned-get")
def presigned_get(key: str, expires: int = 600):
    # key 예: "uploads/no-session/xxxx.png"  (응답의 'rel' 값을 그대로 넘기면 됨)
    if not all([S3_BUCKET, S3_REGION, S3_ENDPOINT, S3_ACCESS_KEY, S3_SECRET_KEY]):
        raise HTTPException(500, "S3 env not set")

    service = "s3"
    algorithm = "AWS4-HMAC-SHA256"
    now = datetime.now(timezone.utc)
    amz_date = now.strftime("%Y%m%dT%H%M%SZ")
    date_stamp = now.strftime("%Y%m%d")
    credential_scope = f"{date_stamp}/{S3_REGION}/{service}/aws4_request"
    host = S3_ENDPOINT.replace("https://","").replace("http://","")
    path = f"/{S3_BUCKET}/{key}"

    # 정렬된 쿼리
    qs = {
        "X-Amz-Algorithm": algorithm,
        "X-Amz-Credential": f"{S3_ACCESS_KEY}/{credential_scope}",
        "X-Amz-Date": amz_date,
        "X-Amz-Expires": str(expires),
        "X-Amz-SignedHeaders": "host",
    }
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

    def _sign(key: bytes, msg: str) -> bytes:
        return hmac.new(key, msg.encode(), hashlib.sha256).digest()

    k_date = _sign(("AWS4" + S3_SECRET_KEY).encode(), date_stamp)
    k_region = _sign(k_date, S3_REGION)
    k_service = _sign(k_region, service)
    k_signing = _sign(k_service, "aws4_request")
    signature = hmac.new(k_signing, string_to_sign.encode(), hashlib.sha256).hexdigest()

    final_qs = canonical_query + f"&X-Amz-Signature={signature}"
    url = f"{S3_ENDPOINT}{path}?{final_qs}"
    return {"url": url, "expires_in": expires}
