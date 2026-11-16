import styles from '../styles/Help.module.css';
import iconBack from '../assets/icons/arrow-back.svg';
import iconSound from '../assets/icons/sound-button.svg';
import iconMenu from '../assets/icons/menu-button.svg';
import iconPhone from '../assets/icons/call.png';

export default function MongleHelp({ onBack }: { onBack?: () => void }) {
  const handleCopy = () => {
    navigator.clipboard.writeText("요즘 좀 힘든 일이 있었어. 잠깐 내 이야기 들어줄 수 있어?");
    alert("문장이 복사되었습니다.");
  };

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

     <div className={styles.helpView}>
          <div className={styles.helpHeader}>
            <div className={styles.titleRow}>
              <div className={styles.iconCircle}>
                <img src={iconPhone} alt="전화" className={styles.phoneIcon} />
              </div>
              <h2 className={styles.helpTitle}>혼자 견디지 않아도 돼요</h2>
            </div>
            <p className={styles.helpSubtitle}>지금 위험하다고 느끼면 아래 연락처에 도움을 청해요.</p>
          </div>

          <div className={styles.contactList}>
            <div className={styles.contactItem}>
              <span className={styles.contactNumber}>112</span>
              <div className={styles.contactInfo}>
                <h4>경찰</h4>
                <p>지금 위험하거나 위협을 받고 있을 때</p>
              </div>
            </div>
            <div className={styles.contactItem}>
              <span className={styles.contactNumber}>1366</span>
              <div className={styles.contactInfo}>
                <h4>여성긴급전화</h4>
                <p>데이트폭력·스토킹 상담 (24시간)</p>
              </div>
            </div>
            <div className={styles.contactItem}>
              <span className={styles.contactNumber}>109</span>
              <div className={styles.contactInfo}>
                <h4>자살예방 상담전화</h4>
                <p>죽고 싶은 마음이 들 때 (24시간)</p>
              </div>
            </div>
            <div className={styles.contactItem}>
              <span className={styles.contactNumber}>1577-0199</span>
              <div className={styles.contactInfo}>
                <h4>정신건강 위기상담</h4>
                <p>마음이 많이 힘들 때 (24시간)</p>
              </div>
            </div>
            <div className={styles.contactItem}>
              <span className={styles.contactNumber}>119</span>
              <div className={styles.contactInfo}>
                <h4>구급</h4>
                <p>다쳤거나 몸이 위급할 때</p>
              </div>
            </div>
          </div>

          <div className={styles.messageBox}>
            <h4 className={styles.messageTitle}>믿을 수 있는 사람에게 말 걸기</h4>
            <p className={styles.messageQuote}>"요즘 좀 힘든 일이 있었어.<br/>잠깐 내 이야기 들어줄 수 있어?"</p>
            <button className={styles.copyBtn} onClick={handleCopy}>문장 복사</button>
          </div>

          <p className={styles.footerText}>
            폭력·스토킹·위협이 있었던 관계라면,<br/>
            연락하거나 회피하려고 애쓰지 말아요. 내 안전이 먼저예요.
          </p>
        </div>

      </div>
    </div>
  );
}