# backend/app/db/database.py
import os
from sqlalchemy.ext.asyncio import AsyncSession, create_async_engine
from sqlalchemy.orm import sessionmaker

from app.models.base import Base

ASYNC_DATABASE_URL = os.getenv("ASYNC_DATABASE_URL") or os.getenv("DATABASE_URL")
if ASYNC_DATABASE_URL and "+asyncpg" not in ASYNC_DATABASE_URL:
    ASYNC_DATABASE_URL = ASYNC_DATABASE_URL.replace("+psycopg2", "+asyncpg")

engine = create_async_engine(
    ASYNC_DATABASE_URL,
    echo=False,
    future=True,
    connect_args={"server_settings": {"client_encoding": "UTF8"}},
)
AsyncSessionLocal = sessionmaker(engine, class_=AsyncSession, expire_on_commit=False)

async def init_models():
    from app.models.ad import AdRequest, AdVariant, AdSelection
    async with engine.begin() as conn:
        await conn.run_sync(Base.metadata.create_all)

async def get_session():
    async with AsyncSessionLocal() as session:
        yield session
