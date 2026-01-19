import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'
import { prisma } from '@/lib/prisma'
import { getReels } from '@/lib/actions/reel'
import ReelFeed from '@/components/reels/ReelFeed'
import TweetBox from '@/components/feed/TweetBox'
import TweetCard from '@/components/feed/TweetCard'
import Link from 'next/link'

export const dynamic = 'force-dynamic'

export default async function DashboardPage() {
    const cookieStore = await cookies()
    const userId = cookieStore.get('userId')?.value

    if (!userId) {
        redirect('/auth/login')
    }

    const user = await prisma.user.findUnique({
        where: { id: userId },
        include: {
            profile: {
                include: {
                    _count: {
                        select: { achievements: true, reels: true }
                    }
                }
            }
        }
    })

    if (!user || !user.profile) {
        redirect('/auth/login')
    }

    const reels = await getReels()

    // Mock tweets for now - you'll provide the backend
    const tweets: any[] = []

    return (
        <div className="container" style={{ paddingTop: '2rem', paddingBottom: '6rem', maxWidth: '935px' }}>
            {/* Simplified Dashboard Header */}
            <div style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                marginBottom: '2rem',
                padding: '1.5rem',
                background: 'rgba(255, 255, 255, 0.02)',
                border: '1px solid rgba(255, 255, 255, 0.05)',
                borderRadius: '16px'
            }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                    <div style={{
                        width: '60px',
                        height: '60px',
                        borderRadius: '50%',
                        background: 'linear-gradient(45deg, #6366f1, #a855f7)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontSize: '1.5rem',
                        fontWeight: 700
                    }}>
                        {user.profile.displayName[0].toUpperCase()}
                    </div>
                    <div>
                        <h2 style={{ fontSize: '1.5rem', fontWeight: 700, marginBottom: '0.25rem' }}>
                            {user.profile.displayName}
                        </h2>
                        <div style={{ display: 'flex', gap: '1.5rem', fontSize: '0.9rem', color: '#a1a1aa' }}>
                            <span><strong style={{ color: 'white' }}>{user.profile._count.achievements}</strong> achievements</span>
                            <span><strong style={{ color: 'white' }}>{user.profile._count.reels}</strong> posts</span>
                            <span><strong style={{ color: 'white' }}>{user.profile.reputationScore}</strong> reputation</span>
                        </div>
                    </div>
                </div>

                <div style={{ display: 'flex', gap: '0.75rem' }}>
                    <Link href="/profile" className="btn btn-outline" style={{ fontSize: '0.9rem', padding: '0.6rem 1.2rem' }}>
                        View Profile
                    </Link>
                </div>
            </div>

            <div style={{ borderTop: '1px solid rgba(255,255,255,0.1)', paddingTop: '2rem' }}>
                <h3 style={{ fontSize: '1.2rem', fontWeight: 600, marginBottom: '1.5rem' }}>Community Feed</h3>

                {/* Tweet Box for creating posts */}
                <TweetBox />

                {/* Combined Feed - Tweets and Reels */}
                <div style={{ marginBottom: '2rem' }}>
                    {tweets.length > 0 ? (
                        tweets.map((tweet) => (
                            <TweetCard key={tweet.id} tweet={tweet} />
                        ))
                    ) : (
                        <div style={{
                            background: 'rgba(255, 255, 255, 0.02)',
                            border: '1px solid rgba(255, 255, 255, 0.05)',
                            borderRadius: '16px',
                            padding: '2rem',
                            textAlign: 'center',
                            color: '#71717a',
                            marginBottom: '2rem'
                        }}>
                            <div style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>💬</div>
                            <p>No posts yet. Be the first to share!</p>
                        </div>
                    )}
                </div>

                {/* Reels Section */}
                <div>
                    <h4 style={{ fontSize: '1.1rem', fontWeight: 600, marginBottom: '1rem' }}>Performance Reels</h4>
                    <ReelFeed initialReels={reels} />
                </div>
            </div>
        </div>
    )
}
