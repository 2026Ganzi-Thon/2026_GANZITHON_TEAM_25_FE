import { useState, type FormEvent } from 'react'
import backgroundNoon from '../../assets/images/background_noon_wide.png'
import sunImage from '../../assets/images/home/sun.png'
import mongleImage from '../../assets/images/home/mongle-default.png'
import mongleEyesSmile from '../../assets/images/home/mongle-eyes-smile.png'
import sunGlow from '../../assets/icons/sun-glow.svg'
import mongleShadow from '../../assets/icons/mongle-shadow.svg'
import HeaderActions, { type HeaderButtonHandlers } from '../../components/HeaderActions/HeaderActions'
import '../../styles/Home.css'

import ribbonHeadImg from '../../assets/deco/ribbon-head.png';
import flowerHeadImg from '../../assets/deco/flower-head.png';
import hatImg from '../../assets/deco/hat.png';
import ribbonNeckImg from '../../assets/deco/ribbon-neck.png';
import bellNeckImg from '../../assets/deco/bell.png';

/** talk: 대화 모드(기본) / rest: 말없이 쉬기 모드 */
type HomeMode = 'talk' | 'rest'
type HomeProps = {
  /** 몽글이 탭 → "내 마음 정리하고 대화하기" */
  onOrganizeAndTalk?: () => void
  /** 입력창 전송 → 자유 대화 시작 */
  onFreeTalk?: (message: string) => void
  /** 말없이 쉬기 모드에서 몽글이를 만졌을 때 (털어내기 화면 진입) */
  onTouchMongle?: () => void
  customMongle: { trait: string; tendency: string; accessory: string };
} & HeaderButtonHandlers 

const GUIDE_TEXT: Record<HomeMode, [string, string]> = {
  talk: ['몽글이를 누르면', '원하는 방식으로 대화할 수 있어요.'],
  rest: ['몽글이를 만지면', '대화없이 털어낼 수 있어요'],
}

/**
 * 홈 (Figma: 홈 - 내 마음 정리 대화 / 자유 대화 / 소리 / 햄버거바)
 * - 대화 모드: 몽글이를 누르면 "내 마음 정리하고 대화하기 · 말없이 쉬기" 선택지가 열림
 * - 말없이 쉬기 모드: 안내 문구가 바뀌고 몽글이가 "안녕!" 인사, 입력창은 흐리게
 * - 우측 상단: 자연음 모달 / 메뉴 시트
 */
function Home({
  onOrganizeAndTalk,
  onFreeTalk,
  onTouchMongle,
  onSoundClick, 
  onMenuClick,
  customMongle
}: HomeProps) {
  const [mode, setMode] = useState<HomeMode>('talk')
  const [showChoices, setShowChoices] = useState(false)
  const [message, setMessage] = useState('')
  const handleMongleClick = () => {
    if (mode === 'rest') {
      onTouchMongle?.()
      return
    }
    setShowChoices((prev) => !prev)
  }

  const startRest = () => {
    setShowChoices(false)
    setMode('rest')
  }

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    const text = message.trim()
    if (!text) return
    onFreeTalk?.(text)
    setMessage('')
  }

  const [guideLine1, guideLine2] = GUIDE_TEXT[mode]

  return (
    <main
      className={`home home--${mode}`}
      style={{ backgroundImage: `url(${backgroundNoon})` }}
    >
      <div className="home__frame">
        <div className="home__actions">
          <HeaderActions onSoundClick={onSoundClick} onMenuClick={onMenuClick} />
        </div>

        <div className="home__sun" aria-hidden="true">
          <img
            className="home__sun-glow"
            src={sunGlow}
            width={153}
            height={153}
            alt=""
          />
          <img
            className="home__sun-image"
            src={sunImage}
            width={188}
            height={188}
            alt=""
          />
        </div>

        <p className="home__guide" aria-live="polite">
          {guideLine1}
          <br />
          {guideLine2}
        </p>

        <div className="home__stage">
          <div className="home__mongle-wrap">
            {mode === 'rest' && (
              <p className="home__greeting" aria-hidden="true">
                안녕!
              </p>
            )}

            {mode === 'talk' && showChoices && (
              <>
                <button
                  type="button"
                  className="home__choice home__choice--organize"
                  onClick={onOrganizeAndTalk}
                >
                  내 마음 정리하고 대화하기
                </button>
                <button
                  type="button"
                  className="home__choice home__choice--rest"
                  onClick={startRest}
                >
                  말없이 쉬기
                </button>
              </>
            )}

            <img
              className="home__mongle-shadow"
              src={mongleShadow}
              width={190}
              height={55}
              alt=""
              aria-hidden="true"
            />
            <button
              type="button"
              className="home__mongle"
              aria-label={
                mode === 'talk' ? '몽글이 — 대화 방식 고르기' : '몽글이 만지기'
              }
              aria-expanded={mode === 'talk' ? showChoices : undefined}
              onClick={handleMongleClick}
            >
              <img
                className="home__mongle-body"
                src={mongleImage}
                width={242}
                height={242}
                alt=""
              />
              <img
                className="home__mongle-eyes"
                src={mongleEyesSmile}
                width={81}
                height={27}
                alt=""
              />
               {customMongle.accessory === '리본 (머리)' && (
          <img src={ribbonHeadImg} alt="머리 리본" className="accessory ribbonHead" />
        )}
        {customMongle.accessory === '작은 꽃 (머리)' && (
          <img src={flowerHeadImg} alt="머리 꽃" className="accessory flowerHead" />
        )}
        {customMongle.accessory === '모자' && (
          <img src={hatImg} alt="모자" className="accessory hat" />
        )}
        {customMongle.accessory === '리본 (목)' && (
          <img src={ribbonNeckImg} alt="목 리본" className="accessory ribbonNeck" />
        )}
        {customMongle.accessory === '방울 (목)' && (
          <img src={bellNeckImg} alt="목 방울" className="accessory bellNeck" />
        )}
            </button>
          </div>
        </div>

        {/* <form className="home__composer" onSubmit={handleSubmit}>
          <input
            className="home__input"
            type="text"
            value={message}
            placeholder="편하게 털어내봐요"
            aria-label="몽글이에게 털어놓기"
            enterKeyHint="send"
            onFocus={() => mode === 'rest' && setMode('talk')}
            onChange={(event) => setMessage(event.target.value)}
          />
          <button type="submit" className="home__send" aria-label="보내기">
            {mode === 'talk' ? (
              <img
                className="home__send-icon"
                src={sendButton}
                width={78}
                height={78}
                alt=""
              />
            ) : (
              <img src={sendButtonRest} width={55} height={55} alt="" />
            )}
          </button>
        </form> */}
      </div>


    </main>
  )
}

export default Home
