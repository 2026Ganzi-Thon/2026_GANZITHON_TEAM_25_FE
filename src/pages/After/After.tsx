import moonImage from '../../assets/images/moon.png'
import moonGlow from '../../assets/icons/moon-glow.svg'
import sunImage from '../../assets/images/home/sun.png'
import sunGlow from '../../assets/icons/sun-glow.svg'
import mongleImage from '../../assets/images/home/mongle-default.png'
import mongleEyesSmile from '../../assets/images/home/mongle-eyes-smile.png'
import mongleShadow from '../../assets/icons/mongle-shadow.svg'
import HeaderActions, { type HeaderButtonHandlers } from '../../components/HeaderActions/HeaderActions'
import '../../styles/After.css'
import MongleCharacter from '../../components/MongleCharacter';
import { useHomeTime } from '../../hooks/useHomeTime'
import { getBackgroundByPhase } from '../../utils/timeBackground'

type AfterProps = {
    /** 몽글이를 눌렀을 때 — 말없이 쉬기 */
    onTouchMongle?: () => void
    /** 털 깎으며 정리하기 */
    onShave?: () => void
    /** 다음 활동 보기 */
    onNext?: () => void
    /** 여기서 끝내기 */
    onEnd?: () => void
    customMongle?: { similarityTrait: string; comfortStyle: string; accessory: string };
} & HeaderButtonHandlers

/** 털어낸 후 ① (Figma: 털어낸후 171:3392) — 대화를 마친 직후 */
function After({ onTouchMongle, onShave, onNext, onSoundClick, onMenuClick, customMongle }: AfterProps) {
    const timeState = useHomeTime()
    const isNight = timeState.phase === 'night'
    const backgroundImage = getBackgroundByPhase(timeState.phase)
    return (
        <main
            className="after"
            style={{ backgroundImage: `url(${backgroundImage})` }}
        >
            <div className="after__frame">
                <div className="after__actions">
                    <HeaderActions onSoundClick={onSoundClick} onMenuClick={onMenuClick} />
                </div>

                <div className="after__sun" aria-hidden="true">
                    {isNight ? (
                        <>
                            <img key="moon-glow" className="after__sun-glow" src={moonGlow} width={153} height={152} alt="" />
                            <img key="moon" className="after__sun-image" src={moonImage} width={188} height={188} alt="" />
                        </>
                    ) : (
                        <>
                            <img key="sun-glow" className="after__sun-glow" src={sunGlow} width={153} height={153} alt="" />
                            <img key="sun" className="after__sun-image" src={sunImage} width={188} height={188} alt="" />
                        </>
                    )}
                </div>

                <h1 className="after__title">털어놓은 마음, 털을 한번에 털어냈어요!</h1>
                <p className="after__desc">
                    몽글이를 만지면 말없이 쉬어갈 수 있어요.
                    <br />
                    여기서 끝내도 괜찮아요.
                </p>

                <div className="after__stage">
                    <div className="after__mongle-wrap">
                        <img
                            className="after__mongle-shadow"
                            src={mongleShadow}
                            width={190}
                            height={55}
                            alt=""
                            aria-hidden="true"
                        />
                        <button
                            type="button"
                            className="after__mongle"
                            aria-label="몽글이 만지기 — 말없이 쉬기"
                            onClick={onTouchMongle}
                        >
                            <MongleCharacter
                                bodyImage={mongleImage}
                                customMongle={customMongle}
                                overrideEyes={mongleEyesSmile}
                                wrapperClassName="after__character-size"
                            />
                        </button>
                    </div>
                </div>

                <div className="after__choices">
                    <button type="button" className="after__choice" onClick={onShave}>
                        털 깎으며 정리하기
                    </button>
                    <button type="button" className="after__choice" onClick={onNext}>
                        다음 행동 선택
                    </button>
                </div>
            </div>
        </main>
    )
}

export default After