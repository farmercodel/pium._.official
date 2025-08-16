# app/services/nts.py (예: 새로운 파일로 분리 추천)
from __future__ import annotations

import os
import json
from typing import Dict, Any, Tuple
from datetime import datetime

import requests
from requests.adapters import HTTPAdapter
from urllib3.util.retry import Retry

NTS_API_BASE_URL = "https://api.odcloud.kr/api/nts-businessman/v1"
DEFAULT_TIMEOUT = 5  # seconds

def _to_yyyymmdd(s: str) -> str:
    """'YYYY-MM-DD' 또는 'YYYYMMDD' 모두 입력 가능하게 표준화."""
    s = (s or "").strip()
    if len(s) == 8 and s.isdigit():
        return s
    try:
        return datetime.strptime(s, "%Y-%m-%d").strftime("%Y%m%d")
    except ValueError:
        raise ValueError("개업일자는 'YYYY-MM-DD' 또는 'YYYYMMDD' 형식이어야 합니다.")

def _session_with_retry(total=2, backoff=0.3) -> requests.Session:
    sess = requests.Session()
    retry = Retry(
        total=total,
        backoff_factor=backoff,
        status_forcelist=(429, 500, 502, 503, 504),
        allowed_methods=("POST",),
        raise_on_status=False,
    )
    adapter = HTTPAdapter(max_retries=retry)
    sess.mount("https://", adapter)
    sess.mount("http://", adapter)
    return sess

def verify_business_registration(
    business_no: str,
    start_date: str,            # 'YYYY-MM-DD' or 'YYYYMMDD'
    representative_name: str,
    api_key: str | None = None,
    timeout: int = DEFAULT_TIMEOUT,
) -> Tuple[bool, Dict[str, Any]]:
    """
    True/False + raw 결과를 반환.
    True = 유효(valid == '01'), False = 유효하지 않음(valid == '02')
    예외는 네트워크/입력 문제일 때만 던짐.
    """
    # 개발 우회
    validate_flag = os.getenv("NTS_VALIDATE", "true").lower() not in {"0", "false", "no"}
    if not validate_flag:
        return True, {"skipped": True, "reason": "validation disabled by NTS_VALIDATE"}

    api_key = api_key or os.getenv("NTS_API_KEY")
    if not api_key:
        raise ValueError("NTS API 키가 설정되지 않았습니다. 환경변수 NTS_API_KEY를 지정하세요.")

    if not (business_no and business_no.isdigit() and len(business_no) == 10):
        raise ValueError("사업자등록번호는 '-' 없이 10자리 숫자여야 합니다.")

    start_dt = _to_yyyymmdd(start_date)
    p_nm = (representative_name or "").strip()
    if not p_nm:
        raise ValueError("대표자 성명을 입력하세요.")

    endpoint = f"{NTS_API_BASE_URL}/validate"
    headers = {"Content-Type": "application/json", "Accept": "application/json"}
    params = {"serviceKey": api_key}
    body = {
        "businesses": [
            {"b_no": business_no, "start_dt": start_dt, "p_nm": p_nm}
        ]
    }

    sess = _session_with_retry()
    try:
        resp = sess.post(endpoint, headers=headers, params=params, json=body, timeout=timeout)
    except requests.RequestException as e:
        raise requests.RequestException(f"NTS API 연결 실패: {e}")

    # HTTP 에러 처리
    try:
        resp.raise_for_status()
    except requests.HTTPError as e:
        # 본문 메시지가 유용할 수 있어 함께 노출
        try:
            payload = resp.json()
        except Exception:
            payload = {"body": resp.text[:500]}
        raise requests.HTTPError(f"NTS API HTTP 오류 {resp.status_code}: {payload}") from e

    # JSON 파싱
    try:
        data = resp.json()
    except json.JSONDecodeError as e:
        raise ValueError(f"NTS API 응답이 JSON이 아닙니다: {e}")

    # 구조/결과 해석
    status_code = data.get("status_code")
    result_list = data.get("data") or []
    first = result_list[0] if result_list else {}

    # 성공 응답이지만 결과 없음
    if status_code != "OK" or not result_list:
        message = data.get("message") or "결과가 없습니다."
        return False, {"status_code": status_code, "message": message, "raw": data}

    # valid: '01' 유효 / '02' 무효 (공식 문서 기준)
    valid_code = (first.get("valid") or "").strip()
    is_valid = (valid_code == "01")
    return is_valid, first