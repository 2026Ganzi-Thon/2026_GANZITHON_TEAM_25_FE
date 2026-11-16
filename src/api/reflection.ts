/**
 * 공감 대화 API (RestAPI 설계 4.3 `POST /sessions/{sessionId}/reflections`)
 * TODO: 서버가 준비되면 이 함수 안만 fetch 호출로 바꾸면 됨 (화면 코드는 그대로)
 */
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
 * 지금은 서버가 없어서 0.6초 뒤 고정 문구로 답하는 가짜 함수
 * @param selectedMemoryIds 이번 대화에 꺼낸 기억 (안 골랐으면 빈 배열)
 */
export async function postReflection(
  text: string,
  selectedMemoryIds: string[] = [],
): Promise<ReflectionResponse> {
  console.log('[mock] reflections 요청:', { text, selectedMemoryIds })
  await new Promise((resolve) => setTimeout(resolve, 600))
  return {
    reply: '그런 일이 있었구나. 솔직하게 말해줘서 고마워!',
    riskDetected: false,
    riskResources: null,
  }
}