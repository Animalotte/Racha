"use client"

import React, { createContext, useContext, useEffect, useState } from 'react'
import { AuthService } from '@/core/services/auth/AuthService'
import { Usuario } from '@/core/models/Usuario'

interface AuthContextType {
  user: Usuario | null
  login: (cpf: string, senha: string) => Promise<boolean>
  logout: () => void
  updateUser: (updates: Partial<Usuario>) => void
  isLoading: boolean
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)
const API_BASE = 'http://localhost:5208/api'

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<Usuario | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const authService = new AuthService()

  useEffect(() => {
    const loadUser = async () => {
      const localUser = authService.getCurrentUser()
      if (localUser?.id) {
        try {
          const res = await fetch(`${API_BASE}/Usuario/${localUser.id}`)
          if (res.ok) {
            const data = await res.json()
            const syncedUser = new Usuario(
              String(data.id),
              data.nomeCompleto,
              data.email,
              data.cpf,
              data.dataNascimento,
              data.cep,
              data.endereco,
              data.cidade,
              data.estado,
              data.codigoUnico,
              Number(data.creditos) || 0,
              data.dataCadastro
            )
            authService.setCurrentUser(syncedUser)
            setUser(syncedUser)
          }
        } catch (err) {
          console.error('Erro ao sincronizar usuário:', err)
          authService.logout()
        }
      }
      setIsLoading(false)
    }
    loadUser()
  }, [])

  const login = async (cpf: string, senha: string): Promise<boolean> => {
    const result = await authService.login(cpf, senha)
    if (result) {
      setUser(result)
      return true
    }
    return false
  }

  const logout = () => {
    authService.logout()
    setUser(null)
  }

  const updateUser = (updates: Partial<Usuario>) => {
    setUser(prev => {
      if (!prev) return null
      const updated = { ...prev, ...updates }
      if (updates.creditos !== undefined) {
        updated.creditos = Number(updates.creditos) || 0
      }
      authService.setCurrentUser(updated)
      return updated
    })
  }

  return (
    <AuthContext.Provider value={{ user, login, logout, updateUser, isLoading }}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (!context) throw new Error('useAuth must be used within AuthProvider')
  return context
}