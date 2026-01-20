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

export async function createGroup(prevState: unknown, formData: FormData) {
    const userId = await getCurrentUserId()

    const name = formData.get('name') as string
    const description = formData.get('description') as string | null
    const isPrivate = formData.get('isPrivate') === 'true'

    if (!name || name.trim().length === 0) {
        return {
            error: 'Group name is required',
            timestamp: Date.now()
        }
    }

    try {
        const user = await prisma.user.findUnique({
            where: { id: userId },
            include: { profile: true }
        })

        if (!user?.profile) {
            return {
                error: 'Profile not found',
                timestamp: Date.now()
            }
        }

        const group = await prisma.group.create({
            data: {
                name: name.trim(),
                description: description?.trim() || null,
                isPrivate,
                creatorId: user.profile.id,
                members: {
                    create: {
                        profileId: user.profile.id,
                        role: 'ADMIN'
                    }
                }
            }
        })

        revalidatePath('/groups')
        return {
            success: true,
            groupId: group.id,
            timestamp: Date.now()
        }
    } catch (error) {
        console.error('Error creating group:', error)
        return {
            error: 'Failed to create group',
            timestamp: Date.now()
        }
    }
}

export async function joinGroup(groupId: string) {
    const userId = await getCurrentUserId()

    try {
        const user = await prisma.user.findUnique({
            where: { id: userId },
            include: { profile: true }
        })

        if (!user?.profile) {
            return { error: 'Profile not found' }
        }

        // Check if already a member
        const existing = await prisma.groupMember.findUnique({
            where: {
                groupId_profileId: {
                    groupId,
                    profileId: user.profile.id
                }
            }
        })

        if (existing) {
            return { error: 'Already a member' }
        }

        await prisma.groupMember.create({
            data: {
                groupId,
                profileId: user.profile.id,
                role: 'MEMBER'
            }
        })

        revalidatePath('/groups')
        revalidatePath(`/groups/${groupId}`)
        return { success: true }
    } catch (error) {
        console.error('Error joining group:', error)
        return { error: 'Failed to join group' }
    }
}

export async function leaveGroup(groupId: string) {
    const userId = await getCurrentUserId()

    try {
        const user = await prisma.user.findUnique({
            where: { id: userId },
            include: { profile: true }
        })

        if (!user?.profile) {
            return { error: 'Profile not found' }
        }

        await prisma.groupMember.delete({
            where: {
                groupId_profileId: {
                    groupId,
                    profileId: user.profile.id
                }
            }
        })

        revalidatePath('/groups')
        revalidatePath(`/groups/${groupId}`)
        return { success: true }
    } catch (error) {
        console.error('Error leaving group:', error)
        return { error: 'Failed to leave group' }
    }
}

export async function postToGroup(groupId: string, content: string) {
    const userId = await getCurrentUserId()

    if (!content || content.trim().length === 0) {
        return { error: 'Post content cannot be empty' }
    }

    try {
        const user = await prisma.user.findUnique({
            where: { id: userId },
            include: { profile: true }
        })

        if (!user?.profile) {
            return { error: 'Profile not found' }
        }

        // Verify membership
        const membership = await prisma.groupMember.findUnique({
            where: {
                groupId_profileId: {
                    groupId,
                    profileId: user.profile.id
                }
            }
        })

        if (!membership) {
            return { error: 'Not a member of this group' }
        }

        await prisma.groupPost.create({
            data: {
                content: content.trim(),
                groupId,
                authorId: user.profile.id
            }
        })

        revalidatePath(`/groups/${groupId}`)
        return { success: true }
    } catch (error) {
        console.error('Error posting to group:', error)
        return { error: 'Failed to post' }
    }
}

export async function getGroups() {
    const userId = await getCurrentUserId()

    try {
        const user = await prisma.user.findUnique({
            where: { id: userId },
            include: { profile: true }
        })

        if (!user?.profile) {
            return []
        }

        const memberships = await prisma.groupMember.findMany({
            where: {
                profileId: user.profile.id
            },
            include: {
                group: {
                    include: {
                        _count: {
                            select: {
                                members: true,
                                posts: true
                            }
                        }
                    }
                }
            }
        })

        return memberships.map(m => m.group)
    } catch (error) {
        console.error('Error fetching groups:', error)
        return []
    }
}
