# 📂 FRONTEND FILE STURCTURE

```bash
frontend/               # FE 루트 폴더
├── src/
    ├── components/     # 컴포넌트 요소 관리용 폴더
        ├── common/     # 흔하게 재사용하는 요소 관리용 폴더
        ├── layout/     # Header, Layout, Footer 관리용 폴더
        └── pageName/   # 각 페이지별 요소 관리용 폴더 (폴더 이름을 main, profile 등으로 작성)
    ├── constants/      # 상수 관리 (페이지 텍스트 등)
    ├── hooks/          # 
    ├── pages/          #
    ├── types/          #
    ├── utils/          #
    ├── App.tsx         # 라우팅 설정    
    ├── index.css       # Tailwind CSS 설정
    └── main.tsx        # 웹 진입지점
├── index.html          # 클라이언트에게 보이는 화면
└── .*                  # FE 설정 파일(node_module, tsconfig.json, package.json 등)
 
```
