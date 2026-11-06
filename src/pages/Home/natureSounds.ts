export type NatureSound = 'off' | 'wind' | 'insects' | 'rain' | 'waves'

export const NATURE_SOUND_OPTIONS: { value: NatureSound; label: string }[] = [
  { value: 'off', label: '끄기' },
  { value: 'wind', label: '바람' },
  { value: 'insects', label: '풀벌레' },
  { value: 'rain', label: '빗소리' },
  { value: 'waves', label: '잔잔한 물결' },
]
