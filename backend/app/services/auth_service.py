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

    def ensure_admin_seed(self) -> None:
        """
        앱 시작 시 'admin@gmail.com' 어드민 계정을 멱등하게 보장.
        이미 있으면 에러로 죽지 않고, 관리자 플래그만 보정합니다.
        """
        try:
            self.register_user(email="admin@gmail.com", password="admin", is_admin=True)
        except ValueError as e:
            if "이미 사용 중인 이메일" in str(e):
                # 필요하면 관리자 승격 보정
                u = self.user_repo.get_by_email("admin@gmail.com")
                if u and not u.is_admin:
                    u.is_admin = True
                    self.db.commit()
            else:
                raise

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

        existing = self.user_repo.get_by_email(email)
        if existing:
            raise ValueError("이미 사용 중인 이메일입니다.")

        # 개발/테스트에서 사업자 검증 스킵 옵션 (NTS_VALIDATE=false)
        validate_flag = os.getenv("NTS_VALIDATE", "true").lower() not in {"0", "false", "no"}

        if not is_admin:
            if not business_registration_number or business_registration_number.strip() == "":
                raise ValueError("사업자등록번호는 필수입니다.")
            if not start_dt or start_dt.strip() == "":
                raise ValueError("개업일자는 필수입니다.")
            if not p_nm or p_nm.strip() == "":
                raise ValueError("대표자 성명은 필수입니다.")

            if validate_flag:
                # 검증 실행
                nts_api_key = os.getenv("NTS_API_KEY")
                if not nts_api_key:
                    raise ValueError("NTS API 키가 설정되지 않았습니다. 환경 변수를 확인해주세요.")

                try:
                    verification_result = verify_business_registration(
                        business_no=business_registration_number,
                        start_date=start_dt,           # "YYYY-MM-DD" or "YYYYMMDD" 모두 허용되는 구현이라 가정
                        representative_name=p_nm,
                        api_key=nts_api_key,
                    )

                    if isinstance(verification_result, tuple):
                        ok, info = verification_result
                    else:
                        info = verification_result
                        ok = (info.get("valid") == "01")

                    if not ok:
                        msg = info.get("valid_msg") or info.get("message") or "유효하지 않은 사업자등록번호입니다."
                        raise ValueError(f"사업자등록번호 진위확인 실패: {msg}")

                    active_status = True  

                except Exception as e:
                    raise ValueError(f"사업자등록번호 검증 중 오류 발생: {e}")
            else:
                active_status = True
        else:
            active_status = True

        hashed = hash_password(password)
        user = self.user_repo.create(
            email=email,
            hashed_password=hashed,
            is_admin=is_admin,
            business_registration_number=business_registration_number,
            is_active=active_status,
        )
        token = create_access_token(subject=str(user.id), extra_claims={"email": user.email})
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