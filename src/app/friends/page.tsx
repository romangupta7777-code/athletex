import { getCurrentUser } from '@/lib/auth'
import { redirect } from 'next/navigation'
import { getFriends, getFriendRequests } from '@/lib/actions/friend'

export const metadata = {
    title: 'Friends - AthleteX',
    description: 'Connect with fellow athletes'
}

export default async function FriendsPage() {
    const user = await getCurrentUser()
    if (!user) {
        redirect('/auth/login')
    }

    const friends = await getFriends()
    const requests = await getFriendRequests()

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
                    marginBottom: '2rem',
                    background: 'linear-gradient(45deg, #6366f1, #a855f7)',
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent',
                    backgroundClip: 'text'
                }}>
                    Friends
                </h1>

                {requests.length > 0 && (
                    <div style={{ marginBottom: '2rem' }}>
                        <h2 style={{ fontSize: '1.5rem', marginBottom: '1rem', color: 'white' }}>
                            Friend Requests ({requests.length})
                        </h2>
                        <div style={{ display: 'grid', gap: '1rem' }}>
                            {requests.map(request => (
                                <div key={request.id} style={{
                                    background: 'rgba(255, 255, 255, 0.02)',
                                    border: '1px solid rgba(255, 255, 255, 0.1)',
                                    borderRadius: '12px',
                                    padding: '1rem',
                                    display: 'flex',
                                    justifyContent: 'space-between',
                                    alignItems: 'center'
                                }}>
                                    <div>
                                        <p style={{ color: 'white', fontWeight: 600 }}>
                                            {request.requester.displayName}
                                        </p>
                                        <p style={{ color: '#71717a', fontSize: '0.9rem' }}>
                                            @{request.requester.username}
                                        </p>
                                    </div>
                                    <div style={{ display: 'flex', gap: '0.5rem' }}>
                                        <button className="btn btn-primary" style={{ padding: '0.5rem 1rem' }}>
                                            Accept
                                        </button>
                                        <button style={{
                                            padding: '0.5rem 1rem',
                                            background: 'rgba(255, 255, 255, 0.05)',
                                            border: '1px solid rgba(255, 255, 255, 0.1)',
                                            borderRadius: '8px',
                                            color: 'white',
                                            cursor: 'pointer'
                                        }}>
                                            Decline
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                <div>
                    <h2 style={{ fontSize: '1.5rem', marginBottom: '1rem', color: 'white' }}>
                        My Friends ({friends.length})
                    </h2>
                    {friends.length === 0 ? (
                        <div style={{
                            textAlign: 'center',
                            padding: '4rem 2rem',
                            background: 'rgba(255, 255, 255, 0.02)',
                            border: '1px solid rgba(255, 255, 255, 0.1)',
                            borderRadius: '16px',
                            color: '#71717a'
                        }}>
                            <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>👥</div>
                            <h3 style={{ color: 'white', marginBottom: '0.5rem' }}>No friends yet</h3>
                            <p>Start connecting with fellow athletes!</p>
                        </div>
                    ) : (
                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))', gap: '1rem' }}>
                            {friends.map(friend => (
                                <div key={friend.id} style={{
                                    background: 'rgba(255, 255, 255, 0.02)',
                                    border: '1px solid rgba(255, 255, 255, 0.1)',
                                    borderRadius: '12px',
                                    padding: '1.5rem',
                                    textAlign: 'center'
                                }}>
                                    <div style={{
                                        width: '60px',
                                        height: '60px',
                                        borderRadius: '50%',
                                        background: 'linear-gradient(45deg, #6366f1, #a855f7)',
                                        margin: '0 auto 1rem',
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        fontSize: '1.5rem',
                                        fontWeight: 700
                                    }}>
                                        {friend.displayName[0].toUpperCase()}
                                    </div>
                                    <p style={{ color: 'white', fontWeight: 600, marginBottom: '0.25rem' }}>
                                        {friend.displayName}
                                    </p>
                                    <p style={{ color: '#71717a', fontSize: '0.9rem' }}>
                                        @{friend.username}
                                    </p>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </div>
    )
}
