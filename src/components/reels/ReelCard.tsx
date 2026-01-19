'use client'

import React, { useState, useRef, useEffect } from 'react'
import { toggleLike, postComment } from '@/lib/actions/reel'
import VerificationBadge from '@/components/verification/VerificationBadge'

interface ReelCardProps {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    reel: any
    isActive: boolean
}

export default function ReelCard({ reel, isActive }: ReelCardProps) {
    const [liked, setLiked] = useState(false)
    const [likesCount, setLikesCount] = useState(reel._count?.likes || 0)
    const [showComments, setShowComments] = useState(false)
    const videoRef = useRef<HTMLVideoElement>(null)

    useEffect(() => {
        if (isActive && videoRef.current) {
            videoRef.current.play().catch(_e => console.log("Auto-play blocked"))
        } else if (videoRef.current) {
            videoRef.current.pause()
            videoRef.current.currentTime = 0
        }
    }, [isActive])

    const handleLike = async () => {
        const result = await toggleLike(reel.id)
        if (result.error) return
        if (typeof result.liked === 'boolean') {
            setLiked(result.liked)
            setLikesCount((prev: number) => result.liked ? prev + 1 : prev - 1)
        }
    }

    return (
        <div style={{
            height: '100%',
            width: '100%',
            backgroundColor: '#000',
            position: 'relative',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            alignItems: 'center',
            scrollSnapAlign: 'start'
        }}>
            <video
                ref={videoRef}
                src={reel.videoUrl}
                loop
                muted
                playsInline
                style={{
                    height: '100%',
                    width: '100%',
                    objectFit: 'cover'
                }}
            />

            {/* Overlay Info */}
            <div style={{
                position: 'absolute',
                bottom: '20px',
                left: '20px',
                right: '80px',
                zIndex: 10,
                color: 'white',
                textShadow: '0 2px 4px rgba(0,0,0,0.5)'
            }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
                    <div style={{
                        width: '40px',
                        height: '40px',
                        borderRadius: '50%',
                        background: 'linear-gradient(45deg, #6366f1, #a855f7)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontWeight: 700,
                        border: '2px solid white'
                    }}>
                        {reel.profile.displayName[0].toUpperCase()}
                    </div>
                    <div>
                        <div style={{ fontWeight: 700, display: 'flex', alignItems: 'center', gap: '4px' }}>
                            {reel.profile.displayName}
                            <VerificationBadge isVerified={reel.profile.isVerified} badge={reel.profile.verificationBadge} size="sm" />
                        </div>
                        <div style={{ fontSize: '0.85rem', opacity: 0.8 }}>@{reel.profile.username}</div>
                    </div>
                </div>
                {reel.caption && (
                    <p style={{ fontSize: '0.95rem', margin: '8px 0', lineHeight: 1.4 }}>
                        {reel.caption}
                    </p>
                )}
                {reel.achievements && reel.achievements.length > 0 && (
                    <div style={{ display: 'flex', gap: '8px', marginTop: '8px' }}>
                        {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
                        {reel.achievements.map((ach: any) => (
                            <span key={ach.id} style={{
                                background: 'rgba(255,255,255,0.2)',
                                backdropFilter: 'blur(10px)',
                                padding: '4px 10px',
                                borderRadius: '100px',
                                fontSize: '0.75rem',
                                fontWeight: 600,
                                border: '1px solid rgba(255,255,255,0.2)'
                            }}>
                                🏆 {ach.title}
                            </span>
                        ))}
                    </div>
                )}
            </div>

            {/* Sidebar Actions */}
            <div style={{
                position: 'absolute',
                right: '15px',
                bottom: '100px',
                display: 'flex',
                flexDirection: 'column',
                gap: '20px',
                alignItems: 'center',
                zIndex: 10
            }}>
                <ActionButton
                    icon={liked ? "❤️" : "🤍"}
                    label={likesCount.toString()}
                    onClick={handleLike}
                    active={liked}
                />
                <ActionButton
                    icon="💬"
                    label={reel._count?.comments.toString()}
                    onClick={() => setShowComments(!showComments)}
                />
                <ActionButton icon="🔗" label="Share" onClick={() => { }} />
            </div>
        </div>
    )
}

function ActionButton({ icon, label, onClick, active = false }: { icon: string, label: string, onClick: () => void, active?: boolean }) {
    return (
        <button
            onClick={onClick}
            style={{
                background: 'none',
                border: 'none',
                color: 'white',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                gap: '4px',
                cursor: 'pointer',
                textShadow: '0 2px 4px rgba(0,0,0,0.5)'
            }}
        >
            <span style={{
                fontSize: '1.8rem',
                filter: active ? 'drop-shadow(0 0 8px rgba(239, 68, 68, 0.5))' : 'none'
            }}>{icon}</span>
            <span style={{ fontSize: '0.75rem', fontWeight: 600 }}>{label}</span>
        </button>
    )
}
