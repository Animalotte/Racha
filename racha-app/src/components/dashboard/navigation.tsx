"use client"

import { useState } from 'react'
import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { useAuth } from '@/components/providers/auth-provider'
import { useNotifications } from '@/components/providers/notification-provider'
import { Button } from '@/components/ui/button'

import { cn } from '@/lib/utils'
import { 
  Avatar, 
  AvatarFallback 
} from '@/components/ui/avatar'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator
} from '@/components/ui/dropdown-menu'

const navigation = [
  {
    name: 'Início',
    href: '/dashboard',
    icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
      </svg>
    )
  },
  {
    name: 'Meus Cartões',
    href: '/dashboard/cartoes',
    icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
      </svg>
    )
  },
  {
    name: 'Notificações',
    href: '/dashboard/notificacoes',
    icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-5-5M15 17v5l5-5M21 3l-6 6m0 0V4m0 5h5M3 12a9 9 0 1118 0 9 9 0 01-18 0z" />
      </svg>
    )
  },
  {
    name: 'Transações',
    href: '/dashboard/creditos',
    icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
      </svg>
    )
  },
  {
    name: 'Suporte',
    href: '/dashboard/suporte',
    icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    )
  },
  {
    name: 'Configurações',
    href: '/dashboard/configuracoes',
    icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
      </svg>
    )
  }
]

export function DashboardNavigation() {
  const { user, logout } = useAuth()
  const { unreadCount } = useNotifications()

  const pathname = usePathname()
  const router = useRouter()

  const handleLogout = () => {
    logout()
    router.push('/')
  }

  const getUserInitials = (name?: string) => {
    if (!name) {
      return 'U';
    }
    return name
      .split(' ')
      .map(word => word[0])
      .join('')
      .toUpperCase()
      .slice(0, 2)
  }

  return (
    <>
      {/* Desktop Sidebar */}
      <div className="hidden lg:fixed lg:inset-y-0 lg:flex lg:w-64 lg:flex-col bg-gradient-to-br from-primary to-red-600 text-white border-black shadow-lg">
        <div className="flex flex-col flex-grow bg-card border-r border-black" >
          {/* Logo */}
          <div className="flex items-center justify-center px-4 py-6 border-b border-black">
            <div className="flex items-center space-x-3">
              <img src="/racha-logo-completa.png" alt="Racha Logo"/>
            </div>
          </div>

          {/* User Info */}
          <div className="px-4 py-4 border-b border-black">
            <div className="flex items-center space-x-3">
              <Avatar className="h-10 w-10">
                <AvatarFallback className="bg-primary  text-red-800">
                  {getUserInitials(user?.nomeCompleto)}
                </AvatarFallback>
              </Avatar>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-foreground truncate">
                  {user?.nomeCompleto || 'Usuário'}
                </p>
                <p className="text-xs  text-gray-400 truncate">
                  {user?.email || ''}
                </p>
              </div>
            </div>
          </div>

          {/* Navigation */}
          <nav className="flex-1 px-2 py-4 space-y-1 ">
            {navigation.map((item) => {
              const isActive = pathname === item.href
              const hasNotification = item.name === 'Notificações' && unreadCount > 0
              
              return (
                <Link
                  key={item.name}
                  href={item.href}
                  className={cn(
                    'group flex items-center px-2 py-2 text-white font-medium rounded-lg transition-colors relative ',
                    isActive
                      ? 'bg-primary text-primary-foreground'
                      : 'text-muted-foreground  hover:bg-black'
                  )}
                >
                  <div className="mr-3 flex-shrink-0">
                    {item.icon}
                  </div>
                  {item.name}
                  {hasNotification && (
                    <span className="ml-auto bg-destructive text-destructive-foreground text-xs rounded-full w-5 h-5 flex items-center justify-center ">
                      {unreadCount}
                    </span>
                  )}
                </Link>
              )
            })}
          </nav>

          {/* Logout */}
          <div className="px-2 py-4 border-t border-black">
            <Button
              variant="ghost" 
              size="sm"
              onClick={handleLogout}
              className="w-full justify-start text-gray-300 hover:bg-black"
            >
              <svg className="mr-2 h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
              </svg>
              Sair
            </Button>
          </div>
        </div>
      </div>

      {/* Mobile Navigation*/}
      <div className="lg:hidden">
        {/* Mobile Header */}
        <div className="bg-card border-b border-black px-4 py-3 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <img src="/racha-logo-completa.png" alt="Racha Logo"/>
          </div>
          
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="sm">
                <Avatar className="h-6 w-6">
                  <AvatarFallback className="bg-primary text-primary-foreground text-xs">
                    {getUserInitials(user?.nomeCompleto)}
                  </AvatarFallback>
                </Avatar>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem disabled>
                <div className="flex flex-col">
                  <span className="text-sm font-medium">{user?.nomeCompleto || 'Usuário'}</span>
                  <span className="text-xs text-muted-foreground">{user?.email || ''}</span>
                </div>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={handleLogout} className="text-destructive">
                Sair
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        {/* Mobile Bottom Navigation */}
        <div className="fixed bottom-0 left-0 right-0 bg-card border-t border-border">
          <nav className="flex">
            {navigation.slice(0, 5).map((item) => {
              const isActive = pathname === item.href
              const hasNotification = item.name === 'Notificações' && unreadCount > 0
              
              return (
                <Link
                  key={item.name}
                  href={item.href}
                  className={cn(
                    'flex-1 flex flex-col items-center justify-center py-2 px-1 text-xs relative',
                    isActive
                      ? 'text-primary'
                      : 'text-muted-foreground'
                  )}
                >
                  <div className="mb-1">
                    {item.icon}
                  </div>
                  <span className="truncate">{item.name}</span>
                  {hasNotification && (
                    <span className="absolute top-1 right-1 bg-destructive text-destructive-foreground text-xs rounded-full w-4 h-4 flex items-center justify-center">
                      {unreadCount}
                    </span>
                  )}
                </Link>
              )
            })}
          </nav>
        </div>
      </div>
    </>
  )
}