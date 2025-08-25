import os
from logging.config import fileConfig
from sqlalchemy import pool
from sqlalchemy.engine import Connection
from alembic import context

# --- 우리 앱 import (Base 로딩) ---
# 프로젝트 루트가 sys.path에 있어야 import가 됨
import sys
from pathlib import Path
sys.path.append(str(Path(__file__).resolve().parents[1]))  # backend/ 를 sys.path에 추가
from app.db.database import Base
import app.models.ad  # 모델 모듈 import해서 Base.metadata에 테이블 등록
import app.models.user
import app.models.inquiry
import app.models.inquiry_file

# 이 줄은 Alembic 기본 로깅
config = context.config
if config.config_file_name is not None:
    fileConfig(config.config_file_name)

# 마이그레이션 대상 메타데이터
target_metadata = Base.metadata

# DB URL은 환경변수에서
DATABASE_URL = os.getenv("DATABASE_URL")
if not DATABASE_URL:
    raise RuntimeError("DATABASE_URL env not set")

# --- Async run 설정 (SQLAlchemy 2.x) ---
from sqlalchemy.ext.asyncio import create_async_engine

def run_migrations_offline():
    context.configure(
        url=DATABASE_URL,
        target_metadata=target_metadata,
        literal_binds=True,
        dialect_opts={"paramstyle": "named"},
        include_schemas=True,
    )
    with context.begin_transaction():
        context.run_migrations()

def do_run_migrations(connection):
    context.configure(connection=connection, target_metadata=target_metadata, include_schemas=True)
    with context.begin_transaction():
        context.run_migrations()

async def run_migrations_online():
    connectable = create_async_engine(DATABASE_URL, poolclass=pool.NullPool)
    async with connectable.connect() as connection:
        await connection.run_sync(do_run_migrations)
    await connectable.dispose()

if context.is_offline_mode():
    run_migrations_offline()
else:
    import asyncio
    asyncio.run(run_migrations_online())
