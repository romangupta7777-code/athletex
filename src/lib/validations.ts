import { z } from 'zod'

export const loginSchema = z.object({
    email: z.string().email('Invalid email address'),
    password: z.string().min(6, 'Password must be at least 6 characters')
})

export const signupSchema = z.object({
    displayName: z.string().min(2, 'Name must be at least 2 characters'),
    email: z.string().email('Invalid email address'),
    password: z.string().min(6, 'Password must be at least 6 characters'),
    role: z.enum(['ATHLETE', 'COACH', 'GYM', 'SPONSOR', 'ADMIN']).default('ATHLETE')
})

export const profileUpdateSchema = z.object({
    displayName: z.string().min(2).optional(),
    bio: z.string().max(500).optional(),
    sport: z.string().optional(),
    discipline: z.string().optional(),
    location: z.string().optional(),
    weight: z.preprocess((val) => Number(val), z.number().optional()),
    height: z.preprocess((val) => Number(val), z.number().optional()),
})

export const achievementSchema = z.object({
    title: z.string().min(3, 'Title is too short'),
    type: z.string().min(1, 'Type is required'),
    date: z.string().min(1, 'Date is required'),
    metricValue: z.string().optional(),
    metricUnit: z.string().optional(),
    description: z.string().optional(),
    location: z.string().optional()
})

export const reelSchema = z.object({
    caption: z.string().max(300).optional(),
    videoUrl: z.string().url('Invalid video URL'),
    achievementId: z.string().optional()
})

export const verificationRequestSchema = z.object({
    credentials: z.string().min(20, 'Please provide detailed credentials (minimum 20 characters)'),
    type: z.enum(['ATHLETE', 'GYM', 'EVENT']).default('ATHLETE')
})

export const verifyAchievementSchema = z.object({
    achievementId: z.string().min(1),
    note: z.string().optional()
})

export const searchSchema = z.object({
    query: z.string().min(1, 'Search query is too short')
})
