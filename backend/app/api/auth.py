"""
인증 의존성 모듈

- HTTP Authorization 헤더에서 Bearer 토큰을 추출
- JWT 토큰을 검증하고, `sub`(사용자 ID)를 이용해 DB에서 사용자 조회
- 비활성화된 사용자나 토큰이 유효하지 않으면 401 Unauthorized 응답
"""

from __future__ import annotations

from fastapi import Depends, HTTPException, status
from fastapi.security import HTTPAuthorizationCredentials, HTTPBearer
from sqlalchemy.orm import Session

from app.repository.user_repository import UserRepository
from app.util.database import get_db
from app.util.security import decode_token


# Bearer 인증 스키마 객체 (FastAPI에서 Security 사용 시 토큰 자동 추출)
http_bearer = HTTPBearer(auto_error=True)

def get_current_user(
    credentials: HTTPAuthorizationCredentials = Depends(http_bearer),  # Authorization 헤더 자동 파싱
    db: Session = Depends(get_db),  # DB 세션 주입
):
    """
    현재 요청의 Bearer 토큰으로 인증된 사용자 반환.

    동작 순서:
    1. Authorization 헤더에서 Bearer 토큰 추출
    2. JWT 토큰을 디코딩하여 payload 획득
    3. payload에서 `sub`(사용자 ID) 추출
    4. DB에서 해당 사용자 조회
    5. 비활성화 또는 존재하지 않으면 401 예외 발생
    6. 정상일 경우 User 객체 반환 (라우터에서 사용 가능)

    실패 시:
    - 토큰이 없거나 형식이 잘못된 경우 → FastAPI가 자동으로 403 처리
    - 토큰 디코딩 실패 / sub 없음 → 401 Unauthorized
    - 사용자 없음 / 비활성화 → 401 Unauthorized
    """

    # 1. 토큰 문자열 추출
    token = credentials.credentials

    # 2. JWT 디코딩 (검증 포함)
    try:
        payload = decode_token(token)
    except Exception:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="유효하지 않은 토큰입니다."
        )

    # 3. payload에서 사용자 ID(sub) 추출
    sub = payload.get("sub")
    if not sub:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="유효하지 않은 토큰입니다."
        )

    # 4. DB에서 사용자 조회
    repo = UserRepository(db)
    user = repo.get_by_id(int(sub))

    # 5. 존재하지 않거나 비활성화된 경우 예외 발생
    if not user or not user.is_active:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="비활성화된 사용자이거나 존재하지 않습니다."
        )

    # 6. 인증된 User 객체 반환
    return user