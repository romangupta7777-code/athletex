import SignUpForm from '@/components/auth/SignUpForm'
import { Metadata } from 'next'

export const metadata: Metadata = {
    title: 'Sign Up - AthleteX',
    description: 'Create your athlete profile'
}

export default function SignupPage() {
    return <SignUpForm />
}
