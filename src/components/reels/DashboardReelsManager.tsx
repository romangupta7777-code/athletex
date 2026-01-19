'use client'

import React, { useState } from 'react'
import ReelUploadModal from '@/components/reels/ReelUploadModal'

import { Achievement } from '@/lib/types'

export default function DashboardReelsManager({ achievements }: { achievements: Achievement[] }) {
    const [isUploading, setIsUploading] = useState(false)

    return (
        <div style={{ marginTop: '2rem' }}>
            <div style={{
                background: 'linear-gradient(135deg, rgba(99, 102, 241, 0.1), rgba(168, 85, 247, 0.1))',
                border: '1px solid rgba(99, 102, 241, 0.2)',
                padding: '1.5rem',
                borderRadius: '16px',
                textAlign: 'center'
            }}>
                <div style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>📹</div>
                <h3 style={{ fontSize: '1.1rem', fontWeight: 700, marginBottom: '0.5rem' }}>Showcase Your Skills</h3>
                <p style={{ fontSize: '0.85rem', color: '#a1a1aa', marginBottom: '1rem' }}>
                    Post a short video reel to prove your achievements and climb the rankings.
                </p>
                <div style={{ display: 'flex', gap: '0.75rem' }}>
                    <button
                        onClick={() => setIsUploading(true)}
                        className="btn btn-primary"
                        style={{ flex: 1, fontSize: '0.9rem' }}
                    >
                        Post Reel
                    </button>
                    <a
                        href="/reels"
                        className="btn btn-outline"
                        style={{ flex: 1, fontSize: '0.9rem', textDecoration: 'none', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                    >
                        View Feed
                    </a>
                </div>
            </div>

            <ReelUploadModal
                isOpen={isUploading}
                onClose={() => setIsUploading(false)}
                achievements={achievements}
            />
        </div>
    )
}
