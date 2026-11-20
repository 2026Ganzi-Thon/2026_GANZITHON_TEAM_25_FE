import { useEffect, useMemo, useRef } from 'react'
import { NATURE_SOUND_FILES, type NatureSound } from '../pages/Home/natureSounds'

/**
 * playing: 재생 중 / stopped: 끄기이거나 더 최근 선택에 밀려 멈춤
 * blocked: 브라우저가 사용자 터치 전 자동 재생을 막음 / error: 파일을 못 불러오는 등 재생 실패
 */
export type PlayResult = 'playing' | 'stopped' | 'blocked' | 'error'

/**
 * 자연음 재생기 (앱 전체에서 하나)
 * - 한 번에 하나만 재생하고 종류를 바꾸면 이전 소리는 멈춰요. 끝나면 처음부터 반복해요.
 * - 브라우저는 사용자가 누르기 전의 재생을 막아서, play는 버튼 클릭 같은 이벤트 안에서 바로 불러야 해요.
 * - 음량은 서버 값(0~100)을 그대로 넘기면 돼요. (audio.volume은 0~1이라 내부에서 100으로 나눠요)
 */
export function useNatureSoundPlayer() {
  const audioRef = useRef<HTMLAudioElement | null>(null)
  const volumeRef = useRef(0.5)
  const cancelPendingRef = useRef<(() => void) | null>(null)

  const player = useMemo(() => {
    const getAudio = () => {
      if (!audioRef.current) {
        const audio = new Audio()
        audio.loop = true
        audio.preload = 'none'
        audioRef.current = audio
      }
      return audioRef.current
    }

    const cancelPending = () => {
      cancelPendingRef.current?.()
      cancelPendingRef.current = null
    }

    const stop = () => {
      const audio = audioRef.current
      if (!audio) return
      audio.pause()
      audio.removeAttribute('src')
      audio.load()
    }

    const setVolume = (percent: number) => {
      volumeRef.current = Math.min(1, Math.max(0, percent / 100))
      if (audioRef.current) audioRef.current.volume = volumeRef.current
    }

    const play = async (sound: NatureSound): Promise<PlayResult> => {
      if (sound === 'off') {
        stop()
        return 'stopped'
      }
      const audio = getAudio()
      const src = new URL(NATURE_SOUND_FILES[sound], window.location.href).href
      // 같은 소리를 다시 누르면 처음부터 다시 받지 않고 이어서 재생해요
      if (audio.src !== src) audio.src = src
      audio.loop = true
      audio.volume = volumeRef.current
      try {
        await audio.play()
        return 'playing'
      } catch (error) {
        if (error instanceof DOMException) {
          if (error.name === 'NotAllowedError') return 'blocked'
          // 바로 다른 소리를 골라 이 재생이 취소된 경우
          if (error.name === 'AbortError') return 'stopped'
        }
        return 'error'
      }
    }

    /** 자동 재생이 막혔을 때: 사용자가 처음 화면을 누르거나 키를 누르는 순간 재생해요 */
    const playOnFirstGesture = (sound: NatureSound) => {
      cancelPending()
      const cleanup = () => {
        window.removeEventListener('pointerup', handler, true)
        window.removeEventListener('keydown', handler, true)
      }
      const handler = () => {
        cleanup()
        cancelPendingRef.current = null
        void play(sound)
      }
      window.addEventListener('pointerup', handler, true)
      window.addEventListener('keydown', handler, true)
      cancelPendingRef.current = cleanup
    }

    return { play, stop, setVolume, playOnFirstGesture, cancelPending }
  }, [])

  // 앱이 닫힐 때(언마운트) 소리와 대기 중인 자동 재생을 정리해요
  useEffect(() => {
    return () => {
      player.cancelPending()
      player.stop()
    }
  }, [player])

  return player
}
