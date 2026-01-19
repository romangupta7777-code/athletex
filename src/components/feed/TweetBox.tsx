'use client'

import { useState } from 'react'

export default function TweetBox({ onPost }: { onPost?: (content: string) => void }) {
    const [content, setContent] = useState('')
    const [isExpanded, setIsExpanded] = useState(false)

    const handlePost = () => {
        if (content.trim()) {
            onPost?.(content)
            setContent('')
            setIsExpanded(false)
        }
    }

    return (
        <div style={{
            background: 'rgba(255, 255, 255, 0.02)',
            border: '1px solid rgba(255, 255, 255, 0.1)',
            borderRadius: '16px',
            padding: '1.5rem',
            marginBottom: '1.5rem'
        }}>
            <div style={{ display: 'flex', gap: '1rem' }}>
                <div style={{
                    width: '40px',
                    height: '40px',
                    borderRadius: '50%',
                    background: 'linear-gradient(45deg, #6366f1, #a855f7)',
                    flexShrink: 0
                }} />

                <div style={{ flex: 1 }}>
                    <textarea
                        value={content}
                        onChange={(e) => setContent(e.target.value)}
                        onFocus={() => setIsExpanded(true)}
                        placeholder="Share your training update, achievement, or thoughts..."
                        style={{
                            width: '100%',
                            background: 'transparent',
                            border: 'none',
                            color: 'white',
                            fontSize: '1rem',
                            resize: 'none',
                            outline: 'none',
                            minHeight: isExpanded ? '100px' : '40px',
                            transition: 'min-height 0.2s'
                        }}
                        rows={isExpanded ? 4 : 1}
                    />

                    {isExpanded && (
                        <div style={{
                            display: 'flex',
                            justifyContent: 'space-between',
                            alignItems: 'center',
                            marginTop: '1rem',
                            paddingTop: '1rem',
                            borderTop: '1px solid rgba(255, 255, 255, 0.05)'
                        }}>
                            <div style={{ display: 'flex', gap: '0.5rem' }}>
                                <button
                                    type="button"
                                    style={{
                                        background: 'none',
                                        border: '1px solid rgba(255, 255, 255, 0.1)',
                                        borderRadius: '8px',
                                        padding: '0.5rem',
                                        color: '#6366f1',
                                        cursor: 'pointer',
                                        fontSize: '1.2rem'
                                    }}
                                    title="Add image"
                                >
                                    📸
                                </button>
                                <button
                                    type="button"
                                    style={{
                                        background: 'none',
                                        border: '1px solid rgba(255, 255, 255, 0.1)',
                                        borderRadius: '8px',
                                        padding: '0.5rem',
                                        color: '#6366f1',
                                        cursor: 'pointer',
                                        fontSize: '1.2rem'
                                    }}
                                    title="Add video"
                                >
                                    🎥
                                </button>
                            </div>

                            <div style={{ display: 'flex', gap: '0.75rem' }}>
                                <button
                                    type="button"
                                    onClick={() => {
                                        setContent('')
                                        setIsExpanded(false)
                                    }}
                                    style={{
                                        background: 'none',
                                        border: 'none',
                                        color: '#a1a1aa',
                                        cursor: 'pointer',
                                        fontSize: '0.9rem',
                                        padding: '0.5rem 1rem'
                                    }}
                                >
                                    Cancel
                                </button>
                                <button
                                    type="button"
                                    onClick={handlePost}
                                    disabled={!content.trim()}
                                    className="btn btn-primary"
                                    style={{
                                        padding: '0.5rem 1.5rem',
                                        fontSize: '0.9rem',
                                        opacity: content.trim() ? 1 : 0.5
                                    }}
                                >
                                    Post
                                </button>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    )
}
