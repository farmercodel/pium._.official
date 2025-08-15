"""
AuthService: 회원가입/로그인 비즈니스 로직
"""

from __future__ import annotations
from typing import Tuple, Optional
import os

from sqlalchemy.orm import Session

from app.repository.user_repository import UserRepository
from app.util.security import hash_password, verify_password, create_access_token
from app.util.business_verification import verify_business_registration


class AuthService:
    """
    인증/인가 관련 비즈니스 로직을 처리하는 서비스 레이어.

    - DB 접근은 UserRepository를 통해 수행 (직접 ORM 쿼리하지 않음)
    - 회원가입, 로그인, 관리자 승인 등 핵심 기능을 담당
    """

    def __init__(self, db: Session):
        # DB 세션 주입 및 UserRepository 초기화
        self.db = db
        self.user_repo = UserRepository(db)

    # -------------------------------
    # 회원가입
    # -------------------------------
    def register_user(
        self,
        email: str,
        password: str,
        is_admin: bool = False,
        business_registration_number: Optional[str] = None,
        start_dt: Optional[str] = None,
        p_nm: Optional[str] = None
    ) -> Tuple[int, str]:
        """
        새로운 사용자를 생성하고, 즉시 JWT 액세스 토큰을 발급.

        Parameters
        ----------
        - email: 로그인용 이메일
        - password: 평문 비밀번호 (함수 내부에서 해싱)
        - is_admin: 관리자 여부
        - business_registration_number: 사업자등록번호 (일반 사용자 필수)
        - start_dt: 개업일자 (YYYYMMDD 형식, 일반 사용자 필수)
        - p_nm: 대표자 성명 (일반 사용자 필수)

        Returns
        -------
        (user_id, access_token) 튜플
        """
        # 1. 이메일 중복 체크
        existing = self.user_repo.get_by_email(email)
        if existing:
            raise ValueError("이미 사용 중인 이메일입니다.")

        # 2. 일반 사용자는 사업자등록번호, 개업일자, 대표자 성명 필수
        if not is_admin:
            if not business_registration_number or business_registration_number.strip() == "":
                raise ValueError("사업자등록번호는 필수입니다.")
            if not start_dt or start_dt.strip() == "":
                raise ValueError("개업일자는 필수입니다.")
            if not p_nm or p_nm.strip() == "":
                raise ValueError("대표자 성명은 필수입니다.")

            # 2-1. 국세청 API를 통한 사업자등록번호 진위확인
            nts_api_key = os.getenv("NTS_API_KEY")
            if not nts_api_key:
                raise ValueError("NTS API 키가 설정되지 않았습니다. 환경 변수를 확인해주세요.")
            
            try:
                verification_result = verify_business_registration(
                    business_no=business_registration_number,
                    start_date=start_dt,
                    representative_name=p_nm,
                    api_key=nts_api_key
                )
                
                if verification_result.get('valid') == '01':
                    active_status = True  # 검증 성공 시 즉시 활성화
                else:
                    # API 응답에서 유효하지 않다고 판단한 경우
                    valid_msg = verification_result.get('valid_msg', '알 수 없는 오류')
                    raise ValueError(f"사업자등록번호 진위확인 실패: {valid_msg}")

            except Exception as e:
                # API 호출 또는 응답 처리 중 오류 발생
                raise ValueError(f"사업자등록번호 검증 중 오류 발생: {e}")
        else:
            # 관리자는 즉시 활성화
            active_status = True

        # 3. 비밀번호 해싱
        hashed = hash_password(password)

        # 4. 사용자 생성 (DB 반영)
        user = self.user_repo.create(
            email=email,
            hashed_password=hashed,
            is_admin=is_admin,
            business_registration_number=business_registration_number,
            is_active=active_status
        )

        # 5. JWT 발급
        token = create_access_token(
            subject=str(user.id),
            extra_claims={"email": user.email}
        )

        return user.id, token

    

    # -------------------------------
    # 로그인
    # -------------------------------
    def login(self, email: str, password: str) -> Tuple[int, str]:
        """
        이메일과 비밀번호를 검증 후 JWT 액세스 토큰 발급.
        """
        # 1. 이메일로 사용자 조회
        user = self.user_repo.get_by_email(email)
        if not user:
            raise ValueError("이메일 또는 비밀번호가 올바르지 않습니다.")

        # 2. 비밀번호 검증 (bcrypt 등)
        if not verify_password(password, user.hashed_password):
            raise ValueError("이메일 또는 비밀번호가 올바르지 않습니다.")

        # 3. JWT 발급
        token = create_access_token(
            subject=str(user.id),
            extra_claims={"email": user.email}
        )

        return user.id, token