'use server'

import { prisma } from '@/lib/prisma'
import { Prisma } from '@prisma/client'

export async function getLeaderboard(filters: { sport?: string; location?: string, type?: 'ATHLETE' | 'GYM' } = {}) {
    const where: Prisma.ProfileWhereInput = {}

    if (filters.sport) {
        where.sport = filters.sport
    }

    if (filters.location) {
        where.location = filters.location
    }

    // Type filtering
    if (filters.type === 'GYM') {
        where.user = { role: 'GYM' }
    } else {
        // Default to athletes (Everything except GYM and ADMIN?)
        where.user = { role: { in: ['ATHLETE', 'COACH'] } }
    }

    try {
        const leaders = await prisma.profile.findMany({
            where,
            include: {
                user: { select: { role: true } }, // Include role to display
                _count: {
                    select: {
                        achievements: {
                            where: { status: 'VERIFIED' }
                        },
                        members: true // For Gyms
                    }
                }
            },
            orderBy: [
                { reputationScore: 'desc' },
                {
                    achievements: {
                        _count: 'desc'
                    }
                }
            ],
            take: 50
        })

        return leaders
    } catch (error) {
        console.error('Failed to fetch leaderboard:', error)
        return []
    }
}

export async function getLeaderboardFilters() {
    try {
        const sports = await prisma.profile.findMany({
            where: { sport: { not: null } },
            select: { sport: true },
            distinct: ['sport']
        })

        const locations = await prisma.profile.findMany({
            where: { location: { not: null } },
            select: { location: true },
            distinct: ['location']
        })

        const staticSports = ['Football', 'Basketball', 'Tennis', 'MMA', 'Boxing', 'CrossFit', 'Powerlifting', 'Swimming', 'Track & Field']
        const dbSports = sports.map(s => s.sport).filter(Boolean) as string[]
        const allSports = Array.from(new Set([...staticSports, ...dbSports])).sort()

        return {
            sports: allSports,
            locations: locations.map(l => l.location).filter(Boolean) as string[]
        }
    } catch (error) {
        console.error('Failed to fetch filters:', error)
        return { sports: [], locations: [] }
    }
}
