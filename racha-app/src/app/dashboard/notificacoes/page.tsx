"use client"

import { useState, useEffect, useCallback } from 'react'
import { useNotifications } from '@/components/providers/notification-provider'
import { useAuth } from '@/components/providers/auth-provider'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { formatCurrency } from '@/lib/utils/validation'
import { toast } from 'sonner'
import Link from 'next/link'

interface Convite {
  cartaoId: string
  cartaoNome: string
  remetenteNome: string
  valor: number
  numeroParticipantes: number
  dataEnvio: string
  status: 'pendente' | 'aceito' | 'rejeitado'
}

export default function NotificacoesPage() {
  const { user } = useAuth()
  const { convites, acceptConvite, rejectConvite, markAsRead, refreshConvites } = useNotifications()
  const [loading, setLoading] = useState(true)

  const loadData = useCallback(async () => {
    if (!user) return
    setLoading(true)
    try {
      await refreshConvites()
      markAsRead()
    } catch (error) {
      console.error('Erro ao carregar notificações:', error)
      toast.error('Erro ao carregar notificações')
    } finally {
      setLoading(false)
    }
  }, [user, refreshConvites, markAsRead])

  useEffect(() => {
    loadData()
  }, [loadData])

  const handleAcceptConvite = async (cartaoId: string) => {
    if (!cartaoId) {
      toast.error('ID do cartão inválido');
      return;
    }
    try {
      await acceptConvite(cartaoId)
      toast.success('Convite aceito! Cartão adicionado à sua lista.')
    } catch (error) {
      toast.error('Erro ao aceitar convite')
    }
  }

  const handleRejectConvite = async (cartaoId: string) => {
    if (!cartaoId) {
      toast.error('ID do cartão inválido');
      return;
    }
    try {
      await rejectConvite(cartaoId)
      toast.success('Convite rejeitado.')
    } catch (error) {
      toast.error('Erro ao rejeitar convite')
    }
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  if (!user) return null

  if (loading) {
    return (
      <div className="p-4 lg:p-6 space-y-6 bg-black min-h-screen">
        <div className="animate-pulse space-y-4">
          <div className="h-8 bg-muted rounded w-1/3"></div>
          <div className="h-32 bg-muted rounded"></div>
        </div>
      </div>
    )
  }

  const convitesPendentes = convites.filter(c => c.status === 'pendente')

  return (
    <div className="p-4 lg:p-6 space-y-6 bg-black min-h-screen text-white">
      {/* Header */}
      <div className="space-y-2">
        <div className="flex items-center space-x-2 text-sm text-muted-foreground">
          <Link href="/dashboard" className="hover:text-foreground">Dashboard</Link>
          <span>•</span>
          <span>Notificações</span>
        </div>
        <h1 className="text-2xl lg:text-3xl font-bold text-white">
          Notificações
        </h1>
        <p className="text-muted-foreground">
          Convites recebidos para participar de cartões compartilhados
        </p>
      </div>

      {/* Estatísticas */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="bg-gradient-to-br from-primary to-red-600 text-white border-0 shadow-lg">
          <CardContent className="pt-6">
            <div className="text-2xl font-bold text-white">
              {convitesPendentes.length}
            </div>
            <p className="text-xs text-white/80">Convites pendentes</p>
          </CardContent>
        </Card>
        <Card className="bg-gradient-to-br from-primary to-red-600 text-white border-0 shadow-lg">
          <CardContent className="pt-6">
            <div className="text-2xl font-bold text-white">
              {convites.filter(c => c.status === 'aceito').length}
            </div>
            <p className="text-xs text-white/80">Aceitos</p>
          </CardContent>
        </Card>
        <Card className="bg-gradient-to-br from-primary to-red-600 text-white border-0 shadow-lg">
          <CardContent className="pt-6">
            <div className="text-2xl font-bold text-white">
              {convites.filter(c => c.status === 'rejeitado').length}
            </div>
            <p className="text-xs text-white/80">Rejeitados</p>
          </CardContent>
        </Card>
      </div>

      {/* Lista de Convites */}
      <Card className="bg-gradient-to-br from-primary to-red-600 text-white border-0 shadow-lg">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-white">Convites Recebidos</CardTitle>
              <CardDescription className="text-white/80">
                Aceite ou rejeite convites para participar de cartões
              </CardDescription>
            </div>
            <Button variant="outline" size="sm" onClick={loadData}>
              Atualizar
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          {convitesPendentes.length > 0 ? (
            <div className="space-y-4">
              {convitesPendentes.map((convite) => (
                <div
                  key={convite.cartaoId}
                  className="border border-white/20 rounded-lg p-4 space-y-4 hover:bg-white/10 transition-colors"
                >
                  <div className="flex items-start justify-between">
                    <div className="space-y-2 flex-1">
                      <div className="flex items-center space-x-3">
                        <div className="w-10 h-10 bg-white/10 rounded-lg flex items-center justify-center">
                          <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
                          </svg>
                        </div>
                        <div className="flex-1">
                          <h4 className="font-medium text-white">{convite.cartaoNome}</h4>
                          <p className="text-sm text-white/80">
                            Convite de <span className="font-medium">{convite.remetenteNome}</span>
                          </p>
                        </div>
                        <Badge variant="outline" className="text-xs border-white/50 text-white">Pendente</Badge>
                      </div>

                      <div className="bg-white/10 rounded-lg p-3 ml-12">
                        <div className="grid grid-cols-2 gap-4 text-sm">
                          <div>
                            <span className="text-white/80">Valor total:</span>
                            <div className="font-medium text-white">{formatCurrency(convite.valor)}</div>
                          </div>
                          <div>
                            <span className="text-white/80">Sua parte:</span>
                            <div className="font-medium text-white">
                              {formatCurrency(convite.valor / convite.numeroParticipantes)}
                            </div>
                          </div>
                        </div>
                      </div>

                      <p className="text-xs text-white/80 ml-12">
                        Recebido em {formatDate(convite.dataEnvio)}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center justify-end space-x-3 ml-12">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleRejectConvite(convite.cartaoId)}
                      className="text-white border-white/50 hover:bg-white/20 hover:text-white"
                    >
                      Rejeitar
                    </Button>
                    <Button
                      size="sm"
                      onClick={() => handleAcceptConvite(convite.cartaoId)}
                      className="bg-gradient-to-br from-primary to-red-600 text-white border-0 shadow-lg hover:brightness-110"
                    >
                      Aceitar
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8">
              <h3 className="text-lg font-medium text-white mb-2">
                Nenhum convite pendente
              </h3>
              <p className="text-white/80 mb-6">
                Quando alguém te convidar, você verá aqui.
              </p>
              <div className="bg-white/10 rounded-lg p-4 text-left max-w-md mx-auto">
                <h4 className="font-medium text-white mb-2">Como receber convites?</h4>
                <div className="space-y-2 text-sm text-white/80">
                  <p>• Seu código único: <code className="bg-black/50 px-1 rounded">{user.codigoUnico}</code></p>
                  <p>• Compartilhe com amigos</p>
                  <p>• Convites aparecerão aqui automaticamente</p>
                </div>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}