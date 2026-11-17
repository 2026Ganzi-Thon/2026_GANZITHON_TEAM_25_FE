/**
 * 서버 오류 → 어떤 UI로 보여줄지 정하는 곳
 * - 화면 전체 오류(ErrorScreen): network / service
 * - 그 외는 토스트 문구로 안내
 */
import { ApiError } from './client'

/** network: 서버에 못 닿음 / service: 서버 오류(5xx) / other: 그 외(4xx) */
export type ErrorKind = 'network' | 'service' | 'other'

export function getErrorKind(error: unknown): ErrorKind {
    if (error instanceof ApiError) {
        if (error.status === 0) return 'network'
        if (error.status >= 500) return 'service'
        return 'other'
    }
    // ApiError가 아닌 예외(코드 버그 등)는 서버 문제처럼 다뤄요
    return 'service'
}

/**
 * 토스트에 띄울 공통 문구
 * 화면마다 다른 문구(예: 404 → "이미 삭제된 기억이에요")는 각 화면에서 먼저 처리하고,
 * 나머지는 이 함수에 맡겨요.
 */
export function getToastMessage(error: unknown): string {
    if (error instanceof ApiError) {
        if (error.status === 0) return '연결이 잠시 불안정해요. 잠시 후 다시 시도해 주세요.'
        if (error.status === 429) return '요청이 너무 많아요. 잠시 후 다시 시도해 주세요'
        // 400 VALIDATION_ERROR의 message는 보여줘도 되는 한글 문장 (가이드 5절)
        if (error.status === 400) return error.message
    }
    return '잠시 후 다시 시도해 주세요.'
}