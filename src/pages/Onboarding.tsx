import { useEffect, useState } from 'react';
import styles from '../styles/Onboarding.module.css';
import OnboardingStep from '../components/OnboardingSetp';
import mongleBody from '../assets/images/home/mongle-default.png';
import mongleEyesSmile from '../assets/images/home/mongle-eyes-smile.png';
import { getMongleProfile, updateMongleProfile } from '../api/mongleProfile';
import { getUserId } from '../api/client';

interface OnboardingProps {
  onComplete: () => void;
  customMongle: { trait: string; tendency: string; accessory: string };
  setCustomMongle: React.Dispatch<React.SetStateAction<any>>;
}

export default function Onboarding({ onComplete, customMongle, setCustomMongle }: OnboardingProps) {
  const onboardingStepKey = `mongle:onboarding-step:${getUserId() ?? 'unknown'}`;

  const [step, setStep] = useState(() => {
    try {
      const savedStep = localStorage.getItem(onboardingStepKey);
      return savedStep === '2' || savedStep === '3' ? Number(savedStep) : 1;
    } catch {
      return 1;
    }
  });
  const [selectedOption, setSelectedOption] = useState<number | null>(null);

  const moveToStep = (nextStep: number) => {
    setStep(nextStep);
    setSelectedOption(null);
    try {
      localStorage.setItem(onboardingStepKey, String(nextStep));
    } catch {
      // 저장소를 사용할 수 없으면 현재 화면에서 계속 진행해요.
    }
  };

  useEffect(() => {
    let cancelled = false;

    getMongleProfile()
      .then((profile) => {
        if (cancelled || !profile.onboardingCompleted) return;

        try {
          localStorage.removeItem(onboardingStepKey);
        } catch {
          // 저장소 사용 불가
        }
        onComplete();
      })
      .catch(() => {
        // 조회에 실패하면 저장된 단계에서 온보딩을 계속해요.
      });

    return () => {
      cancelled = true;
    };
  }, [onboardingStepKey, onComplete]);

  const traitById: Record<number, string> = {
    1: '멍하니 있기',
    2: '잘 웃기',
    3: '침 뱉기',
  };

  const comfortById: Record<number, string> = {
    1: '차분하고 조용함',
    2: '부드럽고 다정함',
    3: '가끔 장난스러움',
  };

  const accessoryById: Record<number, string> = {
    1: '없음',
    2: '리본(머리)',
    3: '작은 꽃(머리)',
    4: '모자',
    5: '리본(목)',
    6: '방울(목)',
  };
  const handleNext = async () => {
    try {
      if (step === 1 && selectedOption !== null) {
        await updateMongleProfile({ similarityTrait: traitById[selectedOption] });
      } else if (step === 2 && selectedOption !== null) {
        await updateMongleProfile({ comfortStyle: comfortById[selectedOption] });
      } else if (step === 3) {
        await updateMongleProfile({
          accessory: selectedOption === null ? '없음' : accessoryById[selectedOption],
        });
        try {
          localStorage.removeItem(onboardingStepKey);
        } catch {
          // 저장소 사용 불가
        }
        onComplete();
        return;
      }

      moveToStep(step + 1);
      setSelectedOption(null);
    } catch {
      window.alert('저장하지 못했어요. 연결을 확인하고 다시 시도해 주세요.');
    }
  };

  const handleSkip = async () => {
    if (step < 3) {
      moveToStep(step + 1);
      setSelectedOption(null);
      return;
    }

    try {
      await updateMongleProfile({ accessory: '없음' });
      try {
        localStorage.removeItem(onboardingStepKey);
      } catch {
        // 저장소 사용 불가
      }
      onComplete();
    } catch {
      window.alert('저장하지 못했어요. 연결을 확인하고 다시 시도해 주세요.');
    }
  };

  const handleOptionSelect = (optionId: number) => {
    setSelectedOption(optionId); 

    if (step === 3) {
      const selectedAccessoryName = accessoryById[optionId] || '없음';
      setCustomMongle((prev: any) => ({
        ...prev,
        accessory: selectedAccessoryName,
      }));
    }
  };

  const stepData = {
    1: {
      title: <><span className="highlight">몽글이</span>에게<br />나와 닮은 점을 줄 수 있어요</>,
      subtitle: "닮은 특징은 몽글이의 작은 버릇이 돼요.\n'나의 몽글이'에서 언제든 바꿀 수 있어요.",
      options: [
        { id: 1, title: "멍하니 있기", desc: "가끔씩 멍하게 있어요." },
        { id: 2, title: "잘 웃기", desc: "자주 행복한 얼굴을 하고 있어요." },
        { id: 3, title: "침 뱉기", desc: "장난꾸러기같은 모습을 보여줘요." }
      ]
    },
    2: {
      title: <>어떤 <span className="highlight">몽글이</span>가<br />곁에 있으면 편할까요?</>,
      subtitle: "몽글이의 말투와 반응이 조금 달라져요.\n'나의 몽글이'에서 언제든 바꿀 수 있어요.",
      options: [
        { id: 1, title: "차분하고 조용함", desc: "말수가 적고 천천히 반응해요." },
        { id: 2, title: "부드럽고 다정함", desc: "다정한 말을 덧붙여요." },
        { id: 3, title: "가끔 장난스러움", desc: "유머러스하게 받아쳐요." }
      ]
    },
    3: {
      title: <>몽글이에게 작은 <span className="highlight">장식</span>을 달아줄까요?</>,
      subtitle: "마음에 드는 장식을 골라주세요.\n고르지 않아도 괜찮아요.",
      options: [
        { id: 1, title: "없음", desc: "장식 없이 함께해요." },
        { id: 2, title: "리본 (머리)", desc: "머리에 리본을 달아요." },
        { id: 3, title: "작은 꽃 (머리)", desc: "머리에 작은 꽃을 달아요." },
        { id: 4, title: "모자", desc: "모자를 씌워줘요." },
        { id: 5, title: "리본 (목)", desc: "목에 리본을 달아요." },
        { id: 6, title: "방울 (목)", desc: "목에 방울을 달아요." },
      ],
    },
  };

  const currentData =
    step === 1 ? stepData[1] : step === 2 ? stepData[2] : stepData[3];
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
          onSelect={handleOptionSelect}
          onNext={handleNext}
          onBack={() => step > 1 && moveToStep(step - 1)}
          onSkip={handleSkip}
          customMongle={customMongle} 
        />
      </div>
    </div>
  );
}