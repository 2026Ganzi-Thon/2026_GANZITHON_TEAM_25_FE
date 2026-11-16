import { useState } from 'react'
import BottomSheet from '../../../components/BottomSheet/BottomSheet'
import '../../../styles/MemorySheet.css'

type RememberSheetProps = {
    /** 요약 후보 — 사용자가 고친 뒤 저장 */
    initialSummary: string
    /** 기억하지 않기 → 저장 없이 대화 종료 */
    onSkip: () => void
    /** 이 내용만 기억하기 → 확인한 요약만 저장 */
    onSave: (summary: string) => void
    /** 바깥 영역 · Esc → 대화로 돌아가기 */
    onClose: () => void
}

/** 대화를 마칠 때 "이 내용만 기억하기" (Figma: 내용 기억하기 171:3576) */
function RememberSheet({
    initialSummary,
    onSkip,
    onSave,
    onClose,
}: RememberSheetProps) {
    const [summary, setSummary] = useState(initialSummary)
    const trimmed = summary.trim()

    return (
        <BottomSheet
            title="이 내용만 기억하기"
            description="기억할 요약이에요. 고치거나 빼고 싶은 내용은 수정해주세요."
            onClose={onClose}
            actions={
                <>
                    <button
                        type="button"
                        className="bottom-sheet__button bottom-sheet__button--secondary"
                        onClick={onSkip}
                    >
                        기억하지 않기
                    </button>
                    <button
                        type="button"
                        className="bottom-sheet__button bottom-sheet__button--primary"
                        disabled={!trimmed}
                        onClick={() => onSave(trimmed)}
                    >
                        이 내용만 기억하기
                    </button>
                </>
            }
        >
            <textarea
                className="memory-summary"
                aria-label="기억할 요약"
                value={summary}
                maxLength={300}
                onChange={(event) => setSummary(event.target.value)}
            />
        </BottomSheet>
    )
}

export default RememberSheet