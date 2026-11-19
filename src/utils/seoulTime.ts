const SEOUL_LATITUDE = 37.5665
const SEOUL_LONGITUDE = 126.978
const SEOUL_UTC_OFFSET_MINUTES = 9 * 60

function normalizeDegrees(value: number) {
    return ((value % 360) + 360) % 360
}

function normalizeMinutes(value: number) {
    return ((value % 1440) + 1440) % 1440
}

function getSolarTimeUtcMinutes(
    dayOfYear: number,
    isSunrise: boolean,
) {
    const longitudeHour = SEOUL_LONGITUDE / 15
    const approximateTime =
        dayOfYear + ((isSunrise ? 6 : 18) - longitudeHour) / 24

    const meanAnomaly = 0.9856 * approximateTime - 3.289
    const trueLongitude = normalizeDegrees(
        meanAnomaly +
        1.916 * Math.sin((meanAnomaly * Math.PI) / 180) +
        0.02 * Math.sin((2 * meanAnomaly * Math.PI) / 180) +
        282.634,
    )

    let rightAscension =
        (Math.atan(0.91764 * Math.tan((trueLongitude * Math.PI) / 180)) *
            180) /
        Math.PI

    rightAscension = normalizeDegrees(rightAscension)
    rightAscension +=
        Math.floor(trueLongitude / 90) * 90 -
        Math.floor(rightAscension / 90) * 90
    rightAscension /= 15

    const sinDeclination =
        0.39782 * Math.sin((trueLongitude * Math.PI) / 180)
    const cosDeclination = Math.cos(Math.asin(sinDeclination))

    const cosHourAngle =
        (Math.cos((90.833 * Math.PI) / 180) -
            sinDeclination *
            Math.sin((SEOUL_LATITUDE * Math.PI) / 180)) /
        (cosDeclination * Math.cos((SEOUL_LATITUDE * Math.PI) / 180))

    const hourAngle = isSunrise
        ? 360 - (Math.acos(cosHourAngle) * 180) / Math.PI
        : (Math.acos(cosHourAngle) * 180) / Math.PI

    const localMeanTime =
        hourAngle / 15 + rightAscension - 0.06571 * approximateTime - 6.622

    const utcHour = localMeanTime - longitudeHour
    return normalizeMinutes(utcHour * 60)
}

export function getSeoulSunTimes(date = new Date()) {
    const parts = new Intl.DateTimeFormat('en-US', {
        timeZone: 'Asia/Seoul',
        year: 'numeric',
        month: 'numeric',
        day: 'numeric',
    }).formatToParts(date)

    const year = Number(parts.find((part) => part.type === 'year')?.value)
    const month = Number(parts.find((part) => part.type === 'month')?.value)
    const day = Number(parts.find((part) => part.type === 'day')?.value)

    const dayOfYear =
        Math.floor(
            (Date.UTC(year, month - 1, day) -
                Date.UTC(year, 0, 0)) /
            86400000,
        )

    return {
        sunrise: normalizeMinutes(
            getSolarTimeUtcMinutes(dayOfYear, true) +
            SEOUL_UTC_OFFSET_MINUTES,
        ),
        sunset: normalizeMinutes(
            getSolarTimeUtcMinutes(dayOfYear, false) +
            SEOUL_UTC_OFFSET_MINUTES,
        ),
    }
}
export type HomeTimePhase = 'night' | 'sunrise' | 'day' | 'sunset'

export function getHomeTimeState(date = new Date()) {
    const parts = new Intl.DateTimeFormat('en-US', {
        timeZone: 'Asia/Seoul',
        hour: 'numeric',
        minute: 'numeric',
        hourCycle: 'h23',
    }).formatToParts(date)

    const hour = Number(parts.find((part) => part.type === 'hour')?.value)
    const minute = Number(parts.find((part) => part.type === 'minute')?.value)
    const currentMinutes = hour * 60 + minute

    const { sunrise, sunset } = getSeoulSunTimes(date)
    const dawnEnd = sunrise + 60
    const duskStart = sunset - 60

    let phase: HomeTimePhase

    if (currentMinutes < sunrise || currentMinutes >= sunset) {
        phase = 'night'
    } else if (currentMinutes < dawnEnd) {
        phase = 'sunrise'
    } else if (currentMinutes >= duskStart) {
        phase = 'sunset'
    } else {
        phase = 'day'
    }

    const sunProgress = Math.max(
        0,
        Math.min(1, (currentMinutes - sunrise) / (sunset - sunrise)),
    )

    return { phase, sunProgress, sunrise, sunset, currentMinutes }
}