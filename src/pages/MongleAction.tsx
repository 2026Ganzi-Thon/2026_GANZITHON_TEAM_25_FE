import { useState, useRef, type PointerEvent } from 'react';
import styles from '../styles/MongleAction.module.css';

import bgImage from '../assets/images/background_noon_wide.png';
import bgSunsetImage from '../assets/images/background_sunset_wide.png';
import mongleBody from '../assets/images/alpaca/mongle_default_v3.png';
import woolParticle from '../assets/images/tuft/tuft-01.png';
import eyesDefault from '../assets/images/alpaca/eyes_v2.png';
import eyesClosed from '../assets/images/alpaca/eyes_closed_wide.png';
import eyesSquint from '../assets/images/alpaca/mongle_eyes_wry.png';
import eyesSmile from '../assets/images/alpaca/eyes_smile_matched.png';
import type { HeaderButtonHandlers } from '../components/HeaderActions/HeaderActions';
import iconSound from '../assets/icons/sound-button.svg';
import iconMenu from '../assets/icons/menu-button.svg';
import iconPet from '../assets/icons/petting.png';
import iconShake from '../assets/icons/shaking.png';
import iconSquish from '../assets/icons/press.png';

import MongleCharacter from '../components/MongleCharacter';

type Mode = 'none' | 'pet' | 'shake' | 'squish';

type MongleActionProps = {
  phase: 'noon' | 'sunset';
  onShave?: () => void;
  onNext?: () => void;
  onEnd?: () => void;
  customMongle: { trait: string; tendency: string; accessory: string }; 
} & HeaderButtonHandlers;

interface WoolAnim {
  id: number;
  startX: number;
  startY: number;
  targetX: number;
  targetY: number;
  targetRot: number;
}

export default function MongleAction({ phase, onNext, onSoundClick, onMenuClick, customMongle }: MongleActionProps) {
  const [mode, setMode] = useState<Mode>('none');
  const [animKey, setAnimKey] = useState(0);

  const [flyingWools, setFlyingWools] = useState<WoolAnim[]>([]);
  const woolIdCounter = useRef(0);

  const [isDragging, setIsDragging] = useState(false);
  const initialTouchX = useRef(0);
  const [dragStartX, setDragStartX] = useState(0);
  const dragAccumulator = useRef(0);
  const [dragOffset, setDragOffset] = useState(0);
  const hasTriggeredThisDrag = useRef(false);

  const textData = {
    none: { title: "몽글이와 함께 시간을 보내요.", sub: "버튼을 눌러 모드를 선택하고 몽글이를 문질러보세요!" },
    pet: { title: "몽글이가 눈을 감고 털을 맡겨요.", sub: "털이 살랑살랑 움직여요. 같이 있어줄게요!" },
    shake: { title: "부르르 - 털이 가볍게 날아가요.", sub: "문지르면 털이 바닥에 떨어져요. 같이 있어줄게요." },
    squish: { title: "말랑 - 눌렸다가 다시 몽글", sub: "몽글이가 다시 동그래졌어요. 같이 있어줄게요." }
  };

  const eyesMap = {
    none: eyesDefault,
    pet: eyesClosed,
    shake: eyesSquint,
    squish: eyesSmile
  };

  const handleAction = (newMode: Mode) => {
    setMode(newMode);
    setAnimKey(prev => prev + 1);
  };

  const handlePointerDown = (e: PointerEvent<HTMLDivElement>) => {
    setIsDragging(true);
    initialTouchX.current = e.clientX;
    setDragStartX(e.clientX);
    dragAccumulator.current = 0;
    setDragOffset(0);
    hasTriggeredThisDrag.current = false;
  };

  const handlePointerMove = (e: PointerEvent<HTMLDivElement>) => {
    if (!isDragging) return;

    const currentX = e.clientX;
    const diff = Math.abs(currentX - dragStartX);

    if (mode === 'pet') {
      setDragOffset(currentX - initialTouchX.current);
    }

    dragAccumulator.current += diff;
    setDragStartX(currentX);

    if (mode === 'shake' && dragAccumulator.current > 60 && !hasTriggeredThisDrag.current) {
      triggerShear();
      hasTriggeredThisDrag.current = true;
    }
  };

  const handlePointerUp = () => {
    setIsDragging(false);
    setDragOffset(0);
  };

  const triggerShear = () => {
    const startX = Math.random() * 80 - 40;
    const startY = Math.random() * 80 - 40;
    const targetX = Math.random() * 160 - 80;
    const targetY = Math.random() * 60 - 10;
    const targetRot = Math.random() * 180 - 90;

    const newId = woolIdCounter.current++;
    setFlyingWools(prev => [...prev, { id: newId, startX, startY, targetX, targetY, targetRot }]);
  };

  const characterStyle = {
    transform: mode === 'pet' && isDragging ? `rotate(${dragOffset * 0.15}deg)` : 'rotate(0deg)',
    transition: isDragging ? 'none' : 'transform 0.3s ease-out'
  };

  return (
    <div className={styles.wrapper}>
      <img src={phase === 'sunset' ? bgSunsetImage : bgImage} alt="" aria-hidden="true" className={styles.bgImage} />
      <div className={styles.container}>

        <div className={styles.topBar}>
          <button className={styles.iconBtn} onClick={onSoundClick}>
            <img src={iconSound} alt="소리" />
          </button>
          <button className={styles.iconBtn} onClick={onMenuClick}>
            <img src={iconMenu} alt="메뉴" />
          </button>
        </div>

        <div className={styles.textSection}>
          <h2 className={styles.title}>{textData[mode].title}</h2>
          <p className={styles.subtitle}>{textData[mode].sub}</p>
        </div>

        <div className={styles.actionButtons}>
          <button className={`${styles.actionBtn} ${mode === 'pet' ? styles.active : ''}`} onClick={() => handleAction('pet')}>
            <img src={iconPet} alt="쓰다듬기" className={styles.actionIcon} /><span>쓰다듬기</span>
          </button>
          <button className={`${styles.actionBtn} ${mode === 'shake' ? styles.active : ''}`} onClick={() => handleAction('shake')}>
            <img src={iconShake} alt="털어내기" className={styles.actionIcon} /><span>털어내기</span>
          </button>
          <button className={`${styles.actionBtn} ${mode === 'squish' ? styles.active : ''}`} onClick={() => handleAction('squish')}>
            <img src={iconSquish} alt="꾹 누르기" className={styles.actionIcon} /><span>꾹 누르기</span>
          </button>
        </div>

        <div
          className={styles.characterArea}
          onPointerDown={handlePointerDown}
          onPointerMove={handlePointerMove}
          onPointerUp={handlePointerUp}
          onPointerLeave={handlePointerUp}
          style={{ touchAction: 'none' }}
        >
          <div key={animKey} className={`${styles.mongleWrapper} ${styles[mode]}`} style={characterStyle}>

            {mode === 'shake' && (
              <>
                <img src={woolParticle} className={`${styles.wool} ${styles.wool1}`} alt="털" />
                <img src={woolParticle} className={`${styles.wool} ${styles.wool2}`} alt="털" />
                <img src={woolParticle} className={`${styles.wool} ${styles.wool3}`} alt="털" />
                <img src={woolParticle} className={`${styles.wool} ${styles.wool4}`} alt="털" />
                <img src={woolParticle} className={`${styles.wool} ${styles.wool5}`} alt="털" />
                <img src={woolParticle} className={`${styles.wool} ${styles.wool6}`} alt="털" />

                {flyingWools.map(wool => (
                  <img
                    key={wool.id} src={woolParticle} className={styles.flyingWool} alt="깎인 털"
                    style={{
                      '--start-x': `${wool.startX}px`, '--start-y': `${wool.startY}px`,
                      '--target-x': `${wool.targetX}px`, '--target-y': `${wool.targetY}px`, '--target-rot': `${wool.targetRot}deg`
                    } as React.CSSProperties}
                  />
                ))}
              </>
            )}

            <MongleCharacter 
              bodyImage={mongleBody}
              customMongle={customMongle}
              overrideEyes={mode === 'none' ? null : eyesMap[mode]} 
              bodyClassName={isDragging && mode === 'shake' ? styles.wiggleMotion : ''}
              eyesClassName={`${mode === 'pet' ? styles.eyesPet : ''} ${mode === 'shake' ? styles.eyesShake : ''}`}
              wrapperClassName={styles.actionSize}
            />

          </div>
        </div>

        <div className={styles.bottomSection}>
          <div className={styles.pillButtons}>
            <button className={styles.pillBtn} onClick={onNext}>
              다음 행동 선택
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}