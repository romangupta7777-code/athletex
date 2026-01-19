'use client'

import { useEffect, useState, useCallback } from 'react'
import { getVerificationRequests } from '@/lib/actions/verification'
import VerificationRequestCard from '@/components/admin/VerificationRequestCard'

export default function VerificationRequestList() {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const [requests, setRequests] = useState<any[]>([])
    const [loading, setLoading] = useState(true)

    const loadRequests = useCallback(async () => {
        const data = await getVerificationRequests()
        setRequests(data)
        setLoading(false)
    }, [])

    useEffect(() => {
        // eslint-disable-next-line react-hooks/set-state-in-effect
        loadRequests()
    }, [loadRequests])

    if (loading) {
        return (
            <div style={{ textAlign: 'center', padding: '3rem', color: '#a1a1aa' }}>
                Loading verification requests...
            </div>
        )
    }

    if (requests.length === 0) {
        return (
            <div style={{
                background: 'rgba(255, 255, 255, 0.02)',
                border: '1px dashed rgba(255, 255, 255, 0.1)',
                borderRadius: '16px',
                padding: '3rem',
                textAlign: 'center',
                color: '#71717a'
            }}>
                <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>✓</div>
                <div>No pending verification requests</div>
            </div>
        )
    }

    return (
        <div>
            <div style={{ marginBottom: '1.5rem', color: '#a1a1aa', fontSize: '0.9rem' }}>
                {requests.length} pending {requests.length === 1 ? 'request' : 'requests'}
            </div>
            {requests.map(request => (
                <VerificationRequestCard
                    key={request.id}
                    request={request}
                    onUpdate={loadRequests}
                />
            ))}
        </div>
    )
}
