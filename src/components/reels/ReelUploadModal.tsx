'use client'

import React, { useState, useActionState } from 'react'
import { createReel } from '@/lib/actions/reel'

import { Achievement } from '@/lib/types'

export default function ReelUploadModal({ isOpen, onClose, achievements }: { isOpen: boolean, onClose: () => void, achievements: Achievement[] }) {
    const [state, formAction, isPending] = useActionState(createReel, null)
    const [preview, setPreview] = useState<string | null>(null)
    const [fileType, setFileType] = useState<'video' | 'image' | null>(null)

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0]
        if (file) {
            const url = URL.createObjectURL(file)
            setPreview(url)
            setFileType(file.type.startsWith('video/') ? 'video' : 'image')
        }
    }

    if (!isOpen) return null

    if (state?.success) {
        return (
            <div style={modalOverlayStyle} onClick={onClose}>
                <div style={modalContentStyle} onClick={e => e.stopPropagation()}>
                    <div style={{ textAlign: 'center', padding: '2rem' }}>
                        <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>🎉</div>
                        <h3>Reel Posted!</h3>
                        <p style={{ color: '#a1a1aa', margin: '1rem 0' }}>Your performance proof is now live.</p>
                        <button onClick={onClose} className="btn btn-primary">Done</button>
                    </div>
                </div>
            </div>
        )
    }

    return (
        <div style={modalOverlayStyle} onClick={onClose}>
            <div style={modalContentStyle} onClick={e => e.stopPropagation()}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
                    <h2 style={{ fontSize: '1.5rem', fontWeight: 800 }}>Create New Post</h2>
                    <button onClick={onClose} style={closeButtonStyle}>×</button>
                </div>

                <form action={formAction}>
                    {/* File Upload Area - Instagram Style */}
                    <div style={uploadAreaStyle}>
                        {!preview ? (
                            <label style={uploadLabelStyle}>
                                <input
                                    type="file"
                                    name="file"
                                    accept="video/*,image/*"
                                    onChange={handleFileChange}
                                    style={{ display: 'none' }}
                                    required
                                />
                                <div style={{ textAlign: 'center' }}>
                                    <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>📸</div>
                                    <div style={{ fontSize: '1.1rem', fontWeight: 600, marginBottom: '0.5rem' }}>
                                        Select photos or videos
                                    </div>
                                    <div style={{ fontSize: '0.85rem', color: '#a1a1aa' }}>
                                        or drag and drop
                                    </div>
                                    <button type="button" className="btn btn-primary" style={{ marginTop: '1rem' }}>
                                        Select from computer
                                    </button>
                                </div>
                            </label>
                        ) : (
                            <div style={{ position: 'relative' }}>
                                {fileType === 'video' ? (
                                    <video
                                        src={preview}
                                        controls
                                        style={{ width: '100%', borderRadius: '12px', maxHeight: '400px' }}
                                    />
                                ) : (
                                    <img
                                        src={preview}
                                        alt="Preview"
                                        style={{ width: '100%', borderRadius: '12px', maxHeight: '400px', objectFit: 'contain' }}
                                    />
                                )}
                                <button
                                    type="button"
                                    onClick={() => {
                                        setPreview(null)
                                        setFileType(null)
                                    }}
                                    style={{
                                        position: 'absolute',
                                        top: '10px',
                                        right: '10px',
                                        background: 'rgba(0,0,0,0.7)',
                                        border: 'none',
                                        borderRadius: '50%',
                                        width: '32px',
                                        height: '32px',
                                        color: 'white',
                                        cursor: 'pointer',
                                        fontSize: '1.2rem'
                                    }}
                                >
                                    ×
                                </button>
                            </div>
                        )}
                    </div>

                    {preview && (
                        <>
                            <div style={inputGroupStyle}>
                                <label style={labelStyle}>Caption</label>
                                <textarea
                                    name="caption"
                                    rows={3}
                                    placeholder="Write a caption..."
                                    style={inputStyle}
                                />
                            </div>

                            <div style={inputGroupStyle}>
                                <label style={labelStyle}>Link to Achievement (Optional)</label>
                                <select name="achievementId" style={inputStyle}>
                                    <option value="">Select an achievement</option>
                                    {achievements.map(ach => (
                                        <option key={ach.id} value={ach.id}>
                                            {ach.title} ({new Date(ach.date).toLocaleDateString()})
                                        </option>
                                    ))}
                                </select>
                            </div>
                        </>
                    )}

                    {state?.error && <div style={errorStyle}>{state.error}</div>}

                    {preview && (
                        <div style={{ display: 'flex', gap: '1rem', marginTop: '2rem' }}>
                            <button type="button" onClick={onClose} className="btn btn-outline" style={{ flex: 1 }}>Cancel</button>
                            <button type="submit" className="btn btn-primary" style={{ flex: 1 }} disabled={isPending}>
                                {isPending ? 'Sharing...' : 'Share'}
                            </button>
                        </div>
                    )}
                </form>
            </div>
        </div>
    )
}

const modalOverlayStyle: React.CSSProperties = {
    position: 'fixed',
    inset: 0,
    background: 'rgba(0, 0, 0, 0.85)',
    backdropFilter: 'blur(10px)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 1000,
    padding: '1rem'
}

const modalContentStyle: React.CSSProperties = {
    background: 'linear-gradient(135deg, #111, #1a1a1a)',
    border: '1px solid rgba(255, 255, 255, 0.1)',
    borderRadius: '24px',
    padding: '2rem',
    width: '100%',
    maxWidth: '600px',
    boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.5)',
    maxHeight: '90vh',
    overflowY: 'auto'
}

const closeButtonStyle: React.CSSProperties = {
    background: 'none',
    border: 'none',
    color: '#71717a',
    fontSize: '1.5rem',
    cursor: 'pointer'
}

const uploadAreaStyle: React.CSSProperties = {
    border: '2px dashed rgba(255, 255, 255, 0.2)',
    borderRadius: '16px',
    padding: '3rem 2rem',
    marginBottom: '1.5rem',
    background: 'rgba(255, 255, 255, 0.02)',
    transition: 'all 0.3s'
}

const uploadLabelStyle: React.CSSProperties = {
    display: 'block',
    cursor: 'pointer',
    width: '100%'
}

const inputGroupStyle: React.CSSProperties = {
    marginBottom: '1.25rem'
}

const labelStyle: React.CSSProperties = {
    display: 'block',
    fontSize: '0.85rem',
    color: '#a1a1aa',
    marginBottom: '0.5rem',
    fontWeight: 500
}

const inputStyle: React.CSSProperties = {
    width: '100%',
    background: 'rgba(255, 255, 255, 0.05)',
    border: '1px solid rgba(255, 255, 255, 0.1)',
    borderRadius: '12px',
    padding: '0.8rem 1rem',
    color: 'white',
    fontSize: '0.95rem',
    outline: 'none',
    boxSizing: 'border-box'
}

const errorStyle: React.CSSProperties = {
    color: '#ef4444',
    fontSize: '0.85rem',
    marginTop: '0.5rem',
    textAlign: 'center',
    background: 'rgba(239, 68, 68, 0.1)',
    padding: '0.75rem',
    borderRadius: '8px'
}
