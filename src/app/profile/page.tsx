import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'
import { prisma } from '@/lib/prisma'
import ProfileHeader from '@/components/profile/ProfileHeader'
import AchievementManager from '@/components/achievements/AchievementManager'
import ProfileTabs from '@/components/profile/ProfileTabs'

export const dynamic = 'force-dynamic'

export default async function ProfilePage() {
    const cookieStore = await cookies()
    const userId = cookieStore.get('userId')?.value

    if (!userId) {
        redirect('/auth/login')
    }

    const user = await prisma.user.findUnique({
        where: { id: userId },
        include: {
            profile: {
                include: {
                    achievements: {
                        orderBy: { date: 'desc' }
                    },
                    reels: {
                        orderBy: { createdAt: 'desc' },
                        include: {
                            _count: {
                                select: { likes: true, comments: true }
                            }
                        }
                    },
                    gym: true,
                    _count: {
                        select: { members: true, achievements: true }
                    }
                }
            }
        }
    })

    if (!user || !user.profile) {
        redirect('/auth/login')
    }

    return (
        <div className="container" style={{ paddingTop: '2rem', paddingBottom: '4rem', maxWidth: '935px' }}>
            <ProfileHeader profile={user.profile} userRole={user.role} />

            <div style={{ marginTop: '3rem' }}>
                <ProfileTabs
                    achievements={user.profile.achievements}
                    reels={user.profile.reels}
                    userProfile={user.profile}
                />
            </div>
        </div>
    )
}
