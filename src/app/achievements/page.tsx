import { getCurrentUser } from '@/lib/auth'
import { redirect } from 'next/navigation'
import AchievementForm from '@/components/achievements/AchievementForm'
import AchievementManager from '@/components/achievements/AchievementManager'

export const metadata = {
    title: 'My Achievements - AthleteX',
    description: 'Log and track your athletic achievements'
}

export default async function AchievementsPage() {
    const user = await getCurrentUser()
    if (!user) {
        redirect('/auth/login')
    }

    return (
        <div style={{
            minHeight: '100vh',
            background: 'linear-gradient(to bottom, #0a0a0a, #1a1a2e)',
            padding: '2rem'
        }}>
            <div style={{
                maxWidth: '1200px',
                margin: '0 auto'
            }}>
                <h1 style={{
                    fontSize: '2.5rem',
                    fontWeight: 700,
                    marginBottom: '1rem',
                    background: 'linear-gradient(45deg, #6366f1, #a855f7)',
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent',
                    backgroundClip: 'text'
                }}>
                    My Achievements
                </h1>
                <p style={{ color: '#71717a', marginBottom: '2rem' }}>
                    Log your personal records, competition results, and training milestones
                </p>

                <div style={{
                    display: 'grid',
                    gridTemplateColumns: '1fr 2fr',
                    gap: '2rem',
                    alignItems: 'start'
                }}>
                    <div>
                        <h2 style={{ fontSize: '1.5rem', marginBottom: '1rem', color: 'white' }}>
                            Log New Achievement
                        </h2>
                        <AchievementForm />
                    </div>

                    <div>
                        <h2 style={{ fontSize: '1.5rem', marginBottom: '1rem', color: 'white' }}>
                            Your Achievements
                        </h2>
                        <AchievementManager />
                    </div>
                </div>
            </div>
        </div>
    )
}
