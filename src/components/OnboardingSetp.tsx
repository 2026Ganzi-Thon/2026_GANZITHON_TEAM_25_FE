import type { ReactNode } from 'react';
import styles from '../styles/OnboardingStep.module.css';

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
}

export default function OnboardingStep({
  step, title, subtitle, bodyImage, eyesImage, options, selectedOption, onSelect, onNext, onBack, onSkip
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