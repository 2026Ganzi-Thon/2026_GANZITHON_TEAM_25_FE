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

### 2. 백엔드 실행 (로그인·API 연동 화면을 보려면 필수)

프론트는 개발 중에 `/api/...` 요청을 **로컬 백엔드 `http://localhost:8081`** 로 보냅니다. (`vite.config.ts`의 proxy 설정)
백엔드가 꺼져 있으면 모든 API가 **502**로 실패하고, 로그인·회원가입에서 "잠시 후 다시 시도해 주세요."만 표시됩니다.

[백엔드 레포](https://github.com/2026Ganzi-Thon/2026_GANZITHON_TEAM_25_BE)를 Docker로 띄우면 됩니다. Java·MySQL 설치는 필요 없습니다.

```bash
git clone https://github.com/2026Ganzi-Thon/2026_GANZITHON_TEAM_25_BE.git
cd 2026_GANZITHON_TEAM_25_BE
cp .env.example .env
openssl rand -base64 48      # 출력값을 .env의 JWT_SECRET= 뒤에 붙여넣기 (Windows는 Git Bash에서 실행)
docker compose up --build    # 첫 실행은 빌드 때문에 몇 분 걸림
```

- 확인: http://localhost:8081/actuator/health 에서 `{"status":"UP"}`가 나오면 성공
- `GEMINI_API_KEY`는 비워도 서버가 뜹니다. AI 대화만 기본 문구로 응답합니다.
- 각자 로컬 DB를 쓰므로 계정은 본인 로컬에서 새로 가입해야 합니다.
- 종료: `docker compose down` / DB 초기화: `docker compose down -v`
- API 상세: 백엔드 레포의 `docs/FRONTEND_GUIDE.md`, Swagger `http://localhost:8081/swagger-ui.html`

### 백엔드 없이 화면만 볼 때

로그인 체크는 저장된 토큰이 있는지만 확인합니다. 브라우저 콘솔에서 아래를 실행하고 새로고침하면 홈으로 들어갈 수 있습니다. (API를 부르는 화면은 계속 실패합니다)

```js
localStorage.setItem('mongle:accessToken', 'dev')     // 우회
localStorage.removeItem('mongle:accessToken')         // 원래대로
```

## 폴더 구조

```
src/
├─ api/      # 백엔드 호출 (client.ts: 공통 요청·토큰 저장, auth.ts 등 도메인별 API)
├─ pages/    # 화면 단위 컴포넌트
└─ styles/   # 전역 스타일
```

## 협업 규칙

- 작업은 `dev`에서 기능별 브랜치(`feature/…`, `fix/…`, `docs/…`)를 만들어 진행합니다.
- PR은 `dev`로 올립니다. **PR 전에 `git fetch` → `git merge origin/dev`로 최신 dev를 반영**해 충돌을 미리 해결합니다.
- `dev` → `main` 머지는 배포·제출 시점에 합니다.