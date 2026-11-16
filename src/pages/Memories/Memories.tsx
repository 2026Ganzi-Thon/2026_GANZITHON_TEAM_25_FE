import { useEffect, useState } from 'react';
import arrowBack from '../../assets/icons/arrow-back.svg';
import HeaderActions from '../../components/HeaderActions/HeaderActions';
import {
    deleteAllMemories,
    deleteMemory,
    getMemories,
    updateMemory,
    type Memory,
} from '../../api/memories';
import ConfirmModal from '../../components/ConfirmModal/ConfirmModal';
import '../../styles/Memories.css'

/** 지울 대상: 기억 하나 또는 전체 */
type DeleteTarget = { kind: 'one'; memoryId: string } | { kind: 'all' }

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
    const [deleteTarget, setDeleteTarget] = useState<DeleteTarget | null>(null)
    const [editingId, setEditingId] = useState<string | null>(null)
    const [draft, setDraft] = useState('')
    useEffect(() => {
        getMemories().then(setMemories)
    }, [])
    const handleConfirmDelete = async () => {
        if (!deleteTarget) return

        if (deleteTarget.kind === 'all') {
            await deleteAllMemories()
            setMemories([])
        } else {
            const { memoryId } = deleteTarget
            await deleteMemory(memoryId)
            setMemories((prev) => prev.filter((memory) => memory.memoryId !== memoryId))
        }
        setDeleteTarget(null)
    }
    const startEdit = (memory: Memory) => {
        setEditingId(memory.memoryId)
        setDraft(memory.summary)
    }

    const handleSaveEdit = async (memoryId: string) => {
        const summary = draft.trim()
        if (!summary) return

        const updated = await updateMemory(memoryId, summary)
        setMemories((prev) =>
            prev.map((memory) => (memory.memoryId === memoryId ? updated : memory)),
        )
        setEditingId(null)
    }
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
                                    <button
                                        type="button"
                                        className="memory-card__button"
                                        onClick={() => startEdit(memory)}
                                    >
                                        고치기
                                    </button>
                                    <button
                                        type="button"
                                        className="memory-card__button"
                                        onClick={() =>
                                            setDeleteTarget({ kind: 'one', memoryId: memory.memoryId })
                                        }
                                    >
                                        지우기
                                    </button>
                                </div>
                            </li>
                        ))}
                    </ul>
                    <button
                        type="button"
                        className="memories__clear"
                        onClick={() => setDeleteTarget({ kind: 'all' })}
                    >
                        모두 지우기
                    </button>
                </>
            )}
            {editingId && (
                <ConfirmModal
                    title="기억한 이야기 고치기"
                    confirmLabel="이 기억 고치기"
                    confirmDisabled={draft.trim() === ''}
                    onConfirm={() => handleSaveEdit(editingId)}
                    onCancel={() => setEditingId(null)}
                >
                    <textarea
                        className="memory-edit__input"
                        value={draft}
                        maxLength={300}
                        aria-label="기억 문장 고치기"
                        autoFocus
                        onChange={(event) => setDraft(event.target.value)}
                    />
                </ConfirmModal>
            )}
            {deleteTarget && (
                <ConfirmModal
                    title={deleteTarget.kind === 'all' ? '기억을 모두 지울까요?' : '이 기억을 지울까요?'}
                    description={
                        <>
                            지우면 다음 대화에 참고하지 않아요.
                            <br />
                            한번 지운 요약은 되돌릴 수 없어요.
                        </>
                    }
                    confirmLabel={deleteTarget.kind === 'all' ? '모두 지우기' : '이 기억 지우기'}
                    onConfirm={handleConfirmDelete}
                    onCancel={() => setDeleteTarget(null)}
                />
            )}
        </main>
    )
}

export default Memories;