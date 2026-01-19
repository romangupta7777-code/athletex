'use client'

import { useActionState } from 'react'
import { login } from '@/lib/actions/auth'
import styles from './auth.module.css'
import Link from 'next/link'

export default function LoginForm() {
    const [state, action, isPending] = useActionState(login, null)

    return (
        <div className={styles.container}>
            <h1 className={styles.title}>Welcome Back</h1>
            <p className={styles.subtitle}>Log in to continue your streak</p>

            <form action={action}>
                <div className={styles.formGroup}>
                    <label className={styles.label}>Email</label>
                    <input name="email" type="email" required className={styles.input} placeholder="you@example.com" />
                </div>

                <div className={styles.formGroup}>
                    <label className={styles.label}>Password</label>
                    <input name="password" type="password" required className={styles.input} placeholder="••••••••" />
                </div>

                <button type="submit" disabled={isPending} className={styles.button}>
                    {isPending ? 'Logging In...' : 'Sign In'}
                </button>

                {state?.error && <p className={styles.error}>{state.error}</p>}
            </form>

            <Link href="/auth/signup" className={styles.link}>
                Don&apos;t have an account? Sign Up
            </Link>
        </div>
    )
}
