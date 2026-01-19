'use client'

import { useState } from 'react'
import { approveVerificationRequest, rejectVerificationRequest } from '@/lib/actions/verification'
import { format } from 'date-fns'

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export default function VerificationRequestCard({ request, onUpdate }: { request: any, onUpdate: () => void }) {
    const [isProcessing, setIsProcessing] = useState(false)
    const [reviewNote, setReviewNote] = useState('')
    const [error, setError] = useState('')

    const handleApprove = async () => {
        setIsProcessing(true)
        setError('')
        const result = await approveVerificationRequest(request.id, reviewNote)
        if (result.error) {
            setError(result.error)
            setIsProcessing(false)
        } else {
            onUpdate()
        }
    }

    const handleReject = async () => {
        if (!reviewNote.trim()) {
            setError('Please provide a reason for rejection')
            return
        }
        setIsProcessing(true)
        setError('')
        const result = await rejectVerificationRequest(request.id, reviewNote)
        if (result.error) {
            setError(result.error)
            setIsProcessing(false)
        } else {
            onUpdate()
        }
    }

    return (
        <div style={{
            background: 'rgba(255, 255, 255, 0.03)',
            border: '1px solid rgba(255, 255, 255, 0.1)',
            borderRadius: '16px',
            padding: '1.5rem',
            marginBottom: '1rem'
        }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1rem' }}>
                <div>
                    <h3 style={{ fontSize: '1.1rem', fontWeight: 600, marginBottom: '0.25rem' }}>
                        {request.profile.displayName}
                    </h3>
                    <div style={{ fontSize: '0.85rem', color: '#a1a1aa' }}>
                        @{request.profile.username} • {request.profile.user.role}
                    </div>
                    <div style={{ fontSize: '0.8rem', color: '#71717a', marginTop: '0.25rem' }}>
                        {request.profile.user.email}
                    </div>
                </div>
                <div style={{
                    background: 'rgba(251, 191, 36, 0.1)',
                    color: '#fbbf24',
                    padding: '4px 12px',
                    borderRadius: '100px',
                    fontSize: '0.75rem',
                    fontWeight: 600
                }}>
                    PENDING
                </div>
            </div>

            <div style={{ marginBottom: '1rem' }}>
                <div style={{ fontSize: '0.85rem', fontWeight: 600, color: '#d4d4d8', marginBottom: '0.5rem' }}>
                    Credentials:
                </div>
                <div style={{
                    background: 'rgba(255, 255, 255, 0.02)',
                    border: '1px solid rgba(255, 255, 255, 0.05)',
                    borderRadius: '8px',
                    padding: '0.75rem',
                    fontSize: '0.9rem',
                    color: '#d4d4d8',
                    lineHeight: 1.6,
                    whiteSpace: 'pre-wrap'
                }}>
                    {request.credentials}
                </div>
            </div>

            <div style={{ fontSize: '0.75rem', color: '#71717a', marginBottom: '1rem' }}>
                Submitted {format(new Date(request.createdAt), 'MMM d, yyyy \'at\' h:mm a')}
            </div>

            <div style={{ marginBottom: '1rem' }}>
                <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.85rem', color: '#d4d4d8' }}>
                    Review Note (optional for approval, required for rejection):
                </label>
                <textarea
                    value={reviewNote}
                    onChange={(e) => setReviewNote(e.target.value)}
                    placeholder="Add a note about your decision..."
                    rows={3}
                    style={{
                        width: '100%',
                        background: 'rgba(255, 255, 255, 0.05)',
                        border: '1px solid rgba(255, 255, 255, 0.1)',
                        borderRadius: '8px',
                        padding: '0.75rem',
                        color: 'white',
                        fontSize: '0.9rem',
                        resize: 'vertical'
                    }}
                    disabled={isProcessing}
                />
            </div>

            {error && (
                <div style={{
                    background: 'rgba(239, 68, 68, 0.1)',
                    border: '1px solid rgba(239, 68, 68, 0.3)',
                    borderRadius: '8px',
                    padding: '0.75rem',
                    color: '#f87171',
                    fontSize: '0.85rem',
                    marginBottom: '1rem'
                }}>
                    {error}
                </div>
            )}

            <div style={{ display: 'flex', gap: '0.75rem' }}>
                <button
                    onClick={handleApprove}
                    disabled={isProcessing}
                    className="btn btn-primary"
                    style={{ flex: 1, fontSize: '0.9rem' }}
                >
                    {isProcessing ? 'Processing...' : '✓ Approve'}
                </button>
                <button
                    onClick={handleReject}
                    disabled={isProcessing}
                    className="btn btn-outline"
                    style={{ flex: 1, fontSize: '0.9rem', color: '#ef4444', borderColor: 'rgba(239, 68, 68, 0.3)' }}
                >
                    {isProcessing ? 'Processing...' : '✕ Reject'}
                </button>
            </div>
        </div>
    )
}
