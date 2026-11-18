import { useCallback, useEffect, useRef, useState, type ReactNode } from 'react'
import {
    ToastContext,
    type ShowToast,
    type ToastPlacement,
    type ToastType,
} from './toastContext'
import '../../styles/Toast.css'

type ToastItem = {
    id: number
    type: ToastType
    message: string
    placement: ToastPlacement
}

/** 토스트가 떠 있는 시간 */
const TOAST_DURATION = 2500

/** 시안: 실패는 포인트 색 "!", 성공은 초록 체크 */
function ToastIcon({ type }: { type: ToastType }) {
    return type === 'success' ? (
        <svg width="20" height="20" viewBox="0 0 20 20" aria-hidden="true">
            <circle cx="10" cy="10" r="10" fill="#5CBF6A" />
            <path d="M6 10.3l2.7 2.7L14 7.7" fill="none" stroke="#fff"
                strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
    ) : (
        <svg width="20" height="20" viewBox="0 0 20 20" aria-hidden="true">
            <circle cx="10" cy="10" r="10" fill="var(--color-point)" />
            <rect x="9.1" y="4.8" width="1.8" height="6.6" rx="0.9" fill="#fff" />
            <circle cx="10" cy="14.3" r="1.1" fill="#fff" />
        </svg>
    )
}

/** 앱 전체를 감싸서 어느 화면에서든 토스트를 띄울 수 있게 해요 */
function ToastProvider({ children }: { children: ReactNode }) {
    const [toast, setToast] = useState<ToastItem | null>(null)
    const idRef = useRef(0)

    const showToast = useCallback<ShowToast>((type, message, placement = 'bottom') => {
        idRef.current += 1
        setToast({ id: idRef.current, type, message, placement })
    }, [])

    // 새 토스트가 뜰 때마다 타이머를 새로 시작 (연달아 눌러도 마지막 것이 2.5초 유지)
    useEffect(() => {
        if (!toast) return
        const timer = window.setTimeout(() => setToast(null), TOAST_DURATION)
        return () => window.clearTimeout(timer)
    }, [toast])

    return (
        <ToastContext.Provider value={showToast}>
            {children}
            {/* 화면 읽기 프로그램이 토스트 문구를 읽어주도록 status 영역은 항상 둬요 */}
            <div
                className={`toast-region toast-region--${toast?.placement ?? 'bottom'}`}
                role="status"
                aria-live="polite"
            >
                {toast && (
                    <div key={toast.id} className={`toast toast--${toast.type}`}>
                        <ToastIcon type={toast.type} />
                        <span className="toast__message">{toast.message}</span>
                    </div>
                )}
            </div>
        </ToastContext.Provider>
    )
}

export default ToastProvider