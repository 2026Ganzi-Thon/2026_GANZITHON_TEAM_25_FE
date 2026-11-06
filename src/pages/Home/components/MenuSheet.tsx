import chevronRight from '../../../assets/icons/chevron-right.svg'
import closeIcon from '../../../assets/icons/close-menu.svg'
import logoutIcon from '../../../assets/icons/logout.svg'
import Overlay from '../../../components/Overlay/Overlay'
import '../../../styles/MenuSheet.css'

type MenuSheetProps = {
  /** 기억한 이야기 개수 — 없으면 표시하지 않음 */
  memoryCount?: number
  vibration: boolean
  onVibrationChange: (on: boolean) => void
  onOpenMemories?: () => void
  onOpenMyMongle?: () => void
  onOpenHelp?: () => void
  onLogout?: () => void
  onClose: () => void
}

/** 홈 - 햄버거바: 하단에서 올라오는 메뉴 시트 */
function MenuSheet({
  memoryCount,
  vibration,
  onVibrationChange,
  onOpenMemories,
  onOpenMyMongle,
  onOpenHelp,
  onLogout,
  onClose,
}: MenuSheetProps) {
  return (
    <Overlay placement="bottom" onClose={onClose}>
      <section
        className="menu-sheet"
        role="dialog"
        aria-modal="true"
        aria-labelledby="menu-sheet-title"
      >
        <span className="menu-sheet__handle" aria-hidden="true" />

        <header className="menu-sheet__header">
          <h2 id="menu-sheet-title" className="menu-sheet__title">
            메뉴
          </h2>
          <button
            type="button"
            className="menu-sheet__close"
            aria-label="닫기"
            autoFocus
            onClick={onClose}
          >
            <img src={closeIcon} width={33} height={33} alt="" />
          </button>
        </header>

        <ul className="menu-sheet__list">
          <li>
            <button
              type="button"
              className="menu-sheet__item menu-sheet__item--tall"
              onClick={onOpenMemories}
            >
              <span className="menu-sheet__label">기억한 이야기</span>
              {memoryCount !== undefined && (
                <span className="menu-sheet__meta">{memoryCount}개</span>
              )}
              <img src={chevronRight} width={16} height={16} alt="" />
            </button>
          </li>
          <li>
            <button
              type="button"
              className="menu-sheet__item"
              onClick={onOpenMyMongle}
            >
              <span className="menu-sheet__label">나의 몽글이</span>
              <span className="menu-sheet__meta">닮은 점·성향·꾸미기</span>
              <img src={chevronRight} width={16} height={16} alt="" />
            </button>
          </li>
          <li>
            <button
              type="button"
              className="menu-sheet__item"
              onClick={onOpenHelp}
            >
              <span className="menu-sheet__label">도움이 필요할 때</span>
              <img src={chevronRight} width={16} height={16} alt="" />
            </button>
          </li>
          <li className="menu-sheet__item menu-sheet__item--static">
            <span className="menu-sheet__label" id="menu-vibration-label">
              진동
            </span>
            <button
              type="button"
              role="switch"
              aria-checked={vibration}
              aria-labelledby="menu-vibration-label"
              className={`menu-sheet__switch${
                vibration ? ' menu-sheet__switch--on' : ''
              }`}
              onClick={() => onVibrationChange(!vibration)}
            >
              <span className="menu-sheet__switch-knob" />
            </button>
          </li>
          <li>
            <button
              type="button"
              className="menu-sheet__item menu-sheet__item--tall menu-sheet__item--danger"
              onClick={onLogout}
            >
              <span className="menu-sheet__label">로그아웃</span>
              <img src={logoutIcon} width={18} height={17} alt="" />
            </button>
          </li>
        </ul>
      </section>
    </Overlay>
  )
}

export default MenuSheet
