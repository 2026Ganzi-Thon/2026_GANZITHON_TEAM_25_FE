import { useEffect, useState } from 'react'
import Home from './pages/Home/Home'
import Login from './pages/Login'
import './styles/App.css'
import Onboarding from './pages/Onboarding'
import MongleAction from './pages/MongleAction'
import Shave from './pages/Shave';
import MindOrganize from './pages/MindOrganize/MindOrganize'
import Chat from './pages/Chat/Chat'
import MongleNext from './pages/Next';
import MongleHelp from './pages/Help';
import Memories from './pages/Memories/Memories'
import After from './pages/After/After'
import End from './pages/End/End'
import SignIn from './pages/SignIn/SignIn'

/**
 * TODO: 라우터(react-router 등) 도입 전까지 쓰는 임시 화면 전환
 * - /     → 첫화면(로그인)
 * - /home → 홈
 * 브라우저 뒤로가기/앞으로가기도 동작하도록 history API 사용
 */
function App() {
  const [path, setPath] = useState(window.location.pathname)

  useEffect(() => {
    const handlePopState = () => setPath(window.location.pathname)
    window.addEventListener('popstate', handlePopState)
    return () => window.removeEventListener('popstate', handlePopState)
  }, [])
  const [savedCount, setSavedCount] = useState(0)

  const navigate = (to: string) => {
    window.history.pushState(null, '', to)
    setPath(to)
  }

  return (
    <div className="app">
      {path.startsWith('/home') ? (
        <Home
          onOrganizeAndTalk={() => navigate('/mind')}
          onOpenMemories={() => navigate('/memories')}
        />
      ) : path.toLowerCase().startsWith('/shave') ? (
        <Shave
          onBack={() => navigate('/action')}
          onComplete={() => navigate('/home')}
          onNextActivity={() => navigate('/next')}
        />
      ) : path.toLowerCase().startsWith('/next') ? (
        <MongleNext
          onBack={() => navigate('/action')}
          onHelp={() => navigate('/help')}
          onMind={() => navigate('/mind')}
        />
      ) : path.toLowerCase().startsWith('/help') ? (
        <MongleHelp
          onBack={() => navigate('/next')}
        />
      ) : path.toLowerCase().startsWith('/onboarding') ? (
        <Onboarding onComplete={() => navigate('/home')} />
      ) : path.toLowerCase().startsWith('/action') ? (
        <MongleAction />
      ) : path.toLowerCase().startsWith('/mind') ? (
        <MindOrganize
          onBack={() => navigate('/home')}
          onEnd={() => navigate('/home')}
          onGoChat={() => navigate('/chat')}
        />
      ) : path.toLowerCase().startsWith('/chat') ? (
        <Chat
          onBack={() => navigate('/mind')}
          onFinish={(count) => {
            setSavedCount(count)
            navigate('/after')
          }}
        />
      ) : path.toLowerCase().startsWith('/memories') ? (
        <Memories onBack={() => navigate('/home')} />
      ) : path.toLowerCase().startsWith('/after') ? (
        <After
          onTouchMongle={() => navigate('/action')}
          onShave={() => navigate('/shave')}
          onNext={() => navigate('/next')}
          onEnd={() => navigate('/end')}
        />
      ) : path.toLowerCase().startsWith('/end') ? (
        <End savedCount={savedCount} onHome={() => navigate('/home')} />
      ) : path.toLowerCase().startsWith('/signin') ? (
        <SignIn
          onBack={() => navigate('/')}
          onLoginSuccess={() => navigate('/onboarding')}
        />
      ) : (
        <Login onLoginClick={() => navigate('/signin')} />
      )}
    </div>
  );
}

export default App
