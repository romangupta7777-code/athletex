'use server'

import { prisma } from '@/lib/prisma'
import { cookies } from 'next/headers'
import { revalidatePath } from 'next/cache'

export async function joinGym(gymId: string) {
    const cookieStore = await cookies()
    const userId = cookieStore.get('userId')?.value

    if (!userId) return { error: 'Auth required' }

    try {
        const user = await prisma.user.findUnique({
            where: { id: userId },
            include: { profile: true }
        })

        if (!user || !user.profile) return { error: 'Profile not found' }

        await prisma.profile.update({
            where: { id: user.profile.id },
            data: { gymId }
        })

        revalidatePath('/dashboard')
        revalidatePath(`/gym/${gymId}`)
        return { success: 'Joined gym successfully' }
    } catch {
        return { error: 'Failed to join gym' }
    }
}

export async function leaveGym() {
    const cookieStore = await cookies()
    const userId = cookieStore.get('userId')?.value

    if (!userId) return { error: 'Auth required' }

    try {
        const user = await prisma.user.findUnique({
            where: { id: userId },
            include: { profile: true }
        })

        if (!user || !user.profile) return { error: 'Profile not found' }

        await prisma.profile.update({
            where: { id: user.profile.id },
            data: { gymId: null }
        })

        revalidatePath('/dashboard')
        return { success: 'Left gym successfully' }
    } catch {
        return { error: 'Failed to leave gym' }
    }
}

export async function getGymRoster(gymId: string) {
    try {
        const roster = await prisma.profile.findMany({
            where: { gymId },
            include: {
                user: {
                    select: { role: true }
                }
            },
            orderBy: { reputationScore: 'desc' }
        })
        return roster
    } catch (error) {
        console.error('Failed to fetch roster:', error)
        return []
    }
}

export async function searchGyms(query: string) {
    try {
        const gyms = await prisma.profile.findMany({
            where: {
                user: {
                    role: 'GYM'
                },
                OR: [
                    { displayName: { contains: query } },
                    { username: { contains: query } },
                    { location: { contains: query } }
                ]
            },
            take: 10
        })
        return gyms
    } catch {
        return []
    }
}

export async function getGymByUsername(username: string) {
    try {
        const profile = await prisma.profile.findUnique({
            where: { username },
            include: {
                user: true,
                members: {
                    include: {
                        achievements: true
                    }
                }
            }
        })

        if (!profile || profile.user.role !== 'GYM') return null
        return profile
    } catch {
        return null
    }
}
