from datetime import datetime
from typing import Optional
from app.models.inquiry import Inquiry
from sqlalchemy.orm import Session

class InquiryRepository:
    def __init__(self, db: Session):
        self.db = db

    def create(self, user_id: int, question: str) -> Inquiry:
        inquiry = Inquiry(user_id=user_id, question=question)
        self.db.add(inquiry)
        self.db.commit()
        self.db.refresh(inquiry)
        return inquiry

    def get_by_id(self, inquiry_id: int) -> Optional[Inquiry]:
        return self.db.query(Inquiry).filter(Inquiry.id == inquiry_id).first()

    def add_answer(self, inquiry_id: int, answer: str) -> Optional[Inquiry]:
        inquiry = self.get_by_id(inquiry_id)
        if inquiry:
            inquiry.answer = answer
            inquiry.answered_at = datetime.utcnow()
            self.db.commit()
            self.db.refresh(inquiry)
        return inquiry
