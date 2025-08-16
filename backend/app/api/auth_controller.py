"""
인증/인가 엔드포인트 라우터

제공 API:
- POST /api/auth/register: 회원가입
- POST /api/auth/login: 로그인
- GET /api/auth/me: 현재 로그인한 사용자 정보 확인

요청/응답 스키마는 Pydantic 모델로 정의합니다.
"""

from __future__ import annotations

# FastAPI 관련 모듈
from fastapi import APIRouter, Depends, HTTPException, status
from pydantic import BaseModel, EmailStr, Field
from typing import Optional
from sqlalchemy.orm import Session

# 내부 서비스, 유틸
from app.services.auth_service import AuthService           # 회원가입/로그인 로직을 처리하는 서비스 계층
from app.util.database import get_db                       # DB 세션 주입 함수
from app.api.auth import get_current_user                 # JWT 토큰으로 현재 사용자 정보 가져오는 함수

# ----------------------
# 라우터 생성
# prefix="/api/auth" → 모든 엔드포인트 URL 앞에 붙는 경로
# tags=["auth"] → Swagger 문서에서 그룹화 이름
# ----------------------
router = APIRouter(prefix="/api/auth", tags=["auth"])

# ----------------------
# 요청(Request) / 응답(Response) 모델 정의
# ----------------------

class RegisterRequest(BaseModel):
    """회원가입 요청 데이터"""
    email: EmailStr = Field(..., description="로그인에 사용할 이메일")  # 필수 이메일
    password: str = Field(..., min_length=8, description="8자 이상 비밀번호")  # 8자 이상
    business_registration_number: Optional[str] = Field(
        None, description="사업자등록증 번호 (일반 사용자 필수)"
    )  # 사업자 회원만 해당, 일반 회원도 필요 시 입력
    start_dt: str = Field(..., description="개업일자 (YYYYMMDD)")
    p_nm: str = Field(..., description="대표자 성명")


class AuthResponse(BaseModel):
    """회원가입 / 로그인 성공 시 응답 데이터"""
    user_id: int             # 생성되거나 로그인된 사용자 ID
    access_token: str        # JWT 액세스 토큰
    token_type: str = "bearer"  # 토큰 타입 (Bearer 고정)


class LoginRequest(BaseModel):
    """로그인 요청 데이터"""
    email: EmailStr
    password: str


# ----------------------
# 회원가입 API
# ----------------------
@router.post("/register", response_model=AuthResponse, status_code=status.HTTP_201_CREATED)
def register(payload: RegisterRequest, db: Session = Depends(get_db)) -> AuthResponse:
    """
    회원가입 엔드포인트.

    동작:
    1. 이메일 중복 여부 확인
    2. 비밀번호 해시 저장
    3. 사용자 생성 후 JWT 발급

    실패:
    - 이메일 중복이면 400 Bad Request 반환
    """
    service = AuthService(db)
    try:
        # AuthService를 통해 회원가입 처리 → user_id와 토큰 반환
        user_id, token = service.register_user(
            email=payload.email,
            password=payload.password,
            business_registration_number=payload.business_registration_number,
            start_dt=payload.start_dt,
            p_nm=payload.p_nm
        )
    except ValueError as e:
        # 서비스 로직에서 예외 발생 시 HTTP 400 반환
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail=str(e))

    return AuthResponse(user_id=user_id, access_token=token)


# ----------------------
# 로그인 API
# ----------------------
@router.post("/login", response_model=AuthResponse)
def login(payload: LoginRequest, db: Session = Depends(get_db)) -> AuthResponse:
    """
    로그인 엔드포인트.

    동작:
    1. 이메일 존재 여부 확인
    2. 비밀번호 검증 (해시 비교)
    3. JWT 발급

    실패:
    - 이메일 또는 비밀번호 불일치 시 400 Bad Request 반환
    """
    service = AuthService(db)
    try:
        user_id, token = service.login(email=payload.email, password=payload.password)
    except ValueError as e:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail=str(e))

    return AuthResponse(user_id=user_id, access_token=token)


# ----------------------
# 현재 사용자 정보 조회 API
# ----------------------
class MeResponse(BaseModel):
    """현재 사용자 정보 응답 모델"""
    id: int
    email: EmailStr
    is_active: bool


@router.get("/me", response_model=MeResponse)
def get_me(user=Depends(get_current_user)) -> MeResponse:
    """
    현재 로그인된 사용자 정보 반환 (JWT 필요).

    - 헤더에 Authorization: Bearer <토큰> 필수
    - 토큰이 유효하면 user 객체를 주입받아 응답
    """
    return MeResponse(id=user.id, email=user.email, is_active=user.is_active)