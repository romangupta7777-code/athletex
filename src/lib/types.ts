export interface Profile {
    id: string
    userId: string
    username: string
    displayName: string
    bio?: string | null
    location?: string | null
    avatarUrl?: string | null
    coverUrl?: string | null
    sport?: string | null
    discipline?: string | null
    gender?: string | null
    dateOfBirth?: Date | null
    height?: number | null
    weight?: number | null
    weightClass?: string | null
    reputationScore: number
    followerCount: number
    followingCount: number
    isVerified: boolean
    verificationBadge?: string | null
    gymId?: string | null
    createdAt: Date
    updatedAt: Date
}

export interface Achievement {
    id: string
    type: string
    title: string
    description?: string | null
    date: Date | string
    metrics?: string | null
    status: string
    profileId: string
    createdAt: Date | string
    updatedAt: Date | string
}

export interface Reel {
    id: string
    caption?: string | null
    videoUrl: string
    profileId: string
    createdAt: Date | string
    updatedAt: Date | string
}
