import { useId, type ReactNode } from 'react'
import Overlay from '../Overlay/Overlay'
import '../../styles/BottomSheet.css'

type BottomSheetProps = {
    title: string
    description?: string
    onClose: () => void
    /** 본문 (입력창, 목록 등) */
    children: ReactNode
    /** 하단 버튼 영역 */
    actions: ReactNode
}

/**
 * 하단 시트 공통 틀 (Figma: 내용 기억하기 171:3576 / 기억 고르기 171:3636, 402 × 383)
 * - 손잡이 + 제목 + 안내 문구 + 본문 + 좌우 버튼
 * - 바깥 영역 클릭·Esc로 닫힘 (Overlay)
 */
function BottomSheet({
    title,
    description,
    onClose,
    children,
    actions,
}: BottomSheetProps) {
    const titleId = useId()

    return (
        <Overlay placement="bottom" onClose={onClose}>
            <section
                className="bottom-sheet"
                role="dialog"
                aria-modal="true"
                aria-labelledby={titleId}
            >
                <span className="bottom-sheet__handle" aria-hidden="true" />
                <h2 id={titleId} className="bottom-sheet__title">
                    {title}
                </h2>
                {description && (
                    <p className="bottom-sheet__description">{description}</p>
                )}
                <div className="bottom-sheet__body">{children}</div>
                <div className="bottom-sheet__actions">{actions}</div>
            </section>
        </Overlay>
    )
}

export default BottomSheet