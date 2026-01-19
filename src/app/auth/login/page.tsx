import LoginForm from '@/components/auth/LoginForm'
import { Metadata } from 'next'

export const metadata: Metadata = {
    title: 'Login - AthleteX',
    description: 'Access your career'
}

export default function LoginPage() {
    return <LoginForm />
}
