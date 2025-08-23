"""
User 모델 정의

- 이메일(email)을 **유니크 키**로 사용 → 동일 이메일 중복 가입 방지
- 비밀번호는 평문이 아닌 **bcrypt 해시 문자열**로 저장 (보안 필수)
- 관리자 여부, 계정 활성화 여부를 boolean 값으로 관리
"""

from __future__ import annotations

from datetime import datetime, timezone
from typing import Optional

# SQLAlchemy 타입
from sqlalchemy import String, DateTime, Boolean
from sqlalchemy.orm import Mapped, mapped_column

# 프로젝트 공용 Base 클래스 (SQLAlchemy Declarative Base)
from app.util.database import Base

from sqlalchemy.orm import relationship


class User(Base):
    """
    `users` 테이블에 매핑되는 SQLAlchemy ORM 모델.
    """
    __tablename__ = "users"  # DB 실제 테이블 이름

    # 기본 키 (PK), 자동 증가 ID
    id: Mapped[int] = mapped_column(
        primary_key=True,    # PK 설정
        index=True           # 조회 성능 향상을 위해 인덱스 생성
    )

    # 사용자 이메일 (로그인 ID 역할)
    email: Mapped[str] = mapped_column(
        String(255),         # 최대 255자 문자열
        unique=True,         # 이메일 중복 가입 방지
        index=True,          # 검색 성능 향상
        nullable=False       # NULL 불가 (필수 값)
    )

    # 비밀번호 해시 (bcrypt 등으로 해싱된 문자열)
    hashed_password: Mapped[str] = mapped_column(
        String(255),
        nullable=False       # 반드시 있어야 함
    )

    # 계정 활성화 여부
    # - 회원가입 시 False → 관리자가 승인하면 True
    is_active: Mapped[bool] = mapped_column(
        Boolean,
        default=False         # 기본값 비활성화
    )

    # 관리자 권한 여부
    # - True면 관리자 API 접근 가능
    is_admin: Mapped[bool] = mapped_column(
        Boolean,
        default=False,        # 파이썬 레벨 기본값
        server_default="false" # DB 레벨 기본값 (문자열 형태로 저장됨)
    )

    # 사업자등록번호 (일반 유저는 선택, 사업자 유저는 필수일 수 있음)
    business_registration_number: Mapped[Optional[str]] = mapped_column(
        String(255),
        nullable=True         # 필수 아님
    )

    # 생성 일시 (UTC)
    created_at: Mapped[datetime] = mapped_column(
        DateTime,
        default=lambda: datetime.now(timezone.utc)  # 객체 생성 시 현재 UTC 시간 기록
    )

    # 수정 일시 (UTC)
    updated_at: Mapped[datetime] = mapped_column(
        DateTime,
        default=lambda: datetime.now(timezone.utc), # 최초 생성 시 현재 시간
        onupdate=lambda: datetime.now(timezone.utc) # 업데이트 시 시간 갱신
    )