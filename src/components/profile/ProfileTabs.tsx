'use client'

import React, { useState } from 'react'
import AchievementManager from '../achievements/AchievementManager'
import DashboardReelsManager from '../reels/DashboardReelsManager'

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export default function ProfileTabs({ achievements, reels, userProfile }: { achievements: any[], reels: any[], userProfile: any }) {
    const [activeTab, setActiveTab] = useState<'ACHIEVEMENTS' | 'REELS'>('ACHIEVEMENTS')

    return (
        <div>
            {/* Tabs Navigation */}
            <div style={{
                display: 'flex',
                justifyContent: 'center',
                borderTop: '1px solid rgba(255,255,255,0.1)',
                marginBottom: '2rem'
            }}>
                <button
                    onClick={() => setActiveTab('ACHIEVEMENTS')}
                    style={{
                        padding: '1rem 2rem',
                        background: 'none',
                        border: 'none',
                        borderTop: activeTab === 'ACHIEVEMENTS' ? '1px solid white' : '1px solid transparent',
                        color: activeTab === 'ACHIEVEMENTS' ? 'white' : '#71717a',
                        fontWeight: 600,
                        fontSize: '0.85rem',
                        letterSpacing: '0.05em',
                        cursor: 'pointer',
                        marginTop: '-1px',
                        display: 'flex',
                        gap: '0.5rem',
                        alignItems: 'center'
                    }}
                >
                    <span>🏆</span> ACHIEVEMENTS
                </button>
                <button
                    onClick={() => setActiveTab('REELS')}
                    style={{
                        padding: '1rem 2rem',
                        background: 'none',
                        border: 'none',
                        borderTop: activeTab === 'REELS' ? '1px solid white' : '1px solid transparent',
                        color: activeTab === 'REELS' ? 'white' : '#71717a',
                        fontWeight: 600,
                        fontSize: '0.85rem',
                        letterSpacing: '0.05em',
                        cursor: 'pointer',
                        marginTop: '-1px',
                        display: 'flex',
                        gap: '0.5rem',
                        alignItems: 'center'
                    }}
                >
                    <span>🎥</span> REELS
                </button>
            </div>

            {/* Content Area */}
            <div>
                {activeTab === 'ACHIEVEMENTS' && (
                    <AchievementManager achievements={achievements} />
                )}

                {activeTab === 'REELS' && (
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '4px' }}>
                        {reels.map((reel: any) => (
                            <div key={reel.id} style={{ aspectRatio: '9/16', background: '#1a1a1a', position: 'relative' }}>
                                <video
                                    src={reel.videoUrl}
                                    style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                                />
                                <div style={{
                                    position: 'absolute',
                                    bottom: 0,
                                    left: 0,
                                    right: 0,
                                    padding: '0.5rem',
                                    background: 'linear-gradient(transparent, rgba(0,0,0,0.8))',
                                    display: 'flex',
                                    gap: '1rem',
                                    fontSize: '0.8rem',
                                    fontWeight: 600
                                }}>
                                    <span>❤️ {reel._count?.likes || 0}</span>
                                    <span>💬 {reel._count?.comments || 0}</span>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    )
}
