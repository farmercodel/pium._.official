"""
UserRepository: 사용자 조회/생성 등 데이터 접근 계층
"""

from __future__ import annotations
from typing import Optional
from sqlalchemy.orm import Session
from app.models.user import User


class UserRepository:
    """
    사용자(User) 엔터티에 대한 **데이터 접근 레이어(Repository)**.

    - 서비스(Service) 계층은 직접 DB 세션을 다루지 않고,
      이 레포지토리를 통해 데이터 CRUD 작업을 수행합니다.
    - 이로 인해 DB 접근 로직과 비즈니스 로직이 분리되어 유지보수성이 향상됩니다.
    """

    def __init__(self, db: Session):
        # SQLAlchemy DB 세션 주입
        self.db = db

    def get_by_email(self, email: str) -> Optional[User]:
        """
        이메일로 사용자 조회.
        - 주로 로그인, 회원가입 시 중복 체크 등에 사용.
        - 존재하지 않으면 None 반환.
        """
        return self.db.query(User).filter(User.email == email).first()

    def get_by_id(self, user_id: int) -> Optional[User]:
        """
        사용자 ID로 조회.
        - 주로 특정 사용자 정보 확인/관리자 승인 등에 사용.
        - 존재하지 않으면 None 반환.
        """
        return self.db.query(User).filter(User.id == user_id).first()

    def create(
        self,
        email: str,
        hashed_password: str,
        is_admin: bool = False,
        business_registration_number: Optional[str] = None,
        is_active: bool = False
    ) -> User:
        """
        새로운 사용자 생성 후 DB에 저장.

        Parameters
        ----------
        - email: 사용자 이메일 (중복 불가)
        - hashed_password: 암호화된 비밀번호 (bcrypt 등)
        - is_admin: 관리자 여부 (기본 False)
        - business_registration_number: 사업자등록번호 (선택)
        - is_active: 계정 활성화 여부 (기본 False)

        Returns
        -------
        - 생성된 User 객체
        """
        user = User(
            email=email,
            hashed_password=hashed_password,
            is_admin=is_admin,
            business_registration_number=business_registration_number,
            is_active=is_active
        )
        self.db.add(user)    # INSERT 대기
        self.db.commit()     # 트랜잭션 커밋 (DB 반영)
        self.db.refresh(user)  # DB에서 최신 상태로 갱신 (id 값 등)
        return user

    