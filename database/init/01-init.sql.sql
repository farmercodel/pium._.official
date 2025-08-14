-- database/init/01-init.sql
-- PostgreSQL 데이터베이스 초기화 스크립트

-- 데이터베이스가 이미 존재하는지 확인
SELECT 'CREATE DATABASE pium_db'
WHERE NOT EXISTS (SELECT FROM pg_database WHERE datname = 'pium_db')\gexec

-- 사용자 권한 확인 및 설정
DO $$
BEGIN
    IF NOT EXISTS (SELECT FROM pg_user WHERE usename = 'pium_user') THEN
        CREATE USER pium_user WITH PASSWORD 'ktuzvxshjfqmwg3gcd3ktpxnh9haj28zhjx5srx0hu0';
    END IF;
END
$$;

-- 데이터베이스 소유권 설정
ALTER DATABASE pium_db OWNER TO pium_user;

-- 기본 스키마 생성
\c pium_db;

-- 사용자 테이블 예시 (임시)
CREATE TABLE IF NOT EXISTS users (
    id SERIAL PRIMARY KEY,
    username VARCHAR(50) UNIQUE NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 테스트 데이터 삽입 (임시)
INSERT INTO users (username, email) VALUES 
    ('test_user1', 'test1@pium.com'),
    ('test_user2', 'test2@pium.com')
ON CONFLICT (username) DO NOTHING;

-- 테이블 권한 설정
GRANT ALL PRIVILEGES ON ALL TABLES IN SCHEMA public TO pium_user;
GRANT ALL PRIVILEGES ON ALL SEQUENCES IN SCHEMA public TO pium_user;

-- 성공 메시지
SELECT 'Database initialization completed successfully!' as status;