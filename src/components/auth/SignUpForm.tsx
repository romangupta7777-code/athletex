'use client'

import { useActionState } from 'react'
import { signup } from '@/lib/actions/auth'
import styles from './auth.module.css'
import Link from 'next/link'

export default function SignUpForm() {
    const [state, action, isPending] = useActionState(signup, null)

    return (
        <div className={styles.container}>
            <h1 className={styles.title}>Join AthleteX</h1>
            <p className={styles.subtitle}>Start your journey to greatness</p>

            <form action={action} key={state?.timestamp || 'initial'}>
                <div className={styles.formGroup}>
                    <label className={styles.label}>Account Type</label>
                    <select
                        name="role"
                        className={styles.select}
                        defaultValue={state?.fields?.role || 'ATHLETE'}
                        disabled={isPending}
                    >
                        <option value="ATHLETE">Athlete</option>
                        <option value="COACH">Coach</option>
                        <option value="GYM">Gym / Academy</option>
                    </select>
                </div>

                <div className={styles.formGroup}>
                    <label className={styles.label}>Full Name</label>
                    <input
                        name="name"
                        type="text"
                        required
                        className={styles.input}
                        placeholder="John Doe"
                        defaultValue={state?.fields?.name || ''}
                        disabled={isPending}
                    />
                </div>

                <div className={styles.formGroup}>
                    <label className={styles.label}>Email</label>
                    <input
                        name="email"
                        type="email"
                        required
                        className={styles.input}
                        placeholder="you@example.com"
                        defaultValue={state?.fields?.email || ''}
                        disabled={isPending}
                    />
                </div>

                <div className={styles.formGroup}>
                    <label className={styles.label}>Password</label>
                    <input
                        name="password"
                        type="password"
                        required
                        className={styles.input}
                        placeholder="••••••••"
                        minLength={6}
                        disabled={isPending}
                    />
                </div>

                <button type="submit" disabled={isPending} className={styles.button}>
                    {isPending ? 'Creating Account...' : 'Sign Up'}
                </button>

                {state?.error && <p className={styles.error}>{state.error}</p>}
            </form>

            <Link href="/auth/login" className={styles.link}>
                Already have an account? Sign In
            </Link>
        </div>
    )
}
