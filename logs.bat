@echo off
chcp 65001 >nul
echo 📋 Pium 프로젝트 로그 모니터링
echo ================================
echo.

REM 실행 중인 컨테이너 확인
docker-compose ps | findstr "Up" >nul 2>&1
if %errorlevel% neq 0 (
    echo ❌ 실행 중인 컨테이너가 없습니다.
    echo 먼저 'start.bat'로 서비스를 시작해주세요.
    pause
    exit /b 1
)

echo 🔍 로그를 볼 서비스를 선택하세요:
echo 1) Frontend 로그
echo 2) Backend 로그
echo 3) 모든 서비스 로그
echo 4) 특정 서비스 로그 (직접 입력)
echo.

set /p choice="선택 (1-4): "

if "%choice%"=="1" (
    echo 🌐 Frontend 로그를 보여줍니다...
    docker-compose logs frontend
) else if "%choice%"=="2" (
    echo 🔧 Backend 로그를 보여줍니다...
    docker-compose logs backend
) else if "%choice%"=="3" (
    echo 📊 모든 서비스 로그를 보여줍니다...
    docker-compose logs
) else if "%choice%"=="4" (
    echo 📝 사용 가능한 서비스:
    docker-compose ps --services
    echo.
    set /p service_name="서비스 이름을 입력하세요: "
    docker-compose ps | findstr "%service_name%" >nul 2>&1
    if %errorlevel% equ 0 (
        echo 📋 %service_name% 로그를 보여줍니다...
        docker-compose logs -f %service_name%
    ) else (
        echo ❌ '%service_name%' 서비스를 찾을 수 없습니다.
        pause
    )
) else (
    echo ❌ 잘못된 선택입니다.
    pause
    exit /b 1
) 