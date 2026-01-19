'use server'

import { prisma } from '@/lib/prisma'
import { hash, compare } from 'bcryptjs'
import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'

import { signupSchema, loginSchema } from '@/lib/validations'

export async function signup(prevState: unknown, formData: FormData) {
    const rawData = {
        email: formData.get('email') as string,
        password: formData.get('password') as string,
        role: formData.get('role') as string,
        displayName: formData.get('name') as string // Input name is 'name' in form
    }

    const validation = signupSchema.safeParse(rawData)
    if (!validation.success) {
        return { error: validation.error.issues[0].message }
    }

    const { email, password, role, displayName } = validation.data

    try {
        const existingUser = await prisma.user.findUnique({ where: { email } })
        if (existingUser) return { error: 'User already exists' }

        const hashedPassword = await hash(password, 10)

        const user = await prisma.user.create({
            data: {
                email,
                password: hashedPassword,
                role: role || 'ATHLETE',
                profile: {
                    create: {
                        username: email.split('@')[0] + Math.floor(Math.random() * 10000),
                        displayName: displayName,
                    }
                }
            }
        })

        const cookieStore = await cookies()
        cookieStore.set('userId', user.id, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            path: '/'
        })

    } catch (e) {
        console.error(e)
        return { error: 'Failed to create user' }
    }

    redirect('/dashboard')
}

export async function login(prevState: unknown, formData: FormData) {
    const rawData = {
        email: formData.get('email') as string,
        password: formData.get('password') as string
    }

    const validation = loginSchema.safeParse(rawData)
    if (!validation.success) {
        return { error: validation.error.issues[0].message }
    }

    const { email, password } = validation.data

    try {
        const user = await prisma.user.findUnique({ where: { email } })
        if (!user) return { error: 'Invalid credentials' }

        const valid = await compare(password, user.password)
        if (!valid) return { error: 'Invalid credentials' }

        const cookieStore = await cookies()
        cookieStore.set('userId', user.id, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            path: '/'
        })

    } catch (e) {
        console.log(e)
        return { error: 'Login failed' }
    }

    redirect('/dashboard')
}

export async function logout() {
    const cookieStore = await cookies()
    cookieStore.delete('userId')
    redirect('/')
}
