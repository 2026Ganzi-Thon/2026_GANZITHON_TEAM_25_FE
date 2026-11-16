/**
 * 공감 대화 API (RestAPI 설계 4.3 `POST /sessions/{sessionId}/reflections`)
 * - AI가 실패해도 서버가 200 + 대체 문구로 답해요 (에러 화면 띄우지 않기)
 * - 응답까지 4~5초 걸릴 수 있어요
 */
import { request } from './client'

export type RiskResource = {
  name: string
  phone: string
}

export type ReflectionResponse = {
  reply: string
  riskDetected: boolean
  riskResources: RiskResource[] | null
}

/**
 * 몽글이에게 한 문장 보내고 답장 받기
 * @param selectedMemoryIds 이번 대화에 꺼낸 기억 ("이번만 이야기하기"면 빈 배열)
 */
export async function postReflection(
  sessionId: string,
  text: string,
  selectedMemoryIds: string[] = [],
): Promise<ReflectionResponse> {
  return request<ReflectionResponse>(
    `/sessions/${encodeURIComponent(sessionId)}/reflections`,
    { method: 'POST', body: { text, selectedMemoryIds } },
  )
}