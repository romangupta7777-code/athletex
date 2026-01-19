import ReelFeed from '@/components/reels/ReelFeed'
import { getReels } from '@/lib/actions/reel'

export const dynamic = 'force-dynamic'

export default async function ReelsPage() {
    const reels = await getReels()

    return (
        <main style={{
            height: '100vh',
            backgroundColor: '#000',
            overflow: 'hidden',
            position: 'relative'
        }}>
            {/* Top Navigation Overlay */}
            <div style={{
                position: 'fixed',
                top: 0,
                left: 0,
                right: 0,
                zIndex: 100,
                padding: '1.5rem',
                background: 'linear-gradient(to bottom, rgba(0,0,0,0.7), transparent)',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center'
            }}>
                <a href="/dashboard" style={{ color: 'white', textDecoration: 'none', fontWeight: 800, fontSize: '1.5rem', letterSpacing: '-0.05em' }}>
                    ATHLETEX <span style={{ color: '#6366f1' }}>REELS</span>
                </a>
                <div style={{ display: 'flex', gap: '1rem' }}>
                    <a href="/leaderboard" style={{ color: 'white', textDecoration: 'none', fontSize: '0.9rem', fontWeight: 600 }}>🏆 Rankings</a>
                </div>
            </div>

            <ReelFeed initialReels={reels} />

            {/* Bottom Tab Bar Overlay (Simplified for Desktop/Web) */}
            <div style={{
                position: 'fixed',
                bottom: 0,
                left: 0,
                right: 0,
                zIndex: 100,
                padding: '1rem',
                background: 'linear-gradient(to top, rgba(0,0,0,0.7), transparent)',
                display: 'flex',
                justifyContent: 'center',
                gap: '3rem'
            }}>
                <NavIcon href="/dashboard" icon="🏠" label="Home" />
                <NavIcon href="/reels" icon="📹" label="Reels" active />
                <NavIcon href="/leaderboard" icon="🏆" label="Elite" />
            </div>
        </main>
    )
}

function NavIcon({ href, icon, label, active = false }: { href: string, icon: string, label: string, active?: boolean }) {
    return (
        <a href={href} style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: '4px',
            textDecoration: 'none',
            color: active ? 'white' : '#71717a',
            fontSize: '0.75rem',
            fontWeight: 600
        }}>
            <span style={{ fontSize: '1.5rem', opacity: active ? 1 : 0.6 }}>{icon}</span>
            {label}
        </a>
    )
}
