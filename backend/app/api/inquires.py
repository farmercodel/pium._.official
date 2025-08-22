from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List

from app.db.database import get_session
from app.models.inquiry import Inquiry, User
from app.schemas.inquiry_schemas import InquiryCreate, InquiryAnswer, InquiryResponse
from app.repository.inquiry_repo import InquiryRepository
from app.api.auth import get_current_user  # 로그인 유저 가져오기

router = APIRouter(prefix="/inquiries", tags=["Inquiries"])

#문의 생성 API(사용자용)
@router.post("/", response_model=InquiryResponse)
def create_inquiry(
    inquiry: InquiryCreate,
    db: Session = Depends(get_session),
    current_user: User = Depends(get_current_user)
):
    repo = InquiryRepository(db)
    return repo.create_inquiry(user_id=current_user.id, question=inquiry.question)

#문의 목록 조회 API(사용자/관리자용)
@router.get("/", response_model=List[InquiryResponse])
def list_inquiries(db: Session = Depends(get_session)):
    inquiries = db.query(Inquiry).all()
    return inquiries

#답변 작성 API(관리자용))
@router.post("/{inquiry_id}/answer", response_model=InquiryResponse)
def answer_inquiry(
    inquiry_id: int,
    body: InquiryAnswer,
    db: Session = Depends(get_session),
    current_user: User = Depends(get_current_user)
):
    if not current_user.is_admin:
        raise HTTPException(status_code=403, detail="관리자만 답변할 수 있습니다.")
    
    repo = InquiryRepository(db)
    inquiry = repo.add_answer(inquiry_id, body.answer)
    
    if not inquiry:
        raise HTTPException(status_code=404, detail="해당 문의를 찾을 수 없습니다.")
    
    return inquiry