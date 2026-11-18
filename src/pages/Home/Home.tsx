import { useState } from 'react'
import backgroundNoon from '../../assets/images/background_noon_wide.png'
import sunImage from '../../assets/images/home/sun.png'
import mongleImage from '../../assets/images/home/mongle-default.png'
import sunGlow from '../../assets/icons/sun-glow.svg'
import mongleShadow from '../../assets/icons/mongle-shadow.svg'
import HeaderActions, { type HeaderButtonHandlers } from '../../components/HeaderActions/HeaderActions'
import '../../styles/Home.css'

// 💡 1. 불필요해진 장식/눈 이미지 import 6줄을 싹 지우고 화가 컴포넌트 하나만 부릅니다!
import MongleCharacter from '../../components/MongleCharacter'

/** talk: 대화 모드(기본) / rest: 말없이 쉬기 모드 */
type HomeMode = 'talk' | 'rest'
type HomeProps = {
  /** 몽글이 탭 → "내 마음 정리하고 대화하기" */
  onOrganizeAndTalk?: () => void
  /** 말없이 쉬기 모드에서 몽글이를 만졌을 때 (털어내기 화면 진입) */
  onTouchMongle?: () => void
  
  // 💡 2. 백엔드 명세서에 맞춘 최신 이름(similarityTrait, comfortStyle)으로 업데이트!
  customMongle: { similarityTrait: string; comfortStyle: string; accessory: string };
} & HeaderButtonHandlers

const GUIDE_TEXT: Record<HomeMode, [string, string]> = {
  talk: ['몽글이를 누르면', '원하는 방식으로 대화할 수 있어요.'],
  rest: ['몽글이를 만지면', '대화없이 털어낼 수 있어요'],
}

function Home({
  onOrganizeAndTalk,
  onTouchMongle,
  onSoundClick,
  onMenuClick,
  customMongle
}: HomeProps) {
  const [mode, setMode] = useState<HomeMode>('talk')
  const [showChoices, setShowChoices] = useState(false)
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
          <img className="home__sun-glow" src={sunGlow} width={153} height={153} alt="" />
          <img className="home__sun-image" src={sunImage} width={188} height={188} alt="" />
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
                <button type="button" className="home__choice home__choice--organize" onClick={onOrganizeAndTalk}>
                  내 마음 정리하고 대화하기
                </button>
                <button type="button" className="home__choice home__choice--rest" onClick={startRest}>
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
              aria-label={mode === 'talk' ? '몽글이 — 대화 방식 고르기' : '몽글이 만지기'}
              aria-expanded={mode === 'talk' ? showChoices : undefined}
              onClick={handleMongleClick}
            >
              
              {/* 💡 3. 길고 복잡하게 나열되어 있던 눈/몸통/장식 <img> 태그 7개를 단 한 줄로 교체! */}
              <MongleCharacter 
                bodyImage={mongleImage}
                customMongle={customMongle}
                wrapperClassName="home__character-size" 
              />
              
            </button>
          </div>
        </div>
      </div>
    </main>
  )
}

export default Home