# app/models/ad.py
from sqlalchemy.orm import Mapped, mapped_column, relationship
from sqlalchemy import Integer, String, JSON, ForeignKey, Text, UniqueConstraint, func, DateTime
from datetime import datetime
from app.models.base import Base

from datetime import datetime
from sqlalchemy.orm import Mapped, mapped_column, relationship
from sqlalchemy import Integer, String, Text, JSON, ForeignKey, DateTime, func

from app.models.base import Base

class AdRequest(Base):
    __tablename__ = "ad_request"
    id: Mapped[int] = mapped_column(Integer, primary_key=True, autoincrement=True)
    user_id: Mapped[int] = mapped_column(Integer, index=True)
    payload: Mapped[dict] = mapped_column(JSON)
    created_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), server_default=func.now())

    variants: Mapped[list["AdVariant"]] = relationship(back_populates="request")

class AdVariant(Base):
    __tablename__ = "ad_variant"
    id: Mapped[str] = mapped_column(String(64), primary_key=True)
    request_id: Mapped[int] = mapped_column(ForeignKey("ad_request.id", ondelete="CASCADE"), index=True)
    index_no: Mapped[int] = mapped_column(Integer)
    content: Mapped[str] = mapped_column(Text)

    request: Mapped["AdRequest"] = relationship(back_populates="variants")

class AdSelection(Base):
    __tablename__ = "ad_selection"
    id: Mapped[int] = mapped_column(Integer, primary_key=True, autoincrement=True)
    user_id: Mapped[int] = mapped_column(Integer, unique=True, index=True) 
    variant_id: Mapped[str] = mapped_column(String(64))
    content: Mapped[str] = mapped_column(Text)