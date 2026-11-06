import { useEffect, useState } from 'react'
import Home from './pages/Home/Home'
import Login from './pages/Login'
import './styles/App.css'

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

  const navigate = (to: string) => {
    window.history.pushState(null, '', to)
    setPath(to)
  }

  return (
    <div className="app">
      {path.startsWith('/home') ? (
        <Home />
      ) : (
        <Login onLoginClick={() => navigate('/home')} />
      )}
    </div>
  )
}

export default App
