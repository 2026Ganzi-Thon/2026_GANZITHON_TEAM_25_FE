import { useState } from 'react';
import styles from '../styles/Onboarding.module.css';
import OnboardingStep from '../components/OnboardingSetp';
import mongleBody from '../assets/images/home/mongle-default.png';
import mongleEyesSmile from '../assets/images/home/mongle-eyes-smile.png';

interface OnboardingProps {
  onComplete: () => void;
}

export default function Onboarding({ onComplete }: OnboardingProps) {
  const [step, setStep] = useState(1);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);

  const handleNext = () => {
    if (step === 1) {
      setStep(2);
      setSelectedOption(null); 
    } else {
      console.log("온보딩 완료 메인으로 이동");
      onComplete(); 
    }
  };

  const stepData = {
    1: {
      title: <><span className="highlight">몽글이</span>에게<br/>나와 닮은 점을 줄 수 있어요</>,
      subtitle: "닮은 특징은 몽글이의 작은 버릇이 돼요.\n'나의 몽글이'에서 언제든 바꿀 수 있어요.",
      options: [
        { id: 1, title: "멍하니 있기", desc: "가끔씩 멍하게 있어요." },
        { id: 2, title: "잘 웃기", desc: "자주 행복한 얼굴을 하고 있어요." },
        { id: 3, title: "침 뱉기", desc: "장난꾸러기같은 모습을 보여줘요." }
      ]
    },
    2: {
      title: <>어떤 <span className="highlight">몽글이</span>가<br/>곁에 있으면 편할까요?</>,
      subtitle: "몽글이의 말투와 반응이 조금 달라져요.\n'나의 몽글이'에서 언제든 바꿀 수 있어요.",
      options: [
        { id: 1, title: "차분하고 조용함", desc: "말수가 적고 천천히 반응해요." },
        { id: 2, title: "부드럽고 다정함", desc: "다정한 말을 덧붙여요." },
        { id: 3, title: "가끔 장난스러움", desc: "유머러스하게 받아쳐요." }
      ]
    }
  };

  const currentData = step === 1 ? stepData[1] : stepData[2];

  return (
    <div className={styles.wrapper}>
      <div className={styles.container}>
        <OnboardingStep
          step={step}
          title={currentData.title}
          subtitle={currentData.subtitle}
          bodyImage={mongleBody}
          eyesImage={mongleEyesSmile}
          options={currentData.options}
          selectedOption={selectedOption}
          onSelect={setSelectedOption}
          onNext={handleNext}
          onBack={() => step === 2 ? setStep(1) : console.log('이전 화면으로')}
        />
      </div>
    </div>
  );
}