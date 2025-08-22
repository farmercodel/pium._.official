from datetime import datetime, timezone;
from pytest import Session
from backend.app.models.inquiry import Inquiry


class InquiryRepository:
    def __init__(self, db: Session):
        self.db = db

    def create_inquiry(self, user_id: int, question: str):
        inquiry = Inquiry(user_id=user_id, question=question)
        self.db.add(inquiry)
        self.db.commit()
        self.db.refresh(inquiry)
        return inquiry

    def get_by_id(self, inquiry_id: int):
        return self.db.query(Inquiry).filter(Inquiry.id == inquiry_id).first()

    def add_answer(self, inquiry_id: int, answer: str):
        inquiry = self.get_by_id(inquiry_id)
        if inquiry:
            inquiry.answer = answer
            inquiry.answered_at = datetime.now(timezone.utc)
            self.db.commit()
            self.db.refresh(inquiry)
        return inquiry
