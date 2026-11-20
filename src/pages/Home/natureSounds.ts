export type NatureSound = 'off' | 'wind' | 'insects' | 'rain' | 'waves'

export const NATURE_SOUND_OPTIONS: { value: NatureSound; label: string }[] = [
  { value: 'off', label: '끄기' },
  { value: 'wind', label: '살랑이는 바람' },
  { value: 'insects', label: '깊은 밤 풀벌레' },
  { value: 'rain', label: '촉촉한 가랑비' },
  { value: 'waves', label: '잔잔한 계곡물' },
]

/**
 * 종류별 음원 파일 (public/audio)
 * - 서버가 받는 값은 off | wind | insects | rain | waves 뿐이라 값은 그대로 두고,
 *   waves에는 계곡물 음원(stream.mp3)을 연결해요. 값을 stream으로 바꾸면 서버가 400을 돌려줘요.
 */
export const NATURE_SOUND_FILES: Record<Exclude<NatureSound, 'off'>, string> = {
  wind: '/audio/wind.mp3',
  insects: '/audio/insects.mp3',
  rain: '/audio/rain.mp3',
  waves: '/audio/stream.mp3',
}

/** 출처 표시가 필요한 음원이라 자연음 시트에 보여줘요 (CC BY·공공누리 제1유형은 출처 표시 필수) */
export const NATURE_SOUND_CREDITS: string[] = [
  '살랑이는 바람 · 한국저작권위원회(공유마당) · CC BY',
  '깊은 밤 풀벌레, 촉촉한 가랑비 · JICA/(재)전주정보문화산업진흥원(공유마당) · 공공누리 제1유형',
  '잔잔한 계곡물 · nvisiblesound(Freesound) · CC0',
]
