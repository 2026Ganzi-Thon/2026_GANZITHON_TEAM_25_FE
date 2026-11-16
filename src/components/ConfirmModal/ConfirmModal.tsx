import { useId, type ReactNode } from 'react'
import Overlay from '../Overlay/Overlay'
import '../../styles/ConfirmModal.css'

type ConfirmModalProps = {
    title: string
    description?: ReactNode
    confirmLabel: string
    /** true면 확인 버튼을 누를 수 없어요 (예: 입력이 비어 있을 때) */
    confirmDisabled?: boolean
    onConfirm: () => void
    onCancel: () => void
    /** 설명 대신(또는 함께) 넣을 내용 — 예: 고치기 입력창 */
    children?: ReactNode
}

/** 되돌릴 수 없는 행동 전에 한 번 더 묻는 가운데 모달 (Figma: 기억한 이야기 - 경고 171:4050) */
function ConfirmModal({
    title,
    description,
    confirmLabel,
    confirmDisabled = false,
    onConfirm,
    onCancel,
    children,
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
                {description && <p className="confirm-modal__desc">{description}</p>}
                {children && <div className="confirm-modal__body">{children}</div>}
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
                        disabled={confirmDisabled}
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