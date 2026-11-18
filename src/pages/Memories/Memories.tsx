import { useCallback, useEffect, useState } from 'react';
import arrowBack from '../../assets/icons/arrow-back.svg';
import HeaderActions, { type HeaderButtonHandlers } from '../../components/HeaderActions/HeaderActions'
import {
    deleteAllMemories,
    deleteMemory,
    getMemories,
    updateMemory,
    type Memory,
} from '../../api/memories';
import ConfirmModal from '../../components/ConfirmModal/ConfirmModal';
import '../../styles/Memories.css'
import { ApiError } from '../../api/client';
import ErrorScreen, { type ScreenErrorKind } from '../../components/ErrorScreen/ErrorScreen';
import { useToast } from '../../components/Toast/toastContext';
import { getErrorKind, getToastMessage } from '../../api/errors';


/** 지울 대상: 기억 하나 또는 전체 */
type DeleteTarget = { kind: 'one'; memoryId: string } | { kind: 'all' }

type MemoriesProps = {
    onBack?: () => void;
    onHome?: () => void;
} & HeaderButtonHandlers

/** "2026-10-24T..." -> "10월 24일 기억함" */
function formatDate(iso: string) {
    const date = new Date(iso)
    return `${date.getMonth() + 1}월 ${date.getDate()}일 기억함`
}


function Memories({ onBack, onSoundClick, onMenuClick, onHome }: MemoriesProps) {
    const [memories, setMemories] = useState<Memory[]>([])
    const [deleteTarget, setDeleteTarget] = useState<DeleteTarget | null>(null)
    const [editingId, setEditingId] = useState<string | null>(null)
    const [draft, setDraft] = useState('')
    const [loading, setLoading] = useState(true)
    const [loadError, setLoadError] = useState<ScreenErrorKind | null>(null)
    const showToast = useToast()

    /** 기억 목록 불러오기 — 첫 진입과 "다시 시도"가 함께 써요 */
    const fetchMemories = useCallback(() => {
        getMemories()
            .then(setMemories)
            .catch((error) => {
                // 4xx처럼 애매한 실패도 화면을 못 그리긴 마찬가지라 서비스 오류로 보여줘요
                setLoadError(getErrorKind(error) === 'network' ? 'network' : 'service')
            })
            .finally(() => setLoading(false))
    }, [])

    useEffect(() => {
        fetchMemories()
    }, [fetchMemories])

    const handleRetry = () => {
        setLoadError(null)
        setLoading(true)
        fetchMemories()
    }
    const handleConfirmDelete = async () => {
        if (!deleteTarget) return
        try {
            if (deleteTarget.kind === 'all') {
                await deleteAllMemories()
                setMemories([])
            } else {
                await deleteMemory(deleteTarget.memoryId)
                setMemories((prev) => prev.filter((m) => m.memoryId !== deleteTarget.memoryId))
            }
            showToast('success', '삭제되었어요.')
        } catch (error) {
            if (error instanceof ApiError && error.status === 404) {
                // 이미 지워진 기억(다른 기기에서 지움 등)이면 목록에서도 빼요
                if (deleteTarget.kind === 'one') {
                    setMemories((prev) => prev.filter((m) => m.memoryId !== deleteTarget.memoryId))
                }
                showToast('error', '이미 삭제된 기억이에요')
            } else {
                showToast('error', getToastMessage(error))
            }
        } finally {
            setDeleteTarget(null)
        }
    }
    const startEdit = (memory: Memory) => {
        setEditingId(memory.memoryId)
        setDraft(memory.summary)
    }

        const handleSaveEdit = async (memoryId: string) => {
        const summary = draft.trim()
        if (!summary) return
        try {
            const updated = await updateMemory(memoryId, summary)
            setMemories((prev) =>
                prev.map((memory) => (memory.memoryId === memoryId ? updated : memory)),
            )
            showToast('success', '저장되었어요.')
        } catch (error) {
            if (error instanceof ApiError && error.status === 404) {
                setMemories((prev) => prev.filter((m) => m.memoryId !== memoryId))
                showToast('error', '이미 삭제된 기억이에요')
            } else {
                showToast('error', getToastMessage(error))
            }
        } finally {
            setEditingId(null)
        }
    }
    if (loadError) {
        return <ErrorScreen kind={loadError} onRetry={handleRetry} onHome={onHome} />
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
                <HeaderActions onSoundClick={onSoundClick} onMenuClick={onMenuClick} />
            </header>

            <h1 className="memories__title">기억한 이야기</h1>
            <p className="memories__desc">
                '이 내용만 기억하기'로 내가 허락한 요약만 남아요.
                <br />
                대화 원문은 저장하지 않고, 지운 기억은 다음 대화에 쓰지 않아요.
            </p>

            {loading ? null : memories.length === 0 ? (
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
            )
            }
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