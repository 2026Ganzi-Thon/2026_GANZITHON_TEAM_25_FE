import { useState, useRef, type PointerEvent } from 'react';
import styles from '../styles/Shave.module.css';

import iconBack from '../assets/icons/arrow-back.svg';
import iconSound from '../assets/icons/sound-button.svg';
import iconMenu from '../assets/icons/menu-button.svg';
import mongleBody from '../assets/images/alpaca/mongle_default_v3.png';
import mongleEyesSmile from '../assets/images/alpaca/eyes_smile_matched.png';
import woolParticle from '../assets/images/tuft/tuft-01.png';


type Category = 'normal' | 'emotion' | 'worry';

interface WoolAnim {
  id: number;
  startX: number;
  startY: number;
  targetX: number;
  targetY: number;
  targetRot: number;
}

export default function Shave({ onBack, onComplete, onNextActivity }: { onBack?: () => void, onComplete?: () => void, onNextActivity?: () => void }) {
  const [isFinished, setIsFinished] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<Category>('normal');
  const [counts, setCounts] = useState<Record<Category, number>>({
    normal: 0, emotion: 0, worry: 0
  });
  
  const [flyingWools, setFlyingWools] = useState<WoolAnim[]>([]);
  const woolIdCounter = useRef(0);

  const [isDragging, setIsDragging] = useState(false);
  const [dragStartX, setDragStartX] = useState(0);
  const dragAccumulator = useRef(0);
  const hasShearedThisDrag = useRef(false);

  const totalWools = counts.normal + counts.emotion + counts.worry 

  const categories: { id: Category; label: string }[] = [
    { id: 'normal', label: '그냥 깎기' },
    { id: 'emotion', label: '지금 감정' },
    { id: 'worry', label: '계속 신경 쓰이는 걱정' }
  ];

  const handlePointerDown = (e: PointerEvent<HTMLDivElement>) => {
    if (isFinished) return;
    setIsDragging(true);
    setDragStartX(e.clientX);
    dragAccumulator.current = 0;
    hasShearedThisDrag.current = false;
  };

  const handlePointerMove = (e: PointerEvent<HTMLDivElement>) => {
    if (!isDragging || isFinished || hasShearedThisDrag.current) return;
    const diff = Math.abs(e.clientX - dragStartX);
    dragAccumulator.current += diff;
    setDragStartX(e.clientX);

   if (dragAccumulator.current > 50) {
      triggerShear();
      hasShearedThisDrag.current = true; 
    }
  };

  const handlePointerUp = () => setIsDragging(false);

  const triggerShear = () => {
    if (totalWools >= 10) return;
    setCounts(prev => ({ ...prev, [selectedCategory]: prev[selectedCategory] + 1 }));
    
    const col = totalWools % 5; 
    const row = Math.floor(totalWools / 5); 

    const targetX = col * 15; 
    const targetY = row * -12; 
    const targetRot = Math.random() * 30 - 15; 

    const startX = Math.random() * 100 - 50; // -50px ~ +50px
    const startY = Math.random() * 100 - 50;

    const newId = woolIdCounter.current++;
    setFlyingWools(prev => [...prev, { id: newId, startX, startY, targetX, targetY, targetRot }])
  };

  return (
    <div className={styles.wrapper}>
      <div className={styles.container}>

        <div className={styles.topBar}>
          <button className={styles.iconBtn} onClick={onBack}><img src={iconBack} alt="뒤로가기" /></button>
          <div className={styles.rightIcons}>
            <button className={styles.iconBtn}><img src={iconSound} alt="소리" /></button>
            <button className={styles.iconBtn}><img src={iconMenu} alt="메뉴" /></button>
          </div>
        </div>

        <div className={styles.textSection}>
          {!isFinished ? (
            <>
              <h2 className={styles.title}>깎고 싶은 만큼만 톡 하거나 쓸어 보세요.<br/>다 깎지 않아도 괜찮아요.</h2>
              <div className={styles.categoryChips}>
                {categories.map(cat => (
                  <button key={cat.id} className={`${styles.chip} ${selectedCategory === cat.id ? styles.chipActive : ''}`} onClick={() => setSelectedCategory(cat.id)}>
                    {cat.label}
                  </button>
                ))}
              </div>
            </>
          ) : (
            <h2 className={styles.title}>털뭉치를 내려놓았어요.<br/>몽글이의 털은 다시 자랄거에요!</h2>
          )}
        </div>

        {/* 캐릭터 영역 */}
        <div 
          className={styles.characterArea}
          onPointerDown={handlePointerDown}
          onPointerMove={handlePointerMove}
          onPointerUp={handlePointerUp}
          onPointerLeave={handlePointerUp}
        >
          <div className={`${styles.mongleWrapper} ${isDragging ? styles.isPetting : ''}`}>
            
            {flyingWools.map(wool => (
              <img 
                key={wool.id} 
                src={woolParticle} 
                className={styles.flyingWool} 
                alt="깎인 털" 
                style={{
                  '--start-x': `${wool.startX}px`,
                  '--start-y': `${wool.startY}px`,
                  '--target-x': `${wool.targetX}px`,
                  '--target-y': `${wool.targetY}px`,
                  '--target-rot': `${wool.targetRot}deg`
                } as React.CSSProperties}
              />
            ))}
            
            <img src={mongleBody} alt="몽글이 몸" className={styles.mongleBody} />
            <img src={mongleEyesSmile} alt="몽글이 표정" className={styles.mongleEyes} />
          </div>
        </div>

        <div className={styles.woolInfoArea}>
          <p className={styles.woolTotalText}>털뭉치 {totalWools}개</p>
          <div className={styles.countChips}>
            {categories.map(cat => counts[cat.id] > 0 && (
              <span key={cat.id} className={styles.countChip}>
                {cat.label} {counts[cat.id]}
              </span>
            ))}
          </div>
        </div>

        <div className={styles.bottomSection}>
          {!isFinished ? (
            <button className={styles.mainBtn} onClick={() => setIsFinished(true)}>털뭉치 내려놓기</button>
          ) : (
            <div className={styles.pillButtons}>
              <button className={styles.pillBtnOutlined} onClick={onNextActivity}>다음 활동 보기</button>
              <button className={styles.pillBtnFilled} onClick={onComplete}>여기서 끝내기</button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}