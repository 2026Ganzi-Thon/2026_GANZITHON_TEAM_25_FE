# Mongle — Frontend

나를 닮은 양 '몽글'에게 털어놓거나 말없이 쉬며 마음을 추스르는 정서 케어 서비스의 프론트엔드입니다. (2026 간지톤 TEAM 25)

## 스택

React · TypeScript · Vite · Oxlint

## 실행 방법

### 1. 프론트 실행

```bash
npm install
npm run dev
# http://localhost:5173
```

### 2. 백엔드 연결

기본으로 **운영 백엔드 `https://api.mongle.asia`** 에 연결됩니다 (`.env`). 별도 설정 없이 `npm run dev`만 하면 회원가입·로그인이 됩니다.

> 로컬 백엔드에서 만든 계정은 운영 서버에 없습니다. 운영 서버에서 새로 가입해 주세요.

로컬 백엔드(`localhost:8081`)로 테스트하고 싶을 때만 `.env.local`에 아래를 넣고, [백엔드 레포](https://github.com/2026Ganzi-Thon/2026_GANZITHON_TEAM_25_BE)를 `docker compose up --build`로 실행합니다.

```
VITE_API_BASE_URL=/api
```

`.env`를 바꾼 뒤에는 `npm run dev`를 재시작해야 적용됩니다.

### 백엔드 없이 화면만 볼 때

로그인 체크는 저장된 토큰이 있는지만 확인합니다. 브라우저 콘솔에서 아래를 실행하고 새로고침하면 홈으로 들어갈 수 있습니다. (API를 부르는 화면은 계속 실패합니다)

```js
localStorage.setItem('mongle:accessToken', 'dev')     // 우회
localStorage.removeItem('mongle:accessToken')         // 원래대로
```

## 폴더 구조

```
src/
├─ api/         # 백엔드 호출 (client.ts: 공통 요청·토큰 저장, auth.ts 등 도메인별 API)
├─ assets/      # 이미지·아이콘
├─ components/  # 여러 화면에서 쓰는 공통 컴포넌트 (HeaderActions, Overlay, BottomSheet 등)
├─ pages/       # 화면 단위 컴포넌트
└─ styles/      # 화면별·전역 스타일
```

## 협업 규칙

- 작업은 `dev`에서 기능별 브랜치(`feature/…`, `fix/…`, `docs/…`)를 만들어 진행합니다.
- PR은 `dev`로 올립니다. **PR 전에 `git fetch` → `git merge origin/dev`로 최신 dev를 반영**해 충돌을 미리 해결합니다.
- `dev` → `main` 머지는 배포·제출 시점에 합니다.