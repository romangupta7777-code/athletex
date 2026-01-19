'use client'

import React from 'react'
import VerificationBadge from '@/components/verification/VerificationBadge'

interface GymRosterProps {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    members: any[] // Use more specific if possible later
}

export default function GymRoster({ members }: GymRosterProps) {
    if (members.length === 0) {
        return (
            <div style={{ padding: '3rem', textAlign: 'center', background: 'var(--card-bg)', borderRadius: '24px', border: '1px solid var(--card-border)' }}>
                <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>🏟️</div>
                <h3 style={{ fontSize: '1.25rem', fontWeight: 700, marginBottom: '0.5rem' }}>No Active Roster</h3>
                <p style={{ color: '#a1a1aa' }}>This academy hasn&apos;t added any athletes yet.</p>
            </div>
        )
    }

    return (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '1.5rem' }}>
            {members.map((member) => (
                <div key={member.id} style={{
                    background: 'var(--card-bg)',
                    border: '1px solid var(--card-border)',
                    borderRadius: '20px',
                    padding: '1.5rem',
                    transition: 'transform 0.2s ease, border-color 0.2s ease',
                    cursor: 'pointer'
                }}
                    onMouseEnter={(e) => {
                        e.currentTarget.style.transform = 'translateY(-4px)'
                        e.currentTarget.style.borderColor = 'rgba(99, 102, 241, 0.4)'
                    }}
                    onMouseLeave={(e) => {
                        e.currentTarget.style.transform = 'translateY(0)'
                        e.currentTarget.style.borderColor = 'var(--card-border)'
                    }}
                >
                    <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1rem' }}>
                        <div style={{
                            width: '48px',
                            height: '48px',
                            borderRadius: '12px',
                            background: 'linear-gradient(135deg, #6366f1, #a855f7)',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            color: 'white',
                            fontWeight: 800,
                            fontSize: '1.2rem'
                        }}>
                            {member.displayName[0].toUpperCase()}
                        </div>
                        <div>
                            <div style={{ fontWeight: 700, display: 'flex', alignItems: 'center', gap: '4px' }}>
                                {member.displayName}
                                <VerificationBadge isVerified={member.isVerified} badge={member.verificationBadge} size="sm" />
                            </div>
                            <div style={{ fontSize: '0.8rem', color: '#a1a1aa' }}>@{member.username}</div>
                        </div>
                    </div>

                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingTop: '1rem', borderTop: '1px solid rgba(255,255,255,0.05)' }}>
                        <div style={{ fontSize: '0.8rem', color: '#71717a' }}>
                            Reputation: <strong style={{ color: '#10b981' }}>{member.reputationScore}</strong>
                        </div>
                        <div style={{ fontSize: '0.8rem', color: '#71717a' }}>
                            {member.sport || 'Athlete'}
                        </div>
                    </div>
                </div>
            ))}
        </div>
    )
}
