import { useState, type SubmitEvent } from 'react'
import arrowBack from '../../assets/icons/arrow-back.svg'
import iconError from '../../assets/icons/error-cross.svg'
import { checkUserIdAvailable } from '../../api/auth'
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

const HAS_LETTER = /[A-Za-z]/
const HAS_DIGIT = /[0-9]/
const HAS_SYMBOL = /[^A-Za-z0-9]/

/** 지금 단계의 입력값을 검사해서 안내 문구를 돌려줘요. 문제가 없으면 빈 문자열 */
function validate(step: Step, values: Record<Step, string>): string {
    const value = values[step]

    if (step === 'userId') {
        if (value.length < 6) return '아이디는 6자 이상 입력해 주세요.'
        if (!HAS_LETTER.test(value) || !HAS_DIGIT.test(value)) {
            return '아이디는 영문과 숫자를 모두 포함하여 입력해주세요.'
        }
    }

    if (step === 'password') {
        if (value.length < 6) return '비밀번호를 6자 이상 입력해주세요.'
        if (!HAS_LETTER.test(value) || !HAS_DIGIT.test(value) || !HAS_SYMBOL.test(value)) {
            return '비밀번호에 영문, 숫자, 특수기호를 모두 포함하여 입력해주세요.'
        }
    }

    if (step === 'passwordConfirm') {
        if (value === '') return '비밀번호를 한 번 더 입력해 주세요.'
        if (value !== values.password) return '비밀번호가 일치하지 않아요.'
    }

    return ''
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

    const [errorMessage, setErrorMessage] = useState('')
    /** 중복확인을 통과한 아이디 (아직 확인 전이면 null) */
    const [checkedUserId, setCheckedUserId] = useState<string | null>(null)
    const [isChecking, setIsChecking] = useState(false)

    const info = STEP_INFO[step]
    const value = values[step]
    const stepIndex = STEPS.indexOf(step)

    // 아이디를 고치면 값이 달라져서 자동으로 "확인 전"이 돼요
    const isIdChecked = checkedUserId === values.userId

    // 이름 단계는 입력했을 때만, 나머지 단계는 항상 "다음"이 보여요 (Figma와 같게)
    const showNext = step !== 'name' || value.trim() !== ''

    const handleNext = (e: SubmitEvent<HTMLFormElement>) => {
        e.preventDefault() // 폼 제출 시 페이지 새로고침 막기
        if (step === 'name' && value.trim() === '') return

        const message = validate(step, values)
        if (message) {
            setErrorMessage(message)
            return
        }
        if (step === 'userId' && !isIdChecked) {
            setErrorMessage('아이디 중복확인을 해 주세요.')
            return
        }
        setErrorMessage('')

        const isLastStep = stepIndex === STEPS.length - 1
        if (isLastStep) {
            onComplete?.() // 5단계에서 "약관 동의 시트 열기"로 바꿔요
        } else {
            setStep(STEPS[stepIndex + 1])
        }
    }

    const handleCheckId = async () => {
        const message = validate('userId', values)
        if (message) {
            setErrorMessage(message)
            return
        }

        const userId = values.userId
        setIsChecking(true)
        setErrorMessage('')
        try {
            const available = await checkUserIdAvailable(userId)
            if (available) {
                setCheckedUserId(userId)
            } else {
                setErrorMessage('이미 사용 중인 아이디예요.')
            }
        } catch {
            setErrorMessage('잠시 후 다시 시도해 주세요.')
        } finally {
            setIsChecking(false)
        }
    }

    // 첫 단계에서는 첫화면으로, 그 뒤로는 이전 단계로
    const handleBack = () => {
        setErrorMessage('')
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
                        onChange={(e) => {
                            setValues({ ...values, [step]: e.target.value })
                            setErrorMessage('')
                        }}
                    />
                    {step === 'userId' && (
                        <button
                            type="button"
                            className="signup__check"
                            onClick={handleCheckId}
                            disabled={isChecking}
                        >
                            중복확인
                        </button>
                    )}
                </div>

                <p className="signup__message" role="alert">
                    {errorMessage ? (
                        <>
                            <img src={iconError} width={20} height={20} alt="" />
                            {errorMessage}
                        </>
                    ) : step === 'userId' && isIdChecked ? (
                        <span className="signup__message-ok">사용할 수 있는 아이디예요.</span>
                    ) : null}
                </p>

                {showNext && (
                    <button type="submit" className="signup__next">
                        다음
                    </button>
                )}
            </form>
        </main>
    )
}

export default SignUp