import { useState } from 'react';
import styles from '../../styles/MyMongle.module.css';

import baseAlpacaImg from '../../assets/images/alpaca.png';
import ribbonHeadImg from '../../assets/deco/ribbon-head.png';
import flowerHeadImg from '../../assets/deco/flower-head.png';
import hatImg from '../../assets/deco/hat.png';
import ribbonNeckImg from '../../assets/deco/ribbon-neck.png';
import bellNeckImg from '../../assets/deco/bell.png';
import backIcon from '../../assets/icons/arrow-back.svg';
import soundIcon from '../../assets/icons/sound-button.svg';
import menuIcon from '../../assets/icons/menu-button.svg';

interface MyMongleProps {
  onBack: () => void;
}

const MyMongle = ({ onBack }: MyMongleProps) => {
  const [trait, setTrait] = useState('멍하니 있기');
  const [tendency, setTendency] = useState('차분하고 조용함');
  const [accessory, setAccessory] = useState('리본 (머리)');

  const traits = ['없음', '멍하니 있기', '침 뱉기', '잘 웃기'];
  const tendencies = ['없음', '차분하고 조용함', '부드럽고 다정함', '가끔 장난스러움'];
  const accessories = ['없음', '리본 (머리)', '작은 꽃 (머리)', '모자', '리본 (목)', '방울 (목)'];

  return (
    <div className={styles.container}>
      <header className={styles.header}>
        <button className={styles.backBtn} onClick={onBack}>
          <img src={backIcon} alt="뒤로가기" className={styles.iconImg} />
        </button>
        <h1 className={styles.title}>나의 몽글이</h1>
        <div className={styles.headerRight}>
          <button className={styles.iconBtn}>
            <img src={soundIcon} alt="음량" className={styles.iconImg} />
          </button>
          <button className={styles.iconBtn}>
            <img src={menuIcon} alt="메뉴" className={styles.iconImg} />
          </button>
        </div>
      </header>

      <div className={styles.characterDisplay}>
        <img src={baseAlpacaImg} alt="알파카 기본" className={styles.baseAlpaca} />
        
        {accessory === '리본 (머리)' && (
          <img src={ribbonHeadImg} alt="머리 리본" className={`${styles.accessory} ${styles.ribbonHead}`} />
        )}
        {accessory === '작은 꽃 (머리)' && (
          <img src={flowerHeadImg} alt="머리 꽃" className={`${styles.accessory} ${styles.flowerHead}`} />
        )}
        {accessory === '모자' && (
          <img src={hatImg} alt="모자" className={`${styles.accessory} ${styles.hat}`} />
        )}
        {accessory === '리본 (목)' && (
          <img src={ribbonNeckImg} alt="목 리본" className={`${styles.accessory} ${styles.ribbonNeck}`} />
        )}
        {accessory === '방울 (목)' && (
          <img src={bellNeckImg} alt="목 방울" className={`${styles.accessory} ${styles.bellNeck}`} />
        )}
      </div>

      <div className={styles.optionsContainer}>
        <div className={styles.optionSection}>
          <h3 className={styles.sectionTitle}>닮은 특징 <span className={styles.subCount}>1가지</span></h3>
          <div className={styles.tagGroup}>
            {traits.map(item => (
              <button
                key={item}
                className={`${styles.tagBtn} ${trait === item ? styles.activeTag : ''}`}
                onClick={() => setTrait(item)}
              >
                {item}
              </button>
            ))}
          </div>
        </div>

        <div className={styles.optionSection}>
          <h3 className={styles.sectionTitle}>편안한 친구 성향 <span className={styles.subCount}>1가지</span></h3>
          <div className={styles.tagGroup}>
            {tendencies.map(item => (
              <button
                key={item}
                className={`${styles.tagBtn} ${tendency === item ? styles.activeTag : ''}`}
                onClick={() => setTendency(item)}
              >
                {item}
              </button>
            ))}
          </div>
        </div>

        <div className={styles.optionSection}>
          <h3 className={styles.sectionTitle}>작은 장식 <span className={styles.subCount}>꾸미기</span></h3>
          <div className={styles.tagGroup}>
            {accessories.map(item => (
              <button
                key={item}
                className={`${styles.tagBtn} ${accessory === item ? styles.activeTag : ''}`}
                onClick={() => setAccessory(item)}
              >
                {item}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default MyMongle;