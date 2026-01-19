'use client'

import React, { useState, useEffect } from 'react'
import LeaderboardTable from '@/components/leaderboard/LeaderboardTable'
import LeaderboardFilters from '@/components/leaderboard/LeaderboardFilters'
import { getLeaderboard, getLeaderboardFilters } from '@/lib/actions/leaderboard'

export default function LeaderboardPageClient() {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const [athletes, setAthletes] = useState<any[]>([])
    const [filters, setFilters] = useState<{ sports: string[], locations: string[] }>({ sports: [], locations: [] })
    const [activeFilters, setActiveFilters] = useState<{ sport?: string; location?: string }>({ sport: '', location: '' })
    const [type, setType] = useState<'ATHLETE' | 'GYM'>('ATHLETE')
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        async function loadInitialData() {
            setLoading(true)
            const [data, availableFilters] = await Promise.all([
                getLeaderboard({ type: 'ATHLETE' }),
                getLeaderboardFilters()
            ])
            setAthletes(data)
            setFilters(availableFilters)
            setLoading(false)
        }
        loadInitialData()
    }, [])

    useEffect(() => {
        async function applyFilters() {
            setLoading(true)
            const data = await getLeaderboard({ ...activeFilters, type })
            setAthletes(data || [])
            setLoading(false)
        }
        applyFilters()
    }, [activeFilters, type])

    return (
        <div className="container" style={{ paddingTop: '4rem', paddingBottom: '6rem' }}>
            <header style={{ marginBottom: '3rem' }}>
                <h1 style={{ fontSize: '3.5rem', fontWeight: 800, letterSpacing: '-0.02em', marginBottom: '0.5rem', background: 'linear-gradient(to right, #fff, #71717a)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
                    Elite Rankings
                </h1>
                <p style={{ color: '#a1a1aa', fontSize: '1.2rem', maxWidth: '600px', lineHeight: 1.6 }}>
                    The global standard for verified athletic performance. Compete with the best to earn your place at the top.
                </p>
            </header>

            <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '2rem', gap: '1rem' }}>
                <button
                    onClick={() => setType('ATHLETE')}
                    className={type === 'ATHLETE' ? 'btn btn-primary' : 'btn btn-outline'}
                    style={{ minWidth: '120px' }}
                >
                    Athletes
                </button>
                <button
                    onClick={() => setType('GYM')}
                    className={type === 'GYM' ? 'btn btn-primary' : 'btn btn-outline'}
                    style={{ minWidth: '120px' }}
                >
                    Gyms / Academies
                </button>
            </div>

            <LeaderboardFilters
                sports={filters.sports}
                locations={filters.locations}
                activeFilters={activeFilters}
                onFilterChange={setActiveFilters}
            />

            <div style={{
                background: 'rgba(255, 255, 255, 0.02)',
                border: '1px solid rgba(255, 255, 255, 0.05)',
                borderRadius: '24px',
                padding: '1px', // Border gradient effect
                minHeight: '400px',
                position: 'relative',
                overflow: 'hidden'
            }}>
                <div style={{
                    background: '#0a0a0a',
                    borderRadius: '23px',
                    padding: '1.5rem',
                    minHeight: '400px'
                }}>
                    {loading && (
                        <div style={{
                            position: 'absolute',
                            inset: 0,
                            background: 'rgba(0,0,0,0.5)',
                            backdropFilter: 'blur(8px)',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            zIndex: 10,
                            borderRadius: '24px'
                        }}>
                            <div style={{
                                color: 'white',
                                fontWeight: 600,
                                background: 'rgba(255,255,255,0.1)',
                                padding: '1rem 2rem',
                                borderRadius: '100px',
                                border: '1px solid rgba(255,255,255,0.1)'
                            }}>
                                Syncing Rankings...
                            </div>
                        </div>
                    )}

                    <LeaderboardTable athletes={athletes} type={type} />
                </div>
            </div>
        </div>
    )
}
