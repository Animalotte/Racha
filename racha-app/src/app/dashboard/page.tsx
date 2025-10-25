"use client"

import { useState, useEffect } from 'react'
import { useAuth } from '@/components/providers/auth-provider'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { formatCurrency } from '@/lib/utils/validation'
import Link from 'next/link'

interface CartaoStats {
  total: number
  ativos: number
  pendentes: number
}

export default function DashboardPage() {
  const { user, updateUser } = useAuth()
  const [cartaoStats, setCartaoStats] = useState<CartaoStats>({ total: 0, ativos: 0, pendentes: 0 })

  useEffect(() => {
    if (!user) return

    const loadData = async () => {
      try {
        const cartoesResponse = await fetch(`http://localhost:5208/api/Cartao/usuario/${user.id}`)
        if (cartoesResponse.ok) {
          const userCartoes = await cartoesResponse.json()
          const stats = {
            total: userCartoes.length,
            ativos: userCartoes.filter((c: any) => c.status === 'ativo' || c.status === 'validado').length,
            pendentes: userCartoes.filter((c: any) => c.status === 'pendente').length
          }
          setCartaoStats(stats)
        }

        const creditosResponse = await fetch(`http://localhost:5208/api/Usuario/${user.id}/creditos`)
        if (creditosResponse.ok) {
          const data = await creditosResponse.json()
          updateUser({ creditos: data.creditos }, true)
        }
      } catch (error) {
        console.error('Erro ao carregar dados:', error)
      }
    }
    loadData()
  }, [user, updateUser])

  const getGreeting = () => {
    const hour = new Date().getHours()
    if (hour < 12) return 'Bom dia'
    if (hour < 18) return 'Boa tarde'
    return 'Boa noite'
  }

  if (!user) return null

  return (
    <div className="min-h-screen bg-black">
      {/* Header do Dashboard */}
      <div className="bg-gradient-to-r from-primary to-red-700 text-white">
        <div className="p-6 lg:p-8">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-4 lg:space-y-0">
            <div>
              <h1 className="text-2xl lg:text-3xl font-bold">
                {getGreeting()}, {user.nomeCompleto.split(' ')[0]}
              </h1>
              <p className="text-white/80 text-lg">
                Gerencie seus cartões e organize sua divisão de despesas
              </p>
            </div>
            <div className="flex items-center space-x-4">
              <div className="text-right">
                <p className="text-white text-sm">Seu saldo</p>
                <p className="text-2xl font-bold text-gray-100">{formatCurrency(user.creditos ?? 0)}</p>
              </div>
              <Link href="/dashboard/creditos/comprar">
                <Button variant="ghost" className="bg-white/20 hover:bg-black text-white">
                  + Adicionar
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </div>
      <br /><br />
      <div className="p-4 lg:p-6 space-y-6 -mt-8">
        {/* Cards de Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card className="bg-black shadow-lg border border-red-800 rounded-2xl">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-400 text-sm">Total de Cartões</p>
                  <p className="text-3xl font-bold text-white">{cartaoStats.total}</p>
                </div>
                <div className="w-12 h-12 bg-gradient-to-br from-primary to-red-600 rounded-xl flex items-center justify-center">
                  <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
                  </svg>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-black shadow-lg border border-red-800 rounded-2xl">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-400 text-sm">Ativos</p>
                  <p className="text-3xl font-bold text-white">{cartaoStats.ativos}</p>
                </div>
                <div className="w-12 h-12 bg-gradient-to-br from-primary to-red-600 rounded-xl flex items-center justify-center">
                  <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-black shadow-lg border border-red-800 rounded-2xl">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-400 text-sm">Pendentes</p>
                  <p className="text-3xl font-bold text-white">{cartaoStats.pendentes}</p>
                </div>
                <div className="w-12 h-12 bg-gradient-to-br from-primary to-red-600 rounded-xl flex items-center justify-center">
                  <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
        <br /><br />
        {/* Ações Rápidas */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <Link href="/dashboard/cartoes/novo">
            <Card className="bg-gradient-to-br from-primary to-red-600 text-white shadow-lg border-0 rounded-2xl hover:shadow-xl transition-all duration-300 cursor-pointer group">
              <CardContent className="p-6 text-center">
                <div className="w-12 h-12 bg-black rounded-xl flex items-center justify-center mx-auto mb-4 group-hover:bg-primary/20 transition-colors">
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                  </svg>
                </div>
                <p className="font-semibold">Criar Cartão</p>
                <p className="text-gray-300 text-sm mt-1">Novo cartão compartilhado</p>
              </CardContent>
            </Card>
          </Link>

          <Link href="/dashboard/cartoes">
            <Card className="bg-gradient-to-br from-primary to-red-600 text-white shadow-lg border-0 rounded-2xl hover:shadow-xl hover:border-primary/50 transition-all duration-300 cursor-pointer group">
              <CardContent className="p-6 text-center">
                <div className="w-12 h-12 bg-black rounded-xl flex items-center justify-center mx-auto mb-4 group-hover:bg-primary/20 transition-colors">
                  <svg className="w-6 h-6 text-gray-300 group-hover:text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
                  </svg>
                </div>
                <p className="font-semibold text-white">Meus Cartões</p>
                <p className="text-gray-300 text-sm mt-1">Ver e gerenciar</p>
              </CardContent>
            </Card>
          </Link>

          <Link href="/dashboard/creditos">
            <Card className="bg-gradient-to-br from-primary to-red-600 text-white shadow-lg border-0 rounded-2xl hover:shadow-xl hover:border-primary/50 transition-all duration-300 cursor-pointer group">
              <CardContent className="p-6 text-center">
                <div className="w-12 h-12 bg-black rounded-xl flex items-center justify-center mx-auto mb-4 group-hover:bg-primary/20 transition-colors">
                  <svg className="w-6 h-6 text-gray-300 group-hover:text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
                  </svg>
                </div>
                <p className="font-semibold text-white">Créditos</p>
                <p className="text-gray-300 text-sm mt-1">Adquirir mais</p>
              </CardContent>
            </Card>
          </Link>

          <Link href="/dashboard/notificacoes">
            <Card className="bg-gradient-to-br from-primary to-red-600 text-white shadow-lg border-0 rounded-2xl hover:shadow-xl hover:border-primary/50 transition-all duration-300 cursor-pointer group">
              <CardContent className="p-6 text-center">
                <div className="w-12 h-12 bg-black rounded-xl flex items-center justify-center mx-auto mb-4 group-hover:bg-primary/20 transition-colors">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-5-5M15 17v5l5-5M21 3l-6 6m0 0V4m0 5h5M3 12a9 9 0 1118 0 9 9 0 01-18 0z" />
                  </svg>
                </div>
                <p className="font-semibold text-white">Notificações</p>
                <p className="text-gray-300 text-sm mt-1">Ver convites</p>
              </CardContent>
            </Card>
          </Link>
        </div>
      </div>
    </div>
  )
}