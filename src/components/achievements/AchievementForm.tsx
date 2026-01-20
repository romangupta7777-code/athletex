'use client'

import { useActionState, useState, useEffect } from 'react'
import { createAchievement } from '@/lib/actions/achievement'

interface AchievementFormProps {
    isOpen: boolean
    onClose: () => void
}

export default function AchievementForm({ isOpen, onClose }: AchievementFormProps) {
    const [state, formAction, isPending] = useActionState(createAchievement, undefined)
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

    // Close modal on successful submission
    useEffect(() => {
        if (state?.success) {
            setTimeout(() => {
                onClose()
                setPreview(null)
                setFileType(null)
            }, 2000)
        }
    }, [state?.success, onClose])

    if (!isOpen) return null

    if (state?.success) {
        return (
            <div style={modalOverlayStyle} onClick={onClose}>
                <div style={{ ...modalContentStyle, maxWidth: '400px' }} onClick={(e) => e.stopPropagation()}>
                    <div style={{ textAlign: 'center', padding: '2rem', background: 'rgba(34, 197, 94, 0.1)', borderRadius: '16px', border: '1px solid rgba(34, 197, 94, 0.3)' }}>
                        <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>✅</div>
                        <h3 style={{ color: '#4ade80', marginBottom: '0.5rem' }}>Achievement Logged!</h3>
                        <p style={{ color: '#a1a1aa' }}>Your achievement has been recorded.</p>
                    </div>
                </div>
            </div>
        )
    }

    return (
        <div style={modalOverlayStyle} onClick={onClose}>
            <div style={modalContentStyle} onClick={(e) => e.stopPropagation()}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
                    <h3 style={{ fontSize: '1.3rem', fontWeight: 700 }}>Log New Achievement</h3>
                    <button
                        type="button"
                        onClick={onClose}
                        style={{
                            background: 'none',
                            border: 'none',
                            color: '#a1a1aa',
                            fontSize: '1.5rem',
                            cursor: 'pointer',
                            padding: '0',
                            width: '32px',
                            height: '32px',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center'
                        }}
                    >
                        ×
                    </button>
                </div>
                <form action={formAction} style={formStyle}>
                    <div style={inputGroupStyle}>
                        <label style={labelStyle}>Achievement Type *</label>
                        <select name="type" required style={inputStyle}>
                            <option value="">Select type</option>
                            <option value="LIFT">Lift / Strength</option>
                            <option value="TIME">Time / Endurance</option>
                            <option value="SCORE">Score / Points</option>
                            <option value="PLACEMENT">Placement / Ranking</option>
                            <option value="FIGHT_RECORD">Fight Record</option>
                            <option value="CUSTOM">Other</option>
                        </select>
                    </div>

                    <div style={inputGroupStyle}>
                        <label style={labelStyle}>Title *</label>
                        <input name="title" type="text" required placeholder="e.g., Deadlift 200kg" style={inputStyle} />
                    </div>

                    <div style={inputGroupStyle}>
                        <label style={labelStyle}>Date *</label>
                        <input name="date" type="date" required style={inputStyle} />
                    </div>

                    {/* Instagram-style file upload */}
                    <div style={inputGroupStyle}>
                        <label style={labelStyle}>Proof (Image/Video)</label>
                        {!preview ? (
                            <label style={uploadAreaStyle}>
                                <input
                                    name="file"
                                    type="file"
                                    accept="image/*,video/*"
                                    onChange={handleFileChange}
                                    style={{ display: 'none' }}
                                />
                                <div style={{ textAlign: 'center' }}>
                                    <div style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>📸</div>
                                    <div style={{ fontSize: '0.9rem', fontWeight: 600, marginBottom: '0.25rem' }}>
                                        Add photo or video
                                    </div>
                                    <div style={{ fontSize: '0.75rem', color: '#71717a' }}>
                                        Click to upload
                                    </div>
                                </div>
                            </label>
                        ) : (
                            <div style={{ position: 'relative', marginBottom: '1rem' }}>
                                {fileType === 'video' ? (
                                    <video
                                        src={preview}
                                        controls
                                        style={{ width: '100%', borderRadius: '12px', maxHeight: '300px' }}
                                    />
                                ) : (
                                    <img
                                        src={preview}
                                        alt="Preview"
                                        style={{ width: '100%', borderRadius: '12px', maxHeight: '300px', objectFit: 'cover' }}
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
                                        top: '8px',
                                        right: '8px',
                                        background: 'rgba(0,0,0,0.7)',
                                        border: 'none',
                                        borderRadius: '50%',
                                        width: '28px',
                                        height: '28px',
                                        color: 'white',
                                        cursor: 'pointer',
                                        fontSize: '1.1rem'
                                    }}
                                >
                                    ×
                                </button>
                            </div>
                        )}
                    </div>

                    <div style={inputGroupStyle}>
                        <label style={labelStyle}>Description / Notes</label>
                        <textarea name="description" rows={2} style={{ ...inputStyle, resize: 'vertical' }} />
                    </div>

                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                        <div>
                            <label style={labelStyle}>Value</label>
                            <input name="metricValue" type="text" placeholder="e.g., 200" style={inputStyle} />
                        </div>
                        <div>
                            <label style={labelStyle}>Unit</label>
                            <input name="metricUnit" type="text" placeholder="e.g., kg" style={inputStyle} />
                        </div>
                    </div>

                    {state?.error && (
                        <div style={{
                            background: 'rgba(239, 68, 68, 0.1)',
                            border: '1px solid rgba(239, 68, 68, 0.3)',
                            borderRadius: '8px',
                            padding: '0.75rem',
                            color: '#f87171',
                            fontSize: '0.9rem',
                            marginTop: '1rem'
                        }}>
                            {state.error}
                        </div>
                    )}

                    <button
                        type="submit"
                        disabled={isPending}
                        className="btn btn-primary"
                        style={{ width: '100%', marginTop: '1.5rem', padding: '0.9rem' }}
                    >
                        {isPending ? 'Logging...' : 'Log Achievement'}
                    </button>
                </form>
            </div>
        </div>
    )
}

const modalOverlayStyle: React.CSSProperties = {
    position: 'fixed',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    background: 'rgba(0, 0, 0, 0.8)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 1000,
    padding: '1rem'
}

const modalContentStyle: React.CSSProperties = {
    background: '#18181b',
    borderRadius: '20px',
    padding: '2rem',
    maxWidth: '600px',
    width: '100%',
    maxHeight: '90vh',
    overflowY: 'auto',
    border: '1px solid rgba(255, 255, 255, 0.1)'
}

const formStyle: React.CSSProperties = {
    background: 'transparent'
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
    borderRadius: '10px',
    padding: '0.75rem',
    color: 'white',
    fontSize: '0.95rem',
    outline: 'none',
    boxSizing: 'border-box'
}

const uploadAreaStyle: React.CSSProperties = {
    display: 'block',
    border: '2px dashed rgba(255, 255, 255, 0.2)',
    borderRadius: '12px',
    padding: '2rem 1rem',
    background: 'rgba(255, 255, 255, 0.02)',
    cursor: 'pointer',
    transition: 'all 0.3s',
    textAlign: 'center'
}
