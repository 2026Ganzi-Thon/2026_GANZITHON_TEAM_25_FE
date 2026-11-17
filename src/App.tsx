import { useCallback, useEffect, useRef, useState } from 'react'
import Home from './pages/Home/Home'
import Login from './pages/Login'
import './styles/App.css'
import Onboarding from './pages/Onboarding'
import MongleAction from './pages/MongleAction'
import MindOrganize from './pages/MindOrganize/MindOrganize'
import Chat from './pages/Chat/Chat'
import MongleNext from './pages/Next';
import MongleHelp from './pages/Help';
import Memories from './pages/Memories/Memories'
import After from './pages/After/After'
import End from './pages/End/End'
import SignIn from './pages/SignIn/SignIn'
import MyMongle from './pages/MyMongle/MyMongle'
import SignUp from './pages/SignUp/SignUp'
import { logout } from './api/auth'
import { getToken, UNAUTHORIZED_EVENT } from './api/client'
import SoundSheet from './pages/Home/components/SoundSheet'
import MenuSheet from './pages/Home/components/MenuSheet'
import type { NatureSound } from './pages/Home/natureSounds'
import { getPreferences, updatePreferences, type PreferencesUpdate } from './api/preferences'
import { finishSession, startSession } from './api/session'


/** 로그인 없이 볼 수 있는 화면: 첫화면·로그인·회원가입 */
function isPublicPath(path: string) {
  const lower = path.toLowerCase()
  return lower === '/' || lower.startsWith('/signin') || lower.startsWith('/signup')
}

function App() {
  const [rawPath, setPath] = useState(window.location.pathname)
  useEffect(() => {
    const handlePopState = () => {
      setOpenSheet(null)
      setPath(window.location.pathname)
    }
    window.addEventListener('popstate', handlePopState)
    return () => window.removeEventListener('popstate', handlePopState)
  }, [])
  const [savedCount, setSavedCount] = useState(0)
  const [actionPhase, setActionPhase] = useState<'noon' | 'sunset'>('noon')
  // 상단 소리·메뉴 시트 — 모든 화면이 같은 설정을 쓰도록 App 한 곳에서 관리
  const [openSheet, setOpenSheet] = useState<'sound' | 'menu' | null>(null)
  const [natureSound, setNatureSound] = useState<NatureSound>('off')
  const [volume, setVolume] = useState(50)
  const [vibration, setVibration] = useState(true)
  const closeSheet = useCallback(() => setOpenSheet(null), [])

  const [customMongle, setCustomMongle] = useState(() => {
    const saved = localStorage.getItem('myCustomMongle')
    return saved ? JSON.parse(saved) : { trait: '멍하니 있기', tendency: '차분하고 조용함', accessory: '리본 (머리)' }
  })

  useEffect(() => {
    localStorage.setItem('myCustomMongle', JSON.stringify(customMongle))
  }, [customMongle])

  /* ── 말없이 쉬기(SILENT) 세션 ── */
  type SilentSession = { id: string | null; ended: boolean }
  const silentRef = useRef<SilentSession | null>(null)

  /** 홈에서 몽글이를 만질 때 한 번만 시작 */
  const startSilent = useCallback(() => {
    if (silentRef.current) return // 이미 쉬는 중이면 그대로 이어가요
    const session: SilentSession = { id: null, ended: false }
    silentRef.current = session
    startSession('SILENT')
      .then(({ sessionId }) => {
        session.id = sessionId
        // 만드는 사이에 이미 나갔다면 바로 종료
        if (session.ended) finishSession(sessionId).catch(() => { })
      })
      .catch(() => {
        if (silentRef.current === session) silentRef.current = null
      })
  }, [])

  /** 쉬는 흐름을 벗어나면 종료 (finish는 여러 번 불러도 200이라 안전) */
  const finishSilent = useCallback(() => {
    const session = silentRef.current
    if (!session) return
    silentRef.current = null
    session.ended = true
    if (session.id) finishSession(session.id).catch(() => { })
  }, [])

  /** 화면 상단 소리·메뉴 버튼에 그대로 넘기는 묶음 */
  const header = {
    onSoundClick: () => setOpenSheet('sound'),
    onMenuClick: () => setOpenSheet('menu'),
  }

  /** 메뉴에서 연 화면(도움·기억·내 몽글)은 왔던 화면으로 돌아가요 */
  const goBack = () => window.history.back()

  const navigate = (to: string, phase?: 'noon' | 'sunset') => {
    setOpenSheet(null)
    if (to === '/action' && phase) setActionPhase(phase)
    window.history.pushState(null, '', to)
    setPath(to)
  }
  // 보호 API에서 401이 오면 client.ts가 토큰을 지우고 신호를 보내요 → 첫화면으로
  useEffect(() => {
    const handleUnauthorized = () => {
      window.history.replaceState(null, '', '/')
      setPath('/')
    }
    window.addEventListener(UNAUTHORIZED_EVENT, handleUnauthorized)
    return () => window.removeEventListener(UNAUTHORIZED_EVENT, handleUnauthorized)
  }, [])

  // 로그인 안 했는데 보호 화면이면 첫화면으로, 로그인했는데 첫화면·로그인·가입이면 홈으로
  const isLoggedIn = getToken() !== null

  // 로그인하면 계정 설정을 불러와요. 실패해도 기본값으로 앱은 계속 써요
  useEffect(() => {
    if (!isLoggedIn) return
    let cancelled = false
    getPreferences()
      .then((prefs) => {
        if (cancelled) return
        setNatureSound(prefs.natureSound)
        setVolume(prefs.natureSoundVolume)
        setVibration(prefs.hapticsEnabled)
      })
      .catch(() => { })
    return () => { cancelled = true }
  }, [isLoggedIn])

  /** 화면은 바로 바꾸고, 서버 저장은 뒤에서 (가이드 6절: 즉시 반응 + 비동기 반영) */
  const savePreferences = (body: PreferencesUpdate) => {
    updatePreferences(body).catch(() => { /* 작업 2에서 토스트로 안내 */ })
  }

  const handleSoundChange = (sound: NatureSound) => {
    setNatureSound(sound)
    savePreferences({ natureSound: sound })
  }

  const handleVibrationChange = (on: boolean) => {
    setVibration(on)
    savePreferences({ hapticsEnabled: on })
  }

  // 슬라이더는 드래그하는 동안 onChange가 수십 번 와요 → 손을 멈춘 뒤 0.4초에 한 번만 저장
  const volumeTimerRef = useRef<number | undefined>(undefined)
  const handleVolumeChange = (next: number) => {
    setVolume(next)
    window.clearTimeout(volumeTimerRef.current)
    volumeTimerRef.current = window.setTimeout(
      () => savePreferences({ natureSoundVolume: next }),
      400,
    )
  }
  const redirectTo = !isLoggedIn && !isPublicPath(rawPath)
    ? '/'
    : isLoggedIn && isPublicPath(rawPath)
      ? '/home'
      : null
  /** 실제로 그릴 화면 주소 */
  const path = redirectTo ?? rawPath

  // 주소창도 옮겨 간 주소로 맞춰요 (뒤로가기 기록에 남기지 않음)
  useEffect(() => {
    if (redirectTo) window.history.replaceState(null, '', redirectTo)
  }, [redirectTo])

  /** 쉬는 동안 머물 수 있는 화면 (메뉴에서 연 화면도 돌아오니까 포함) */
  const SILENT_FLOW = ['/action', '/next', '/help', '/memories', '/mymongle']

  useEffect(() => {
    const lower = path.toLowerCase()
    if (!SILENT_FLOW.some((p) => lower.startsWith(p))) finishSilent()
  }, [path, finishSilent])

  const handleLogout = () => {
    finishSilent()
    window.clearTimeout(volumeTimerRef.current)
    logout()
    setNatureSound('off')
    setVolume(50)
    setVibration(true)
    navigate('/')
  }


  return (
    <div className="app">
      {path.startsWith('/home') ? (
        <Home
          {...header}
          customMongle={customMongle}
          onOrganizeAndTalk={() => navigate('/mind')}
          onTouchMongle={() => {
            startSilent()
            navigate('/action', 'noon')
          }}
        />
      ) : path.toLowerCase().startsWith('/mymongle') ? (
        <MyMongle
          {...header} onBack={goBack}
          customMongle={customMongle}
          setCustomMongle={setCustomMongle}
        />
      ) : path.toLowerCase().startsWith('/next') ? (
        <MongleNext
          {...header}
          onBack={() => navigate('/action')}
          onHelp={() => navigate('/help')}
          onMind={() => navigate('/mind')}
        />
      ) : path.toLowerCase().startsWith('/help') ? (
        <MongleHelp
          {...header}
          onBack={goBack}
        />
      ) : path.toLowerCase().startsWith('/onboarding') ? (
        <Onboarding onComplete={() => navigate('/home')} />
      ) : path.toLowerCase().startsWith('/action') ? (
        <MongleAction
          {...header}
          phase={actionPhase}
          customMongle={customMongle}
          onNext={() => navigate('/next')}
          onEnd={() => navigate('/end')}
        />
      ) : path.toLowerCase().startsWith('/mind') ? (
        <MindOrganize
          {...header}
          onBack={() => navigate('/home')}
          onEnd={() => navigate('/home')}
          onGoChat={() => navigate('/chat')}
        />
      ) : path.toLowerCase().startsWith('/chat') ? (
        <Chat
          {...header}
          onBack={() => navigate('/mind')}
          onFinish={(count) => {
            setSavedCount(count)
            setActionPhase('sunset')
            navigate('/after')
          }}
        />
      ) : path.toLowerCase().startsWith('/memories') ? (
        <Memories {...header} onBack={goBack} />
      ) : path.toLowerCase().startsWith('/after') ? (
        <After
          {...header}
          onTouchMongle={() => navigate('/action', 'sunset')}
          onShave={() => navigate('/action')}
          onNext={() => navigate('/next')}
          onEnd={() => navigate('/end')}
        />
      ) : path.toLowerCase().startsWith('/end') ? (
        <End {...header} savedCount={savedCount} onHome={() => navigate('/home')} />
      ) : path.toLowerCase().startsWith('/signin') ? (
        <SignIn
          onBack={() => navigate('/')}
          onLoginSuccess={() => navigate('/onboarding')}
        />
      ) : path.toLowerCase().startsWith('/signup') ? (
        <SignUp onBack={() => navigate('/')} onComplete={() => navigate('/')} />
      ) : (
        <Login
          onLoginClick={() => navigate('/signin')}
          onSignUpClick={() => navigate('/signup')}
        />)}
      {openSheet === 'sound' && (
        <SoundSheet
          sound={natureSound}
          volume={volume}
          onSoundChange={handleSoundChange}
          onVolumeChange={handleVolumeChange}
          onClose={closeSheet}
        />
      )}
      {openSheet === 'menu' && (
        <MenuSheet
          vibration={vibration}
          onVibrationChange={handleVibrationChange}
          onOpenMemories={() => navigate('/memories')}
          onOpenMyMongle={() => navigate('/mymongle')}
          onOpenHelp={() => navigate('/help')}
          onLogout={handleLogout}
          onClose={closeSheet}
        />
      )}
    </div>
  );
}

export default App
