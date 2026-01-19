'use client'

import React from 'react'

export default function LeaderboardFilters({
    sports,
    locations,
    onFilterChange,
    activeFilters
}: {
    sports: string[],
    locations: string[],
    onFilterChange: (filters: { sport?: string; location?: string }) => void,
    activeFilters: { sport?: string; location?: string }
}) {
    return (
        <div style={{
            display: 'flex',
            gap: '1rem',
            marginBottom: '2rem',
            padding: '1.5rem',
            background: 'rgba(255, 255, 255, 0.02)',
            border: '1px solid rgba(255, 255, 255, 0.05)',
            borderRadius: '16px',
            flexWrap: 'wrap'
        }}>
            <div style={{ minWidth: '200px', flex: 1 }}>
                <label style={{ display: 'block', fontSize: '0.75rem', color: '#71717a', marginBottom: '0.5rem', textTransform: 'uppercase' }}>Filter by Sport</label>
                <select
                    value={activeFilters.sport || ''}
                    onChange={(e) => onFilterChange({ ...activeFilters, sport: e.target.value })}
                    style={{
                        width: '100%',
                        background: 'rgba(255, 255, 255, 0.05)',
                        border: '1px solid rgba(255, 255, 255, 0.1)',
                        borderRadius: '8px',
                        padding: '0.6rem 0.75rem',
                        color: 'white',
                        fontSize: '0.9rem',
                        outline: 'none'
                    }}
                >
                    <option value="">All Sports</option>
                    {sports.map(sport => (
                        <option key={sport} value={sport}>{sport}</option>
                    ))}
                </select>
            </div>

            <div style={{ minWidth: '200px', flex: 1 }}>
                <label style={{ display: 'block', fontSize: '0.75rem', color: '#71717a', marginBottom: '0.5rem', textTransform: 'uppercase' }}>Filter by Location</label>
                <select
                    value={activeFilters.location || ''}
                    onChange={(e) => onFilterChange({ ...activeFilters, location: e.target.value })}
                    style={{
                        width: '100%',
                        background: 'rgba(255, 255, 255, 0.05)',
                        border: '1px solid rgba(255, 255, 255, 0.1)',
                        borderRadius: '8px',
                        padding: '0.6rem 0.75rem',
                        color: 'white',
                        fontSize: '0.9rem',
                        outline: 'none'
                    }}
                >
                    <option value="">Global</option>
                    {locations.map(location => (
                        <option key={location} value={location}>{location}</option>
                    ))}
                </select>
            </div>

            <button
                onClick={() => onFilterChange({})}
                className="btn btn-outline"
                style={{ alignSelf: 'flex-end', padding: '0.6rem 1rem', fontSize: '0.9rem' }}
            >
                Reset
            </button>
        </div>
    )
}
