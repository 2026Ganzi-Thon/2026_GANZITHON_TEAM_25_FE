import noon from '../assets/images/background_noon_wide.png'
import sunset from '../assets/images/background_sunset_wide.png'
import night from '../assets/images/background_night_wide.png'
import type { HomeTimePhase } from './seoulTime'

export function getBackgroundByPhase(phase: HomeTimePhase) {
    if (phase === 'day') return noon
    if (phase === 'night') return night
    return sunset
}