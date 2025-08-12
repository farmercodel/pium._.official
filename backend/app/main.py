from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.exc import OperationalError
from time import sleep
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.exc import OperationalError
from time import sleep
from app.util.database import Base, engine, SessionLocal
from app.controller.auth_controller import router as auth_router
# from app.controller.admin_controller import router as admin_router # 관리자 승인 로직 제거로 주석 처리
from app.service.auth_service import AuthService
from app.repository.user_repository import UserRepository

# 예시로 user_controller import (실제로 있으면)
# from app.controller.user_controller import router as user_router

app = FastAPI(title="Pium API", version="1.0.0")

# CORS 미들웨어 설정
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # 운영환경에선 특정 도메인으로 제한 권장
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# 라우터 등록
app.include_router(auth_router)
# app.include_router(admin_router) # 관리자 승인 로직 제거로 주석 처리
# app.include_router(user_router)  # user_router가 있으면 이렇게 추가

@app.on_event("startup")
def on_startup_create_tables_with_retry():
    """
    앱 시작 시 DB 테이블 생성 (DB 준비 안됐으면 재시도) 및 관리자 계정 생성
    """
    max_attempts = 10
    for attempt in range(1, max_attempts + 1):
        try:
            Base.metadata.create_all(bind=engine)
            print("✅ DB 테이블 생성 완료")
            
            # 관리자 계정 생성 로직
            db = SessionLocal()
            try:
                user_repo = UserRepository(db)
                admin_user = user_repo.get_by_email("admin")
                if not admin_user:
                    auth_service = AuthService(db)
                    auth_service.register_user(email="admin", password="admin", is_admin=True)
                    print("✅ 관리자 계정(admin) 생성 완료")
            finally:
                db.close()

            break
        except OperationalError:
            if attempt == max_attempts:
                raise
            print(f"DB 연결 실패, 재시도 {attempt}/{max_attempts} (2초 대기)")
            sleep(2)

@app.get("/")
async def root():
    return {"message": "Pium API에 오신 것을 환영합니다!"}

@app.get("/health")
async def health_check():
    return {"status": "healthy"}

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)