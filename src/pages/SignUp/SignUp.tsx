import { useState, type SubmitEvent } from 'react'
import arrowBack from '../../assets/icons/arrow-back.svg'
import '../../styles/SignUp.css'

type SignUpProps = {
    /** 뒤로 가기 (첫화면으로) */
    onBack?: () => void
    /** 가입 완료 */
    onComplete?: () => void
}

/** 회원가입 (Figma: 회원가입 - 이름 250:56 ~ 개인정보 동의 252:141) */
function SignUp({ onBack, onComplete }: SignUpProps) {
    const [name, setName] = useState('')

    // 빈칸(공백만 입력한 경우 포함)이면 다음으로 못 감
    const canNext = name.trim() !== ''

    const handleNext = (e: SubmitEvent<HTMLFormElement>) => {
        e.preventDefault() // 폼 제출 시 페이지 새로고침 막기
        if (!canNext) return
        onComplete?.() // 3단계에서 "다음 단계로 넘어가기"로 바꿔요
    }

    return (
        <main className="signup">
            <form className="signup__frame" onSubmit={handleNext} noValidate>
                <button type="button" className="signup__back" onClick={onBack} aria-label="뒤로 가기">
                    <img src={arrowBack} width={35} height={35} alt="" />
                </button>

                <h1 className="signup__title">
                    이름을
                    <br />
                    입력해주세요
                </h1>

                <label className="signup__label" htmlFor="signup-input">
                    이름
                </label>
                <div className="signup__field">
                    <input
                        id="signup-input"
                        className="signup__input"
                        type="text"
                        name="name"
                        placeholder="이름"
                        autoComplete="name"
                        autoFocus
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                    />
                </div>

                {canNext && (
                    <button type="submit" className="signup__next">
                        다음
                    </button>
                )}
            </form>
        </main>
    )
}

export default SignUp