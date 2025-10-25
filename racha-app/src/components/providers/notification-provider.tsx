"use client"

import React, { createContext, useContext, useEffect, useState, useCallback } from 'react'
import { useAuth } from './auth-provider'

export interface Convite {
  cartaoId: string
  cartaoNome: string
  remetenteNome: string
  valor: number
  numeroParticipantes: number
  dataEnvio: string
  status: 'pendente' | 'aceito' | 'rejeitado'
}

interface NotificationContextType {
  convites: Convite[]
  unreadCount: number
  acceptConvite: (cartaoId: string) => Promise<void>
  rejectConvite: (cartaoId: string) => Promise<void>
  markAsRead: () => void
  refreshConvites: () => Promise<void>
}

const NotificationContext = createContext<NotificationContextType | undefined>(undefined)

export function NotificationProvider({ children }: { children: React.ReactNode }) {
  const { user } = useAuth()
  const [convites, setConvites] = useState<Convite[]>([])
  const [unreadCount, setUnreadCount] = useState(0)

  const API_BASE = 'http://localhost:5208/api/Cartao'

  const refreshConvites = useCallback(async () => {
    if (!user?.id) return

    try {
      const response = await fetch(`${API_BASE}/convites/${user.id}`)
      if (!response.ok) throw new Error('Erro ao carregar convites')
      const data: { id: string; cartaoNome: string; remetenteNome: string; valor: number; numeroParticipantes: number; dataEnvio: string; status: string }[] = await response.json()
      const mappedData: Convite[] = data.map(item => ({
        cartaoId: item.id,
        cartaoNome: item.cartaoNome,
        remetenteNome: item.remetenteNome,
        valor: item.valor,
        numeroParticipantes: item.numeroParticipantes,
        dataEnvio: item.dataEnvio,
        status: item.status as 'pendente' | 'aceito' | 'rejeitado'
      }))
      console.log('Convites carregados:', mappedData);
      setConvites(mappedData)
      setUnreadCount(mappedData.filter(c => c.status === 'pendente').length)
    } catch (error) {
      console.error('Erro ao carregar convites:', error)
    }
  }, [user?.id])

  const acceptConvite = useCallback(async (cartaoId: string) => {
    if (!user?.id || !cartaoId) throw new Error('ID inválido')
    const res = await fetch(`${API_BASE}/${cartaoId}/aceitar`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ UsuarioId: user.id })
    })
    if (!res.ok) throw new Error('Falha ao aceitar convite')
    await refreshConvites()
  }, [user?.id, refreshConvites])

  const rejectConvite = useCallback(async (cartaoId: string) => {
    if (!user?.id || !cartaoId) throw new Error('ID inválido')
    const res = await fetch(`${API_BASE}/${cartaoId}/rejeitar`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ UsuarioId: user.id })
    })
    if (!res.ok) throw new Error('Falha ao rejeitar convite')
    await refreshConvites()
  }, [user?.id, refreshConvites])

  const markAsRead = useCallback(() => {
    setUnreadCount(0)
  }, [])

  useEffect(() => {
    if (user?.id) {
      refreshConvites()
      const interval = setInterval(refreshConvites, 30000)
      return () => clearInterval(interval)
    }
  }, [refreshConvites, user?.id])

  return (
    <NotificationContext.Provider value={{
      convites,
      unreadCount,
      acceptConvite,
      rejectConvite,
      markAsRead,
      refreshConvites
    }}>
      {children}
    </NotificationContext.Provider>
  )
}

export const useNotifications = () => {
  const context = useContext(NotificationContext)
  if (!context) throw new Error('useNotifications must be used within NotificationProvider')
  return context
}