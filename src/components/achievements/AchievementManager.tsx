'use client'

import { useState } from 'react'
import AchievementCard from './AchievementCard'
import AchievementForm from './AchievementForm'
import { Achievement } from '@/lib/types'

export default function AchievementManager({ achievements }: { achievements: Achievement[] }) {
    const [isLogging, setIsLogging] = useState(false)

    return (
        <section>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
                <h2 style={{ fontSize: '1.5rem', fontWeight: 700 }}>Career Achievements</h2>
                <button onClick={() => setIsLogging(true)} className="btn btn-primary" style={{ fontSize: '0.9rem' }}>
                    + Log New
                </button>
            </div>

            {achievements.length === 0 ? (
                <div style={{
                    padding: '3rem',
                    textAlign: 'center',
                    background: 'rgba(255,255,255,0.02)',
                    borderRadius: '16px',
                    border: '1px dashed rgba(255,255,255,0.1)',
                    color: '#71717a'
                }}>
                    No achievements logged yet. Start building your legacy.
                </div>
            ) : (
                <div>
                    {achievements.map(ach => (
                        <AchievementCard key={ach.id} achievement={ach} />
                    ))}
                </div>
            )}

            <AchievementForm isOpen={isLogging} onClose={() => setIsLogging(false)} />
        </section>
    )
}
