import { useState, type KeyboardEvent } from 'react'
import '../../styles/Chip.css'

type ChipProps = {
  label: string
  selected: boolean
  onToggle: () => void
}

/** 선택형 칩 — 선택 시 메인 컬러로 채워짐 */
export function Chip({ label, selected, onToggle }: ChipProps) {
  return (
    <button
      type="button"
      className={`chip${selected ? ' chip--selected' : ''}`}
      aria-pressed={selected}
      onClick={onToggle}
    >
      {label}
    </button>
  )
}

type AddChipProps = {
  /** 입력창 접근성 라벨 (예: "직접 입력할 마음") */
  inputLabel: string
  placeholder?: string
  maxLength?: number
  onAdd: (label: string) => void
}

/** "+" 칩 — 누르면 그 자리에서 짧은 직접 입력 칩으로 바뀜 */
export function AddChip({
  inputLabel,
  placeholder = '직접 입력',
  maxLength = 12,
  onAdd,
}: AddChipProps) {
  const [isEditing, setIsEditing] = useState(false)
  const [value, setValue] = useState('')

  const close = () => {
    setValue('')
    setIsEditing(false)
  }

  const commit = () => {
    const label = value.trim()
    if (label) onAdd(label)
    close()
  }

  const handleKeyDown = (event: KeyboardEvent<HTMLInputElement>) => {
    // 한글 조합 중 Enter는 무시해야 마지막 글자가 중복 입력되지 않음
    if (event.nativeEvent.isComposing) return
    if (event.key === 'Enter') {
      event.preventDefault()
      commit()
    } else if (event.key === 'Escape') {
      close()
    }
  }

  if (isEditing) {
    return (
      <input
        className="chip chip--input"
        aria-label={inputLabel}
        placeholder={placeholder}
        maxLength={maxLength}
        value={value}
        size={Math.max(value.length, placeholder.length) + 1}
        autoFocus
        onChange={(event) => setValue(event.target.value)}
        onKeyDown={handleKeyDown}
        onBlur={commit}
      />
    )
  }

  return (
    <button
      type="button"
      className="chip chip--add"
      aria-label={`${inputLabel} 추가`}
      onClick={() => setIsEditing(true)}
    >
      +
    </button>
  )
}
