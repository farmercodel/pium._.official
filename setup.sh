#!/bin/bash

echo "🚀 Pium 프로젝트 초기 설정을 시작합니다..."
echo "=========================================="
echo ""

# 실행 권한 부여
echo "📝 실행 권한을 설정합니다..."
chmod +x *.sh

# Docker 설치 확인
echo "🐳 Docker 설치 상태를 확인합니다..."
if ! command -v docker &> /dev/null; then
    echo "❌ Docker가 설치되지 않았습니다."
    echo "Docker Desktop을 설치해주세요: https://www.docker.com/products/docker-desktop/"
    exit 1
fi

if ! command -v docker-compose &> /dev/null; then
    echo "❌ Docker Compose가 설치되지 않았습니다."
    echo "Docker Compose를 설치해주세요."
    exit 1
fi

echo "✅ Docker 및 Docker Compose가 설치되어 있습니다."

# Docker 서비스 시작 확인
echo "🔄 Docker 서비스를 시작합니다..."
if ! docker info &> /dev/null; then
    echo "⚠️  Docker 서비스가 시작되지 않았습니다."
    echo "Docker Desktop을 실행해주세요."
    exit 1
fi

echo "✅ Docker 서비스가 정상적으로 실행 중입니다."

# 명령어 설명
echo ""
echo "🎉 초기 설정이 완료되었습니다!"
echo ""
echo "📋 사용 가능한 명령어:"
echo "  ./start.sh    - 프로젝트 시작"
echo "  ./stop.sh     - 프로젝트 중지"
echo "  ./logs.sh     - 로그 보기"
echo "  ./setup.sh    - 초기 설정 (재실행)" 