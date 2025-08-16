import os
from typing import Generator
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker, Session

from app.models.base import Base

SYNC_DATABASE_URL = os.getenv("SYNC_DATABASE_URL")
if not SYNC_DATABASE_URL:
    db_url = os.getenv("DATABASE_URL", "postgresql+psycopg2://postgres:postgres@db:5432/pium")
    SYNC_DATABASE_URL = db_url.replace("+asyncpg", "+psycopg2")

engine = create_engine(SYNC_DATABASE_URL, pool_pre_ping=True, future=True)
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

def get_db() -> Generator[Session, None, None]:
    db: Session = SessionLocal()
    try:
        yield db
    finally:
        db.close()
