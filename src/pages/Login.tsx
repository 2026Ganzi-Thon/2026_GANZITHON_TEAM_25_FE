import React from 'react';
import styles from '../styles/Login.module.css';

import logoImg from '../assets/images/mongle-logo.png';
import alpacaImg from '../assets/images/alpaca.png';


export default function Login() {
  return (
    <div className={styles.wrapper}>
    <div className={styles.container}>
      
      {/* 중앙 메인 콘텐츠 */}
      <div className={styles.content}>
        {/* 몽글 로고  */}
        <img 
          src={logoImg} 
          alt="몽글 로고" 
          className={styles.logoImage} 
        />
        <p className={styles.subCopy}>
          말하고 싶을 때 <span className={styles.highlight}>털어놓고</span><br />
          말하기 싫을 때 <span className={styles.highlight}>털어내고</span>
        </p>

        <img 
          src={alpacaImg} 
          alt="알파카 캐릭터" 
          className={styles.alpacaImage} 
        />

        <p className={styles.description}>
          나와 닮아 친근하고, 나보다 조금 더 여유로운<br />
          몽글몽글한 양 친구와 마음을 털어내는 시간
        </p>
      </div>

      {/* 하단 고정 영역 */}
      <div className={styles.bottomSection}>
        <button className={styles.submitButton}>
          로그인하기
        </button>

        {/* 6. 회원가입 안내 텍스트[cite: 3] */}
        <p className={styles.signupText}>
          회원이 아니신가요? 
          <span className={styles.signupLink}>회원가입 하러가기</span>
        </p>
      </div>
    </div>
    </div>
  );
}