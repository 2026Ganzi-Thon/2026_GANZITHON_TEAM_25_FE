import { useEffect, useState } from 'react';
import arrowBack from '../../assets/icons/arrow-back.svg';
import HeaderActions from '../../components/HeaderActions/HeaderActions';
import { getMemories, type Memory } from '../../api/memories';
import '../../styles/Memories.css'

type MemoriesProps = {
    onBack?: () => void;
}

/** "2026-10-24T..." -> "10월 24일 기억함" */
function formatDate(iso: string) {
    const date = new Date(iso)
    return `${date.getMonth() + 1}월 ${date.getDate()}일 기억함`
}

function Memories({ onBack }: MemoriesProps) {
    const [memories, setMemories] = useState<Memory[]>([])

    useEffect(() => {
        getMemories().then(setMemories)
    }, [])

    return (
        <main className="memories">
            <header className="memories__top">
                <button
                    type="button"
                    className="memories__back"
                    aria-label="뒤로가기"
                    onClick={onBack}
                >
                    <img src={arrowBack} width={35} height={35} alt="" />
                </button>
                <HeaderActions />
            </header>

            <h1 className="memories__title">기억한 이야기</h1>
            <p className="memories__desc">
                '이 내용만 기억하기'로 내가 허락한 요약만 남아요.
                <br />
                대화 원문은 저장하지 않고, 지운 기억은 다음 대화에 쓰지 않아요.
            </p>

            {memories.length === 0 ? (
                <p className="memories__empty">아직 기억한 이야기가 없어요.</p>
            ) : (
                <>
                    <ul className="memories__list">
                        {memories.map((memory) => (
                            <li key={memory.memoryId} className="memory-card">
                                <p className="memory-card__date">
                                    {formatDate(memory.approvedAt)}
                                </p>
                                <p className="memory-card__summary">{memory.summary}</p>
                                <div className="memory-card__actions">
                                    <button type="button" className="memory-card__button">
                                        고치기
                                    </button>
                                    <button type="button" className="memory-card__button">
                                        지우기
                                    </button>
                                </div>
                            </li>
                        ))}
                    </ul>
                    <button type="button" className="memories__clear">
                        모두 지우기
                    </button>
                </>
            )}
        </main>
    )
}

export default Memories;