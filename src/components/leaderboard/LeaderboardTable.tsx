'use client'

import React from 'react'

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export default function LeaderboardTable({ athletes, type = 'ATHLETE' }: { athletes: any[], type?: 'ATHLETE' | 'GYM' }) {
    if (athletes.length === 0) {
        return (
            <div style={{ textAlign: 'center', padding: '3rem', color: '#a1a1aa' }}>
                No {type === 'GYM' ? 'gyms' : 'athletes'} found in this category.
            </div>
        )
    }

    return (
        <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', marginTop: '1rem' }}>
                <thead>
                    <tr style={{ borderBottom: '1px solid rgba(255, 255, 255, 0.1)', color: '#71717a', fontSize: '0.85rem' }}>
                        <th style={{ textAlign: 'left', padding: '1rem', fontWeight: 500 }}>RANK</th>
                        <th style={{ textAlign: 'left', padding: '1rem', fontWeight: 500 }}>{type === 'GYM' ? 'GYM / ACADEMY' : 'ATHLETE'}</th>
                        {type === 'GYM' ? (
                            <th style={{ textAlign: 'center', padding: '1rem', fontWeight: 500 }}>MEMBERS</th>
                        ) : (
                            <th style={{ textAlign: 'left', padding: '1rem', fontWeight: 500 }}>SPORT</th>
                        )}
                        <th style={{ textAlign: 'center', padding: '1rem', fontWeight: 500 }}>{type === 'GYM' ? 'VERIFIED' : 'VERIFIED'}</th>
                        <th style={{ textAlign: 'right', padding: '1rem', fontWeight: 500 }}>REPUTATION</th>
                    </tr>
                </thead>
                <tbody>
                    {athletes.map((athlete, index) => (
                        <tr
                            key={athlete.id}
                            style={{
                                borderBottom: '1px solid rgba(255, 255, 255, 0.05)',
                                transition: 'background 0.2s',
                                cursor: 'default'
                            }}
                            onMouseEnter={(e) => e.currentTarget.style.background = 'rgba(255, 255, 255, 0.02)'}
                            onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}
                        >
                            <td style={{ padding: '1.25rem 1rem' }}>
                                <div style={{
                                    width: '32px',
                                    height: '32px',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    borderRadius: '8px',
                                    fontWeight: 700,
                                    background: index === 0 ? 'rgba(251, 191, 36, 0.2)' :
                                        index === 1 ? 'rgba(156, 163, 175, 0.2)' :
                                            index === 2 ? 'rgba(180, 83, 9, 0.2)' : 'rgba(255, 255, 255, 0.05)',
                                    color: index === 0 ? '#fbbf24' :
                                        index === 1 ? '#d1d5db' :
                                            index === 2 ? '#b45309' : '#a1a1aa'
                                }}>
                                    {index + 1}
                                </div>
                            </td>
                            <td style={{ padding: '1.25rem 1rem' }}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                                    <div style={{
                                        width: '40px',
                                        height: '40px',
                                        borderRadius: '50%',
                                        background: 'linear-gradient(45deg, #6366f1, #a855f7)',
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        fontSize: '1rem',
                                        fontWeight: 700,
                                        color: 'white'
                                    }}>
                                        {athlete.displayName[0].toUpperCase()}
                                    </div>
                                    <div>
                                        <div style={{ fontWeight: 600, fontSize: '0.95rem' }}>{athlete.displayName}</div>
                                        <div style={{ color: '#71717a', fontSize: '0.8rem' }}>@{athlete.username}</div>
                                    </div>
                                </div>
                            </td>
                            {type === 'GYM' ? (
                                <td style={{ padding: '1.25rem 1rem', textAlign: 'center', color: '#d4d4d8' }}>
                                    {athlete._count?.members || 0}
                                </td>
                            ) : (
                                <td style={{ padding: '1.25rem 1rem', color: '#d4d4d8', fontSize: '0.9rem' }}>
                                    {athlete.sport || 'N/A'}
                                </td>
                            )}
                            <td style={{ padding: '1.25rem 1rem', textAlign: 'center' }}>
                                <span style={{
                                    background: 'rgba(34, 197, 94, 0.1)',
                                    color: '#4ade80',
                                    padding: '4px 8px',
                                    borderRadius: '6px',
                                    fontSize: '0.8rem',
                                    fontWeight: 600
                                }}>
                                    {athlete._count.achievements}
                                </span>
                            </td>
                            <td style={{ padding: '1.25rem 1rem', textAlign: 'right' }}>
                                <div style={{ fontSize: '1.1rem', fontWeight: 800, color: '#4ade80' }}>
                                    {athlete.reputationScore}
                                </div>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    )
}
