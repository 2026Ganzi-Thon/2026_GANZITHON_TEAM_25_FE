import styles from '../../styles/MyMongle.module.css';
import { updateMongleProfile, type MongleProfileUpdate } from '../../api/mongleProfile';
import MongleCharacter from '../../components/MongleCharacter';
import mongleBody from '../../assets/images/alpaca/mongle_default_v3.png';
import backIcon from '../../assets/icons/arrow-back.svg';
import soundIcon from '../../assets/icons/sound-button.svg';
import menuIcon from '../../assets/icons/menu-button.svg';
import type { HeaderButtonHandlers } from '../../components/HeaderActions/HeaderActions';

// 💡 1. 명세서를 최신 이름(similarityTrait, comfortStyle)으로 업데이트!
interface MyMongleProps extends HeaderButtonHandlers {
  onBack: () => void;
  customMongle: { similarityTrait: string; comfortStyle: string; accessory: string };
  setCustomMongle: React.Dispatch<React.SetStateAction<{ similarityTrait: string; comfortStyle: string; accessory: string }>>;
}

const MyMongle = ({ onBack, onSoundClick, onMenuClick, customMongle, setCustomMongle }: MyMongleProps) => {

  const traits = ['없음', '멍하니 있기', '침 뱉기', '잘 웃기'];
  const tendencies = ['없음', '차분하고 조용함', '부드럽고 다정함', '가끔 장난스러움'];
  // 띄어쓰기가 컴포넌트와 안 맞아서 나는 오류를 방지하기 위해 띄어쓰기를 없앴습니다. ('리본(머리)')
  const accessories = ['없음', '리본(머리)', '작은 꽃(머리)', '모자', '리본(목)', '방울(목)'];
  // 화면은 바로 바꾸고, 서버에도 저장해요
  const handleChange = (update: MongleProfileUpdate) => {
    setCustomMongle(prev => ({ ...prev, ...update }));
    updateMongleProfile(update).catch((err) => {
      console.error('몽글이 프로필 저장 실패', err);
    });
  };
  return (
    <div className={styles.container}>
      <header className={styles.header}>
        <button className={styles.backBtn} onClick={onBack}>
          <img src={backIcon} alt="뒤로가기" className={styles.iconImg} />
        </button>
        <h1 className={styles.title}>나의 몽글이</h1>
        <div className={styles.headerRight}>
          <button className={styles.iconBtn} onClick={onSoundClick}>
            <img src={soundIcon} alt="음량" className={styles.iconImg} />
          </button>
          <button className={styles.iconBtn} onClick={onMenuClick}>
            <img src={menuIcon} alt="메뉴" className={styles.iconImg} />
          </button>
        </div>
      </header>

      <div className={styles.characterDisplay}>
        {/* 💡 2. 길었던 장식 img 태그들을 싹 지우고 화가 컴포넌트로 교체! */}
        <MongleCharacter
          bodyImage={mongleBody}
          customMongle={customMongle}
          wrapperClassName={styles.myMongleSize}
        />
      </div>

      <div className={styles.optionsContainer}>
        <div className={styles.optionSection}>
          <h3 className={styles.sectionTitle}>닮은 특징 <span className={styles.subCount}>1가지</span></h3>
          <div className={styles.tagGroup}>
            {traits.map(item => (
              <button
                key={item}
                className={`${styles.tagBtn} ${customMongle.similarityTrait === item ? styles.activeTag : ''}`}
                onClick={() => handleChange({ similarityTrait: item })}
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
                className={`${styles.tagBtn} ${customMongle.comfortStyle === item ? styles.activeTag : ''}`}
                onClick={() => handleChange({ comfortStyle: item })}
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
                className={`${styles.tagBtn} ${customMongle.accessory === item ? styles.activeTag : ''}`}
                onClick={() => handleChange({ accessory: item })}
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