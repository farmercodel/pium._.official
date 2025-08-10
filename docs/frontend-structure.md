# 📂 Frontend File Structure

```bash
frontend/                   # FE 루트 폴더
├── src/
│   ├── components/         # 재사용 가능한 컴포넌트
│   │   ├── common/         # 공통 컴포넌트 (Button, Input 등)
│   │   ├── layout/         # 레이아웃 컴포넌트 (Header, Footer, Sidebar)
│   │   └── pageName/       # 페이지별 전용 컴포넌트
│   ├── constants/          # 상수 정의 (API URL, 텍스트 등)
│   ├── hooks/              # 커스텀 React 훅
│   ├── pages/              # 페이지 컴포넌트
│   ├── types/              # TypeScript 타입 정의
│   ├── utils/              # 유틸리티 함수
│   ├── App.tsx             # 메인 앱 컴포넌트 및 라우팅
│   ├── index.css           # 글로벌 스타일 (Tailwind CSS 포함)
│   └── main.tsx            # 애플리케이션 진입점
├── index.html              # HTML 템플릿
└── .*                      # 설정 파일 (package.json, tsconfig.json 등)
```
