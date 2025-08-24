@echo off
chcp 65001 >nul
echo 🚀 Pium 프로젝트를 시작합니다...

REM Docker Compose가 실행 중인지 확인
docker-compose ps | findstr "Up" >nul 2>&1
if %errorlevel% equ 0 (
    echo ⚠️  이미 실행 중인 컨테이너가 있습니다.
    echo 기존 컨테이너를 중지하고 새로 시작하시겠습니까? (y/n)
    set /p response=
    if /i "%response%"=="y" (
        echo 🛑 기존 컨테이너를 중지합니다...
        docker-compose down
    ) else (
        echo ❌ 시작을 취소했습니다.
        pause
        exit /b 1
    )
)

REM Docker Compose로 서비스 시작
echo 🐳 Docker Compose로 서비스를 시작합니다...
docker-compose up -d

REM 서비스 상태 확인
echo 📊 서비스 상태를 확인합니다...
timeout /t 5 /nobreak >nul
docker-compose ps

echo.
echo ✅ Pium 프로젝트가 성공적으로 시작되었습니다!
echo 🌐 Frontend: http://localhost:5173
echo 🔧 Backend: http://localhost:8000
echo 📚 Backend API 문서: http://localhost:8000/docs
echo.
echo 🛑 서비스를 중지하려면 'stop.bat'를 실행하세요.
pause 