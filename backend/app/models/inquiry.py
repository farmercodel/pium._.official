from datetime import datetime, timezone
from app.models.base import Base
from sqlalchemy.orm import relationship
from sqlalchemy import Column, DateTime, ForeignKey, Integer, Text


class Inquiry(Base):
    __tablename__ = "inquiries"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=True)
    question = Column(Text, nullable=False)
    answer = Column(Text, nullable=True)  # 관리자가 답변 달면 저장됨
    created_at = Column(DateTime, default=lambda: datetime.now(timezone.utc))
    answered_at = Column(DateTime, nullable=True)

    user = relationship("User", back_populates="inquiries")
    files = relationship("InquiryFile", back_populates="inquiry")