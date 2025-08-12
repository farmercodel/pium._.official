"""
보안/인증 유틸리티 모듈

- 비밀번호 해시와 검증: bcrypt 알고리즘(passlib 사용)
- JWT 토큰 생성과 검증: HS256 대칭키 알고리즘(jose 사용)

환경 변수
- JWT_SECRET: JWT 서명에 사용되는 비밀키 (운영환경에서 반드시 설정)
- JWT_EXPIRE_MINUTES: 토큰 만료 시간(분), 기본값 60분
"""

from __future__ import annotations

import os
from datetime import datetime, timedelta, timezone
from typing import Any, Dict, Optional

from jose import jwt
from passlib.context import CryptContext


# bcrypt 해시 스킴을 사용하는 패스워드 컨텍스트 생성 (auto deprecated 처리)
pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

# JWT 서명용 비밀키. 환경변수에서 읽어오며 기본값은 테스트용
JWT_SECRET = os.getenv("JWT_SECRET", "change-me-in-prod")

# JWT 서명 알고리즘 (HS256: HMAC-SHA256)
JWT_ALGORITHM = "HS256"

# JWT 토큰 만료 시간(분). 환경변수 없으면 기본 60분
JWT_EXPIRE_MINUTES = int(os.getenv("JWT_EXPIRE_MINUTES", "60"))


def hash_password(plain_password: str) -> str:
    """
    평문 비밀번호를 bcrypt 해시로 변환합니다.

    Parameters
    ----------
    plain_password : str
        사용자가 입력한 원본 비밀번호

    Returns
    -------
    str
        bcrypt로 해시된 비밀번호 문자열
    """
    return pwd_context.hash(plain_password)


def verify_password(plain_password: str, hashed_password: str) -> bool:
    """
    평문 비밀번호가 해시된 비밀번호와 일치하는지 검증합니다.

    Parameters
    ----------
    plain_password : str
        사용자가 입력한 원본 비밀번호
    hashed_password : str
        DB에 저장된 bcrypt 해시 비밀번호

    Returns
    -------
    bool
        비밀번호 일치 여부 (True: 일치, False: 불일치)
    """
    return pwd_context.verify(plain_password, hashed_password)


def create_access_token(subject: str, extra_claims: Optional[Dict[str, Any]] = None) -> str:
    """
    JWT 액세스 토큰을 생성합니다.

    Parameters
    ----------
    subject : str
        토큰의 주체(sub) 클레임으로 보통 사용자 ID나 이메일 사용
    extra_claims : Optional[Dict[str, Any]], optional
        기본 클레임 외 추가로 포함할 정보 (기본값: None)

    Returns
    -------
    str
        서명된 JWT 토큰 문자열
    """
    now = datetime.now(timezone.utc)  # UTC 현재 시각
    expire = now + timedelta(minutes=JWT_EXPIRE_MINUTES)  # 만료 시각 계산

    # JWT 페이로드(클레임) 기본값 설정
    to_encode: Dict[str, Any] = {
        "sub": subject,                    # 토큰 주체
        "iat": int(now.timestamp()),      # 발급 시각(Unix timestamp)
        "exp": int(expire.timestamp()),   # 만료 시각(Unix timestamp)
    }

    # 추가 클레임이 있으면 병합
    if extra_claims:
        to_encode.update(extra_claims)

    # JWT 토큰 생성 (HS256 알고리즘으로 서명)
    token = jwt.encode(to_encode, JWT_SECRET, algorithm=JWT_ALGORITHM)
    return token


def decode_token(token: str) -> Dict[str, Any]:
    """
    JWT 토큰을 디코딩하고 서명과 만료를 검증합니다.

    Parameters
    ----------
    token : str
        클라이언트로부터 받은 JWT 토큰 문자열

    Returns
    -------
    Dict[str, Any]
        디코딩된 JWT 페이로드(클레임) 사전

    Raises
    ------
    jose.JWTError
        서명 검증 실패 또는 토큰 만료 시 발생
    """
    return jwt.decode(token, JWT_SECRET, algorithms=[JWT_ALGORITHM])