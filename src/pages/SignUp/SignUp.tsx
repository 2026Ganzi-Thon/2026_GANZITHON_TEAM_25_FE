import { useState, type SubmitEvent } from 'react'
import arrowBack from '../../assets/icons/arrow-back.svg'
import '../../styles/SignUp.css'

/** 회원가입 단계 (입력칸 하나짜리 화면 4개) */
type Step = 'name' | 'userId' | 'password' | 'passwordConfirm'

/** 단계 순서 — 다음/뒤로는 이 배열에서 한 칸씩 움직여요 */
const STEPS: Step[] = ['name', 'userId', 'password', 'passwordConfirm']

type StepInfo = {
    /** 제목 두 줄 */
    title: [string, string]
    /** 입력칸 이름표 (placeholder도 같은 글자) */
    label: string
    type: 'text' | 'password'
    autoComplete: string
}

/** 단계마다 달라지는 글자와 입력 종류 */
const STEP_INFO: Record<Step, StepInfo> = {
    name: { title: ['이름을', '입력해주세요'], label: '이름', type: 'text', autoComplete: 'name' },
    userId: { title: ['아이디를', '입력해주세요'], label: '아이디', type: 'text', autoComplete: 'username' },
    password: {
        title: ['비밀번호를', '입력해주세요'],
        label: '비밀번호',
        type: 'password',
        autoComplete: 'new-password',
    },
    passwordConfirm: {
        title: ['비밀번호를', '다시 확인해주세요'],
        label: '비밀번호 확인',
        type: 'password',
        autoComplete: 'new-password',
    },
}

type SignUpProps = {
    /** 뒤로 가기 (첫화면으로) */
    onBack?: () => void
    /** 가입 완료 */
    onComplete?: () => void
}

/** 회원가입 (Figma: 회원가입 - 이름 250:56 ~ 개인정보 동의 252:141) */
function SignUp({ onBack, onComplete }: SignUpProps) {
    const [step, setStep] = useState<Step>('name')
    const [values, setValues] = useState<Record<Step, string>>({
        name: '',
        userId: '',
        password: '',
        passwordConfirm: '',
    })

    const info = STEP_INFO[step]
    const value = values[step]
    const stepIndex = STEPS.indexOf(step)

    // 빈칸(공백만 입력한 경우 포함)이면 다음으로 못 감
    const canNext = value.trim() !== ''

    const handleNext = (e: SubmitEvent<HTMLFormElement>) => {
        e.preventDefault() // 폼 제출 시 페이지 새로고침 막기
        if (!canNext) return

        const isLastStep = stepIndex === STEPS.length - 1
        if (isLastStep) {
            onComplete?.() // 5단계에서 "약관 동의 시트 열기"로 바꿔요
        } else {
            setStep(STEPS[stepIndex + 1])
        }
    }

    // 첫 단계에서는 첫화면으로, 그 뒤로는 이전 단계로
    const handleBack = () => {
        if (stepIndex === 0) {
            onBack?.()
        } else {
            setStep(STEPS[stepIndex - 1])
        }
    }

    return (
        <main className="signup">
            <form className="signup__frame" onSubmit={handleNext} noValidate>
                <button type="button" className="signup__back" onClick={handleBack} aria-label="뒤로 가기">
                    <img src={arrowBack} width={35} height={35} alt="" />
                </button>

                <h1 className="signup__title">
                    {info.title[0]}
                    <br />
                    {info.title[1]}
                </h1>

                <label className="signup__label" htmlFor="signup-input">
                    {info.label}
                </label>
                <div className="signup__field">
                    <input
                        key={step}
                        id="signup-input"
                        className="signup__input"
                        type={info.type}
                        name={step}
                        placeholder={info.label}
                        autoComplete={info.autoComplete}
                        autoCapitalize="none"
                        autoFocus
                        value={value}
                        onChange={(e) => setValues({ ...values, [step]: e.target.value })}
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