@echo off
chcp 65001 >nul
echo 🛑 Pium 프로젝트를 중지합니다...

REM Docker Compose로 서비스 중지
echo 🐳 Docker Compose로 서비스를 중지합니다...
docker-compose down

REM 모든 컨테이너가 중지되었는지 확인
docker-compose ps | findstr "Up" >nul 2>&1
if %errorlevel% equ 0 (
    echo ⚠️  일부 컨테이너가 여전히 실행 중입니다.
    echo 강제로 중지하시겠습니까? (y/n)
    set /p response=
    if /i "%response%"=="y" (
        echo 🔴 강제로 모든 컨테이너를 중지합니다...
        docker-compose down --remove-orphans
        docker system prune -f
    )
) else (
    echo ✅ 모든 서비스가 성공적으로 중지되었습니다.
)

echo.
echo 🔄 서비스를 다시 시작하려면 'start.bat'를 실행하세요.
pause 