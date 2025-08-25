from requests import Session
from app.models.inquiry_file import InquiryFile


class InquiryFileRepository:
    def __init__(self, db: Session):
        self.db = db

    def create(self, inquiry_id: int, filename: str, content_type: str, size: int, url: str) -> InquiryFile:
        file = InquiryFile(
            inquiry_id=inquiry_id,
            filename=filename,
            content_type=content_type,
            size=size,
            url=url
        )
        self.db.add(file)
        self.db.commit()
        self.db.refresh(file)
        return file