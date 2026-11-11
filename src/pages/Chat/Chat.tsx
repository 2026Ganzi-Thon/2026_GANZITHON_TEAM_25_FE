import { useEffect, useRef, useState, type FormEvent } from 'react'
import backgroundNoon from '../../assets/images/background_noon_wide.png'
import sunImage from '../../assets/images/home/sun.png'
import mongleImage from '../../assets/images/alpaca/mongle_default_v3.png'
import mongleEyesSmile from '../../assets/images/alpaca/eyes_smile_matched.png'
import sunGlow from '../../assets/icons/sun-glow.svg'
import mongleShadow from '../../assets/icons/mongle-shadow.svg'
import sendButton from '../../assets/icons/send-button.svg'
import arrowBack from '../../assets/icons/arrow-back.svg'
import HeaderActions from '../../components/HeaderActions/HeaderActions'
import '../../styles/Chat.css'
import { postReflection } from '../../api/reflection'
import {
    approveMemory,
    createMemoryPreview,
    getMemories,
    type Memory,
    type MemoryPreview,
} from '../../api/memories'
import RememberSheet from './components/RememberSheet'
import MemoryPickSheet from './components/MemoryPickSheet'

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

type ChatProps = {
    /** 뒤로 가기 */
    onBack?: () => void
    /** 대화 종료 (그만 털어놓기) */
    onFinish?: () => void
}

/**
 * 대화 (Figma: 대화 - 이번만 기억하기 171:3177)
 * - 2단계: 배경 · 어두운 막 · 해 · 몽글이 · 상단 바 · 입력창
 * - 다음 단계에서 토글(내용 기억하기), 말풍선, 하단 버튼을 추가
 */
function Chat({ onBack, onFinish }: ChatProps) {
    const [message, setMessage] = useState('')
    const [messages, setMessages] = useState<Message[]>([])
    const [remember, setRemember] = useState(false)
    const nextId = useRef(0)
    const logRef = useRef<HTMLOListElement>(null)
    
    // 기억 요약 후보 — 값이 있으면 "이 내용만 기억하기" 시트가 열림
    const [preview, setPreview] = useState<MemoryPreview | null>(null)
    // 꺼낼 기억 목록 — 값이 있으면 "꺼낼 기억 고르기" 시트가 열림
    const [pickList, setPickList] = useState<Memory[] | null>(null)
    // 이번 대화에 꺼낸 기억 id
    const [selectedMemoryIds, setSelectedMemoryIds] = useState<string[]>([])
    // 새 말풍선이 생기면 맨 아래로 스크롤
    useEffect(() => {
        const log = logRef.current
        if (log) log.scrollTop = log.scrollHeight
    }, [messages])

    const addMessage = (from: Message['from'], text: string) => {
        const id = nextId.current++
        setMessages((prev) => [...prev, { id, from, text }])
    }

    const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault()
        const text = message.trim()
        if (!text) return
        addMessage('user', text)
        setMessage('')

        const { reply } = await postReflection(text, selectedMemoryIds)
        addMessage('mongle', reply)
    }

    /** 그만 털어놓기 — OFF거나 한 말이 없으면 바로 종료, ON이면 기억할 요약 확인 */
    const handleStop = async () => {
        const userTexts = messages
            .filter((item) => item.from === 'user')
            .map((item) => item.text)

        if (!remember || userTexts.length === 0) {
            onFinish?.()
            return
        }
        setPreview(await createMemoryPreview(userTexts))
    }

    const handleSaveMemory = async (summary: string) => {
        if (!preview) return
        await approveMemory(preview.previewId, summary)
        onFinish?.()
    }

        /** 기억 꺼내기 — 사용자가 직접 눌렀을 때만 기억 목록을 불러옴 (자동 불러오기 금지) */
    const handleOpenPick = async () => {
        setPickList(await getMemories())
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
                    <HeaderActions />
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
                        <div className="chat__mongle">
                            <img
                                className="chat__mongle-body"
                                src={mongleImage}
                                width={242}
                                height={242}
                                alt=""
                            />
                            <img
                                className="chat__mongle-eyes"
                                src={mongleEyesSmile}
                                width={81}
                                height={27}
                                alt=""
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
                </ol>

                <div className="chat__quick">
                    <button type="button" className="chat__quick-button" onClick={handleStop}>
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
                        placeholder="편하게 털어내봐요"
                        aria-label="몽글이에게 털어놓기"
                        enterKeyHint="send"
                        onChange={(event) => setMessage(event.target.value)}
                    />
                    <button type="submit" className="chat__send" aria-label="보내기">
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
            {preview && (
                <RememberSheet
                    initialSummary={preview.draftSummary}
                    onSkip={() => onFinish?.()}
                    onSave={handleSaveMemory}
                    onClose={() => setPreview(null)}
                />
            )}
            
            {pickList && (
                <MemoryPickSheet
                    memories={pickList}
                    initialSelectedIds={selectedMemoryIds}
                    onStartWith={handleStartWith}
                    onStartWithout={handleStartWithout}
                    onClose={() => setPickList(null)}
                />
            )}
        </main>
    )
}

export default Chat