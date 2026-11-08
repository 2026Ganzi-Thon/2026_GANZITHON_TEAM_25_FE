import { useState } from 'react';
import styles from '../styles/MongleAction.module.css';

import bgImage from '../assets/images/background_noon_wide.png'; 
import mongleBody from '../assets/images/alpaca/mongle_default_v3.png'; 
import woolParticle from '../assets/images/tuft/tuft-01.png'; 
import eyesDefault from '../assets/images/alpaca/eyes_v2.png';       
import eyesClosed from '../assets/images/alpaca/eyes_closed_wide.png';
import eyesSquint from '../assets/images/alpaca/mongle_eyes_wry.png';              
import eyesSmile from '../assets/images/alpaca/eyes_smile_matched.png';

import iconSound from '../assets/icons/sound-button.svg';
import iconMenu from '../assets/icons/menu-button.svg';

import iconPet from '../assets/icons/petting.png';
import iconShake from '../assets/icons/shaking.png';
import iconSquish from '../assets/icons/press.png';

type Mode = 'none' | 'pet' | 'shake' | 'squish';

export default function MongleAction() {
  const [mode, setMode] = useState<Mode>('none');
  const [animKey, setAnimKey] = useState(0); 

  const handleGoToShave = () => {
    window.history.pushState(null, '', '/shave'); 
    window.dispatchEvent(new PopStateEvent('popstate')); 
  };

  const handleAction = (newMode: Mode) => {
    setMode(newMode);
    setAnimKey(prev => prev + 1); // 클릭할 때마다 key가 바뀌어 애니메이션 재시작
  };

  const textData = {
    none: { title: "몽글이와 함께 시간을 보내요.", sub: "아래 버튼을 눌러 몽글이와 상호작용 해보세요!" },
    pet: { title: "몽글이가 눈을 감고 털을 맡겨요.", sub: "털이 살랑살랑 움직요. 같이 있어줄게요!" },
    shake: { title: "부르르 - 털이 가볍게 날아가요.", sub: "털어낸 털은 바람에 흩어졌어요. 같이 있어줄게요." },
    squish: { title: "말랑 - 눌렸다가 다시 몽글", sub: "몽글이가 다시 동그래졌어요. 같이 있어줄게요." }
  };

  const eyesMap = {
    none: eyesDefault,
    pet: eyesClosed,
    shake: eyesSquint,
    squish: eyesSmile
  };

  return (
    <div className={styles.wrapper}>
      <div className={styles.container}>
        {/* 1. 전체 배경 이미지 */}
        <img src={bgImage} alt="배경" className={styles.bgImage} />

        {/* 2. 상단 네비게이션 (소리, 메뉴) */}
        <div className={styles.topBar}>
          <button className={styles.iconBtn}><img src={iconSound} alt="소리" /></button>
          <button className={styles.iconBtn}><img src={iconMenu} alt="메뉴" /></button>
        </div>

        {/* 3. 상황별 텍스트 영역 */}
        <div className={styles.textSection}>
          <h2 className={styles.title}>{textData[mode].title}</h2>
          <p className={styles.subtitle}>{textData[mode].sub}</p>
        </div>

        {/* 4. 액션 버튼 3개 */}
        <div className={styles.actionButtons}>
          <button className={`${styles.actionBtn} ${mode === 'pet' ? styles.active : ''}`} onClick={() => handleAction('pet')}>
            <img src={iconPet} alt="쓰다듬기" className={styles.actionIcon} />
            <span>쓰다듬기</span>
          </button>
          <button className={`${styles.actionBtn} ${mode === 'shake' ? styles.active : ''}`} onClick={() => handleAction('shake')}>
            <img src={iconShake} alt="털어내기" className={styles.actionIcon} />
            <span>털어내기</span>
          </button>
          <button className={`${styles.actionBtn} ${mode === 'squish' ? styles.active : ''}`} onClick={() => handleAction('squish')}>
            <img src={iconSquish} alt="꾹 누르기" className={styles.actionIcon} />
            <span>꾹 누르기</span>
          </button>
        </div>

        {/* 5. 캐릭터 및 애니메이션 영역 */}
        <div className={styles.characterArea}>
          {/* animKey가 바뀔 때마다 div가 새로 그려지면서 CSS 애니메이션이 처음부터 다시 재생됨 */}
          <div key={animKey} className={`${styles.mongleWrapper} ${styles[mode]}`}>
            
            {/* 털어내기(shake) 모드일 때만 흩뿌려지는 양털 3개 렌더링 */}
            {mode === 'shake' && (
              <>
                <img src={woolParticle} className={`${styles.wool} ${styles.wool1}`} alt="털" />
                <img src={woolParticle} className={`${styles.wool} ${styles.wool2}`} alt="털" />
                <img src={woolParticle} className={`${styles.wool} ${styles.wool3}`} alt="털" />
                <img src={woolParticle} className={`${styles.wool} ${styles.wool4}`} alt="털" />
                <img src={woolParticle} className={`${styles.wool} ${styles.wool5}`} alt="털" />
                <img src={woolParticle} className={`${styles.wool} ${styles.wool6}`} alt="털" />
              </>
            )}

            <img src={mongleBody} alt="몽글이 몸" className={styles.mongleBody} />
            {/* 쓰다듬기(pet) 모드면 눈을 감고, 아니면 뜬 눈 이미지 사용 */}
            <img 
              src={eyesMap[mode]} 
              alt="몽글이 표정" 
              className={`${styles.mongleEyes} ${mode === 'pet' ? styles.eyesPet : ''} ${mode === 'shake' ? styles.eyesShake : ''}`} 
            />
          </div>
        </div>

        {/* 6. 하단 버튼 영역 */}
        <div className={styles.bottomSection}>
          <div className={styles.pillButtons}>
            <button className={styles.pillBtn} onClick={handleGoToShave}>털 깎으며 정리하기</button>
            <button className={styles.pillBtn}>다음 활동 보기</button>
          </div>
          <button className={styles.textLinkBtn}>여기서 끝내기</button>
        </div>

      </div>
    </div>
  );
}