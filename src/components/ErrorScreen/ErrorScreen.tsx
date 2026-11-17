import mongleImage from '../../assets/images/alpaca.png'
import '../../styles/ErrorScreen.css'

export type ScreenErrorKind = 'network' | 'service'

type ErrorScreenProps = {
    kind: ScreenErrorKind
    /** 다시 시도 — 실패한 불러오기를 다시 실행 */
    onRetry: () => void
    /** 홈으로 (네트워크 오류일 때만 보여요) */
    onHome?: () => void
}

/** Figma: 네트워크 오류 / 서비스 오류 */
const CONTENT: Record<ScreenErrorKind, { title: string; showHome: boolean }> = {
    network: { title: '네트워크 연결 상태가 좋지 않아요', showHome: true },
    service: { title: '서비스 이용이 원활하지 않아요', showHome: false },
}

/** 화면에 필요한 데이터를 처음부터 못 불러왔을 때 화면 전체를 대신해요 */
function ErrorScreen({ kind, onRetry, onHome }: ErrorScreenProps) {
    const { title, showHome } = CONTENT[kind]

    return (
        <main className="error-screen" role="alert">
            <img className="error-screen__mongle" src={mongleImage} width={160} alt="" />
            <h1 className="error-screen__title">{title}</h1>
            <p className="error-screen__desc">연결 상태 확인 후 다시 시도해주세요</p>

            <div className="error-screen__actions">
                <button type="button" className="error-screen__button" onClick={onRetry}>
                    다시 시도
                </button>
                {showHome && onHome && (
                    <button type="button" className="error-screen__button" onClick={onHome}>
                        홈으로
                    </button>
                )}
            </div>
        </main>
    )
}

export default ErrorScreen