'use server'

import { prisma } from '@/lib/prisma'
import { cookies } from 'next/headers'
import { revalidatePath } from 'next/cache'
import { writeFile, mkdir } from 'fs/promises'
import { join } from 'path'

export async function createReel(prevState: unknown, formData: FormData) {
    const cookieStore = await cookies()
    const userId = cookieStore.get('userId')?.value

    if (!userId) {
        return { error: 'Authentication required' }
    }

    const user = await prisma.user.findUnique({
        where: { id: userId },
        include: { profile: true }
    })

    if (!user || !user.profile) {
        return { error: 'Profile not found' }
    }

    // Get form data
    const caption = formData.get('caption') as string
    const achievementId = formData.get('achievementId') as string
    const file = formData.get('file') as File | null

    // Validate file
    if (!file || file.size === 0 || file.name === 'undefined') {
        return { error: 'Please select a video or image file' }
    }

    // Validate file type
    const validTypes = ['video/mp4', 'video/webm', 'video/quicktime', 'image/jpeg', 'image/png', 'image/gif']
    if (!validTypes.includes(file.type)) {
        return { error: 'Invalid file type. Please upload a video (MP4, WebM, MOV) or image (JPG, PNG, GIF)' }
    }

    // Validate file size (50MB max)
    const maxSize = 50 * 1024 * 1024 // 50MB
    if (file.size > maxSize) {
        return { error: 'File too large. Maximum size is 50MB' }
    }

    let videoUrl: string

    try {
        const buffer = Buffer.from(await file.arrayBuffer())
        const uploadDir = join(process.cwd(), 'public', 'uploads', 'reels')

        // Ensure directory exists
        await mkdir(uploadDir, { recursive: true })

        const uniqueName = `${Date.now()}-${file.name.replace(/[^a-zA-Z0-9.-]/g, '_')}`
        const filePath = join(uploadDir, uniqueName)

        await writeFile(filePath, buffer)
        videoUrl = `/uploads/reels/${uniqueName}`
    } catch (error) {
        console.error('Upload error:', error)
        return { error: 'Failed to upload media' }
    }

    try {
        const reel = await prisma.reel.create({
            data: {
                caption: caption || null,
                videoUrl,
                profileId: user.profile.id,
                achievements: achievementId ? {
                    connect: { id: achievementId }
                } : undefined
            }
        })

        revalidatePath('/reels')
        revalidatePath('/dashboard')
        revalidatePath('/profile')
        return { success: 'Reel posted successfully', reel }
    } catch (error) {
        console.error('Failed to create reel:', error)
        return { error: 'Failed to post reel' }
    }
}

export async function getReels() {
    try {
        const reels = await prisma.reel.findMany({
            include: {
                profile: true,
                likes: true,
                _count: {
                    select: {
                        likes: true,
                        comments: true
                    }
                },
                achievements: true
            },
            orderBy: { createdAt: 'desc' }
        })
        return reels
    } catch (error) {
        console.error('Failed to fetch reels:', error)
        return []
    }
}

export async function toggleLike(reelId: string) {
    const cookieStore = await cookies()
    const userId = cookieStore.get('userId')?.value

    if (!userId) return { error: 'Auth required' }

    const user = await prisma.user.findUnique({
        where: { id: userId },
        include: { profile: true }
    })

    if (!user || !user.profile) return { error: 'Profile required' }

    const profileId = user.profile.id

    try {
        const existingLike = await prisma.reelLike.findUnique({
            where: {
                reelId_profileId: {
                    reelId,
                    profileId
                }
            }
        })

        if (existingLike) {
            await prisma.reelLike.delete({
                where: { id: existingLike.id }
            })
            return { liked: false }
        } else {
            await prisma.reelLike.create({
                data: {
                    reelId,
                    profileId
                }
            })
            return { liked: true }
        }
    } catch {
        return { error: 'Action failed' }
    }
}

export async function postComment(reelId: string, content: string) {
    const cookieStore = await cookies()
    const userId = cookieStore.get('userId')?.value

    if (!userId || !content.trim()) return { error: 'Invalid request' }

    const user = await prisma.user.findUnique({
        where: { id: userId },
        include: { profile: true }
    })

    if (!user || !user.profile) return { error: 'Profile required' }

    try {
        const comment = await prisma.reelComment.create({
            data: {
                content,
                reelId,
                profileId: user.profile.id
            },
            include: {
                profile: true
            }
        })
        return { success: true, comment }
    } catch {
        return { error: 'Failed to post comment' }
    }
}
