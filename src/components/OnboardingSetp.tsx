import type { ReactNode } from 'react';
import styles from '../styles/OnboardingStep.module.css';

import ribbonHeadImg from '../assets/deco/ribbon-head.png';
import flowerHeadImg from '../assets/deco/flower-head.png';
import hatImg from '../assets/deco/hat.png';
import ribbonNeckImg from '../assets/deco/ribbon-neck.png';
import bellNeckImg from '../assets/deco/bell.png';

interface Option {
  id: number;
  title: string;
  desc: string;
}

interface StepProps {
  step: number;
  title: ReactNode;
  subtitle: string;
  bodyImage: string;
  eyesImage: string;
  options: Option[];
  selectedOption: number | null;
  onSelect: (id: number) => void;
  onNext: () => void;
  onBack: () => void;
  onSkip?: () => void;
  customMongle?: { trait: string; tendency: string; accessory: string };
}

export default function OnboardingStep({
  step, title, subtitle, bodyImage, eyesImage, options, selectedOption,customMongle, onSelect, onNext, onBack, onSkip
}: StepProps) {
  return (
    <div className={styles.stepContainer}>

      {/*  상단 바  */}
      <div className={styles.topBar}>
        <button className={styles.iconBtn} onClick={onBack}>&lt;</button>
        <div className={styles.progress}>
          {[1, 2, 3].map((progressStep) => (
            <div
              key={progressStep}
              className={step === progressStep ? styles.activePill : styles.inactiveDot}
            />
          ))}
        </div>
        <button className={styles.skipBtn} onClick={onSkip}>건너뛰기</button>
      </div>

      {/* 텍스트 영역 */}
      <div className={styles.textSection}>
        <h2 className={styles.title}>{title}</h2>
        <p className={styles.subtitle}>
          {subtitle.split('\n').map((line, index) => (
            <span key={index}>{line}<br /></span>
          ))}
        </p>
      </div>

      {/* 알파카 이미지 */}
      <div className={styles.imageWrapper}>
        <img src={bodyImage} alt="몽글이 몸" className={styles.mongleBody} />
        <img src={eyesImage} alt="몽글이 표정" className={styles.mongleEyes} />
        {customMongle?.accessory === '리본(머리)' && (
          <img src={ribbonHeadImg} alt="머리 리본" className={`${styles.accessory} ${styles.ribbonHead}`} />
        )}
        {customMongle?.accessory === '작은 꽃(머리)' && (
          <img src={flowerHeadImg} alt="머리 꽃" className={`${styles.accessory} ${styles.flowerHead}`} />
        )}
        {customMongle?.accessory === '모자' && (
          <img src={hatImg} alt="모자" className={`${styles.accessory} ${styles.hat}`} />
        )}
        {customMongle?.accessory === '리본(목)' && (
          <img src={ribbonNeckImg} alt="목 리본" className={`${styles.accessory} ${styles.ribbonNeck}`} />
        )}
        {customMongle?.accessory === '방울(목)' && (
          <img src={bellNeckImg} alt="목 방울" className={`${styles.accessory} ${styles.bellNeck}`} />
        )}
      </div>

      {/* 선택 카드 목록 */}
      <div className={styles.optionsContainer}>
        {options.map((opt) => (
          <button
            key={opt.id}
            className={`${styles.optionCard} ${selectedOption === opt.id ? styles.selected : ''}`}
            onClick={() => onSelect(opt.id)}
          >
            <h3 className={styles.optionTitle}>{opt.title}</h3>
            <p className={styles.optionDesc}>{opt.desc}</p>
          </button>
        ))}
      </div>

      {/* 하단 버튼 */}
      <button
        className={styles.nextButton}
        onClick={onNext}
      >
        {step < 3 ? '다음' : '몽글이 만나기'}
      </button>

    </div >
  );
}