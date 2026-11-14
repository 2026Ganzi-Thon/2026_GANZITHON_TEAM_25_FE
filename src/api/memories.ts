/**
 * 기억 API (RestAPI 설계 4.2 · 4.4)
 * - 대화 원문은 저장하지 않고, 사용자가 확인·수정한 "요약"만 저장한다.
 * TODO: 서버가 준비되면 각 함수 안만 fetch 호출로 바꾸면 됨
 *       지금은 브라우저 localStorage에 저장하는 가짜 구현
 */
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

function writeMemories(memories: Memory[]) {
    try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(memories))
    } catch {
        // 저장 공간이 막힌 환경(시크릿 모드 등)에서는 조용히 무시
    }
}

/** GET /memories — 최신순 */
export async function getMemories(): Promise<Memory[]> {
    return readMemories()
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
    const memories = readMemories()
    const target = memories.find((memory) => memory.memoryId === memoryId)
    if (!target) {
        throw new Error('MEMORY_NOT_FOUND') // 서버라면 404
    }
    const updated: Memory = {
        ...target,
        summary,
        updatedAt: new Date().toISOString(),
    }
    writeMemories(
        memories.map((memory) =>
            memory.memoryId === memoryId ? updated : memory,
        ),
    )
    return updated
}

/** DELETE /memories/{memoryId} — 기억 하나 지우기 (하드 삭제) */
export async function deleteMemory(memoryId: string): Promise<void> {
    writeMemories(
        readMemories().filter((memory) => memory.memoryId !== memoryId),
    )
}

/** DELETE /memories — 기억 모두 지우기 */
export async function deleteAllMemories(): Promise<void> {
    writeMemories([])
}
