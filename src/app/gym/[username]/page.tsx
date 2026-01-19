import { prisma } from '@/lib/prisma'
import { cookies } from 'next/headers'
import { notFound } from 'next/navigation'
import ProfileHeader from '@/components/profile/ProfileHeader'
import GymRoster from '@/components/gym/GymRoster'
import GymActionButtons from '@/components/gym/GymActionButtons'

export const dynamic = 'force-dynamic'

export default async function GymProfilePage({ params }: { params: { username: string } }) {
    const { username } = await params

    const gym = await prisma.profile.findUnique({
        where: { username },
        include: {
            user: true,
            members: {
                orderBy: { reputationScore: 'desc' },
                include: {
                    achievements: true
                }
            }
        }
    })

    if (!gym || gym.user.role !== 'GYM') {
        notFound()
    }

    const cookieStore = await cookies()
    const currentUserId = cookieStore.get('userId')?.value

    let isMember = false
    let isOwner = false

    if (currentUserId) {
        const currentUser = await prisma.user.findUnique({
            where: { id: currentUserId },
            include: { profile: true }
        })
        isMember = currentUser?.profile?.gymId === gym.id
        isOwner = currentUser?.id === gym.userId
    }

    return (
        <div className="container" style={{ paddingTop: '4rem', paddingBottom: '4rem' }}>
            <div style={{ position: 'relative' }}>
                <ProfileHeader profile={gym} userRole={gym.user.role} />
                <div style={{ position: 'absolute', top: '2rem', right: '0' }}>
                    <GymActionButtons gymId={gym.id} isMember={isMember} isOwner={isOwner} />
                </div>
            </div>

            <div style={{ marginTop: '4rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '2rem' }}>
                    <div>
                        <h2 style={{ fontSize: '2rem', fontWeight: 800, marginBottom: '0.5rem' }}>Active Roster</h2>
                        <p style={{ color: '#a1a1aa' }}>Verified athletes training at {gym.displayName}.</p>
                    </div>
                    <div style={{ background: 'rgba(99, 102, 241, 0.1)', padding: '0.75rem 1.5rem', borderRadius: '100px', border: '1px solid rgba(99, 102, 241, 0.2)' }}>
                        <span style={{ fontWeight: 700, color: '#6366f1' }}>{gym.members.length}</span> <span style={{ color: '#a1a1aa', fontSize: '0.9rem' }}>Athletes</span>
                    </div>
                </div>

                <GymRoster members={gym.members} />
            </div>

            {/* Academy Features Placeholder */}
            <div style={{ marginTop: '4rem', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem' }}>
                <div style={academyCardStyle}>
                    <div style={{ fontSize: '2rem', marginBottom: '1rem' }}>🎓</div>
                    <h3 style={{ fontWeight: 700, marginBottom: '0.5rem' }}>Academy Programs</h3>
                    <p style={{ color: '#a1a1aa', fontSize: '0.9rem' }}>Specialized training programs for elite performance development.</p>
                </div>
                <div style={academyCardStyle}>
                    <div style={{ fontSize: '2rem', marginBottom: '1rem' }}>💎</div>
                    <h3 style={{ fontWeight: 700, marginBottom: '0.5rem' }}>Alumni success</h3>
                    <p style={{ color: '#a1a1aa', fontSize: '0.9rem' }}>Track records of athletes moving to pro leagues from this academy.</p>
                </div>
            </div>
        </div>
    )
}

const academyCardStyle: React.CSSProperties = {
    background: 'var(--card-bg)',
    border: '1px solid var(--card-border)',
    padding: '2rem',
    borderRadius: '24px',
    textAlign: 'center'
}
