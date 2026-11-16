import { useState } from 'react'
import arrowBack from '../../assets/icons/arrow-back.svg'
import heartBadge from '../../assets/icons/heart-badge.svg'
import HeaderActions from '../../components/HeaderActions/HeaderActions'
import { AddChip, Chip } from '../../components/Chip/Chip'
import {
  FEELING_OPTIONS,
  WISH_OPTIONS,
  buildMindSentences,
  createCustomFeeling,
  createCustomWish,
  type FeelingOption,
  type WishOption,
} from './mindOptions'
import '../../styles/MindOrganize.css'

export type MindSummary = {
  feelings: string[]
  wishes: string[]
  sentence: string
}

type MindOrganizeProps = {
  onBack?: () => void
  onSoundClick?: () => void
  onMenuClick?: () => void
  /** 여기서 끝내기 */
  onEnd?: () => void
  /** 대화하러 가기 — 정리한 마음을 대화 화면에 넘겨줄 수 있음 */
  onGoChat?: (summary: MindSummary) => void
}

/**
 * 내 마음 정리 (기능 4 · 다음 행동 선택 › 내 마음 정리)
 * - 지금 마음 / 바라는 것을 칩으로 고르면 "지금의 내 마음" 문장으로 정리
 * - 선택은 이 화면 안에서만 유지되고 저장하지 않음
 */
function MindOrganize({
  onBack,
  onSoundClick,
  onMenuClick,
  onEnd,
  onGoChat,
}: MindOrganizeProps) {
  const [feelingOptions, setFeelingOptions] =
    useState<FeelingOption[]>(FEELING_OPTIONS)
  const [wishOptions, setWishOptions] = useState<WishOption[]>(WISH_OPTIONS)
  const [selectedFeelingIds, setSelectedFeelingIds] = useState<string[]>([])
  const [selectedWishIds, setSelectedWishIds] = useState<string[]>([])

  // 선택 순서와 무관하게 화면에 보이는 순서대로 문장을 만든다
  const selectedFeelings = feelingOptions.filter((option) =>
    selectedFeelingIds.includes(option.id),
  )
  const selectedWishes = wishOptions.filter((option) =>
    selectedWishIds.includes(option.id),
  )

  const sentences = buildMindSentences(selectedFeelings, selectedWishes)

  const toggleFeeling = (id: string) => {
    setSelectedFeelingIds((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id],
    )
  }

  const toggleWish = (wish: WishOption) => {
    setSelectedWishIds((prev) => {
      if (prev.includes(wish.id)) return prev.filter((id) => id !== wish.id)
      // "아직 잘 모르겠어"는 단독 선택, 다른 바람을 고르면 자동 해제
      if (wish.exclusive) return [wish.id]
      const exclusiveIds = wishOptions
        .filter((option) => option.exclusive)
        .map((option) => option.id)
      return [...prev.filter((id) => !exclusiveIds.includes(id)), wish.id]
    })
  }

  const addFeeling = (label: string) => {
    const existing = feelingOptions.find((option) => option.label === label)
    const feeling = existing ?? createCustomFeeling(label)
    if (!existing) setFeelingOptions((prev) => [...prev, feeling])
    setSelectedFeelingIds((prev) =>
      prev.includes(feeling.id) ? prev : [...prev, feeling.id],
    )
  }

  const addWish = (label: string) => {
    const existing = wishOptions.find((option) => option.label === label)
    const wish = existing ?? createCustomWish(label)
    if (!existing) setWishOptions((prev) => [...prev, wish])
    if (!selectedWishIds.includes(wish.id)) toggleWish(wish)
  }

  const handleGoChat = () => {
    onGoChat?.({
      feelings: selectedFeelings.map((feeling) => feeling.label),
      wishes: selectedWishes.map((wish) => wish.label),
      sentence: sentences.join(' '),
    })
  }

  return (
    <main className="mind">
      <header className="mind__top">
        <button
          type="button"
          className="mind__back"
          aria-label="뒤로 가기"
          onClick={onBack}
        >
          <img src={arrowBack} width={35} height={35} alt="" />
        </button>
        <HeaderActions onSoundClick={onSoundClick} onMenuClick={onMenuClick} />
      </header>

      <section className="mind__section" aria-labelledby="mind-feeling-title">
        <div className="mind__title-row">
          <img src={heartBadge} width={30} height={30} alt="" />
          <h1 id="mind-feeling-title" className="mind__title">
            지금 마음에 가까운 것
          </h1>
        </div>
        <p className="mind__guide">
          여러 개 골라도 돼요. 맞는 말이 없으면 건너뛰어도 돼요.
        </p>

        <div className="mind__chips mind__chips--feeling" role="group">
          {feelingOptions.map((option) => (
            <Chip
              key={option.id}
              label={option.label}
              selected={selectedFeelingIds.includes(option.id)}
              onToggle={() => toggleFeeling(option.id)}
            />
          ))}
          <AddChip inputLabel="직접 입력할 마음" onAdd={addFeeling} />
        </div>
      </section>

      <section
        className="mind__section mind__section--wish"
        aria-labelledby="mind-wish-title"
      >
        <h2 id="mind-wish-title" className="mind__subtitle">
          내가 바라는 것
        </h2>
        <div className="mind__chips mind__chips--wish" role="group">
          {wishOptions.map((option) => (
            <Chip
              key={option.id}
              label={option.label}
              selected={selectedWishIds.includes(option.id)}
              onToggle={() => toggleWish(option)}
            />
          ))}
          <AddChip
            inputLabel="직접 입력할 바람"
            maxLength={16}
            onAdd={addWish}
          />
        </div>
      </section>

      <section className="mind__summary" aria-labelledby="mind-summary-title">
        <h2 id="mind-summary-title" className="mind__summary-title">
          지금의 내 마음
        </h2>
        <p
          className={`mind__summary-text${
            sentences.length === 0 ? ' mind__summary-text--empty' : ''
          }`}
          aria-live="polite"
        >
          {sentences.length > 0
            ? sentences.map((line) => (
                <span key={line} className="mind__summary-line">
                  {line}
                </span>
              ))
            : '위에서 마음을 고르면 여기에 문장으로 정리돼요.'}
        </p>
      </section>
      <p className="mind__note">이 화면의 선택은 저장되지 않아요.</p>

      <footer className="mind__actions">
        <button
          type="button"
          className="mind__cta mind__cta--end"
          onClick={onEnd}
        >
          여기서 끝내기
        </button>
        <button
          type="button"
          className="mind__cta mind__cta--chat"
          onClick={handleGoChat}
        >
          대화하러 가기
        </button>
      </footer>
    </main>
  )
}

export default MindOrganize
