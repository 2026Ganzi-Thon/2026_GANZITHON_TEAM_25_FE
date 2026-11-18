import { useEffect, useRef, useState, type FormEvent } from 'react'
import backgroundNoon from '../../assets/images/background_noon_wide.png'
import sunImage from '../../assets/images/home/sun.png'
import mongleImage from '../../assets/images/alpaca/mongle_default_v3.png'
import sunGlow from '../../assets/icons/sun-glow.svg'
import mongleShadow from '../../assets/icons/mongle-shadow.svg'
import sendButton from '../../assets/icons/send-button.svg'
import arrowBack from '../../assets/icons/arrow-back.svg'
import HeaderActions, { type HeaderButtonHandlers } from '../../components/HeaderActions/HeaderActions'
import '../../styles/Chat.css'
import { postReflection } from '../../api/reflection'
import { finishSession, startSession } from '../../api/session'
import { ApiError } from '../../api/client'
import {
    approveMemory,
    createMemoryPreview,
    getMemories,
    type Memory,
    type MemoryPreview,
} from '../../api/memories'
import RememberSheet from './components/RememberSheet'
import MemoryPickSheet from './components/MemoryPickSheet'
import { useToast } from '../../components/Toast/toastContext'
import { getToastMessage } from '../../api/errors'
import MongleCharacter from '../../components/MongleCharacter'

type Message = {
    id: number
    from: 'user' | 'mongle'
    text: string
}
/** 첫 안내 말풍선 — 토글 상태에 따라 문구가 바뀜 */
const INTRO_TEXT = {
    off: ['여기서는 편하게 말해도 돼!', '이 대화는 끝나면 사라져.'],
    on: ['여기서는 편하게 말해도 돼!', '끝나면 기억할 내용만 골라서 남길 수 있어.'],
}

function getChatErrorMessage(error: unknown): string {
    if (error instanceof ApiError) {
        if (error.status === 429) return '이번 대화에서는 더 들을 수 없어. 그만 털어놓기를 눌러줄래?'
        if (error.status === 0) return '연결이 잠깐 끊긴 것 같아. 잠시 후 다시 말해줄래?'
    }
    return '지금은 대답이 잘 안 떠올라. 잠시 후 다시 말해줄래?'
}

type ChatProps = {
    onBack?: () => void
    onFinish?: (savedCount: number) => void
    customMongle?: { similarityTrait: string; comfortStyle: string; accessory: string } 
} & HeaderButtonHandlers

function Chat({ onBack, onFinish, onSoundClick, onMenuClick, customMongle }: ChatProps) {
    const [message, setMessage] = useState('')
    const [messages, setMessages] = useState<Message[]>([])
    const [remember, setRemember] = useState(false)
    const nextId = useRef(0)
    const logRef = useRef<HTMLOListElement>(null)
    const showToast = useToast()

    const [preview, setPreview] = useState<MemoryPreview | null>(null)
    const [pickList, setPickList] = useState<Memory[] | null>(null)
    const [selectedMemoryIds, setSelectedMemoryIds] = useState<string[]>([])
    const [sending, setSending] = useState(false)
    const sessionIdRef = useRef<string | null>(null)
    const startSessionPromiseRef = useRef<Promise<string> | null>(null)
    const leavingRef = useRef(false)

    const ensureSession = async (): Promise<string> => {
        if (sessionIdRef.current) return sessionIdRef.current
        if (!startSessionPromiseRef.current) {
            startSessionPromiseRef.current = startSession('TALK').then(({ sessionId }) => {
                sessionIdRef.current = sessionId
                return sessionId
            }).finally(() => { startSessionPromiseRef.current = null })
        }
        return startSessionPromiseRef.current
    }

    // 화면을 떠나면 세션 종료. 생성 요청이 진행 중이면 생성 완료 후 종료해요.
    useEffect(() => {
        leavingRef.current = false
        return () => {
            leavingRef.current = true
            const sessionId = sessionIdRef.current
            if (sessionId) finishSession(sessionId).catch(() => { })
            else startSessionPromiseRef.current?.then((id) => finishSession(id)).catch(() => { })
        }
    }, [])

    useEffect(() => {
        const log = logRef.current
        if (log) log.scrollTop = log.scrollHeight
    }, [messages, sending])

    const addMessage = (from: Message['from'], text: string) => {
        const id = nextId.current++
        setMessages((prev) => [...prev, { id, from, text }])
    }

    const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault()
        const text = message.trim()
        if (!text || sending) return
        addMessage('user', text)
        setMessage('')
        setSending(true)
        try {
            const sessionId = await ensureSession()
            if (leavingRef.current) return
            const { reply, riskDetected, riskResources } = await postReflection(
                sessionId,
                text,
                selectedMemoryIds,
            )
            addMessage('mongle', reply)
             // 위험 신호: 대화는 이어가면서 도움받을 곳을 함께 안내 (강제 화면 전환 X)
            if (riskDetected && riskResources?.length) {
                addMessage('mongle', '혼자 버티지 않아도 돼. 이야기 나눌 수 있는 곳이 있어.')
                riskResources.forEach((r) => addMessage('mongle', `${r.name} ${r.phone}`))
            }
        } catch (error) {
            // 이미 끝난 세션(409)이면 다음 메시지 때 새 세션으로 시작
            if (error instanceof ApiError && error.status === 409) sessionIdRef.current = null
            addMessage('mongle', getChatErrorMessage(error))
        } finally {
            setSending(false)
        }
    }

    /** 그만 털어놓기 — OFF거나 한 말이 없으면 바로 종료, ON이면 서버가 만든 요약 확인 */
    const handleStop = async () => {
        if (sending) return
        const hasTalked = messages.some((item) => item.from === 'user')
        const sessionId = sessionIdRef.current
        if (!remember || !hasTalked || !sessionId) {
            onFinish?.(0)
            return
        }
        try {
            setPreview(await createMemoryPreview(sessionId))
        } catch (error) {
            addMessage('mongle', getChatErrorMessage(error))
        }
    }

    const handleSaveMemory = async (summary: string) => {
        if (!preview) return
        try {
            await approveMemory(preview.previewId, summary)
            showToast('success', '저장되었어요.', 'middle')
            onFinish?.(1)
        } catch (error) {
            if (error instanceof ApiError && error.status === 404) {
                // 미리보기는 30분이 지나면 서버가 지워요 (가이드 3절)
                setPreview(null)
                showToast('error', '저장할 수 있는 시간이 지났어요.', 'middle')
                return
            }
            showToast('error', getToastMessage(error), 'middle')
        }
    }

    /** 기억 꺼내기 — 사용자가 직접 눌렀을 때만 기억 목록을 불러옴 (자동 불러오기 금지) */
    const handleOpenPick = async () => {
        try {
            setPickList(await getMemories())
        } catch (error) {
            addMessage('mongle', getChatErrorMessage(error))
        }
    }

    const handleStartWith = (ids: string[]) => {
        setSelectedMemoryIds(ids)
        setPickList(null)
    }

    const handleStartWithout = () => {
        setSelectedMemoryIds([])
        setPickList(null)
    }

    const [introLine1, introLine2] = INTRO_TEXT[remember ? 'on' : 'off']

    return (
        <main
            className="chat"
            style={{ backgroundImage: `url(${backgroundNoon})` }}
        >
            {/* 배경 · 해 · 몽글이만 어둡게 덮는 막 (Figma: rgba(0,0,0,0.25)) — 넓은 화면에서도 배경 전체를 덮도록 프레임 바깥에 둠 */}
            <div className="chat__dim" aria-hidden="true" />
            <div className="chat__frame">
                <header className="chat__top">
                    <button
                        type="button"
                        className="chat__back"
                        aria-label="뒤로 가기"
                        onClick={onBack}
                    >
                        <img src={arrowBack} width={35} height={35} alt="" />
                    </button>
                    <HeaderActions onSoundClick={onSoundClick} onMenuClick={onMenuClick} />
                </header>
                <div className="chat__memory">
                    <span className="chat__memory-label" aria-hidden="true">
                        내용 기억하기
                    </span>
                    <button
                        type="button"
                        role="switch"
                        aria-checked={remember}
                        aria-label="내용 기억하기"
                        className={`chat__toggle${remember ? ' chat__toggle--on' : ''}`}
                        onClick={() => setRemember((prev) => !prev)}
                    >
                        <span className="chat__toggle-knob" />
                        <span className="chat__toggle-text">{remember ? 'ON' : 'OFF'}</span>
                    </button>
                </div>
                <div className="chat__sun" aria-hidden="true">
                    <img
                        className="chat__sun-glow"
                        src={sunGlow}
                        width={153}
                        height={153}
                        alt=""
                    />
                    <img
                        className="chat__sun-image"
                        src={sunImage}
                        width={188}
                        height={188}
                        alt=""
                    />
                </div>

                <div className="chat__stage">
                    <div className="chat__mongle-wrap" aria-hidden="true">
                        <img
                            className="chat__mongle-shadow"
                            src={mongleShadow}
                            width={190}
                            height={55}
                            alt=""
                        />
                        {/* 💡 3. 몸통과 눈을 렌더링하던 img 태그를 지우고 MongleCharacter 컴포넌트로 대체 */}
                        <div className="chat__mongle">
                            <MongleCharacter
                                bodyImage={mongleImage}
                                customMongle={customMongle}
                                wrapperClassName="chat__character-size"
                            />
                        </div>
                    </div>
                </div>

                <ol className="chat__log" ref={logRef} aria-live="polite">
                    <li className="chat__bubble chat__bubble--mongle">
                        {introLine1}
                        <br />
                        {introLine2}
                    </li>
                    {messages.map((item) => (
                        <li
                            key={item.id}
                            className={`chat__bubble chat__bubble--${item.from}`}
                        >
                            {item.text}
                        </li>
                    ))}
                    {sending && (
                        <li className="chat__bubble chat__bubble--mongle" aria-label="몽글이가 생각하는 중">
                            …
                        </li>
                    )}
                </ol>

                <div className="chat__quick">
                    <button type="button" className="chat__quick-button" onClick={handleStop} disabled={sending}>
                        그만 털어놓기
                    </button>
                    <button type="button" className="chat__quick-button" onClick={handleOpenPick}>
                        기억 꺼내기
                    </button>
                </div>
                <form className="chat__composer" onSubmit={handleSubmit}>
                    <input
                        className="chat__input"
                        type="text"
                        value={message}
                        maxLength={500}
                        placeholder="편하게 털어내봐요"
                        aria-label="몽글이에게 털어놓기"
                        enterKeyHint="send"
                        onChange={(event) => setMessage(event.target.value)}
                    />
                    <button type="submit" className="chat__send" aria-label="보내기" disabled={sending}>
                        <img
                            className="chat__send-icon"
                            src={sendButton}
                            width={78}
                            height={78}
                            alt=""
                        />
                    </button>
                </form>
            </div>
            {
                preview && (
                    <RememberSheet
                        initialSummary={preview.draftSummary}
                        onSkip={() => onFinish?.(0)}
                        onSave={handleSaveMemory}
                        onClose={() => setPreview(null)}
                    />
                )
            }

            {
                pickList && (
                    <MemoryPickSheet
                        memories={pickList}
                        initialSelectedIds={selectedMemoryIds}
                        onStartWith={handleStartWith}
                        onStartWithout={handleStartWithout}
                        onClose={() => setPickList(null)}
                    />
                )
            }
        </main >
    )
}

export default Chat