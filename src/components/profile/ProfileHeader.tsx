'use client'

import { useState } from 'react'
import EditProfile from './EditProfileForm'
import VerificationBadge from '../verification/VerificationBadge'
import VerificationRequestForm from '../verification/VerificationRequestForm'
import { logout } from '@/lib/actions/auth'

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export default function ProfileHeader({ profile, userRole }: { profile: any, userRole?: string }) {
    const [isEditing, setIsEditing] = useState(false)
    const [isRequestingVerification, setIsRequestingVerification] = useState(false)

    const canRequestVerification = (userRole === 'COACH' || userRole === 'GYM') && !profile.isVerified

    // Fallback avatar
    const initial = profile.displayName ? profile.displayName[0].toUpperCase() : '?'

    return (
        <header style={{ marginBottom: '3rem' }}>
            <div style={{ display: 'grid', gridTemplateColumns: 'min-content 1fr', gap: '2rem', alignItems: 'start' }}>
                {/* Avatar Column */}
                <div style={{ padding: '0 1rem' }}>
                    <div style={{
                        width: '150px',
                        height: '150px',
                        borderRadius: '50%',
                        background: profile.avatarUrl ? `url(${profile.avatarUrl}) center/cover` : 'linear-gradient(45deg, #6366f1, #a855f7)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontSize: '4rem',
                        fontWeight: 700,
                        color: 'white',
                        border: '2px solid #000',
                        boxShadow: '0 0 0 2px rgba(255,255,255,0.1)'
                    }}>
                        {!profile.avatarUrl && initial}
                    </div>
                </div>

                {/* Info Column */}
                <div style={{ paddingTop: '0.5rem' }}>
                    {/* Top Row: Username + Actions */}
                    <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem', marginBottom: '1.5rem', flexWrap: 'wrap' }}>
                        <h2 style={{ fontSize: '1.25rem', fontWeight: 400, margin: 0 }}>{profile.username}</h2>
                        <VerificationBadge isVerified={profile.isVerified} badge={profile.verificationBadge} size="md" />

                        <div style={{ display: 'flex', gap: '0.5rem' }}>
                            <button onClick={() => setIsEditing(true)} className="btn btn-outline" style={{ padding: '0.4rem 1rem', fontSize: '0.9rem', height: 'auto' }}>
                                Edit Profile
                            </button>

                            {canRequestVerification && (
                                <button onClick={() => setIsRequestingVerification(true)} className="btn btn-primary" style={{ padding: '0.4rem 1rem', fontSize: '0.9rem', height: 'auto' }}>
                                    Verify
                                </button>
                            )}

                            <form action={logout}>
                                <button type="submit" className="btn btn-outline" style={{ padding: '0.4rem 1rem', fontSize: '0.9rem', height: 'auto', borderColor: 'rgba(239, 68, 68, 0.3)', color: '#ef4444' }}>
                                    Sign Out
                                </button>
                            </form>
                        </div>
                    </div>

                    {/* Stats Row */}
                    <div style={{ display: 'flex', gap: '2.5rem', marginBottom: '1.5rem', fontSize: '1rem' }}>
                        <div style={{ display: 'flex', gap: '0.3rem' }}>
                            <span style={{ fontWeight: 700 }}>{profile._count?.achievements || 0}</span>
                            <span style={{ color: '#a1a1aa' }}>posts</span>
                        </div>
                        <div style={{ display: 'flex', gap: '0.3rem' }}>
                            <span style={{ fontWeight: 700 }}>{profile.followerCount || 0}</span>
                            <span style={{ color: '#a1a1aa' }}>followers</span>
                        </div>
                        <div style={{ display: 'flex', gap: '0.3rem' }}>
                            <span style={{ fontWeight: 700 }}>{profile.followingCount || 0}</span>
                            <span style={{ color: '#a1a1aa' }}>following</span>
                        </div>
                    </div>

                    {/* Bio & Details */}
                    <div>
                        <div style={{ fontWeight: 600, marginBottom: '0.25rem' }}>{profile.displayName}</div>

                        {/* Tags / Category */}
                        <div style={{ color: '#a1a1aa', marginBottom: '0.5rem', fontSize: '0.9rem' }}>
                            {userRole === 'GYM' ? 'Training Center' : profile.sport || 'Athlete'}
                        </div>

                        <div style={{ whiteSpace: 'pre-wrap', lineHeight: 1.5, marginBottom: '0.5rem' }}>
                            {profile.bio}
                        </div>

                        {profile.gym && (
                            <a href={`/gym/${profile.gym.username}`} style={{ color: '#bae6fd', textDecoration: 'none', fontSize: '0.9rem' }}>
                                📍 {profile.gym.displayName}
                            </a>
                        )}
                    </div>
                </div>
            </div>

            <EditProfile user={profile} userRole={userRole} isOpen={isEditing} onClose={() => setIsEditing(false)} />
            <VerificationRequestForm isOpen={isRequestingVerification} onClose={() => setIsRequestingVerification(false)} />
        </header>
    )
}
