/**
 * 백엔드 공통 요청 함수
 * - 주소 앞부분, 토큰 헤더, 에러 모양을 이 파일 한 곳에서 처리해요.
 * - 다른 api 파일은 fetch를 직접 쓰지 않고 request()만 불러요.
 */

/** 기본은 운영 서버(.env). 로컬 백엔드를 쓰려면 .env.local에 VITE_API_BASE_URL=/api */
const BASE_URL = import.meta.env.VITE_API_BASE_URL ?? '/api'

const TOKEN_KEY = 'mongle:accessToken'

/** 서버 실패 응답 {error, message, field}를 담는 에러 */
export class ApiError extends Error {
    /** HTTP 상태 (서버에 못 닿으면 0) */
    status: number
    /** 서버의 error 값 (예: VALIDATION_ERROR) */
    code: string
    /** 문제가 난 입력 칸 이름 (없으면 null) */
    field: string | null

    constructor(status: number, code: string, message: string, field: string | null) {
        super(message)
        this.name = 'ApiError'
        this.status = status
        this.code = code
        this.field = field
    }
}

/* ── 토큰 저장 ── (시크릿 모드처럼 저장소가 막힌 곳에서도 앱이 멈추지 않게 try로 감쌈) */
export function getToken(): string | null {
    try {
        return localStorage.getItem(TOKEN_KEY)
    } catch {
        return null
    }
}

export function setToken(token: string) {
    try {
        localStorage.setItem(TOKEN_KEY, token)
    } catch {
        // 저장 못 해도 이번 화면에서는 계속 쓸 수 있게 조용히 넘어감
    }
}

export function clearToken() {
    try {
        localStorage.removeItem(TOKEN_KEY)
    } catch {
        // 위와 같음
    }
}

type RequestOptions = {
    method?: 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE'
    /** 보낼 JSON (없으면 본문 없이 보냄) */
    body?: unknown
    /** 토큰이 필요한 요청인지 (로그인·회원가입·아이디 확인은 false) */
    auth?: boolean
}

/** 로그인이 풀렸을 때 App에 알리는 신호 이름 */
export const UNAUTHORIZED_EVENT = 'mongle:unauthorized'

export async function request<T>(path: string, options: RequestOptions = {}): Promise<T> {
    const { method = 'GET', body, auth = true } = options

    const headers: Record<string, string> = {}
    if (body !== undefined) headers['Content-Type'] = 'application/json'

    const token = auth ? getToken() : null
    if (token) headers.Authorization = `Bearer ${token}`

    let response: Response
    try {
        response = await fetch(BASE_URL + path, {
            method,
            headers,
            body: body === undefined ? undefined : JSON.stringify(body),
        })
    } catch {
        // 인터넷이 끊겼거나 서버에 아예 닿지 못한 경우
        throw new ApiError(0, 'NETWORK_ERROR', '연결이 잠시 불안정해요. 잠시 후 다시 시도해 주세요.', null)
    }

    // 204는 본문이 없어서 json()을 부르면 에러가 남
    if (response.status === 204) return undefined as T

    const data = await response.json().catch(() => null)

    if (!response.ok) {
        // 보호 API의 401 = 토큰 만료·위조 → 토큰 지우고 App에 알림
        // (로그인 요청의 401은 auth:false라 여기 안 걸리고 "아이디·비밀번호 오류"로 남음)
        if (response.status === 401 && auth) {
            clearToken()
            window.dispatchEvent(new Event(UNAUTHORIZED_EVENT))
        }
        throw new ApiError(
            response.status,
            data?.error ?? 'UNKNOWN_ERROR',
            data?.message ?? '잠시 후 다시 시도해 주세요.',
            data?.field ?? null,
        )
    }

    return data as T
}