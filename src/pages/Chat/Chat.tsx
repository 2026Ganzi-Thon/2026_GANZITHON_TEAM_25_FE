import { useState, type FormEvent } from 'react'
import backgroundNoon from '../../assets/images/background_noon_wide.png'
import sunImage from '../../assets/images/home/sun.png'
import mongleImage from '../../assets/images/alpaca/mongle_default_v3.png'
import mongleEyesSmile from '../../assets/images/alpaca/eyes_smile_matched.png'
import sunGlow from '../../assets/icons/sun-glow.svg'
import mongleShadow from '../../assets/icons/mongle-shadow.svg'
import sendButton from '../../assets/icons/send-button.svg'
import arrowBack from '../../assets/icons/arrow-back.svg'
import HeaderActions from '../../components/HeaderActions/HeaderActions'
import '../../styles/Chat.css'

type ChatProps = {
  /** 뒤로 가기 */
  onBack?: () => void
}

/**
 * 대화 (Figma: 대화 - 이번만 기억하기 171:3177)
 * - 2단계: 배경 · 어두운 막 · 해 · 몽글이 · 상단 바 · 입력창
 * - 다음 단계에서 토글(내용 기억하기), 말풍선, 하단 버튼을 추가
 */
function Chat({ onBack }: ChatProps) {
  const [message, setMessage] = useState('')

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    const text = message.trim()
    if (!text) return
    // TODO(4단계): 말풍선 목록에 추가
    setMessage('')
  }

  return (
    <main
      className="chat"
      style={{ backgroundImage: `url(${backgroundNoon})` }}
    >
      <header className="chat__top">
        <button
          type="button"
          className="chat__back"
          aria-label="뒤로 가기"
          onClick={onBack}
        >
          <img src={arrowBack} width={35} height={35} alt="" />
        </button>
        <HeaderActions />
      </header>

      <div className="chat__sun" aria-hidden="true">
        <img
          className="chat__sun-glow"
          src={sunGlow}
          width={153}
          height={153}
          alt=""
        />
        <img
          className="chat__sun-image"
          src={sunImage}
          width={188}
          height={188}
          alt=""
        />
      </div>

      <div className="chat__stage">
        <div className="chat__mongle-wrap" aria-hidden="true">
          <img
            className="chat__mongle-shadow"
            src={mongleShadow}
            width={190}
            height={55}
            alt=""
          />
          <div className="chat__mongle">
            <img
              className="chat__mongle-body"
              src={mongleImage}
              width={242}
              height={242}
              alt=""
            />
            <img
              className="chat__mongle-eyes"
              src={mongleEyesSmile}
              width={81}
              height={27}
              alt=""
            />
          </div>
        </div>
      </div>

      {/* 배경 · 해 · 몽글이만 어둡게 덮는 막 (Figma: rgba(0,0,0,0.25)) */}
      <div className="chat__dim" aria-hidden="true" />

      <form className="chat__composer" onSubmit={handleSubmit}>
        <input
          className="chat__input"
          type="text"
          value={message}
          placeholder="편하게 털어내봐요"
          aria-label="몽글이에게 털어놓기"
          enterKeyHint="send"
          onChange={(event) => setMessage(event.target.value)}
        />
        <button type="submit" className="chat__send" aria-label="보내기">
          <img
            className="chat__send-icon"
            src={sendButton}
            width={78}
            height={78}
            alt=""
          />
        </button>
      </form>
    </main>
  )
}

export default Chat