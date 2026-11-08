export type FeelingOption = {
  id: string
  label: string
}

export type WishOption = {
  id: string
  label: string
  /** 다른 바람이 뒤에 이어질 때의 연결형 (예: "사과하고 싶고") */
  linking: string
  /** 문장 마지막에 오는 관형형 (예: "사과하고 싶은") → "~ 마음이 있어." */
  ending: string
  /** true면 다른 바람과 함께 선택되지 않음 */
  exclusive?: boolean
}

export const FEELING_OPTIONS: FeelingOption[] = [
  { id: 'hurt', label: '서운함' },
  { id: 'anxious', label: '불안함' },
  { id: 'upset', label: '속상함' },
  { id: 'wronged', label: '억울함' },
  { id: 'tired', label: '지침' },
  { id: 'stuffy', label: '답답함' },
  { id: 'sorry', label: '미안함' },
  { id: 'lonely', label: '외로움' },
  { id: 'angry', label: '화남' },
  { id: 'confused', label: '혼란스러움' },
  { id: 'better', label: '조금 괜찮아짐' },
]

export const WISH_OPTIONS: WishOption[] = [
  {
    id: 'be-heard',
    label: '내 말을 들어주었으면',
    linking: '내 말을 들어주었으면 하고',
    ending: '내 말을 들어주었으면 하는',
  },
  {
    id: 'get-apology',
    label: '사과를 받고 싶어',
    linking: '사과를 받고 싶고',
    ending: '사과를 받고 싶은',
  },
  {
    id: 'alone-time',
    label: '혼자 있을 시간이 필요해',
    linking: '혼자 있을 시간이 필요하고',
    ending: '혼자 있을 시간이 필요한',
  },
  {
    id: 'reassurance',
    label: '관계를 확인받고 싶어',
    linking: '관계를 확인받고 싶고',
    ending: '관계를 확인받고 싶은',
  },
  {
    id: 'not-sure',
    label: '아직 잘 모르겠어',
    linking: '',
    ending: '',
    exclusive: true,
  },
  {
    id: 'apologize',
    label: '사과하고 싶어',
    linking: '사과하고 싶고',
    ending: '사과하고 싶은',
  },
]

/** 사용자가 "+"로 직접 입력한 바람 → 문장에 자연스럽게 들어가도록 인용 형태로 변환 */
export function createCustomWish(label: string): WishOption {
  return {
    id: `custom-wish-${label}`,
    label,
    linking: `‘${label}’ 하고`,
    ending: `‘${label}’ 하는`,
  }
}

export function createCustomFeeling(label: string): FeelingOption {
  return { id: `custom-feeling-${label}`, label }
}

/**
 * 선택한 마음과 바람을 "지금의 내 마음" 문장(줄 단위)으로 정리
 * 예) ["지금 나는 불안함, 미안함 같은 마음이 들어.", "그리고 사과하고 싶은 마음이 있어."]
 */
export function buildMindSentences(
  feelings: FeelingOption[],
  wishes: WishOption[],
): string[] {
  const lines: string[] = []

  if (feelings.length > 0) {
    const names = feelings.map((feeling) => feeling.label).join(', ')
    lines.push(`지금 나는 ${names} 같은 마음이 들어.`)
  }

  const hasFeeling = lines.length > 0

  if (wishes.some((wish) => wish.exclusive)) {
    lines.push(`${hasFeeling ? '그리고 ' : ''}바라는 건 아직 잘 모르겠어.`)
  } else if (wishes.length > 0) {
    const phrase = wishes
      .map((wish, index) =>
        index === wishes.length - 1 ? wish.ending : wish.linking,
      )
      .join(' ')
    lines.push(`${hasFeeling ? '그리고' : '지금 나는'} ${phrase} 마음이 있어.`)
  }

  return lines
}
