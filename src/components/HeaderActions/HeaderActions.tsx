import soundButton from '../../assets/icons/sound-button.svg'
import menuButton from '../../assets/icons/menu-button.svg'
import './HeaderActions.css'

type HeaderActionsProps = {
  onSoundClick?: () => void
  onMenuClick?: () => void
}

/** 우측 상단 공통 버튼 묶음 (자연음 / 메뉴) — 홈·내 마음 정리 등 여러 화면에서 재사용 */
function HeaderActions({ onSoundClick, onMenuClick }: HeaderActionsProps) {
  return (
    <div className="header-actions">
      <button
        type="button"
        className="header-actions__button"
        aria-label="자연음 설정"
        onClick={onSoundClick}
      >
        <img src={soundButton} width={44} height={43} alt="" />
      </button>
      <button
        type="button"
        className="header-actions__button"
        aria-label="메뉴 열기"
        onClick={onMenuClick}
      >
        <img src={menuButton} width={44} height={43} alt="" />
      </button>
    </div>
  )
}

export default HeaderActions
