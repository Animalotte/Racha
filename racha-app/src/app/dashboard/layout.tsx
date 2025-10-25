"use client"

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/components/providers/auth-provider'
import { DashboardNavigation } from '@/components/dashboard/navigation'
import { NotificationProvider } from '@/components/providers/notification-provider'

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const { user, isLoading } = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (!isLoading && !user) {
      router.push('/auth/login')
    }
  }, [user, isLoading, router])

  if (isLoading) {
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center">
        <div className="animate-pulse">
          <div className="w-8 h-8 bg-red-600 rounded-lg mb-4"></div>
          <div className="h-4 w-32 bg-neutral-800 rounded mb-2"></div>
          <div className="h-4 w-24 bg-neutral-800 rounded"></div>
        </div>
      </div>
    )
  }

  if (!user) {
    return null
  }

  return (
    <NotificationProvider>
      <div className="min-h-screen bg-black text-white">
        <DashboardNavigation />
        <main className="lg:pl-64 pb-20 lg:pb-0">
          {children}
        </main>
      </div>
    </NotificationProvider>
  )
}
