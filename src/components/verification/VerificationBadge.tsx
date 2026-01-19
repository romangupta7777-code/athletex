export default function VerificationBadge({
    isVerified,
    badge,
    size = 'sm'
}: {
    isVerified: boolean
    badge?: string | null
    size?: 'sm' | 'md' | 'lg'
}) {
    if (!isVerified) return null

    const sizes = {
        sm: { icon: '0.9rem', padding: '2px 6px', fontSize: '0.7rem' },
        md: { icon: '1.1rem', padding: '4px 8px', fontSize: '0.8rem' },
        lg: { icon: '1.3rem', padding: '6px 10px', fontSize: '0.9rem' }
    }

    const style = sizes[size]

    return (
        <span
            style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '4px',
                background: 'rgba(59, 130, 246, 0.15)',
                color: '#60a5fa',
                padding: style.padding,
                borderRadius: '100px',
                fontSize: style.fontSize,
                fontWeight: 600,
                border: '1px solid rgba(59, 130, 246, 0.3)'
            }}
            title="Verified Account"
        >
            <span style={{ fontSize: style.icon }}>✓</span>
            {badge && badge !== 'VERIFIED' && <span>{badge.replace('_', ' ')}</span>}
        </span>
    )
}
