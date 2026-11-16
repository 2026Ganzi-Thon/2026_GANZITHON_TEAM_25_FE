/**
 * 기억 API (RestAPI 설계 4.2 · 4.4)
 * - 모든 함수가 실제 서버에 연결돼 있어요
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

/** GET /memories — 최신순 */
export async function getMemories(): Promise<Memory[]> {
    const data = await request<{ memories: Memory[] }>('/memories')
    return data.memories
}

/**
 * POST /memories/preview — 요약 후보 만들기
 * 서버가 세션 동안 들고 있던 대화로 AI 요약을 만들어요 (30분 안에 승인 안 하면 삭제)
 */
export async function createMemoryPreview(sessionId: string): Promise<MemoryPreview> {
    return request<MemoryPreview>('/memories/preview', {
        method: 'POST',
        body: { sessionId },
    })
}

/** POST /memories — 사용자가 확인·수정한 요약만 저장 */
export async function approveMemory(
    previewId: string,
    finalSummary: string,
): Promise<Memory> {
    return request<Memory>('/memories', {
        method: 'POST',
        body: { previewId, finalSummary },
    })
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

