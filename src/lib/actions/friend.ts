'use server'

import { prisma } from '@/lib/prisma'
import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'
import { revalidatePath } from 'next/cache'

async function getCurrentUserId() {
    const cookieStore = await cookies()
    const userId = cookieStore.get('userId')?.value
    if (!userId) {
        redirect('/auth/login')
    }
    return userId
}

export async function sendFriendRequest(addresseeId: string) {
    const userId = await getCurrentUserId()

    try {
        const user = await prisma.user.findUnique({
            where: { id: userId },
            include: { profile: true }
        })

        if (!user?.profile) {
            return { error: 'Profile not found' }
        }

        // Check if friendship already exists
        const existing = await prisma.friendship.findFirst({
            where: {
                OR: [
                    { requesterId: user.profile.id, addresseeId },
                    { requesterId: addresseeId, addresseeId: user.profile.id }
                ]
            }
        })

        if (existing) {
            return { error: 'Friend request already exists' }
        }

        await prisma.friendship.create({
            data: {
                requesterId: user.profile.id,
                addresseeId,
                status: 'PENDING'
            }
        })

        revalidatePath('/friends')
        return { success: true }
    } catch (error) {
        console.error('Error sending friend request:', error)
        return { error: 'Failed to send friend request' }
    }
}

export async function acceptFriendRequest(friendshipId: string) {
    const userId = await getCurrentUserId()

    try {
        const user = await prisma.user.findUnique({
            where: { id: userId },
            include: { profile: true }
        })

        if (!user?.profile) {
            return { error: 'Profile not found' }
        }

        await prisma.friendship.update({
            where: {
                id: friendshipId,
                addresseeId: user.profile.id
            },
            data: {
                status: 'ACCEPTED'
            }
        })

        revalidatePath('/friends')
        return { success: true }
    } catch (error) {
        console.error('Error accepting friend request:', error)
        return { error: 'Failed to accept friend request' }
    }
}

export async function rejectFriendRequest(friendshipId: string) {
    const userId = await getCurrentUserId()

    try {
        const user = await prisma.user.findUnique({
            where: { id: userId },
            include: { profile: true }
        })

        if (!user?.profile) {
            return { error: 'Profile not found' }
        }

        await prisma.friendship.delete({
            where: {
                id: friendshipId,
                addresseeId: user.profile.id
            }
        })

        revalidatePath('/friends')
        return { success: true }
    } catch (error) {
        console.error('Error rejecting friend request:', error)
        return { error: 'Failed to reject friend request' }
    }
}

export async function getFriends() {
    const userId = await getCurrentUserId()

    try {
        const user = await prisma.user.findUnique({
            where: { id: userId },
            include: { profile: true }
        })

        if (!user?.profile) {
            return []
        }

        const friendships = await prisma.friendship.findMany({
            where: {
                OR: [
                    { requesterId: user.profile.id, status: 'ACCEPTED' },
                    { addresseeId: user.profile.id, status: 'ACCEPTED' }
                ]
            },
            include: {
                requester: {
                    select: {
                        id: true,
                        username: true,
                        displayName: true,
                        avatarUrl: true,
                        isVerified: true
                    }
                },
                addressee: {
                    select: {
                        id: true,
                        username: true,
                        displayName: true,
                        avatarUrl: true,
                        isVerified: true
                    }
                }
            }
        })

        return friendships.map(f =>
            f.requesterId === user.profile!.id ? f.addressee : f.requester
        )
    } catch (error) {
        console.error('Error fetching friends:', error)
        return []
    }
}

export async function getFriendRequests() {
    const userId = await getCurrentUserId()

    try {
        const user = await prisma.user.findUnique({
            where: { id: userId },
            include: { profile: true }
        })

        if (!user?.profile) {
            return []
        }

        const requests = await prisma.friendship.findMany({
            where: {
                addresseeId: user.profile.id,
                status: 'PENDING'
            },
            include: {
                requester: {
                    select: {
                        id: true,
                        username: true,
                        displayName: true,
                        avatarUrl: true,
                        isVerified: true
                    }
                }
            }
        })

        return requests
    } catch (error) {
        console.error('Error fetching friend requests:', error)
        return []
    }
}
