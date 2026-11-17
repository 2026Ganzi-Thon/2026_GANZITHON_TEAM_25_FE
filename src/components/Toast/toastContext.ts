import { createContext, useContext } from 'react'

export type ToastType = 'success' | 'error'
/** bottom: 화면 아래(기본) / middle: 하단 시트 위쪽 (시트가 열려 있을 때) */
export type ToastPlacement = 'bottom' | 'middle'

export type ShowToast = (
    type: ToastType,
    message: string,
    placement?: ToastPlacement,
) => void

export const ToastContext = createContext<ShowToast | null>(null)

/** 어느 화면에서든 토스트 띄우기: const showToast = useToast() */
export function useToast(): ShowToast {
    const showToast = useContext(ToastContext)
    if (!showToast) throw new Error('ToastProvider 안에서만 useToast를 쓸 수 있어요.')
    return showToast
}