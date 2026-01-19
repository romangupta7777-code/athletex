import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'
import { prisma } from '@/lib/prisma'
import VerificationRequestList from '@/components/admin/VerificationRequestList'

export const dynamic = 'force-dynamic'

export default async function AdminVerificationsPage() {
    const cookieStore = await cookies()
    const userId = cookieStore.get('userId')?.value

    if (!userId) {
        redirect('/auth/login')
    }

    const user = await prisma.user.findUnique({
        where: { id: userId }
    })

    // Only admins can access this page
    if (!user || user.role !== 'ADMIN') {
        redirect('/dashboard')
    }

    return (
        <div className="container" style={{ paddingTop: '4rem', paddingBottom: '4rem' }}>
            <header style={{ marginBottom: '3rem' }}>
                <h1 style={{ fontSize: '2.5rem', fontWeight: 800, letterSpacing: '-0.02em', marginBottom: '0.5rem' }}>
                    Verification Requests
                </h1>
                <p style={{ color: '#a1a1aa', fontSize: '1.1rem' }}>
                    Review and approve verification requests from coaches and gyms
                </p>
            </header>

            <VerificationRequestList />
        </div>
    )
}
