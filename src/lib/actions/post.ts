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

export async function createPost(prevState: unknown, formData: FormData) {
    const userId = await getCurrentUserId()

    const content = formData.get('content') as string
    const mediaUrl = formData.get('mediaUrl') as string | null

    if (!content || content.trim().length === 0) {
        return {
            error: 'Post content cannot be empty',
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

        await prisma.post.create({
            data: {
                content: content.trim(),
                mediaUrl: mediaUrl || undefined,
                profileId: user.profile.id
            }
        })

        revalidatePath('/feed')
        return {
            success: true,
            timestamp: Date.now()
        }
    } catch (error) {
        console.error('Error creating post:', error)
        return {
            error: 'Failed to create post',
            timestamp: Date.now()
        }
    }
}

export async function getPosts() {
    try {
        const posts = await prisma.post.findMany({
            include: {
                profile: {
                    select: {
                        id: true,
                        username: true,
                        displayName: true,
                        avatarUrl: true,
                        isVerified: true
                    }
                },
                _count: {
                    select: {
                        likes: true,
                        comments: true
                    }
                }
            },
            orderBy: {
                createdAt: 'desc'
            },
            take: 50
        })

        return posts
    } catch (error) {
        console.error('Error fetching posts:', error)
        return []
    }
}

export async function likePost(postId: string) {
    const userId = await getCurrentUserId()

    try {
        const user = await prisma.user.findUnique({
            where: { id: userId },
            include: { profile: true }
        })

        if (!user?.profile) {
            return { error: 'Profile not found' }
        }

        // Check if already liked
        const existingLike = await prisma.postLike.findUnique({
            where: {
                postId_profileId: {
                    postId,
                    profileId: user.profile.id
                }
            }
        })

        if (existingLike) {
            // Unlike
            await prisma.postLike.delete({
                where: { id: existingLike.id }
            })
        } else {
            // Like
            await prisma.postLike.create({
                data: {
                    postId,
                    profileId: user.profile.id
                }
            })
        }

        revalidatePath('/feed')
        return { success: true }
    } catch (error) {
        console.error('Error liking post:', error)
        return { error: 'Failed to like post' }
    }
}

export async function commentOnPost(postId: string, content: string) {
    const userId = await getCurrentUserId()

    if (!content || content.trim().length === 0) {
        return { error: 'Comment cannot be empty' }
    }

    try {
        const user = await prisma.user.findUnique({
            where: { id: userId },
            include: { profile: true }
        })

        if (!user?.profile) {
            return { error: 'Profile not found' }
        }

        await prisma.postComment.create({
            data: {
                content: content.trim(),
                postId,
                profileId: user.profile.id
            }
        })

        revalidatePath('/feed')
        return { success: true }
    } catch (error) {
        console.error('Error commenting on post:', error)
        return { error: 'Failed to comment' }
    }
}
