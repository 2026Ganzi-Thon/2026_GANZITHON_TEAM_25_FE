import { useEffect, useState } from 'react'
import { getHomeTimeState } from '../utils/seoulTime'

export function useHomeTime() {
    const [now, setNow] = useState(() => new Date())

    useEffect(() => {
        const timer = window.setInterval(() => {
            setNow(new Date())
        }, 60_000)

        return () => window.clearInterval(timer)
    }, [])

    return getHomeTimeState(now)
}