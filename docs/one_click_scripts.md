# 📃 원클릭 실행 스크립트

## 📋 개요
프로젝트를 빠르게 시작하고 관리할 수 있는 실행 스크립트들입니다.

## :computer: Mac/Linux 환경

### Prerequisites
- Docker 설치
- Docker Compose 설치
- 실행 권한 부여: `chmod +x *.sh`

### 스크립트 목록

| 스크립트 | 설명 | 사용법 |
|----------|------|--------|
| `setup.sh` | 초기 설정 (1회만) | `./setup.sh` |
| `start-dev.sh` | 개발 컨테이너 실행 | `./start-dev.sh` |
| `logs.sh` | 로그 확인 | `./logs.sh` → 1~4 선택 |
| `stop.sh` | 컨테이너 중지 | `./stop.sh` |

## :computer: Windows 환경

### Prerequisites
- Docker Desktop 설치
- Docker Compose 설치

### 스크립트 목록

| 스크립트 | 설명 | 사용법 |
|----------|------|--------|
| `setup.bat` | 초기 설정 (1회만) | `.\setup.bat` |
| `start-dev.bat` | 개발 컨테이너 실행 | `.\start-dev.bat` |
| `logs.bat` | 로그 확인 | `.\logs.bat` → 1~4 선택 |
| `stop.bat` | 컨테이너 중지 | `.\stop.bat` |

## 🔧 문제 해결

### 권한 오류
```bash
chmod +x *.sh
```

### Docker 서비스 확인
```bash
docker info
```
```

### 2️⃣ **더 간단한 버전**
```markdown
# �� 실행 스크립트 가이드

## �� 스크립트 목록

| OS | 초기 설정 | 실행 | 로그 | 중지 |
|----|-----------|------|------|------|
| **Mac/Linux** | `./setup.sh` | `./start-dev.sh` | `./logs.sh` | `./stop.sh` |
| **Windows** | `.\setup.bat` | `.\start-dev.bat` | `.\logs.bat` | `.\stop.bat` |

## �� 사용법

### 초기 설정 (1회만)
```bash
# Mac/Linux
./setup.sh

# Windows
.\setup.bat
```

### 개발 환경 시작
```bash
# Mac/Linux
./start-dev.sh

# Windows
.\start-dev.bat
```

### 로그 확인
```bash
# Mac/Linux
./logs.sh

# Windows
.\logs.bat
```
```

## 💡 **추천**
**첫 번째 GitHub 스타일**을 추천합니다:
- **표준적**: 대부분의 개발자들이 익숙함
- **체계적**: 정보가 잘 정리되어 있음
- **확장성**: 나중에 내용 추가하기 쉬움
- **가독성**: 표와 구조화된 정보로 이해하기 쉬움

어떤 스타일이 마음에 드시나요?