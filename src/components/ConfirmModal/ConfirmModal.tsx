import { useId, type ReactNode } from 'react'
import Overlay from '../Overlay/Overlay'
import '../../styles/ConfirmModal.css'

type ConfirmModalProps = {
    title: string
    description: ReactNode
    confirmLabel: string
    onConfirm: () => void
    onCancel: () => void
}

/** 되돌릴 수 없는 행동 전에 한 번 더 묻는 가운데 모달 (Figma: 기억한 이야기 - 경고 171:4050) */
function ConfirmModal({
    title,
    description,
    confirmLabel,
    onConfirm,
    onCancel,
}: ConfirmModalProps) {
    const titleId = useId()

    return (
        <Overlay placement="center" onClose={onCancel}>
            <div
                className="confirm-modal"
                role="alertdialog"
                aria-modal="true"
                aria-labelledby={titleId}
            >
                <h2 id={titleId} className="confirm-modal__title">
                    {title}
                </h2>
                <p className="confirm-modal__desc">{description}</p>
                <div className="confirm-modal__actions">
                    <button
                        type="button"
                        className="confirm-modal__button confirm-modal__button--cancel"
                        onClick={onCancel}
                    >
                        취소
                    </button>
                    <button
                        type="button"
                        className="confirm-modal__button confirm-modal__button--confirm"
                        onClick={onConfirm}
                    >
                        {confirmLabel}
                    </button>
                </div>
            </div>
        </Overlay>
    )
}

export default ConfirmModal