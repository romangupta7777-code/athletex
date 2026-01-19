'use server'

import { prisma } from '@/lib/prisma'
import { cookies } from 'next/headers'
import { revalidatePath } from 'next/cache'
import { writeFile, mkdir } from 'fs/promises'
import { join } from 'path'
import { achievementSchema } from '@/lib/validations'

export async function createAchievement(prevState: unknown, formData: FormData): Promise<{ error?: string; success?: string } | undefined> {
    const cookieStore = await cookies()
    const userId = cookieStore.get('userId')?.value

    if (!userId) return { error: 'Unauthorized' }

    const rawData = Object.fromEntries(formData.entries())
    const validation = achievementSchema.safeParse(rawData)

    if (!validation.success) {
        return { error: validation.error.issues[0].message }
    }

    const { title, type, date, description, metricValue, metricUnit } = validation.data

    const file = formData.get('file') as File | null
    let mediaUrl: string | null = null

    if (file && file.size > 0 && file.name !== 'undefined') {
        try {
            const buffer = Buffer.from(await file.arrayBuffer())
            const uploadDir = join(process.cwd(), 'public', 'uploads', 'achievements')

            // Ensure directory exists
            await mkdir(uploadDir, { recursive: true })

            const uniqueName = `${Date.now()}-${file.name.replace(/[^a-zA-Z0-9.-]/g, '_')}`
            const filePath = join(uploadDir, uniqueName)

            await writeFile(filePath, buffer)
            mediaUrl = `/uploads/achievements/${uniqueName}`
        } catch (error) {
            console.error('Upload error:', error)
            return { error: 'Failed to upload media' }
        }
    }

    const user = await prisma.user.findUnique({
        where: { id: userId },
        include: { profile: true }
    })

    if (!user || !user.profile) return { error: 'Profile not found' }

    try {
        await prisma.achievement.create({
            data: {
                type,
                title,
                description,
                date: new Date(date),
                metrics: JSON.stringify({ value: metricValue, unit: metricUnit }),
                status: 'UNVERIFIED',
                mediaUrl: mediaUrl,
                profileId: user.profile.id
            }
        })

        revalidatePath('/dashboard')
        revalidatePath('/profile')
        return { success: 'Achievement logged' }
    } catch (e) {
        console.error(e)
        return { error: 'Failed to log achievement' }
    }
}
