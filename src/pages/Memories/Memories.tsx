type MemoriesProps = {
    onBack?: () => void;
}

function Memories({ onBack }: MemoriesProps) {
    return (
        <main>
            <button type="button" onClick={onBack}>
                뒤로
            </button>
            <h1>기억한 이야기</h1>
        </main>
    )
}

export default Memories;