import { getUserId, request } from './client'

export type MongleProfile = {
    similarityTrait: string | null
    comfortStyle: string | null
    accessory: string | null
    onboardingCompleted: boolean
}

export type MongleProfileUpdate = {
    similarityTrait?: string
    comfortStyle?: string
    accessory?: string
}

function getProfilePath(): string {
    const userId = getUserId()
    if (!userId) throw new Error('로그인 정보가 없어요. 다시 로그인해 주세요.')

    return `/mongle-profile?userId=${encodeURIComponent(userId)}`
}

export function getMongleProfile(): Promise<MongleProfile> {
    return request<MongleProfile>(getProfilePath())
}

export function updateMongleProfile(
    body: MongleProfileUpdate,
): Promise<MongleProfile> {
    return request<MongleProfile>(getProfilePath(), {
        method: 'PATCH',
        body,
    })
}