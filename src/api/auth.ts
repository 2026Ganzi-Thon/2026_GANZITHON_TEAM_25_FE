/**
 * 로그인 API
 * 🔴 RestAPI 설계 v1에는 아직 없음 (v1은 기기 익명 토큰만 있음) → 백엔드와 모양 확정 필요
 * TODO: 서버가 준비되면 함수 안만 fetch 호출로 바꾸면 됨 (화면 코드는 그대로)
 *       지금은 0.6초 뒤 테스트 계정 하나만 통과시키는 가짜 구현
 */
export type LoginResponse = {
    userId: string
    accessToken: string
    expiresAt: string
}

/** 아이디·비밀번호가 맞지 않을 때 던지는 에러 */
export class LoginError extends Error { }

/** 가짜 테스트 계정 (Figma 회원가입 예시 비밀번호와 같게 맞춤) */
const MOCK_ACCOUNT = { userId: 'mongle01', password: 'mongle123!' }

/** POST /auth/login (가정) */
export async function login(userId: string, password: string): Promise<LoginResponse> {
    await new Promise((resolve) => setTimeout(resolve, 600))

    if (userId !== MOCK_ACCOUNT.userId || password !== MOCK_ACCOUNT.password) {
        throw new LoginError('아이디 또는 비밀번호가 맞지 않아요.')
    }

    return {
        userId,
        accessToken: 'mock-access-token',
        expiresAt: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString(),
    }
}