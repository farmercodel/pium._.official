from fastapi import APIRouter, Depends, File, Form, HTTPException, UploadFile
from sqlalchemy.orm import Session
from typing import List, Optional

from app.util.database import get_db
from app.models.inquiry import Inquiry
from app.models.user import User
from app.schemas.inquiry_schemas import InquiryCreate, InquiryAnswer, InquiryResponse
from app.repository.inquiry_repo import InquiryRepository
from app.api.auth import get_current_user
from app.repository.inquiriy_file_repo import InquiryFileRepository  # 로그인 유저 가져오기

router = APIRouter(prefix="/inquiries", tags=["Inquiries"])

# 문의 생성 (로그인 선택)
@router.post("/", response_model=InquiryResponse)
async def create_inquiry(
    question: str = Form(...),
    files: List[UploadFile] = File([]),
    db: Session = Depends(get_db),
    current_user: Optional[User] = Depends(get_current_user)
):
    user_id = current_user.id if current_user else None
    inquiry_repo = InquiryRepository(db)
    file_repo = InquiryFileRepository(db)

    # 1) 문의 생성
    inquiry = inquiry_repo.create(user_id=user_id, question=question)

    # 2) 파일 업로드 처리
    uploaded_files = []
    for f in files:
        # 여기서 실제 서버나 S3 등에 업로드 후 url 생성
        url = f"/uploads/{f.filename}"  # 예시, 실제 URL은 업로드 위치에 따라 달라짐
        uploaded_files.append(file_repo.create(
            inquiry_id=inquiry.id,
            filename=f.filename,
            content_type=f.content_type,
            size=f.spool_max_size,
            url=url
        ))

    return {
        "inquiry_id": inquiry.id,
        "question": inquiry.question,
        "files": [{"filename": f.filename, "url": f.url} for f in uploaded_files]
    }

# 문의 목록 조회
@router.get("/", response_model=List[InquiryResponse])
def list_inquiries(db: Session = Depends(get_db)):
    inquiries = db.query(Inquiry).all()
    return inquiries

# 답변 작성 (관리자만 가능)
@router.post("/{inquiry_id}/answer", response_model=InquiryResponse)
def answer_inquiry(
    inquiry_id: int,
    body: InquiryAnswer,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    if not current_user.is_admin:
        raise HTTPException(status_code=403, detail="관리자만 답변할 수 있습니다.")
    
    repo = InquiryRepository(db)
    inquiry = repo.add_answer(inquiry_id, body.answer)
    
    if not inquiry:
        raise HTTPException(status_code=404, detail="해당 문의를 찾을 수 없습니다.")
    
    return inquiry
