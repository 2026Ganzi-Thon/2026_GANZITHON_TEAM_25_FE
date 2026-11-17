/**
 * 인증 API (백엔드 API 안내서 · 계정)
 * - 로그인 전에 부르는 API라서 모두 auth: false (토큰을 붙이지 않음)
 * - 로그인 아이디는 loginId, 응답의 userId는 서버 내부 ID라 서로 달라요
 */
import { clearToken, clearUserId, request, setToken, setUserId } from './client'

export type LoginResponse = {
    /** 서버 내부 사용자 ID (로그인 아이디 아님) */
    userId: string
    accessToken: string
    expiresAt: string
    name: string
}

/** POST /auth/login — 성공하면 토큰을 저장해요 */
export async function login(loginId: string, password: string): Promise<LoginResponse> {
    const data = await request<LoginResponse>('/auth/login', {
        method: 'POST',
        body: { loginId, password },
        auth: false,
    })
    setToken(data.accessToken)
    setUserId(data.userId)
    return data
}

/** 로그아웃 — 서버 호출 없이 저장한 토큰만 지워요 (안내서 공통 규칙) */
export function logout() {
    clearToken()
    clearUserId()
}

/** GET /auth/check-id — 쓸 수 있는 아이디면 true */
export async function checkLoginIdAvailable(loginId: string): Promise<boolean> {
    const data = await request<{ available: boolean }>(
        `/auth/check-id?loginId=${encodeURIComponent(loginId)}`,
        { auth: false },
    )
    return data.available
}

export type SignUpRequest = {
    name: string
    loginId: string
    password: string
    termsAgreed: boolean
    privacyAgreed: boolean
}

/** POST /auth/signup — 토큰은 주지 않아요. 가입 후 로그인 화면에서 다시 로그인 */
export async function signUp(body: SignUpRequest): Promise<void> {
    await request<{ userId: string }>('/auth/signup', {
        method: 'POST',
        body,
        auth: false,
    })
}