type SignUpProps = {
    /** 뒤로 가기 (첫화면으로) */
    onBack?: () => void
    /** 가입 완료 */
    onComplete?: () => void
}

/** 회원가입 (Figma: 회원가입 - 이름 250:56 ~ 개인정보 동의 252:141) */
function SignUp({ onBack, onComplete }: SignUpProps) {
    return (
        <main>
            <button type="button" onClick={onBack}>
                뒤로
            </button>
            <h1>회원가입</h1>
            <button type="button" onClick={onComplete}>
                가입 완료
            </button>
        </main>
    )
}

export default SignUp