# backend/app/api/compose.py
import os, io, math, uuid, requests
from fastapi import APIRouter, HTTPException, Form
from typing import Optional
from PIL import Image, ImageDraw, ImageFont, ImageOps, ImageFilter
from datetime import datetime, timezone
from fastapi import Body
from pydantic import BaseModel
from typing import List
from .files import _aws_v4_sign, presigned_get

router = APIRouter()

S3_BUCKET = os.getenv("S3_BUCKET", "pium-dev")
S3_REGION = os.getenv("S3_REGION", "kr-standard")
S3_ENDPOINT = os.getenv("S3_ENDPOINT", "https://kr.object.ncloudstorage.com")
MEDIA_BASE_URL = os.getenv("MEDIA_BASE_URL") 
BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
UPLOADS_DIR = os.path.join(BASE_DIR, "uploads")
FONT_PATH_BOLD = os.path.join(UPLOADS_DIR, "BMDOHYEON_ttf.ttf")
FONT_PATH_REG  = os.path.join(UPLOADS_DIR, "BMDOHYEON_ttf.ttf")


def _ensure_font():
    if not os.path.exists(FONT_PATH_BOLD):
        raise HTTPException(500, f"폰트 파일이 없습니다: {FONT_PATH_BOLD}")

def _text_wh(font: ImageFont.FreeTypeFont, text: str):
    x0, y0, x1, y1 = font.getbbox(text)
    return (x1 - x0, y1 - y0)

def _fit_font(text, max_w, max_h, font_path, max_size, min_size=18):
    size = max_size
    while size >= min_size:
        font = ImageFont.truetype(font_path, size=size)
        w, h = _text_wh(font, text)
        if w <= max_w and h <= max_h:
            return font
        size -= 2
    return ImageFont.truetype(font_path, size=min_size)

def _presigned_get_url(key: str, expires: int = 600) -> str:
    from .files import presigned_get
    return presigned_get(key=key, expires=expires)["url"]

def _rounded_mask(w, h, r):
    m = Image.new("L", (w, h), 0)
    d = ImageDraw.Draw(m)
    d.rounded_rectangle((0,0,w,h), r, fill=255)
    return m
def _resize_cover(img: Image.Image, target_w: int, target_h: int) -> Image.Image:
    iw, ih = img.size
    scale = max(target_w / iw, target_h / ih)
    rs = img.resize((math.ceil(iw * scale), math.ceil(ih * scale)), Image.Resampling.LANCZOS)
    rw, rh = rs.size
    left = (rw - target_w) // 2
    top  = (rh - target_h) // 2
    return rs.crop((left, top, left + target_w, top + target_h))

# ---- v2 레이아웃 합성 (시안 스타일) ----
def _compose_card_v2(
    bg_bytes: bytes,
    thumb_bytes: bytes,
    store_name: str,
    district: str,
    district_color: str = "#FF8601",   # ← 추가: 상권명 포인트 색
) -> bytes:
    _ensure_font()
    W, H = 1080, 1350

    # ── 조정용 상수 ───────────────────────────────
    pad = 72
    TITLE_TOP_OFFSET = 50
    line_gap = 12
    slot_w, slot_h = 860, 600
    MIN_GAP = 30
    CAPTION_SAFE_MARGIN = 150
    # ────────────────────────────────────────────

    canvas = Image.new("RGB", (W, H), "#000000")
    bg = Image.open(io.BytesIO(bg_bytes))
    bg = ImageOps.exif_transpose(bg)
    bg = _resize_cover(bg, W, H)
    canvas.paste(bg, (0, 0))
    draw = ImageDraw.Draw(canvas)

    # 제목(두 줄)
    title_w = W - pad * 2
    district_font = _fit_font(district, title_w, 160, FONT_PATH_BOLD, 128, 32)
    store_font    = _fit_font(store_name, title_w, 200, FONT_PATH_BOLD, 128, 32)

    slot_x = (W - slot_w) // 2
    tx = slot_x
    ty = pad + TITLE_TOP_OFFSET

    # ✔ 상권명만 포인트 색 적용
    draw.text(
        (tx, ty), district, font=district_font,
        fill=district_color,
        # 필요시 외곽선으로 가독성 보강:
        # stroke_width=2, stroke_fill=(0,0,0)
    )

    ty2 = ty + _text_wh(district_font, district)[1] + line_gap
    draw.text((tx, ty2), store_name, font=store_font, fill="#ffffff")

    title_bottom = ty2 + _text_wh(store_font, store_name)[1]

    cap_top_y = H - CAPTION_SAFE_MARGIN
    available = cap_top_y - title_bottom - slot_h
    gap = max(MIN_GAP, available // 2) if available > 0 else MIN_GAP

    slot_y = title_bottom + gap
    if slot_y + slot_h > cap_top_y:
        slot_y = max(title_bottom + MIN_GAP, cap_top_y - slot_h)

    thumb = Image.open(io.BytesIO(thumb_bytes))
    thumb = ImageOps.exif_transpose(thumb)
    thumb = _resize_cover(thumb, slot_w, slot_h)
    canvas.paste(thumb, (slot_x, slot_y))

    out = io.BytesIO()
    canvas.save(out, "WEBP", quality=92, method=6)
    return out.getvalue()


class ComposeCardV2(BaseModel):
    bg_key: str              # 배경 이미지 S3 key (ex: assets/bg/gradient.jpg)
    image_key: str           # 썸네일 원본 S3 key (업로드 응답의 rel)
    store_name: str
    area_keywords: List[str]
    session_id: Optional[str] = None


def _format_district(area_keywords: List[str]) -> str:
    if not area_keywords:
        return "상권 정보"
    top = [kw.strip() for kw in area_keywords if kw.strip()]
    return " · ".join(top[:1])   # 필요하면 [:2]로 확장

# ---- 엔드포인트 ----
@router.post("/compose/card")
def compose_card_v2(payload: ComposeCardV2 = Body(...)):
    _ensure_font()

    # 원본 배경/썸네일 presigned GET
    bg_url    = _presigned_get_url(payload.bg_key)
    thumb_url = _presigned_get_url(payload.image_key)

    rb = requests.get(bg_url, timeout=20)
    if rb.status_code != 200:
        raise HTTPException(502, f"배경 이미지 다운로드 실패: {rb.status_code}")
    rt = requests.get(thumb_url, timeout=20)
    if rt.status_code != 200:
        raise HTTPException(502, f"썸네일 이미지 다운로드 실패: {rt.status_code}")

    district = _format_district(payload.area_keywords)
    composed = _compose_card_v2(rb.content, rt.content, payload.store_name.strip(), district)

    # 업로드
    key_prefix = f"composed_v2/{payload.session_id or 'common'}".strip("/")
    out_key  = f"{key_prefix}/{uuid.uuid4().hex}.webp"
    path = f"/{S3_BUCKET}/{out_key}"
    url  = f"{S3_ENDPOINT}{path}"
    headers = _aws_v4_sign(path, composed, "image/webp")
    pu = requests.put(url, data=composed, headers=headers, timeout=20)
    if pu.status_code not in (200, 201):
        raise HTTPException(500, f"S3 업로드 실패: {pu.status_code} {pu.text}")

    # presigned GET URL 반환
    presigned_url = presigned_get(key=out_key, expires=600)["url"]
    return {"ok": True, "rel": out_key, "url": presigned_url}
