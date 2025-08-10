#!/bin/bash

echo "🚀 Pium 프로젝트를 시작합니다..."

# Docker Compose가 실행 중인지 확인
if docker-compose ps | grep -q "Up"; then
    echo "⚠️  이미 실행 중인 컨테이너가 있습니다."
    echo "기존 컨테이너를 중지하고 새로 시작하시겠습니까? (y/n)"
    read -r response
    if [[ "$response" =~ ^[Yy]$ ]]; then
        echo "🛑 기존 컨테이너를 중지합니다..."
        docker-compose down
    else
        echo "❌ 시작을 취소했습니다."
        exit 1
    fi
fi

# Docker Compose로 서비스 시작
echo "🐳 Docker Compose로 서비스를 시작합니다..."
docker-compose up -d

# 서비스 상태 확인
echo "📊 서비스 상태를 확인합니다..."
sleep 5
docker-compose ps

echo ""
echo "✅ Pium 프로젝트가 성공적으로 시작되었습니다!"
echo "🌐 Frontend: http://localhost:3000"
echo "🔧 Backend: http://localhost:8000"
echo "📚 Backend API 문서: http://localhost:8000/docs"
echo ""
echo "🛑 서비스를 중지하려면 './stop.sh'를 실행하세요." 