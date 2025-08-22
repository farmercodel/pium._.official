from datetime import datetime
from typing import Optional
from openai import BaseModel


class InquiryCreate(BaseModel):
    question: str

class InquiryAnswer(BaseModel):
    answer: str

class InquiryResponse(BaseModel):
    id: int
    user_id: int
    question: str
    answer: Optional[str] = None
    created_at: datetime
    answered_at: Optional[datetime] = None

    class Config:
        orm_mode = True