import { useState, type SubmitEvent } from 'react'
import arrowBack from '../../assets/icons/arrow-back.svg'
import iconError from '../../assets/icons/error-cross.svg'
import iconEye from '../../assets/icons/eye.svg'
import iconEyeOff from '../../assets/icons/eye-off.svg'
import iconCheck from '../../assets/icons/check.svg'
import iconCheckOn from '../../assets/icons/check-on.svg'
import iconCheckCircle from '../../assets/icons/check-circle.svg'
import iconCheckCircleOn from '../../assets/icons/check-circle-on.svg'
import { checkLoginIdAvailable, signUp } from '../../api/auth'
import { ApiError } from '../../api/client'
import '../../styles/SignUp.css'

/** 회원가입 단계 (입력칸 하나짜리 화면 4개) */
type Step = 'name' | 'loginId' | 'password' | 'passwordConfirm'

/** 단계 순서 — 다음/뒤로는 이 배열에서 한 칸씩 움직여요 */
const STEPS: Step[] = ['name', 'loginId', 'password', 'passwordConfirm']

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
    loginId: { title: ['아이디를', '입력해주세요'], label: '아이디', type: 'text', autoComplete: 'username' },
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

/** 동의 항목 (둘 다 필수) */
type TermId = 'service' | 'privacy'

const TERMS: { id: TermId; label: string }[] = [
    { id: 'service', label: '이용약관에 동의 (필수)' },
    { id: 'privacy', label: '개인정보 처리 방침에 동의 (필수)' },
]

const HAS_LETTER = /[A-Za-z]/
const HAS_DIGIT = /[0-9]/
const HAS_SYMBOL = /[^A-Za-z0-9]/
/** 아이디에 쓸 수 있는 글자: 영문 소문자와 숫자만 */
const LOGIN_ID_CHARS = /^[a-z0-9]+$/
/** 비밀번호에 쓸 수 있는 글자: ASCII 영문·숫자·기호 32개 (공백·한글 불가) */
const PASSWORD_CHARS = /^[\x21-\x7E]+$/

/** 지금 단계의 입력값을 검사해서 안내 문구를 돌려줘요. 문제가 없으면 빈 문자열 (서버 규칙과 같게) */
function validate(step: Step, values: Record<Step, string>): string {
    const value = values[step]

    if (step === 'name') {
        if (value.trim().length > 20) return '이름은 20자 이내로 입력해 주세요.'
    }

    if (step === 'loginId') {
        if (value.length < 6) return '아이디는 6자 이상 입력해 주세요.'
        if (value.length > 20) return '아이디는 20자 이내로 입력해 주세요.'
        if (!LOGIN_ID_CHARS.test(value)) return '아이디는 영문 소문자와 숫자로만 입력해 주세요.'
        if (!HAS_LETTER.test(value) || !HAS_DIGIT.test(value)) {
            return '아이디는 영문과 숫자를 모두 포함하여 입력해주세요.'
        }
    }

    if (step === 'password') {
        if (value.length < 6) return '비밀번호를 6자 이상 입력해주세요.'
        if (value.length > 64) return '비밀번호는 64자 이내로 입력해 주세요.'
        if (!PASSWORD_CHARS.test(value)) return '비밀번호에는 공백이나 한글을 쓸 수 없어요.'
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

/** 서버가 알려준 칸(field) → 돌아갈 단계 */
const FIELD_TO_STEP: Record<string, Step> = { name: 'name', loginId: 'loginId', password: 'password' }

/** 서버 에러를 "돌아갈 단계 + 보여줄 문구"로 바꿔요 */
function getSignUpError(error: unknown): { step?: Step; message: string } {
    if (error instanceof ApiError) {
        if (error.status === 409) return { step: 'loginId', message: '이미 사용 중인 아이디예요.' }
        if (error.status === 429) return { message: '요청이 너무 많아요. 잠시 후 다시 시도해 주세요.' }
        if (error.status === 400 && error.field && FIELD_TO_STEP[error.field]) {
            return { step: FIELD_TO_STEP[error.field], message: '입력한 내용을 다시 확인해 주세요.' }
        }
        if (error.status === 0) return { message: error.message }
    }
    return { message: '잠시 후 다시 시도해 주세요.' }
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
        loginId: '',
        password: '',
        passwordConfirm: '',
    })

    const [errorMessage, setErrorMessage] = useState('')
    /** 중복확인을 통과한 아이디 (아직 확인 전이면 null) */
    const [checkedLoginId, setCheckedLoginId] = useState<string | null>(null)
    const [isChecking, setIsChecking] = useState(false)

    const [showPassword, setShowPassword] = useState(false)
    const [isTermsOpen, setIsTermsOpen] = useState(false)
    const [agreed, setAgreed] = useState<Record<TermId, boolean>>({ service: false, privacy: false })
    const [isSubmitting, setIsSubmitting] = useState(false)

    const info = STEP_INFO[step]
    const value = values[step]
    const stepIndex = STEPS.indexOf(step)

    // 아이디를 고치면 값이 달라져서 자동으로 "확인 전"이 돼요
    const isIdChecked = checkedLoginId === values.loginId

    // 이름 단계는 입력했을 때만, 나머지 단계는 항상 "다음"이 보여요 (Figma와 같게)
    const showNext = step !== 'name' || value.trim() !== ''

    const isAllAgreed = agreed.service && agreed.privacy

    const handleNext = (e: SubmitEvent<HTMLFormElement>) => {
        e.preventDefault() // 폼 제출 시 페이지 새로고침 막기
        if (step === 'name' && value.trim() === '') return

        const message = validate(step, values)
        if (message) {
            setErrorMessage(message)
            return
        }
        if (step === 'loginId' && !isIdChecked) {
            setErrorMessage('아이디 중복확인을 해 주세요.')
            return
        }
        setErrorMessage('')

        const isLastStep = stepIndex === STEPS.length - 1
        if (isLastStep) {
            setIsTermsOpen(true) // 입력이 다 끝났으니 약관 동의로
        } else {
            setStep(STEPS[stepIndex + 1])
        }
    }

    const handleCheckId = async () => {

        const message = validate('loginId', values)
        if (message) {
            setErrorMessage(message)
            return
        }

        const loginId = values.loginId
        setIsChecking(true)
        setErrorMessage('')
        try {
            const available = await checkLoginIdAvailable(loginId)
            if (available) {
                setCheckedLoginId(loginId)
            } else {
                setErrorMessage('이미 사용 중인 아이디예요.')
            }
        } catch (error) {
            setErrorMessage(getSignUpError(error).message)
        } finally {
            setIsChecking(false)
        }
    }

    // 전체동의: 둘 다 켜져 있으면 모두 끄고, 아니면 모두 켜요
    const handleToggleAll = () => {
        setAgreed({ service: !isAllAgreed, privacy: !isAllAgreed })
    }

    const handleSignUp = async () => {
        if (!isAllAgreed || isSubmitting) return

        setIsSubmitting(true)
        setErrorMessage('')
        try {
            await signUp({
                name: values.name.trim(),
                loginId: values.loginId,
                password: values.password,
                termsAgreed: agreed.service,
                privacyAgreed: agreed.privacy,
            })
            onComplete?.()
        } catch (error) {
            const { step: backTo, message } = getSignUpError(error)
            if (backTo) {
                // 문제가 난 칸이 있는 단계로 돌아가서 고치게 해요
                setIsTermsOpen(false)
                setStep(backTo)
                if (backTo === 'loginId') setCheckedLoginId(null) // 중복확인 다시 받기
            }
            setErrorMessage(message)
        } finally {
            setIsSubmitting(false)
        }
    }

    // 약관 시트가 열려 있으면 시트만 닫고, 첫 단계에서는 첫화면으로, 그 뒤로는 이전 단계로
    const handleBack = () => {
        setErrorMessage('')
        if (isTermsOpen) {
            setIsTermsOpen(false)
            return
        }
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
                        type={info.type === 'password' && showPassword ? 'text' : info.type}
                        name={step}
                        placeholder={info.label}
                        autoComplete={info.autoComplete}
                        autoCapitalize="none"
                        autoFocus
                        value={value}
                        onChange={(e) => {
                            setValues({ ...values, [step]: e.target.value })
                            setErrorMessage('')
                            setIsTermsOpen(false) // 값을 고치면 다시 "다음"으로 검사받게
                        }}
                    />
                    {info.type === 'password' && (
                        <button
                            type="button"
                            className="signup__eye"
                            onClick={() => setShowPassword((prev) => !prev)}
                            onMouseDown={(e) => e.preventDefault()}
                            aria-label={showPassword ? '비밀번호 숨기기' : '비밀번호 보기'}
                            aria-pressed={showPassword}
                        >
                            <img src={showPassword ? iconEye : iconEyeOff} width={24} height={24} alt="" />
                        </button>
                    )}
                    {step === 'loginId' && (
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
                    ) : step === 'loginId' && isIdChecked ? (
                        <span className="signup__message-ok">사용할 수 있는 아이디예요.</span>
                    ) : null}
                </p>

                {showNext && !isTermsOpen && (
                    <button type="submit" className="signup__next">
                        다음
                    </button>
                )}

                {isTermsOpen && (
                    <section className="signup__terms" role="dialog" aria-labelledby="signup-terms-title">
                        <h2 id="signup-terms-title" className="signup__terms-title">
                            약관동의
                        </h2>

                        <button
                            type="button"
                            className={`signup__agree-all${isAllAgreed ? ' signup__agree-all--on' : ''}`}
                            onClick={handleToggleAll}
                            aria-pressed={isAllAgreed}
                        >
                            <img src={isAllAgreed ? iconCheckCircleOn : iconCheckCircle} width={27} height={26} alt="" />
                            전체동의
                        </button>

                        <ul className="signup__agree-list">
                            {TERMS.map((term) => (
                                <li key={term.id}>
                                    <button
                                        type="button"
                                        className="signup__agree-item"
                                        onClick={() => setAgreed({ ...agreed, [term.id]: !agreed[term.id] })}
                                        aria-pressed={agreed[term.id]}
                                    >
                                        <img src={agreed[term.id] ? iconCheckOn : iconCheck} width={23} height={23} alt="" />
                                        {term.label}
                                    </button>
                                </li>
                            ))}
                        </ul>

                        <button
                            type="button"
                            className="signup__submit"
                            onClick={handleSignUp}
                            disabled={!isAllAgreed || isSubmitting}
                        >
                            {isSubmitting ? '가입 중…' : '다음'}
                        </button>
                    </section>
                )}
            </form>
        </main>
    )
}

export default SignUp