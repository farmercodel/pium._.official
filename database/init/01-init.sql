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

-- 대상 DB로 접속
\c pium_db;

-- 스키마 초기화(개발용): 테이블은 ORM/Alembic이 생성
DROP SCHEMA IF EXISTS public CASCADE;
CREATE SCHEMA public AUTHORIZATION pium_user;

-- 권한 부여
GRANT ALL PRIVILEGES ON SCHEMA public TO pium_user;

-- 향후 생성될 객체에 대한 기본 권한 (안전장치)
ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT ALL PRIVILEGES ON TABLES TO pium_user;
ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT ALL PRIVILEGES ON SEQUENCES TO pium_user;
ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT ALL PRIVILEGES ON FUNCTIONS TO pium_user;

-- 성공 메시지
SELECT 'Database initialization completed successfully!' as status;