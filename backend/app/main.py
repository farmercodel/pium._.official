# backend\app\main.py
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.api import generate_ad, instagram, files
from fastapi.staticfiles import StaticFiles
import os

app = FastAPI(title="Pium API", version="1.0.0")

# CORS 미들웨어 설정
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # 프로덕션에서는 특정 도메인 제한
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/")
async def root():
    return {"message": "Pium API에 오신 것을 환영합니다!"}

@app.get("/health")
async def health_check():
    return {"status": "healthy"}


# 정적 파일 경로 (로컬)
MEDIA_ROOT = os.getenv("MEDIA_ROOT", r"F:/pium._.official/backend/app/img")
os.makedirs(MEDIA_ROOT, exist_ok=True)

# /img 경로로 정적 서빙
app.mount("/img", StaticFiles(directory=MEDIA_ROOT), name="img")

# 라우터
app.include_router(files.router, prefix="/api", tags=["files"])
app.include_router(generate_ad.router, prefix="/api", tags=["GPT"])
app.include_router(instagram.router, prefix="/api", tags=["instagram"])

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
