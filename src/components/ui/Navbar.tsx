'use client'

import React from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'

export default function Navbar() {
    const pathname = usePathname()

    // Don't show navbar on reels page as it has its own overlay, or on auth pages
    const isReels = pathname === '/reels'
    const isAuth = pathname.startsWith('/auth')

    if (isReels || isAuth) return null

    return (
        <nav style={navbarStyle}>
            <div className="container" style={navContainerStyle}>
                <Link href="/dashboard" style={logoStyle}>
                    ATHLETEX <span style={{ color: '#6366f1' }}>MVP</span>
                </Link>

                <div style={linksContainerStyle}>
                    <NavLink href="/dashboard" active={pathname === '/dashboard'}>Dashboard</NavLink>
                    <NavLink href="/leaderboard" active={pathname === '/leaderboard'}>Rankings</NavLink>
                    <NavLink href="/reels" active={pathname === '/reels'}>Reels</NavLink>
                </div>

                <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
                    <Link href="/dashboard" style={profileTriggerStyle}>
                        <span>Profile</span>
                    </Link>
                </div>
            </div>
        </nav>
    )
}

function NavLink({ href, children, active }: { href: string, children: React.ReactNode, active: boolean }) {
    return (
        <Link href={href} style={{
            ...navLinkStyle,
            color: active ? '#6366f1' : '#a1a1aa',
            fontWeight: active ? '700' : '500',
        }}>
            {children}
            {active && <div style={activeIndicatorStyle} />}
        </Link>
    )
}

const navbarStyle: React.CSSProperties = {
    position: 'fixed',
    top: 0,
    left: 0,
    right: 0,
    height: '64px',
    backgroundColor: 'rgba(10, 10, 10, 0.8)',
    backdropFilter: 'blur(12px)',
    borderBottom: '1px solid rgba(255, 255, 255, 0.05)',
    zIndex: 1000,
}

const navContainerStyle: React.CSSProperties = {
    height: '100%',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
}

const logoStyle: React.CSSProperties = {
    fontSize: '1.25rem',
    fontWeight: 800,
    letterSpacing: '-0.03em',
    color: 'white',
    textDecoration: 'none',
}

const linksContainerStyle: React.CSSProperties = {
    display: 'flex',
    gap: '2.5rem',
    height: '100%',
    alignItems: 'center',
}

const navLinkStyle: React.CSSProperties = {
    textDecoration: 'none',
    fontSize: '0.9rem',
    transition: 'color 0.2s ease',
    position: 'relative',
    height: '100%',
    display: 'flex',
    alignItems: 'center',
}

const activeIndicatorStyle: React.CSSProperties = {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: '2px',
    backgroundColor: '#6366f1',
    boxShadow: '0 0 10px rgba(99, 102, 241, 0.5)',
}

const profileTriggerStyle: React.CSSProperties = {
    background: 'rgba(255, 255, 255, 0.05)',
    border: '1px solid rgba(255, 255, 255, 0.1)',
    padding: '0.5rem 1rem',
    borderRadius: '100px',
    color: 'white',
    fontSize: '0.85rem',
    fontWeight: 600,
    textDecoration: 'none',
    transition: 'background 0.2s ease',
}
