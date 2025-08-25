from sqlalchemy import Column, Integer, String, BigInteger, ForeignKey, TIMESTAMP
from sqlalchemy.orm import relationship
from app.models.base import Base

class InquiryFile(Base):
    __tablename__ = "inquiry_files"

    id = Column(Integer, primary_key=True, index=True)
    inquiry_id = Column(BigInteger, ForeignKey("inquiries.id", ondelete="CASCADE"), nullable=False)
    filename = Column(String(255), nullable=False)
    url = Column(String(1024), nullable=False)
    content_type = Column(String(100))
    size = Column(BigInteger)
    created_at = Column(TIMESTAMP, server_default="CURRENT_TIMESTAMP")

    inquiry = relationship("Inquiry", back_populates="files")
