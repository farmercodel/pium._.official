from fastapi import APIRouter, UploadFile, File, Form
from fastapi.responses import JSONResponse
from typing import List

router = APIRouter()

@router.post("/contact")
async def create_contact(
    name: str = Form(...),
    message: str = Form(...),
    files: List[UploadFile] = File(default=[])
):
    print("이름:", name)
    print("메시지:", message)
    print("업로드 파일:", [f.filename for f in files])
    return JSONResponse({"success": True, "message": "문의 접수 완료"})
