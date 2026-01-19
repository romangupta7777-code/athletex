'use client'

import { useActionState } from 'react'
import { requestUserVerification } from '@/lib/actions/verification'

export default function VerificationRequestForm({
    isOpen,
    onClose
}: {
    isOpen: boolean
    onClose: () => void
}) {
    const [state, formAction, isPending] = useActionState(requestUserVerification, undefined)

    if (!isOpen) return null

    if (state?.success) {
        return (
            <div style={{
                position: 'fixed',
                inset: 0,
                background: 'rgba(0, 0, 0, 0.8)',
                backdropFilter: 'blur(8px)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                zIndex: 1000
            }} onClick={onClose}>
                <div style={{
                    background: 'linear-gradient(135deg, rgba(17, 24, 39, 0.95), rgba(31, 41, 55, 0.95))',
                    border: '1px solid rgba(255, 255, 255, 0.1)',
                    borderRadius: '20px',
                    padding: '2rem',
                    maxWidth: '500px',
                    width: '90%',
                    textAlign: 'center'
                }} onClick={e => e.stopPropagation()}>
                    <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>✅</div>
                    <h2 style={{ fontSize: '1.5rem', marginBottom: '0.5rem' }}>Request Submitted!</h2>
                    <p style={{ color: '#a1a1aa', marginBottom: '1.5rem' }}>{state.success}</p>
                    <button onClick={onClose} className="btn btn-primary">Close</button>
                </div>
            </div>
        )
    }

    return (
        <div style={{
            position: 'fixed',
            inset: 0,
            background: 'rgba(0, 0, 0, 0.8)',
            backdropFilter: 'blur(8px)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 1000
        }} onClick={onClose}>
            <div style={{
                background: 'linear-gradient(135deg, rgba(17, 24, 39, 0.95), rgba(31, 41, 55, 0.95))',
                border: '1px solid rgba(255, 255, 255, 0.1)',
                borderRadius: '20px',
                padding: '2rem',
                maxWidth: '600px',
                width: '90%',
                boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.5)'
            }} onClick={e => e.stopPropagation()}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
                    <h2 style={{ fontSize: '1.5rem', fontWeight: 700 }}>Request Verification</h2>
                    <button onClick={onClose} style={{ background: 'none', border: 'none', fontSize: '1.5rem', cursor: 'pointer', color: '#71717a' }}>×</button>
                </div>

                <form action={formAction}>
                    <div style={{ marginBottom: '1.5rem' }}>
                        <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.9rem', color: '#d4d4d8' }}>
                            Credentials & Qualifications *
                        </label>
                        <textarea
                            name="credentials"
                            required
                            minLength={20}
                            rows={6}
                            placeholder="Describe your qualifications, certifications, experience, and why you should be verified. Be specific and detailed (minimum 20 characters)."
                            style={{
                                width: '100%',
                                background: 'rgba(255, 255, 255, 0.05)',
                                border: '1px solid rgba(255, 255, 255, 0.1)',
                                borderRadius: '12px',
                                padding: '0.75rem',
                                color: 'white',
                                fontSize: '0.9rem',
                                resize: 'vertical'
                            }}
                        />
                        <div style={{ fontSize: '0.75rem', color: '#71717a', marginTop: '0.25rem' }}>
                            Include certifications, years of experience, notable achievements, etc.
                        </div>
                    </div>

                    {state?.error && (
                        <div style={{
                            background: 'rgba(239, 68, 68, 0.1)',
                            border: '1px solid rgba(239, 68, 68, 0.3)',
                            borderRadius: '8px',
                            padding: '0.75rem',
                            color: '#f87171',
                            fontSize: '0.9rem',
                            marginBottom: '1rem'
                        }}>
                            {state.error}
                        </div>
                    )}

                    <div style={{ display: 'flex', gap: '1rem' }}>
                        <button
                            type="button"
                            onClick={onClose}
                            className="btn btn-outline"
                            style={{ flex: 1 }}
                            disabled={isPending}
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            className="btn btn-primary"
                            style={{ flex: 1 }}
                            disabled={isPending}
                        >
                            {isPending ? 'Submitting...' : 'Submit Request'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    )
}
