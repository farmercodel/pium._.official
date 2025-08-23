# backend\app\main.py
import os
import asyncio
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.exc import OperationalError
from app.api import generate_ad, instagram, files, compose
from app.db.database import init_models
from app.util.database import Base, engine, SessionLocal
from app.api.auth_controller import router as auth_router
from app.services.auth_service import AuthService
from app.repository.user_repository import UserRepository
from app.api.tosspayments import router as toss_router
from app.api.inquiries import router as inquiries_router

app = FastAPI(title="Pium API", version="1.0.0")

origins = [
    "http://localhost:5173", "http://127.0.0.1:5173"
]

# CORS 미들웨어 설정
app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,  
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

def _seed_sync_with_retry():
    """
    sync 엔진으로 테이블 생성 + 관리자 계정 생성 (재시도 포함)
    FastAPI 이벤트 루프를 막지 않으려고 run_in_executor로 호출함.
    """
    max_attempts = 10
    for attempt in range(1, max_attempts + 1):
        try:
            # 테이블 생성
            Base.metadata.create_all(bind=engine)
            print("(sync) DB 테이블 생성 완료")

            # 관리자 계정 시드
            db = SessionLocal()
            try:
                user_repo = UserRepository(db)
                admin_user = user_repo.get_by_email("admin")
                if not admin_user:
                    auth_service = AuthService(db)
                    auth_service.ensure_admin_seed()
                    print("(sync) 관리자 계정(admin) 생성 완료")
            finally:
                db.close()

            break
        except OperationalError as e:
            if attempt == max_attempts:
                print("DB 연결 실패: 재시도 한도 초과")
                raise
            print(f"DB 연결 실패, 재시도 {attempt}/{max_attempts} (2초 대기) - {e}")
            import time
            time.sleep(2)

@app.on_event("startup")
async def on_startup():
    await init_models()
    print("(async) init_models 완료")

    loop = asyncio.get_running_loop()
    await loop.run_in_executor(None, _seed_sync_with_retry)

@app.get("/")
async def root():
    return {"message": "Pium API에 오신 것을 환영합니다!"}

@app.get("/health")
async def health_check():
    return {"status": "healthy"}

app.include_router(auth_router)
app.include_router(files.router, prefix="/api", tags=["files"])
app.include_router(generate_ad.router, prefix="/api", tags=["GPT"])
app.include_router(instagram.router, prefix="/api", tags=["instagram"])
app.include_router(compose.router, prefix="/api", tags=["compose"])
app.include_router(toss_router, prefix="/api")
app.include_router(inquiries_router, prefix="/api")

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
