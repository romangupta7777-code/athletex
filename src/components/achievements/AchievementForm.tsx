'use client'

import { useActionState, useState } from 'react'
import { createAchievement } from '@/lib/actions/achievement'

export default function AchievementForm() {
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

    if (state?.success) {
        return (
            <div style={{ textAlign: 'center', padding: '2rem', background: 'rgba(34, 197, 94, 0.1)', borderRadius: '16px', border: '1px solid rgba(34, 197, 94, 0.3)' }}>
                <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>✅</div>
                <h3 style={{ color: '#4ade80', marginBottom: '0.5rem' }}>Achievement Logged!</h3>
                <p style={{ color: '#a1a1aa' }}>Your achievement has been recorded.</p>
            </div>
        )
    }

    return (
        <form action={formAction} style={formStyle}>
            <h3 style={{ fontSize: '1.3rem', fontWeight: 700, marginBottom: '1.5rem' }}>Log New Achievement</h3>

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
    )
}

const formStyle: React.CSSProperties = {
    background: 'rgba(255, 255, 255, 0.02)',
    border: '1px solid rgba(255, 255, 255, 0.1)',
    borderRadius: '16px',
    padding: '1.5rem'
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
