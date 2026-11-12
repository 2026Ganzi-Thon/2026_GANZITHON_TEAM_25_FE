type EndProps = {
    /** 이번 대화에서 기억한 요약 개수 */
    savedCount: number
    /** 처음 화면으로 */
    onHome?: () => void
}

/** 털어낸 후 ② 종료 화면 (Figma: 털어낸후 171:3420) */
function End({ savedCount, onHome }: EndProps) {
    return (
        <main>
            <h1>오늘은 여기까지.</h1>
            <p>기억한 요약: {savedCount}개</p>
            <button type="button" onClick={onHome}>
                처음 화면으로
            </button>
        </main>
    )
}

export default End