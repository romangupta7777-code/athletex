import { format } from 'date-fns'
import { Achievement } from '@/lib/types'

export default function AchievementCard({ achievement }: { achievement: Achievement }) {
    let metrics = { value: '', unit: '' }
    try {
        metrics = JSON.parse(achievement.metrics || '{}')
    } catch (_e) { }

    const isVerified = achievement.status === 'VERIFIED'

    return (
        <div style={{
            background: 'rgba(255, 255, 255, 0.03)',
            border: '1px solid rgba(255, 255, 255, 0.05)',
            borderRadius: '16px',
            padding: '1.25rem',
            display: 'flex',
            alignItems: 'flex-start',
            gap: '1rem',
            marginBottom: '1rem'
        }}>
            <div style={{
                width: '50px',
                height: '50px',
                background: isVerified ? 'rgba(34, 197, 94, 0.2)' : 'rgba(255, 255, 255, 0.1)',
                borderRadius: '12px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '1.5rem'
            }}>
                {achievement.type === 'LIFT' ? '🏋️' : achievement.type === 'TIME' ? '⏱️' : '🏆'}
            </div>

            <div style={{ flex: 1 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <h3 style={{ fontSize: '1rem', fontWeight: 600, margin: 0 }}>{achievement.title}</h3>
                    {isVerified && (
                        <span style={{ fontSize: '0.75rem', color: '#4ade80', background: 'rgba(74, 222, 128, 0.1)', padding: '2px 8px', borderRadius: '4px' }}>
                            ✔ Verified
                        </span>
                    )}
                    {!isVerified && (
                        <span style={{ fontSize: '0.75rem', color: '#a1a1aa', border: '1px solid #3f3f46', padding: '2px 8px', borderRadius: '4px' }}>
                            Unverified
                        </span>
                    )}
                </div>

                <div style={{ fontSize: '1.25rem', fontWeight: 700, margin: '0.25rem 0', color: 'white' }}>
                    {metrics.value} <span style={{ fontSize: '0.9rem', color: '#a1a1aa', fontWeight: 500 }}>{metrics.unit}</span>
                </div>

                <div style={{ fontSize: '0.85rem', color: '#71717a' }}>
                    {format(new Date(achievement.date), 'MMM d, yyyy')} • {achievement.type}
                </div>
            </div>
        </div>
    )
}
