'use client'

import React, { useState } from 'react'
import { joinGym, leaveGym } from '@/lib/actions/gym'

interface GymActionButtonsProps {
    gymId: string
    isMember: boolean
    isOwner: boolean
}

export default function GymActionButtons({ gymId, isMember, isOwner }: GymActionButtonsProps) {
    const [loading, setLoading] = useState(false)

    if (isOwner) {
        return (
            <button className="btn btn-outline" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                ⚙️ Manage Academy
            </button>
        )
    }

    const handleAction = async () => {
        setLoading(true)
        if (isMember) {
            await leaveGym()
        } else {
            await joinGym(gymId)
        }
        setLoading(false)
    }

    return (
        <button
            onClick={handleAction}
            disabled={loading}
            className={isMember ? "btn btn-outline" : "btn btn-primary"}
            style={{ minWidth: '140px' }}
        >
            {loading ? 'Processing...' : isMember ? 'Leave Academy' : 'Join Academy'}
        </button>
    )
}
