import styles from '../styles/Next.module.css';
import iconBack from '../assets/icons/arrow-back.svg';
import iconSound from '../assets/icons/sound-button.svg';
import iconMenu from '../assets/icons/menu-button.svg';
import mongleBody from '../assets/images/mongle_v3.png';

import iconHand from '../assets/icons/hand.png';
import iconHeart from '../assets/icons/heart.png';
import iconPhone from '../assets/icons/call.png';
import iconArrow from '../assets/icons/chevron-right.svg';

export default function MongleNext({ onBack, onHelp, onMind }: { onBack?: () => void, onHelp?: () => void, onMind?: () => void}) {
  return (
    <div className={styles.wrapper}>
      <div className={styles.container}>
        
        <div className={styles.topBar}>
          <button className={styles.iconBtn} onClick={onBack}>
            <img src={iconBack} alt="뒤로가기" />
          </button>
          <div className={styles.rightIcons}>
            <button className={styles.iconBtn}><img src={iconSound} alt="소리" /></button>
            <button className={styles.iconBtn}><img src={iconMenu} alt="메뉴" /></button>
          </div>
        </div>

        <div className={styles.menuView}>
          <div className={styles.characterSection}>
            <img src={mongleBody} alt="몽글이" className={styles.smallMongle} />
            <h2 className={styles.title}>이제 뭘 해 볼까?</h2>
          </div>

          <div className={styles.actionList}>
            <button className={styles.actionCard} onClick={onBack}>
              <div className={styles.cardIconBox}>
                <img src={iconHand} alt="더 쉬기" className={styles.iconImage} />
              </div>
              <div className={styles.cardText}>
                <h3>더 쉬기</h3>
                <p>몽글이 털을 더 만지며 쉬어요.</p>
              </div>
              <img src={iconArrow} alt="이동" className={styles.chevronImage} />
            </button>

            <button className={styles.actionCard} onClick={onMind}>
              <div className={styles.cardIconBox}>
                <img src={iconHeart} alt="내 마음 정리" className={styles.iconImage} />
              </div>
              <div className={styles.cardText}>
                <h3>내 마음 정리</h3>
                <p>서운함, 불안함처럼 짧게 골라 봐요.</p>
              </div>
              <img src={iconArrow} alt="이동" className={styles.chevronImage} />
            </button>

            <button className={styles.actionCard} onClick={onHelp}>
              <div className={styles.cardIconBox}>
                <img src={iconPhone} alt="도움 요청" className={styles.iconImage} />
              </div>
              <div className={styles.cardText}>
                <h3>도움 요청</h3>
                <p>믿을 수 있는 사람이나 전문 상담에 연결해요.</p>
              </div>
              <img src={iconArrow} alt="이동" className={styles.chevronImage} />
            </button>
          </div>
        </div>

      </div>
    </div>
  );
}