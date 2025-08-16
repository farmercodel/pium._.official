#!/bin/bash

echo "📋 Pium 프로젝트 로그 모니터링"
echo "================================"
echo ""

# 실행 중인 컨테이너 확인
if ! docker-compose ps | grep -q "Up"; then
    echo "❌ 실행 중인 컨테이너가 없습니다."
    echo "먼저 './start.sh'로 서비스를 시작해주세요."
    exit 1
fi

echo "🔍 로그를 볼 서비스를 선택하세요:"
echo "1) Frontend 로그"
echo "2) Backend 로그"
echo "3) Postgres 로그"
echo "4) 모든 서비스 로그"
echo "5) 특정 서비스 로그 (직접 입력)"
echo ""

read -p "선택 (1-5): " choice

case $choice in
    1)
        echo "🌐 Frontend 로그를 보여줍니다..."
        docker-compose logs frontend
        ;;
    2)
        echo "🔧 Backend 로그를 보여줍니다..."
        docker-compose logs backend
        ;;
    3)
        echo "🔍 Postgres 로그를 보여줍니다..."
        docker-compose logs postgres
        ;;
    4)
        echo "📊 모든 서비스 로그를 보여줍니다..."
        docker-compose logs
        ;;
    5)
        echo "📝 사용 가능한 서비스:"
        docker-compose ps --services
        echo ""
        read -p "서비스 이름을 입력하세요: " service_name
        if docker-compose ps | grep -q "$service_name"; then
            echo "📋 $service_name 로그를 보여줍니다..."
            docker-compose logs "$service_name"
        else
            echo "❌ '$service_name' 서비스를 찾을 수 없습니다."
        fi
        ;;
    *)
        echo "❌ 잘못된 선택입니다."
        exit 1
        ;;
esac 