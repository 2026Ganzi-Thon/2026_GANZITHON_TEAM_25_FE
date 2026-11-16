/*** - 목록·수정·삭제: 실제 서버 연결
 * - 미리보기·승인(preview/approve): 세션 연결 전까지 localStorage 가짜 구현
/**
 * 기억 API (RestAPI 설계 4.2 · 4.4)
 * - 목록·수정·삭제: 실제 서버 연결
 * - 미리보기·승인(preview/approve): 세션 연결 전까지 localStorage 가짜 구현
 */

import { request } from './client'

export type Memory = {
    memoryId: string
    summary: string
    approvedAt: string
    updatedAt?: string
}

export type MemoryPreview = {
    previewId: string
    draftSummary: string
}

const STORAGE_KEY = 'mongle:memories'

function createId() {
    // crypto.randomUUID는 http(LAN IP로 폰 테스트 등)에서는 없을 수 있어 대체값을 둔다
    return typeof crypto !== 'undefined' && 'randomUUID' in crypto
        ? crypto.randomUUID()
        : `${Date.now()}-${Math.random().toString(36).slice(2, 10)}`
}

function readMemories(): Memory[] {
    try {
        const raw = localStorage.getItem(STORAGE_KEY)
        return raw ? (JSON.parse(raw) as Memory[]) : []
    } catch {
        return []
    }
}

/** GET /memories — 최신순 */
export async function getMemories(): Promise<Memory[]> {
    const data = await request<{ memories: Memory[] }>('/memories')
    return data.memories
}

/**
 * POST /memories/preview — 요약 후보 만들기
 * 실제 서버는 sessionId만 받고 서버가 들고 있는 대화로 AI 요약을 만든다.
 * 지금은 사용자가 마지막에 한 말을 그대로 후보로 돌려준다.
 */
export async function createMemoryPreview(
    userTexts: string[],
): Promise<MemoryPreview> {
    const last = userTexts[userTexts.length - 1] ?? ''
    return {
        previewId: createId(),
        draftSummary: last.replace(/[.!?~\s]+$/, ''),
    }
}

/** POST /memories — 사용자가 확인한 요약만 저장 */
export async function approveMemory(
    _previewId: string,
    finalSummary: string,
): Promise<Memory> {
    const memory: Memory = {
        memoryId: createId(),
        summary: finalSummary,
        approvedAt: new Date().toISOString(),
    }
    try {
        localStorage.setItem(
            STORAGE_KEY,
            JSON.stringify([memory, ...readMemories()]),
        )
    } catch {
        // 저장 공간이 막힌 환경(시크릿 모드 등)에서는 조용히 무시
    }
    return memory
}

/** PATCH /memories/{memoryId} — 요약 문장 고치기 */
export async function updateMemory(
    memoryId: string,
    summary: string,
): Promise<Memory> {
    return request<Memory>(`/memories/${encodeURIComponent(memoryId)}`, {
        method: 'PATCH',
        body: { summary },
    })
}

/** DELETE /memories/{memoryId} — 기억 하나 지우기 (하드 삭제) */
export async function deleteMemory(memoryId: string): Promise<void> {
    await request<void>(`/memories/${encodeURIComponent(memoryId)}`, { method: 'DELETE' })
}

/** DELETE /memories — 기억 모두 지우기 */
export async function deleteAllMemories(): Promise<void> {
    await request<void>('/memories', { method: 'DELETE' })
}

