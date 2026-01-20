import { getCurrentUser } from '@/lib/auth'
import { redirect } from 'next/navigation'
import { getGroups } from '@/lib/actions/group'
import Link from 'next/link'

export const metadata = {
    title: 'Groups - AthleteX',
    description: 'Join communities of like-minded athletes'
}

export default async function GroupsPage() {
    const user = await getCurrentUser()
    if (!user) {
        redirect('/auth/login')
    }

    const groups = await getGroups()

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
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
                    <h1 style={{
                        fontSize: '2.5rem',
                        fontWeight: 700,
                        background: 'linear-gradient(45deg, #6366f1, #a855f7)',
                        WebkitBackgroundClip: 'text',
                        WebkitTextFillColor: 'transparent',
                        backgroundClip: 'text'
                    }}>
                        Groups
                    </h1>
                    <button className="btn btn-primary">
                        + Create Group
                    </button>
                </div>

                {groups.length === 0 ? (
                    <div style={{
                        textAlign: 'center',
                        padding: '4rem 2rem',
                        background: 'rgba(255, 255, 255, 0.02)',
                        border: '1px solid rgba(255, 255, 255, 0.1)',
                        borderRadius: '16px',
                        color: '#71717a'
                    }}>
                        <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>👥</div>
                        <h2 style={{ color: 'white', marginBottom: '0.5rem' }}>No groups yet</h2>
                        <p>Create or join a group to connect with athletes who share your interests!</p>
                    </div>
                ) : (
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '1.5rem' }}>
                        {groups.map(group => (
                            <Link key={group.id} href={`/groups/${group.id}`} style={{ textDecoration: 'none' }}>
                                <div style={{
                                    background: 'rgba(255, 255, 255, 0.02)',
                                    border: '1px solid rgba(255, 255, 255, 0.1)',
                                    borderRadius: '12px',
                                    padding: '1.5rem',
                                    transition: 'all 0.2s',
                                    cursor: 'pointer'
                                }}>
                                    <h3 style={{ color: 'white', fontSize: '1.25rem', marginBottom: '0.5rem' }}>
                                        {group.name}
                                    </h3>
                                    {group.description && (
                                        <p style={{ color: '#a1a1aa', fontSize: '0.9rem', marginBottom: '1rem' }}>
                                            {group.description}
                                        </p>
                                    )}
                                    <div style={{ display: 'flex', gap: '1.5rem', color: '#71717a', fontSize: '0.85rem' }}>
                                        <span>👥 {group._count?.members || 0} members</span>
                                        <span>📝 {group._count?.posts || 0} posts</span>
                                    </div>
                                </div>
                            </Link>
                        ))}
                    </div>
                )}
            </div>
        </div>
    )
}
