import { getPosts } from '@/lib/actions/post'
import { getCurrentUser } from '@/lib/auth'
import { redirect } from 'next/navigation'
import TweetBox from '@/components/feed/TweetBox'
import TweetCard from '@/components/feed/TweetCard'

export const metadata = {
    title: 'Community Feed - AthleteX',
    description: 'Connect with athletes worldwide'
}

export default async function FeedPage() {
    const user = await getCurrentUser()
    if (!user) {
        redirect('/auth/login')
    }

    const posts = await getPosts()

    return (
        <div style={{
            minHeight: '100vh',
            background: 'linear-gradient(to bottom, #0a0a0a, #1a1a2e)',
            padding: '2rem'
        }}>
            <div style={{
                maxWidth: '800px',
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
                    Community Feed
                </h1>

                <TweetBox />

                <div style={{ marginTop: '2rem' }}>
                    {posts.length === 0 ? (
                        <div style={{
                            textAlign: 'center',
                            padding: '4rem 2rem',
                            background: 'rgba(255, 255, 255, 0.02)',
                            border: '1px solid rgba(255, 255, 255, 0.1)',
                            borderRadius: '16px',
                            color: '#71717a'
                        }}>
                            <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>📝</div>
                            <h2 style={{ color: 'white', marginBottom: '0.5rem' }}>No posts yet</h2>
                            <p>Be the first to share your training journey!</p>
                        </div>
                    ) : (
                        posts.map(post => (
                            <TweetCard key={post.id} tweet={post} />
                        ))
                    )}
                </div>
            </div>
        </div>
    )
}
