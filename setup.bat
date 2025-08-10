@echo off
chcp 65001 >nul
echo 🚀 Pium 프로젝트 초기 설정을 시작합니다...
echo ==========================================
echo.

REM 실행 권한 설정 (윈도우에서는 필요 없음)
echo 📝 윈도우 환경 설정을 확인합니다...

REM Docker 설치 확인
echo 🐳 Docker 설치 상태를 확인합니다...
docker --version >nul 2>&1
if %errorlevel% neq 0 (
    echo ❌ Docker가 설치되지 않았습니다.
    echo Docker Desktop을 설치해주세요: https://www.docker.com/products/docker-desktop/
    pause
    exit /b 1
)

docker-compose --version >nul 2>&1
if %errorlevel% neq 0 (
    echo ❌ Docker Compose가 설치되지 않았습니다.
    echo Docker Compose를 설치해주세요.
    pause
    exit /b 1
)

echo ✅ Docker 및 Docker Compose가 설치되어 있습니다.

REM Docker 서비스 시작 확인
echo 🔄 Docker 서비스를 시작합니다...
docker info >nul 2>&1
if %errorlevel% neq 0 (
    echo ⚠️  Docker 서비스가 시작되지 않았습니다.
    echo Docker Desktop을 실행해주세요.
    pause
    exit /b 1
)

echo ✅ Docker 서비스가 정상적으로 실행 중입니다.

REM 프로젝트 시작
echo.
echo 🎯 프로젝트를 시작합니다...
call start.bat

echo.
echo 🎉 초기 설정이 완료되었습니다!
echo.
echo 📋 사용 가능한 명령어:
echo   start.bat    - 프로젝트 시작
echo   stop.bat     - 프로젝트 중지
echo   logs.bat     - 로그 보기
echo   setup.bat    - 초기 설정 (재실행)
echo.
pause 