"""
데이터베이스 초기화 및 세션 관리 유틸리티

주요 기능
---------
1. PostgreSQL 연결을 위해 SQLAlchemy 엔진과 세션팩토리(SessionLocal)를 생성
2. 모든 ORM 모델이 상속할 Base 클래스 제공
3. FastAPI 의존성으로 사용 가능한 `get_db()` 함수 제공
4. 환경변수 DATABASE_URL을 사용하여 DB 연결정보 설정
   - 기본값: docker-compose에서 사용하는 PostgreSQL 컨테이너 주소
5. pool_pre_ping 활성화 → 연결이 오래되면 자동으로 재연결
"""

from __future__ import annotations

import os
from typing import Generator

from sqlalchemy import create_engine
from sqlalchemy.orm import declarative_base, sessionmaker, Session


# -------------------------
# DB 접속 URL 설정
# -------------------------
# 환경변수 DATABASE_URL이 있으면 그 값 사용, 없으면 디폴트(postgres@db:5432/pium) 사용
DATABASE_URL: str = os.getenv(
    "DATABASE_URL",
    "postgresql+psycopg2://postgres:postgres@db:5432/pium",
)

# -------------------------
# SQLAlchemy 엔진 생성
# -------------------------
# pool_pre_ping=True → DB 커넥션이 오래되어 끊겼는지 미리 체크, 필요시 재연결
engine = create_engine(DATABASE_URL, pool_pre_ping=True)

# -------------------------
# 세션 팩토리(SessionLocal) 생성
# -------------------------
# autocommit=False → commit을 명시적으로 해야 함
# autoflush=False → flush 자동 실행 방지 (성능/트랜잭션 제어 목적)
# bind=engine → 위에서 만든 엔진을 사용
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

# -------------------------
# ORM Base 클래스
# -------------------------
# 모든 모델 클래스(User, Product 등)는 Base를 상속받아 테이블 메타데이터를 공유
Base = declarative_base()


# -------------------------
# FastAPI 의존성 - DB 세션 제공
# -------------------------
def get_db() -> Generator[Session, None, None]:
    """
    요청 단위로 SQLAlchemy 세션을 생성하여 제공.

    Yields
    -----
    Session
        SQLAlchemy 세션 객체.
        `Depends(get_db)`로 라우터에 주입 가능.

    동작 방식
    ----------
    1. SessionLocal()을 호출해 세션 인스턴스 생성
    2. yield로 반환 → 라우터에서 DB 작업 수행
    3. 요청이 끝나면 finally 블록에서 세션을 닫아 커넥션 반환
    """
    db: Session = SessionLocal()
    try:
        yield db
    finally:
        db.close()