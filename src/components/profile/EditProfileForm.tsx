'use client'

import { useActionState } from 'react'
import { updateProfile } from '@/lib/actions/profile'
import Modal from '@/components/ui/Modal'

import { Profile } from '@/lib/types'

export default function EditProfile({ user, userRole, isOpen, onClose }: { user: Profile, userRole?: string, isOpen: boolean, onClose: () => void }) {
    const [state, action, isPending] = useActionState(updateProfile, undefined)

    const isAthlete = userRole === 'ATHLETE' || userRole === 'COACH'

    const inputStyle = {
        width: '100%',
        padding: '0.75rem',
        background: 'rgba(255, 255, 255, 0.05)',
        border: '1px solid rgba(255, 255, 255, 0.1)',
        borderRadius: '8px',
        color: 'white',
        marginBottom: '1rem',
        fontSize: '0.95rem'
    }

    const labelStyle = {
        display: 'block',
        marginBottom: '0.4rem',
        fontSize: '0.85rem',
        color: '#d4d4d8'
    }

    return (
        <Modal isOpen={isOpen} onClose={onClose} title="Edit Profile">
            <form action={action}>
                <div>
                    <label style={labelStyle}>{isAthlete ? 'Display Name' : 'Academy Name'}</label>
                    <input name="displayName" defaultValue={user.displayName} style={inputStyle} />
                </div>

                <div>
                    <label style={labelStyle}>{isAthlete ? 'Bio' : 'Description / Mission'}</label>
                    <textarea name="bio" defaultValue={user.bio ?? ''} rows={3} style={{ ...inputStyle, resize: 'vertical' }} />
                </div>

                {isAthlete && (
                    <>
                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                            <div>
                                <label style={labelStyle}>Sport</label>
                                <input name="sport" defaultValue={user.sport ?? ''} placeholder="e.g. Weightlifting" style={inputStyle} />
                            </div>
                            <div>
                                <label style={labelStyle}>Discipline / Class</label>
                                <input name="discipline" defaultValue={user.discipline ?? ''} placeholder="e.g. 81kg" style={inputStyle} />
                            </div>
                        </div>

                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                            <div>
                                <label style={labelStyle}>Weight (kg)</label>
                                <input name="weight" type="number" step="0.1" defaultValue={user.weight ?? ''} style={inputStyle} />
                            </div>
                            <div>
                                <label style={labelStyle}>Height (cm)</label>
                                <input name="height" type="number" step="0.1" defaultValue={user.height ?? ''} style={inputStyle} />
                            </div>
                        </div>
                    </>
                )}

                <div>
                    <label style={labelStyle}>Location</label>
                    <input name="location" defaultValue={user.location ?? ''} style={inputStyle} />
                </div>

                <div style={{ marginTop: '1rem', display: 'flex', gap: '1rem' }}>
                    <button type="submit" disabled={isPending} className="btn btn-primary" style={{ flex: 1 }}>
                        {isPending ? 'Saving...' : 'Save Changes'}
                    </button>
                    <button type="button" onClick={onClose} className="btn btn-outline" style={{ flex: 1 }}>
                        Cancel
                    </button>
                </div>

                {state?.success && <p style={{ color: '#4ade80', marginTop: '1rem', textAlign: 'center' }}>Saved successfully!</p>}
            </form>
        </Modal>
    )
}
