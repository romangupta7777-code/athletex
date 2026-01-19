'use client'

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export default function TweetCard({ tweet }: { tweet: any }) {
    return (
        <div style={{
            background: 'rgba(255, 255, 255, 0.02)',
            border: '1px solid rgba(255, 255, 255, 0.1)',
            borderRadius: '16px',
            padding: '1.5rem',
            marginBottom: '1rem',
            transition: 'all 0.2s'
        }}>
            <div style={{ display: 'flex', gap: '1rem' }}>
                <div style={{
                    width: '40px',
                    height: '40px',
                    borderRadius: '50%',
                    background: 'linear-gradient(45deg, #6366f1, #a855f7)',
                    flexShrink: 0,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '1.2rem',
                    fontWeight: 700
                }}>
                    {tweet.profile?.displayName?.[0]?.toUpperCase() || 'A'}
                </div>

                <div style={{ flex: 1 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}>
                        <span style={{ fontWeight: 600, color: 'white' }}>
                            {tweet.profile?.displayName || 'Athlete'}
                        </span>
                        <span style={{ color: '#71717a', fontSize: '0.85rem' }}>
                            @{tweet.profile?.username || 'user'}
                        </span>
                        <span style={{ color: '#71717a', fontSize: '0.85rem' }}>·</span>
                        <span style={{ color: '#71717a', fontSize: '0.85rem' }}>
                            {new Date(tweet.createdAt).toLocaleDateString()}
                        </span>
                    </div>

                    <p style={{
                        color: '#e4e4e7',
                        lineHeight: 1.5,
                        marginBottom: '1rem',
                        whiteSpace: 'pre-wrap'
                    }}>
                        {tweet.content}
                    </p>

                    {tweet.mediaUrl && (
                        <div style={{ marginBottom: '1rem', borderRadius: '12px', overflow: 'hidden' }}>
                            {tweet.mediaUrl.match(/\.(mp4|webm|mov)$/i) ? (
                                <video
                                    src={tweet.mediaUrl}
                                    controls
                                    style={{ width: '100%', maxHeight: '400px' }}
                                />
                            ) : (
                                <img
                                    src={tweet.mediaUrl}
                                    alt="Post media"
                                    style={{ width: '100%', maxHeight: '400px', objectFit: 'cover' }}
                                />
                            )}
                        </div>
                    )}

                    <div style={{ display: 'flex', gap: '2rem', color: '#71717a', fontSize: '0.9rem' }}>
                        <button style={{
                            background: 'none',
                            border: 'none',
                            color: '#71717a',
                            cursor: 'pointer',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '0.5rem',
                            transition: 'color 0.2s'
                        }}>
                            💬 {tweet._count?.comments || 0}
                        </button>
                        <button style={{
                            background: 'none',
                            border: 'none',
                            color: '#71717a',
                            cursor: 'pointer',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '0.5rem',
                            transition: 'color 0.2s'
                        }}>
                            ❤️ {tweet._count?.likes || 0}
                        </button>
                        <button style={{
                            background: 'none',
                            border: 'none',
                            color: '#71717a',
                            cursor: 'pointer',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '0.5rem',
                            transition: 'color 0.2s'
                        }}>
                            🔄 Share
                        </button>
                    </div>
                </div>
            </div>
        </div>
    )
}
