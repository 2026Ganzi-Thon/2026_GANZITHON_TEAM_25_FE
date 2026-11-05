import React from 'react';
// Login 컴포넌트가 있는 경로를 정확히 입력해 주세요. (예: components 또는 pages 폴더)
import Login from './pages/Login'; 
import './App.css'; // 필요에 따라 유지하거나 삭제

function App() {
  return (
    <div>
      {/* 불러온 로그인 화면을 도화지에 렌더링합니다 */}
      <Login />
    </div>
  );
}

export default App;