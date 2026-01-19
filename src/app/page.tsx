import Link from 'next/link'

export default function Home() {
  return (
    <main style={{
      minHeight: '100vh',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      textAlign: 'center',
      background: 'radial-gradient(circle at 50% 0%, #1e1b4b 0%, #000 70%)'
    }}>
      <div className="container">
        <h1 style={{ fontSize: '4rem', fontWeight: 800, marginBottom: '0.5rem', letterSpacing: '-0.03em', lineHeight: 1.1 }}>
          <span className="text-gradient">AthleteX</span>
        </h1>
        <p style={{ fontSize: '1.5rem', fontWeight: 500, color: 'white', marginBottom: '2rem' }}>
          The Credibility Network for Athletes
        </p>
        <p style={{ fontSize: '1.1rem', color: '#a1a1aa', maxWidth: '600px', margin: '0 auto 3rem', lineHeight: 1.6 }}>
          Join the first platform where performance is verified, reputation is earned, and careers are built.
          Not just a social network—a verified sports resume.
        </p>

        <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center' }}>
          <Link href="/auth/signup" className="btn btn-primary" style={{ padding: '1rem 2rem', fontSize: '1.1rem' }}>
            Get Verified
          </Link>
          <Link href="/auth/login" className="btn btn-outline" style={{ padding: '1rem 2rem', fontSize: '1.1rem' }}>
            Member Login
          </Link>
        </div>

        <div style={{ marginTop: '4rem', display: 'flex', gap: '2rem', justifyContent: 'center', opacity: 0.5 }}>
          <div>
            <div style={{ fontSize: '2rem', fontWeight: 700 }}>10k+</div>
            <div style={{ fontSize: '0.8rem', textTransform: 'uppercase', letterSpacing: '1px' }}>Athletes</div>
          </div>
          <div>
            <div style={{ fontSize: '2rem', fontWeight: 700 }}>500+</div>
            <div style={{ fontSize: '0.8rem', textTransform: 'uppercase', letterSpacing: '1px' }}>Gyms</div>
          </div>
          <div>
            <div style={{ fontSize: '2rem', fontWeight: 700 }}>Verified</div>
            <div style={{ fontSize: '0.8rem', textTransform: 'uppercase', letterSpacing: '1px' }}>Performance</div>
          </div>
        </div>
      </div>
    </main>
  )
}
