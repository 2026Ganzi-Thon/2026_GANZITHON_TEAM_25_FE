type AfterProps = {
    /** 털 깎으며 정리하기 */
    onShave?: () => void
    /** 다음 활동 보기 */
    onNext?: () => void
    /** 여기서 끝내기 */
    onEnd?: () => void
}

/** 털어낸 후 ① (Figma: 털어낸후 171:3392) — 대화를 마친 직후 */
function After({ onShave, onNext, onEnd }: AfterProps) {
    return (
        <main>
            <h1>털어놓은 마음, 털을 한번에 털어냈어요!</h1>
            <button type="button" onClick={onShave}>
                털 깎으며 정리하기
            </button>
            <button type="button" onClick={onNext}>
                다음 활동 보기
            </button>
            <button type="button" onClick={onEnd}>
                여기서 끝내기
            </button>
        </main>
    )
}

export default After