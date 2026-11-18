import styles from '../styles/MongleCharacter.module.css';

import ribbonHeadImg from '../assets/deco/ribbon-head.png';
import flowerHeadImg from '../assets/deco/flower-head.png';
import hatImg from '../assets/deco/hat.png';
import ribbonNeckImg from '../assets/deco/ribbon-neck.png';
import bellNeckImg from '../assets/deco/bell.png';

import mongleBlankBody from '../assets/images/alpaca/blank.png';
import eyesSmile from '../assets/images/alpaca/eyes_smile_matched.png'; 
import eyesSpit from '../assets/images/alpaca/mongle_spit.png';
import eyesSquint from '../assets/images/alpaca/mongle_eyes_wry.png';

interface MongleProps {
  bodyImage: string;
  customMongle?: { similarityTrait: string; comfortStyle: string; accessory: string };
  overrideEyes?: string | null; 
  bodyClassName?: string;       
  eyesClassName?: string;       
  wrapperClassName?: string;
}

export default function MongleCharacter({ bodyImage, customMongle, overrideEyes, bodyClassName, eyesClassName,wrapperClassName }: MongleProps) {
  let currentBody = bodyImage; 
  let eyesContent = null;
  
  if (overrideEyes) {
    eyesContent = <img src={overrideEyes} alt="액션 표정" className={`${styles.mongleEyes} ${eyesClassName || ''}`} />;
  } 
  else if (customMongle?.similarityTrait === '멍하니 있기') {
    currentBody = mongleBlankBody; 
  } 
  else if (customMongle?.similarityTrait === '침 뱉기') {
    eyesContent = (
      <>
        <img src={eyesSquint} alt="질끈 감은 눈" className={`${styles.squintEyes} ${eyesClassName || ''}`} />
        <img src={eyesSpit} alt="침방울" className={styles.spit} />
        <img src={eyesSpit} alt="침방울" className={styles.spit2} />
      </>
    );
  } 
  else {
    eyesContent = <img src={eyesSmile} alt="웃는 표정" className={`${styles.mongleEyes} ${eyesClassName || ''}`} />;
  }

  return (
    <div className={`${styles.imageWrapper} ${wrapperClassName || ''}`}>
      <img src={currentBody} alt="몽글이 몸" className={`${styles.mongleBody} ${bodyClassName || ''}`} />
      {eyesContent}
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
  );
}