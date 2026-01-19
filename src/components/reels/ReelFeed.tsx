'use client'

import React, { useState, useRef } from 'react'
import ReelCard from './ReelCard'

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export default function ReelFeed({ initialReels }: { initialReels: any[] }) {
    const [reels] = useState(initialReels)
    const [activeIndex, setActiveIndex] = useState(0)
    const containerRef = useRef<HTMLDivElement>(null)

    const handleScroll = () => {
        if (!containerRef.current) return
        const scrollPos = containerRef.current.scrollTop
        const containerHeight = containerRef.current.clientHeight
        const index = Math.round(scrollPos / containerHeight)
        if (index !== activeIndex) {
            setActiveIndex(index)
        }
    }

    if (reels.length === 0) {
        return (
            <div style={{
                minHeight: '400px',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'center',
                alignItems: 'center',
                backgroundColor: 'rgba(255, 255, 255, 0.02)',
                border: '1px solid rgba(255, 255, 255, 0.05)',
                borderRadius: '16px',
                color: '#71717a',
                padding: '2rem',
                textAlign: 'center'
            }}>
                <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>📹</div>
                <h2 style={{ color: 'white' }}>No performance reels yet</h2>
                <p>Be the first to showcase your verified skills.</p>
            </div>
        )
    }

    return (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '1rem' }}>
            {reels.map((reel, index) => (
                <div
                    key={reel.id}
                    style={{
                        height: '450px',
                        borderRadius: '12px',
                        overflow: 'hidden',
                        position: 'relative'
                    }}
                >
                    <ReelCard reel={reel} isActive={index === activeIndex} />
                </div>
            ))}
        </div>
    )
}
