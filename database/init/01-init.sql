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

-- 테이블 권한 설정 (SQLAlchemy가 테이블을 생성할 수 있도록)
GRANT ALL PRIVILEGES ON SCHEMA public TO pium_user;
GRANT ALL PRIVILEGES ON ALL TABLES IN SCHEMA public TO pium_user;
GRANT ALL PRIVILEGES ON ALL SEQUENCES IN SCHEMA public TO pium_user;
GRANT ALL PRIVILEGES ON ALL FUNCTIONS IN SCHEMA public TO pium_user;

-- 성공 메시지
SELECT 'Database initialization completed successfully!' as status;