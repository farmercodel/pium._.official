# 📂 Frontend File Structure

## 📋 개요
프론트엔드 폴더 구조를 보여주는 문서입니다.

<br>

## 👀 폴더 구조 한눈에 보기

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

<br>

## 📚 폴더 구조 표로 보기

|폴더명|설명|예시|
|---|-----|-----|
|frontend/|FE root folder||
|src/components/|재사용 가능한 컴포넌트 폴더|common/ layout/ 등|
|components/common/|공통 컴포넌트 폴더|Button.tsx Input.tsx 등|
|components/layout/|레이아웃 컴포넌트 폴더|Header.tsx Footer.tsx Sidebar.tsx 등|
|components/pageName/|페이지 컴포넌트 폴더|components/main/ components/profile/ 등|
|src/constants/|상수 정의 폴더|API URL, Text 등|
|src/hooks|커스텀 React 훅 폴더|useScrollTo.ts(커스텀 스크롤 훅) 등|
|src/pages/|페이지 컴포넌트|main.tsx profile.tsx 등|
|src/types/|TypeScript 타입 정의 폴더|mainType.ts 등|
|src/utils|유틸리티 함수 폴더|날짜 시간관련 함수, 문자열 처리 함수 등|
|src/App.tsx|메인 앱 컴포넌트 및 라우팅||
|src/index.css|글로벌 스타일|Tailwind CSS 등|
|src/main.tsx|애플리케이션 진입점||
|frontend/index.html|HTML 템플릿||
|frontend/.*|설정파일|package.json, tsconfig.json 등|

<br>

***

<br>

## 🔗 컴포넌트 관계도

```mermaid
graph TD
  Header.tsx -->|Header 정보| Layout.tsx
  MainPage.tsx -->|메인 콘텐츠| Layout.tsx
  Footer.tsx -->|Footer 정보| Layout.tsx

  Layout.tsx -->|레이아웃 래핑| App.tsx

  PageLayout.tsx -->|페이지 구조 정의| MainPage.tsx
  pageLayout.ts -->|타입 정의| PageLayout.tsx
  
  components -->|Header, content, Footer 에 포함| Layout_section

  headerConstant.ts -->|헤더 메뉴 상수| Header.tsx
  useNavigation.ts -->|라우팅 로직| Header.tsx

  subgraph components ["재사용 가능한 컴포넌트"]
    Button.tsx
    Image.tsx
    subgraph anotherComponents_section ["Input.tsx Card.tsx 등"]
      style anotherComponents_section stroke-dasharray: 5 5
      anotherComponents
    end
  end

  subgraph Layout_section ["Layout 구조"]
    subgraph Header_section ["Header 영역"]
      Header.tsx
    end

    subgraph content_section ["content 영역"]
      style content_section stroke-dasharray: 5 5
      MainPage.tsx
    end

    subgraph Footer_section ["Footer 영역"]
      Footer.tsx
    end
  end
```

## 🌊 데이터의 흐름도
```mermaid
graph LR
  headerConstant.ts -->|MAIN_NAVIGATION_ITEMS| Header.tsx
  headerConstant.ts -->|POPUP_NAVIGATION_ITEMS| Header.tsx
  
  useNavigation.ts -->|goToMain 등 라우팅 함수| Header.tsx
  
  Header.tsx -->|네비게이션 이벤트| Layout.tsx
  MainPage.tsx -->|페이지 콘텐츠| Layout.tsx
  
  Layout.tsx -->|전체 구조| App.tsx
```


