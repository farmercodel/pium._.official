# backend/app/services/GA_Service.py
import os, re
import uuid
from typing import List, Optional, Iterable, Dict, Any
from anyio import to_thread
from openai import OpenAI, OpenAIError
from dotenv import load_dotenv
import httpx

load_dotenv()

api_key = os.getenv("OPENAI_API_KEY")

if not api_key:
    raise RuntimeError("OPENAI_API_KEY가 설정되어 있지 않습니다.")

client = OpenAI(api_key=api_key)

TONE_STYLE = {
    "Casual": "친근하고 일상적인 말투, 이모지 적절히 사용",
    "professional": "신뢰감 있는 존댓말, 간결하고 정확한 표현",
    "Witty": "위트 있는 가벼운 유머를 한두 군데 사용",
    "emotional": "따뜻하고 감성적인 문장 위주",
    "urgent": "행동을 재촉하는 짧은 문장과 명확한 혜택 강조",
    "luxury": "절제된 어휘, 고급스러운 톤, 불필요한 감탄사 금지",
}

DELIM = "\n<<<VARIANT_END>>>\n" 

def _safe_join(items: Optional[Iterable], sep: str) -> str:
    if not items:
        return ""
    return sep.join([str(x) for x in items if x is not None])


def _fmt_time(t) -> str:
    return t.strftime("%H:%M") if t else ""

def _extract_hashtags(text: str) -> List[str]:
    tags = re.findall(r"#([A-Za-z0-9가-힣_]+)", text)
    seen, out = set(), []
    for t in tags:
        if t not in seen:
            seen.add(t); out.append(t)
    return out

def _call_openai(prompt: str) -> str:
    try:
        resp = client.chat.completions.create(
            model="gpt-4o-mini",
            messages=[
                {"role": "system", "content": "너는 인스타그램 광고 카피라이터야. 한국어로 쓰고, 지침을 엄격히 따른다."},
                {"role": "user", "content": prompt},
            ],
            temperature=0.7,
        )
        return resp.choices[0].message.content.strip()
    except OpenAIError as e:
        print(f"[OpenAIError] {type(e).__name__}: {e}")
        raise RuntimeError(f"OpenAI 호출 실패: {e}")


def _build_prompt(req) -> str:
    tone_rule = TONE_STYLE.get(req.tone or "Casual", TONE_STYLE["Casual"])
    area_kw = _safe_join(req.area_keywords, ", ")
    ref_links = _safe_join(req.reference_links, "\n") or "없음"
    ps_kw = _safe_join(req.product_service_keywords, ", ") or "미지정"
    targets = _safe_join(req.target_customers, ", ") or "일반 대중"
    promos = _safe_join(req.promotions, " / ") or "없음"
    ig = f"@{req.instagram_id}" if req.instagram_id else "없음"

    img_links = []
    if req.image_urls:
        img_links.extend([str(u) for u in req.image_urls])

    img_hint = ("\n- 참고 이미지 링크: " + ", ".join(img_links)) if img_links else ""

    bh = f"{_fmt_time(req.business_hours.open)} ~ {_fmt_time(req.business_hours.close)}"

    avoid = ""
    if req.avoid_texts:
        avoid = "\n[피해야 할 문구/컨셉]\n- " + "\n- ".join(req.avoid_texts[:10])

    return f"""
[목표]
인스타그램 피드용 광고 캡션 {req.num_variants}개를 작성한다.

[브리프]
- 가게명: {req.store_name}
- 업종: {req.category}
- 지역/상권 키워드: {area_kw}
- 주소: {req.address}
- 가격대: {req.price}
- 영업 시간: {bh}
- 가게 소개: {req.store_intro}
- 제품/서비스 키워드: {ps_kw}
- 타깃 고객: {targets}
- 진행 중 프로모션/이벤트: {promos}
- 인스타그램 ID: {ig}{img_hint}
- 참고 링크:
{ref_links}
{avoid}

[톤]
{tone_rule}

[작성 규칙]
- 한국어, 300자 이내. 자연스럽게 지역/상권 키워드 최소 1개 포함.
- 홍보글은 가게 특성과 고객에게 줄 가치가 명확히 드러나야 함
- 해시태그는 검색 최적화(SEO) 관점에서 작성
- 가게 특징(업종·메인 서비스)과 혜택/차별점을 1~2개로 명확히.
- 인스타 핸들(ID)이 있으면 본문에 한 번만 표기.
- 이모지는 과하지 않게 핵심 위치에만 사용(톤에 맞게).
- 금지: 과장된 단정(최고, 100% 보장, 완벽), 과도한 특수문자, 허위·건강 효능.
- 해시태그는 마지막 줄에만, 띄어쓰기로 구분하여 정확히 {req.hashtag_limit}개 생성.
- 해시태그는 #기호로만 시작하고 문장부호/이모지 금지.
- 홍보글 밑, 해시태그 전 반드시 가게명과 가게 주소를 각각 📍 이모지 뒤에 표기할 것. (ex. 📍 묭이카페\n 📍 소행성 행성로 88-2)
- 가게 인스타그램 아이디는 @기호 뒤에 띄어쓰기 없이 작성할 것

[출력 포맷]
다음 형식을 각 캡션마다 엄격히 따르고, 각 캡션 블록 끝에 '{DELIM.strip()}' 구분자를 붙인다.

캡션 본문 한 문단
빈 줄 1개
#해시태그들(#으로 시작, 공백으로 구분)
{DELIM.strip()}
"""

def _clean_caption_title(text: str) -> str:
    return re.sub(r"^캡션\s*\d+\s*:\s*", "", text.strip())

def _parse_variants(text: str) -> List[Dict[str, Any]]:
    blocks = [b.strip() for b in text.split(DELIM) if b.strip()]
    variants: List[Dict[str, Any]] = []
    for b in blocks:
        parts = b.strip().split("\n")
        hashtag_line = ""
        for i in range(len(parts) - 1, -1, -1):
            if "#" in parts[i]:
                hashtag_line = parts[i].strip()
                body = "\n".join(parts[:i]).strip()
                break
        if not hashtag_line:
            body = b.strip()
        
        body = _clean_caption_title(body)  # ← 여기서 '캡션 1:' 제거
        content = body if not hashtag_line else (body.rstrip() + "\n\n" + hashtag_line)
        variants.append({"id": str(uuid.uuid4()), "content": content})
    return variants


async def generate_ad_copy(req) -> dict:
    prompt = _build_prompt(req)
    raw = await to_thread.run_sync(_call_openai, prompt)
    variants = _parse_variants(raw)
    if not variants:
        variants = [{"content": raw.strip()}]
    return {"variants": variants[: req.num_variants]}

