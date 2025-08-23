from datetime import datetime
from typing import Optional
from pydantic import BaseModel


class InquiryCreate(BaseModel):
    question: str

class InquiryResponse(BaseModel):
    id: int
    user_id: int
    question: str
    answer: Optional[str] = None
    created_at: datetime
    answered_at: Optional[datetime] = None

    model_config = {
        "from_attributes": True
    }

class InquiryAnswer(BaseModel):
    answer: str
