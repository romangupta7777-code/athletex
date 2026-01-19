'use server'

import { prisma } from '@/lib/prisma'
import { cookies } from 'next/headers'
import { revalidatePath } from 'next/cache'

import { profileUpdateSchema } from '@/lib/validations'

export async function updateProfile(prevState: unknown, formData: FormData): Promise<{ error?: string; success?: string } | undefined> {
    const cookieStore = await cookies()
    const userId = cookieStore.get('userId')?.value

    if (!userId) return { error: 'Unauthorized' }

    const rawData = Object.fromEntries(formData.entries())
    const validation = profileUpdateSchema.safeParse(rawData)

    if (!validation.success) {
        return { error: validation.error.issues[0].message }
    }

    try {
        await prisma.profile.update({
            where: { userId },
            data: validation.data
        })

        revalidatePath('/dashboard')
        return { success: 'Profile updated' }
    } catch (e) {
        console.error(e)
        return { error: 'Failed to update profile' }
    }
}
