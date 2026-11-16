/**
 * 세션 API (RestAPI 설계 4.1)
 * - 대화(TALK) · 말없이 쉬기(SILENT) 한 번 = 세션 하나
 * - 서버는 세션 동안만 대화 문맥을 기억하고, finish 때 지워요
 */
import { request } from './client'

export type EntryType = 'TALK' | 'SILENT'

export type Session = {
    sessionId: string
    entryType: EntryType
    startedAt: string
}

/** POST /sessions — 세션 시작 */
export async function startSession(entryType: EntryType): Promise<Session> {
    return request<Session>('/sessions', { method: 'POST', body: { entryType } })
}

/** POST /sessions/{id}/finish — 세션 종료 (여러 번 불러도 200이라 안전) */
export async function finishSession(sessionId: string): Promise<void> {
    await request(`/sessions/${encodeURIComponent(sessionId)}/finish`, { method: 'POST' })
}