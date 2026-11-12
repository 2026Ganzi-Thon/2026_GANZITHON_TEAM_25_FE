import backgroundNight from '../../assets/images/background_night_wide.png'
import moonImage from '../../assets/images/moon.png'
import moonGlow from '../../assets/icons/moon-glow.svg'
import mongleImage from '../../assets/images/home/mongle-default.png'
import mongleEyesSleepy from '../../assets/images/alpaca/eyes_sleepy_matched.png'
import mongleShadow from '../../assets/icons/mongle-shadow.svg'
import HeaderActions from '../../components/HeaderActions/HeaderActions'
import '../../styles/End.css'

type EndProps = {
    /** 이번 대화에서 기억한 요약 개수 */
    savedCount: number
    /** 처음 화면으로 */
    onHome?: () => void
}

/** 털어낸 후 ② 종료 화면 (Figma: 털어낸후 171:3420) */
function End({ savedCount, onHome }: EndProps) {
    return (
        <main
            className="end"
            style={{ backgroundImage: `url(${backgroundNight})` }}
        >
            <div className="end__frame">
                <div className="end__actions">
                    <HeaderActions />
                </div>

                <div className="end__moon" aria-hidden="true">
                    <img className="end__moon-glow" src={moonGlow} width={153} height={152} alt="" />
                    <img className="end__moon-image" src={moonImage} width={167} height={167} alt="" />
                </div>

                <h1 className="end__title">오늘은 여기까지.</h1>
                <p className="end__desc">필요할 때 언제든 다시 와도 돼요.</p>

                <div className="end__stage">
                    <div className="end__mongle-wrap" aria-hidden="true">
                        <p className="end__bubble">수고했어. 푹 쉬어!</p>
                        <img
                            className="end__mongle-shadow"
                            src={mongleShadow}
                            width={190}
                            height={55}
                            alt=""
                        />
                        {/* 몸과 눈을 한 그룹으로 묶어 같이 숨 쉬게 함 (모션 명세: sleepy) */}
                        <div className="end__mongle">
                            <img className="end__mongle-body" src={mongleImage} width={242} height={242} alt="" />
                            <img className="end__mongle-eyes" src={mongleEyesSleepy} width={72} height={24} alt="" />
                        </div>
                    </div>
                </div>

                <p className="end__info">
                    {savedCount > 0 ? (
                        <>
                            허락한 요약 {savedCount}개만 기억했어요.
                            <br />
                            ‘기억한 이야기’에서 고치거나 지울 수 있어요.
                        </>
                    ) : (
                        <>
                            이번 이야기는 기억하지 않았어요.
                            <br />
                            대화 원문도 남기지 않아요.
                        </>
                    )}
                </p>
                <button type="button" className="end__home" onClick={onHome}>
                    처음 화면으로
                </button>
            </div>
        </main>
    )
}

export default End