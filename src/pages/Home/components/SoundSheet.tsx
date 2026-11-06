import type { CSSProperties } from 'react'
import closeIcon from '../../../assets/icons/close-sound.svg'
import soundOnIcon from '../../../assets/icons/sound-on.svg'
import Overlay from '../../../components/Overlay/Overlay'
import { NATURE_SOUND_OPTIONS, type NatureSound } from '../natureSounds'
import '../../../styles/SoundSheet.css'

type SoundSheetProps = {
  sound: NatureSound
  volume: number
  onSoundChange: (sound: NatureSound) => void
  onVolumeChange: (volume: number) => void
  onClose: () => void
}

/** 홈 - 소리: 자연음 선택 + 음량 조절 모달 */
function SoundSheet({
  sound,
  volume,
  onSoundChange,
  onVolumeChange,
  onClose,
}: SoundSheetProps) {
  return (
    <Overlay placement="center" onClose={onClose}>
      <section
        className="sound-sheet"
        role="dialog"
        aria-modal="true"
        aria-labelledby="sound-sheet-title"
      >
        <header className="sound-sheet__header">
          <h2 id="sound-sheet-title" className="sound-sheet__title">
            자연음
          </h2>
          <button
            type="button"
            className="sound-sheet__close"
            aria-label="닫기"
            autoFocus
            onClick={onClose}
          >
            <img src={closeIcon} width={30} height={30} alt="" />
          </button>
        </header>

        <div className="sound-sheet__options" role="radiogroup" aria-label="자연음 종류">
          {NATURE_SOUND_OPTIONS.map((option) => {
            const selected = option.value === sound
            return (
              <button
                key={option.value}
                type="button"
                role="radio"
                aria-checked={selected}
                className={`sound-sheet__option${
                  selected ? ' sound-sheet__option--selected' : ''
                }`}
                onClick={() => onSoundChange(option.value)}
              >
                {option.label}
              </button>
            )
          })}
        </div>

        <div className="sound-sheet__volume">
          <img src={soundOnIcon} width={22} height={22} alt="" />
          <input
            type="range"
            className="sound-sheet__slider"
            min={0}
            max={100}
            step={1}
            value={volume}
            aria-label="음량"
            disabled={sound === 'off'}
            style={{ '--volume': `${volume}%` } as CSSProperties}
            onChange={(event) => onVolumeChange(Number(event.target.value))}
          />
          <span className="sound-sheet__volume-value" aria-hidden="true">
            {volume}
          </span>
        </div>
      </section>
    </Overlay>
  )
}

export default SoundSheet
