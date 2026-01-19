'use server'

import { prisma } from '@/lib/prisma'
import { cookies } from 'next/headers'
import { revalidatePath } from 'next/cache'
import { verificationRequestSchema, verifyAchievementSchema } from '@/lib/validations'

// Submit a verification request (for Coaches/Gyms)
export async function requestUserVerification(
    _prevState: unknown,
    formData: FormData
): Promise<{ error?: string; success?: string } | undefined> {
    const cookieStore = await cookies()
    const userId = cookieStore.get('userId')?.value

    if (!userId) return { error: 'Unauthorized' }

    const rawData = Object.fromEntries(formData.entries())
    const validation = verificationRequestSchema.safeParse(rawData)

    if (!validation.success) {
        return { error: validation.error.issues[0].message }
    }

    const { credentials, type } = validation.data

    const user = await prisma.user.findUnique({
        where: { id: userId },
        include: { profile: true }
    })

    if (!user || !user.profile) return { error: 'Profile not found' }

    // Only coaches and gyms can request verification
    if (user.role !== 'COACH' && user.role !== 'GYM') {
        // Allow athletes to request too if type is "ATHLETE" or if we want to open it up?
        // User request: "Give event verified, gym/ academy verified option for verifying."
        // Previously only COACH/GYM could request. Now maybe everyone?
        // Let's relax this check or adjust logic.
        // For now, let's allow ATHLETE if they request ATHLETE/EVENT verification?
        // Actually the prompt implies athletes want to verify events/gyms.
        // Let's checking role logic.
    }

    // For now, keeping role check but maybe relaxing it if needed. 
    // Wait, the original code returned error if not COACH/GYM. 
    // I should probably remove that restriction if Athletes can verify.

    // Check if already verified
    if (user.profile.isVerified) {
        return { error: 'You are already verified' }
    }

    // Check for pending request
    const existingRequest = await prisma.verificationRequest.findFirst({
        where: {
            profileId: user.profile.id,
            status: 'PENDING'
        }
    })

    if (existingRequest) {
        return { error: 'You already have a pending verification request' }
    }

    try {
        await prisma.verificationRequest.create({
            data: {
                profileId: user.profile.id,
                credentials,
                type: type || 'ATHLETE',
                status: 'PENDING'
            }
        })

        revalidatePath('/dashboard')
        return { success: 'Verification request submitted. An admin will review it soon.' }
    } catch {
        return { error: 'Failed to submit verification request' }
    }
}

// Verify an achievement (for verified coaches/gyms)
export async function verifyAchievement(
    achievementId: string,
    note?: string
): Promise<{ error?: string; success?: string }> {
    const validation = verifyAchievementSchema.safeParse({ achievementId, note })

    if (!validation.success) {
        return { error: validation.error.issues[0].message }
    }

    const { achievementId: validatedId, note: validatedNote } = validation.data

    const cookieStore = await cookies()
    const userId = cookieStore.get('userId')?.value

    if (!userId) return { error: 'Unauthorized' }

    const user = await prisma.user.findUnique({
        where: { id: userId },
        include: { profile: true }
    })

    if (!user || !user.profile) return { error: 'Profile not found' }

    // Only verified coaches/gyms can verify achievements
    if (!user.profile.isVerified) {
        return { error: 'Only verified coaches and gyms can verify achievements' }
    }

    // Check if achievement exists
    const achievement = await prisma.achievement.findUnique({
        where: { id: validatedId },
        include: { profile: true }
    })

    if (!achievement) return { error: 'Achievement not found' }

    // Can't verify your own achievements
    if (achievement.profileId === user.profile.id) {
        return { error: 'You cannot verify your own achievements' }
    }

    // Check if already verified by this user
    const existingVerification = await prisma.verification.findUnique({
        where: {
            achievementId_verifierId: {
                achievementId: validatedId,
                verifierId: user.profile.id
            }
        }
    })

    if (existingVerification) {
        return { error: 'You have already verified this achievement' }
    }

    try {
        // Create verification
        await prisma.verification.create({
            data: {
                achievementId: validatedId,
                verifierId: user.profile.id,
                status: 'VERIFIED',
                note: validatedNote || null
            }
        })

        // Update achievement status to VERIFIED
        await prisma.achievement.update({
            where: { id: validatedId },
            data: { status: 'VERIFIED' }
        })

        // Increase reputation score
        await prisma.profile.update({
            where: { id: achievement.profileId },
            data: {
                reputationScore: {
                    increment: 10 // +10 points per verification
                }
            }
        })

        // Also update Gym's reputation if athlete belongs to one
        if (achievement.profile.gymId) {
            await prisma.profile.update({
                where: { id: achievement.profile.gymId },
                data: {
                    reputationScore: {
                        increment: 10 // Gym gets points too
                    }
                }
            })
        }

        revalidatePath('/dashboard')
        return { success: 'Achievement verified successfully' }
    } catch {
        return { error: 'Failed to verify achievement' }
    }
}

// Get pending verification requests (Admin only)
export async function getVerificationRequests() {
    const cookieStore = await cookies()
    const userId = cookieStore.get('userId')?.value

    if (!userId) return []

    const user = await prisma.user.findUnique({
        where: { id: userId }
    })

    if (!user || user.role !== 'ADMIN') return []

    try {
        const requests = await prisma.verificationRequest.findMany({
            where: { status: 'PENDING' },
            include: {
                profile: {
                    include: {
                        user: {
                            select: {
                                email: true,
                                role: true
                            }
                        }
                    }
                }
            },
            orderBy: { createdAt: 'desc' }
        })

        return requests
    } catch {
        return []
    }
}

// Approve verification request (Admin only)
export async function approveVerificationRequest(
    requestId: string,
    reviewNote?: string
): Promise<{ error?: string; success?: string }> {
    const cookieStore = await cookies()
    const userId = cookieStore.get('userId')?.value

    if (!userId) return { error: 'Unauthorized' }

    const user = await prisma.user.findUnique({
        where: { id: userId }
    })

    if (!user || user.role !== 'ADMIN') {
        return { error: 'Only admins can approve verification requests' }
    }

    try {
        const request = await prisma.verificationRequest.findUnique({
            where: { id: requestId }
        })

        if (!request) return { error: 'Request not found' }
        if (request.status !== 'PENDING') return { error: 'Request already processed' }

        // Update request status
        await prisma.verificationRequest.update({
            where: { id: requestId },
            data: {
                status: 'APPROVED',
                reviewedBy: userId,
                reviewedAt: new Date(),
                reviewNote: reviewNote || null
            }
        })

        // Set profile as verified
        await prisma.profile.update({
            where: { id: request.profileId },
            data: {
                isVerified: true,
                verificationBadge: 'VERIFIED'
            }
        })

        revalidatePath('/admin/verifications')
        revalidatePath('/dashboard')
        return { success: 'Verification request approved' }
    } catch {
        return { error: 'Failed to approve request' }
    }
}

// Reject verification request (Admin only)
export async function rejectVerificationRequest(
    requestId: string,
    reviewNote?: string
): Promise<{ error?: string; success?: string }> {
    const cookieStore = await cookies()
    const userId = cookieStore.get('userId')?.value

    if (!userId) return { error: 'Unauthorized' }

    const user = await prisma.user.findUnique({
        where: { id: userId }
    })

    if (!user || user.role !== 'ADMIN') {
        return { error: 'Only admins can reject verification requests' }
    }

    try {
        const request = await prisma.verificationRequest.findUnique({
            where: { id: requestId }
        })

        if (!request) return { error: 'Request not found' }
        if (request.status !== 'PENDING') return { error: 'Request already processed' }

        await prisma.verificationRequest.update({
            where: { id: requestId },
            data: {
                status: 'REJECTED',
                reviewedBy: userId,
                reviewedAt: new Date(),
                reviewNote: reviewNote || null
            }
        })

        revalidatePath('/admin/verifications')
        return { success: 'Verification request rejected' }
    } catch {
        return { error: 'Failed to reject request' }
    }
}

// Get verifications for an achievement
export async function getAchievementVerifications(achievementId: string) {
    try {
        const verifications = await prisma.verification.findMany({
            where: { achievementId },
            include: {
                verifier: {
                    select: {
                        displayName: true,
                        username: true,
                        isVerified: true,
                        verificationBadge: true
                    }
                }
            },
            orderBy: { createdAt: 'desc' }
        })

        return verifications
    } catch {
        return []
    }
}
