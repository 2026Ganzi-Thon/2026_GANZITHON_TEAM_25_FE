import { useState } from 'react'
import BottomSheet from '../../../components/BottomSheet/BottomSheet'
import type { Memory } from '../../../api/memories'
import '../../../styles/MemorySheet.css'

type MemoryPickSheetProps = {
    memories: Memory[]
    /** 이미 꺼내 둔 기억 (다시 열었을 때 체크 유지) */
    initialSelectedIds: string[]
    /** 고른 기억과 시작 */
    onStartWith: (ids: string[]) => void
    /** 기억 없이 시작 */
    onStartWithout: () => void
    onClose: () => void
}

/** "꺼낼 기억 고르기" (Figma: 기억 고르기 171:3636) */
function MemoryPickSheet({
    memories,
    initialSelectedIds,
    onStartWith,
    onStartWithout,
    onClose,
}: MemoryPickSheetProps) {
    const [selectedIds, setSelectedIds] = useState(initialSelectedIds)

    const toggle = (id: string) => {
        setSelectedIds((prev) =>
            prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id],
        )
    }

    return (
        <BottomSheet
            title="꺼낼 기억 고르기"
            description="이번 대화에 꺼낼 기억만 골라요. 고르지 않아도 대화할 수 있어요."
            onClose={onClose}
            actions={
                <>
                    <button
                        type="button"
                        className="bottom-sheet__button bottom-sheet__button--secondary"
                        onClick={onStartWithout}
                    >
                        기억 없이 시작
                    </button>
                    <button
                        type="button"
                        className="bottom-sheet__button bottom-sheet__button--primary"
                        disabled={selectedIds.length === 0}
                        onClick={() => onStartWith(selectedIds)}
                    >
                        고른 기억과 시작 ({selectedIds.length})
                    </button>
                </>
            }
        >
            {memories.length === 0 ? (
                <p className="memory-empty">
                    아직 기억한 이야기가 없어요.
                    <br />
                    대화를 마칠 때 &lsquo;이 내용만 기억하기&rsquo;로 남길 수 있어요.
                </p>
            ) : (
                <ul className="memory-list" aria-label="기억한 이야기">
                    {memories.map((memory) => {
                        const selected = selectedIds.includes(memory.memoryId)
                        return (
                            <li key={memory.memoryId}>
                                <button
                                    type="button"
                                    role="checkbox"
                                    aria-checked={selected}
                                    className={`memory-option${selected ? ' memory-option--selected' : ''
                                        }`}
                                    onClick={() => toggle(memory.memoryId)}
                                >
                                    <span className="memory-option__check" aria-hidden="true">
                                        {selected && (
                                            <svg width="18" height="14" viewBox="0 0 18 14" fill="none">
                                                <path
                                                    d="M1 7l5 5L17 1"
                                                    stroke="currentColor"
                                                    strokeWidth="2"
                                                    strokeLinecap="round"
                                                    strokeLinejoin="round"
                                                />
                                            </svg>
                                        )}
                                    </span>
                                    <span className="memory-option__text">{memory.summary}</span>
                                </button>
                            </li>
                        )
                    })}
                </ul>
            )}
        </BottomSheet>
    )
}

export default MemoryPickSheet