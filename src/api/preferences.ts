/**
 * 환경설정 API (FRONTEND_GUIDE 3절 · 자연음 설정)
 * - 바뀐 필드만 PATCH로 보내요 (누락·null은 서버가 기존 값 유지)
 */
import { request } from './client'
import type { NatureSound } from '../pages/Home/natureSounds'

export type Preferences = {
    soundEnabled: boolean
    hapticsEnabled: boolean
    animationEnabled: boolean
    natureSound: NatureSound
    /** 0~100 정수 */
    natureSoundVolume: number
    natureSoundAutoPlayEnabled: boolean
}

export type PreferencesUpdate = Partial<Preferences>

/** GET /preferences — 로그인한 계정의 설정 */
export function getPreferences(): Promise<Preferences> {
    return request<Preferences>('/preferences')
}

/** PATCH /preferences — 바꾼 필드만 보내요 */
export function updatePreferences(body: PreferencesUpdate): Promise<Preferences> {
    return request<Preferences>('/preferences', { method: 'PATCH', body })
}