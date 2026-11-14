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

/**
 * 가짜 회원 목록 — 테스트 계정 + 이번에 가입한 계정
 * 메모리에만 있어서 새로고침하면 가입한 계정은 사라져요 (비밀번호를 브라우저에 저장하지 않으려고 일부러 이렇게 함)
 */
const mockAccounts = [MOCK_ACCOUNT]

/** POST /auth/login (가정) */
export async function login(userId: string, password: string): Promise<LoginResponse> {
    await new Promise((resolve) => setTimeout(resolve, 600))

    const account = mockAccounts.find((item) => item.userId === userId)
    if (!account || account.password !== password) {
        throw new LoginError('아이디 또는 비밀번호가 맞지 않아요.')
    }

    return {
        userId,
        accessToken: 'mock-access-token',
        expiresAt: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString(),
    }
}

/**
 * 아이디 중복확인 — 쓸 수 있는 아이디면 true
 * GET /auth/check-id (가정) 🔴 백엔드와 모양 확정 필요
 * 지금은 0.4초 뒤 가짜 회원 목록에 있는 아이디만 "이미 사용 중"으로 답하는 가짜 구현
 */
export async function checkUserIdAvailable(userId: string): Promise<boolean> {
    await new Promise((resolve) => setTimeout(resolve, 400))
    return !mockAccounts.some((item) => item.userId === userId)
}

export type SignUpRequest = {
    name: string
    userId: string
    password: string
}

/**
 * 회원가입
 * POST /auth/signup (가정) 🔴 백엔드와 모양 확정 필요
 * 지금은 0.6초 뒤 가짜 회원 목록에 넣는 가짜 구현 — 가입한 계정으로 바로 로그인할 수 있어요
 */
export async function signUp({ userId, password }: SignUpRequest): Promise<void> {
    await new Promise((resolve) => setTimeout(resolve, 600))
    mockAccounts.push({ userId, password })
}