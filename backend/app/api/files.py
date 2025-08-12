# backend/app/api/files.py
from fastapi import APIRouter, UploadFile, File, HTTPException
from typing import List
import os, uuid, shutil
from dotenv import load_dotenv
from pathlib import Path

load_dotenv()
router = APIRouter()

# 윈도우 절대 경로 기본값 (raw string 또는 슬래시 사용)
DEFAULT_MEDIA_ROOT = r"F:/pium._.official/backend/app/img"
MEDIA_ROOT = os.getenv("MEDIA_ROOT", DEFAULT_MEDIA_ROOT)
MEDIA_ROOT = str(Path(MEDIA_ROOT))  # 정규화

# 로컬 개발용 공개 URL prefix
MEDIA_BASE_URL = os.getenv("MEDIA_BASE_URL", "http://localhost:8000/img")

ALLOWED_MIME = {"image/jpeg", "image/png", "image/webp"}
MAX_SIZE_MB = 10

@router.post("/files/upload")
async def upload_files(
    files: List[UploadFile] = File(...),
    session_id: str | None = None,
    subdir: str | None = None,  # "stores/123" 같은 세부 폴더 지정용(선택)
):
    saved = []
    # 폴더 규칙: media/{subdir or 'uploads'}/{session_id or 'common'}/
    base_dir = os.path.join(
        MEDIA_ROOT,
        subdir or "uploads",
        session_id or "common"
    )
    os.makedirs(base_dir, exist_ok=True)

    for f in files:
        if f.content_type not in ALLOWED_MIME:
            raise HTTPException(400, f"지원하지 않는 MIME: {f.content_type}")

        # 용량 제한(옵션): 스트림으로 읽어 확인
        size = 0
        tmp_path = os.path.join(base_dir, f"._tmp_{uuid.uuid4().hex}")
        with open(tmp_path, "wb") as out:
            while chunk := await f.read(1024 * 1024):
                size += len(chunk)
                if size > MAX_SIZE_MB * 1024 * 1024:
                    out.close()
                    os.remove(tmp_path)
                    raise HTTPException(413, f"파일이 {MAX_SIZE_MB}MB를 초과합니다.")
                out.write(chunk)

        # 최종 파일명: {uuid}.{ext}
        ext = os.path.splitext(f.filename or "")[1].lower() or ".jpg"
        final_name = f"{uuid.uuid4().hex}{ext}"
        final_path = os.path.join(base_dir, final_name)
        shutil.move(tmp_path, final_path)

        # 공개 URL 조합: MEDIA_BASE_URL + 상대경로
        rel_path = os.path.relpath(final_path, MEDIA_ROOT).replace("\\", "/")
        public_url = f"{MEDIA_BASE_URL}/{rel_path}"

        saved.append({
            "filename": final_name,
            "content_type": f.content_type,
            "size": size,
            "url": public_url,
            "path": final_path,
            "rel": rel_path,
        })

    return {"ok": True, "files": saved}