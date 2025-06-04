import { redirect } from 'next/navigation'
import DashboardNav from '../../components/dashboard/DashboardNav'
import { useAuth } from '../../lib/hooks/useAuth'

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const { user, loading } = useAuth()

  if (!loading && !user) {
    redirect('/auth/login')
  }

  return (
    <div className="flex h-full">
      <DashboardNav />
      <div className="flex-1 overflow-y-auto">
        <main className="py-10">
          <div className="px-4 sm:px-6 lg:px-8">{children}</div>
        </main>
      </div>
    </div>
  )
} 