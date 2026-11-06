import { useEffect, type MouseEvent, type ReactNode } from 'react'
import './Overlay.css'

type OverlayProps = {
  /** center: 가운데 모달(자연음) / bottom: 하단 시트(메뉴) */
  placement: 'center' | 'bottom'
  onClose: () => void
  children: ReactNode
}

/** 화면을 어둡게 덮는 공통 레이어 — 바깥 영역 클릭과 Esc 키로 닫힘 */
function Overlay({ placement, onClose, children }: OverlayProps) {
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') onClose()
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [onClose])

  const handleBackdropClick = (event: MouseEvent<HTMLDivElement>) => {
    if (event.target === event.currentTarget) onClose()
  }

  return (
    <div
      className={`overlay overlay--${placement}`}
      onClick={handleBackdropClick}
    >
      {children}
    </div>
  )
}

export default Overlay
