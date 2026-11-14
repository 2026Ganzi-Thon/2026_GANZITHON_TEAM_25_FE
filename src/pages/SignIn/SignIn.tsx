import mongleBody from '../../assets/images/alpaca/mongle_default_v3.png'
import mongleEyes from '../../assets/images/alpaca/eyes_smile_matched.png'
import mongleShadow from '../../assets/icons/mongle-shadow.svg'
import arrowBack from '../../assets/icons/arrow-back.svg'
import '../../styles/SignIn.css'
import { useState, type SubmitEvent } from 'react'
import iconProfile from '../../assets/icons/profile-circle.svg'
import iconLock from '../../assets/icons/lock-password.svg'
import iconEye from '../../assets/icons/eye.svg'
import iconEyeOff from '../../assets/icons/eye-off.svg'
import iconError from '../../assets/icons/error-cross.svg'
import { login, LoginError } from '../../api/auth'

interface SignInProps {
    onBack: () => void
    onLoginSuccess: () => void
}

/** 로그인하기 화면 (Figma: 로그인하기 244:8) */
export default function SignIn({ onBack, onLoginSuccess }: SignInProps) {
    const [userId, setUserId] = useState('')
    const [password, setPassword] = useState('')
    const [showPassword, setShowPassword] = useState(false)
    const [isSubmitting, setIsSubmitting] = useState(false)
    const [errorMessage, setErrorMessage] = useState('')

    // 두 칸이 다 채워져 있고, 보내는 중이 아닐 때만 누를 수 있음
    const canSubmit = userId.trim() !== '' && password !== '' && !isSubmitting

    const handleSubmit = async (e: SubmitEvent<HTMLFormElement>) => {
        e.preventDefault() // 폼 제출 시 페이지 새로고침 막기
        if (!canSubmit) return

        setIsSubmitting(true)
        setErrorMessage('')
        try {
            await login(userId.trim(), password)
            onLoginSuccess()
        } catch (error) {
            setErrorMessage(
                error instanceof LoginError ? error.message : '잠시 후 다시 시도해 주세요.',
            )
        } finally {
            setIsSubmitting(false)
        }
    }

    return (
        <main className="signin">
            <div className="signin__frame">
                <button type="button" className="signin__back" onClick={onBack} aria-label="뒤로 가기">
                    <img src={arrowBack} width={35} height={35} alt="" />
                </button>

                <h1 className="signin__title">로그인하기</h1>

                <div className="signin__mongle">
                    <img className="signin__mongle-shadow" src={mongleShadow} width={157} height={45} alt="" />
                    <img className="signin__mongle-body" src={mongleBody} width={200} height={200} alt="" />
                    <img className="signin__mongle-eyes" src={mongleEyes} width={67} height={22} alt="" />
                </div>

                <form className="signin__form" onSubmit={handleSubmit} noValidate>
                    <div className="signin__fields">
                        <label className="signin__field">
                            <img src={iconProfile} width={24} height={24} alt="" />
                            <input
                                className="signin__input"
                                type="text"
                                name="userId"
                                placeholder="아이디"
                                aria-label="아이디"
                                autoComplete="username"
                                autoCapitalize="none"
                                value={userId}
                                onChange={(e) => {
                                    setUserId(e.target.value)
                                    setErrorMessage('')
                                }}
                            />
                        </label>

                        <label className="signin__field">
                            <img src={iconLock} width={24} height={24} alt="" />
                            <input
                                className="signin__input"
                                type={showPassword ? 'text' : 'password'}
                                name="password"
                                placeholder="비밀번호"
                                aria-label="비밀번호"
                                autoComplete="current-password"
                                value={password}
                                onChange={(e) => {
                                    setPassword(e.target.value)
                                    setErrorMessage('')
                                }}
                            />
                            <button
                                type="button"
                                className="signin__eye"
                                onClick={() => setShowPassword((prev) => !prev)}
                                onMouseDown={(e) => e.preventDefault()}
                                aria-label={showPassword ? '비밀번호 숨기기' : '비밀번호 보기'}
                                aria-pressed={showPassword}
                            >
                                <img src={showPassword ? iconEye : iconEyeOff} width={24} height={24} alt="" />
                            </button>
                        </label>
                    </div>

                    <p className="signin__error" role="alert">
                        {errorMessage && (
                            <>
                                <img src={iconError} width={20} height={20} alt="" />
                                {errorMessage}
                            </>
                        )}
                    </p>

                    <button type="submit" className="signin__submit" disabled={!canSubmit}>
                        {isSubmitting ? '로그인 중…' : '로그인'}
                    </button>
                </form>
            </div>
        </main>
    )
}