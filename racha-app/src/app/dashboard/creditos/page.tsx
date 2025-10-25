"use client"

import { useState, useEffect } from 'react'
import { useAuth } from '@/components/providers/auth-provider'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { formatCurrency } from '@/lib/utils/validation'
import Link from 'next/link'

interface Transaction {
  id: string
  userId: string
  type: 'credit_purchase' | 'cartao_payment' | 'refund'
  amount: number
  finalAmount?: number
  taxAmount?: number
  paymentMethod?: string
  status: 'completed' | 'pending' | 'failed'
  date: string
  description: string
  cartaoId?: string
  cartaoName?: string
}

export default function CreditosPage() {
  const { user } = useAuth()
  const [transactions, setTransactions] = useState<Transaction[]>([])

  useEffect(() => {
    if (!user) return

    fetch(`http://localhost:5208/api/Transacao/usuario/${user.id}`)
      .then(res => {
        if (!res.ok) {
          throw new Error('Erro ao carregar transações')
        }
        return res.json()
      })
      .then(data => {
        data.sort((a: Transaction, b: Transaction) => 
          new Date(b.date).getTime() - new Date(a.date).getTime()
        )
        setTransactions(data)
      })
      .catch(error => {
        console.error('Erro ao carregar transações:', error)
      })
  }, [user])

  const getTransactionIcon = (type: string, status: string) => {
    if (status === 'failed') {
      return (
        <div className="w-8 h-8 bg-red-800/20 rounded-full flex items-center justify-center">
          <svg className="w-4 h-4 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </div>
      )
    }

    switch (type) {
      case 'credit_purchase':
        return (
          <div className="w-8 h-8 bg-green-800/20 rounded-full flex items-center justify-center">
            <svg className="w-4 h-4 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
            </svg>
          </div>
        )
      case 'cartao_payment':
        return (
          <div className="w-8 h-8 bg-red-800/20 rounded-full flex items-center justify-center">
            <svg className="w-4 h-4 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12H9m12 0a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
        )
      case 'refund':
        return (
          <div className="w-8 h-8 bg-blue-800/20 rounded-full flex items-center justify-center">
            <svg className="w-4 h-4 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h10a8 8 0 018 8v2M3 10l6 6m-6-6l6-6" />
            </svg>
          </div>
        )
      default:
        return (
          <div className="w-8 h-8 bg-gray-800/20 rounded-full flex items-center justify-center">
            <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
            </svg>
          </div>
        )
    }
  }

  const getTransactionTypeText = (type: string) => {
    switch (type) {
      case 'credit_purchase': return 'Compra de Créditos'
      case 'cartao_payment': return 'Pagamento de Cartão'
      case 'refund': return 'Reembolso'
      default: return 'Transação'
    }
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'completed':
        return <Badge className="bg-green-800/20 text-green-400 border-green-800/30">Concluída</Badge>
      case 'pending':
        return <Badge className="bg-yellow-800/20 text-yellow-400 border-yellow-800/30">Pendente</Badge>
      case 'failed':
        return <Badge className="bg-red-800/20 text-red-400 border-red-800/30">Falhou</Badge>
      default:
        return <Badge variant="outline" className="text-gray-400 border-gray-800/30">Desconhecido</Badge>
    }
  }

  const totalSpent = transactions
    .filter(t => t.type === 'cartao_payment' && t.status === 'completed')
    .reduce((sum, t) => sum + t.amount, 0)

  const totalAdded = transactions
    .filter(t => t.type === 'credit_purchase' && t.status === 'completed')
    .reduce((sum, t) => sum + t.amount, 0)

  if (!user) return null

  return (
    <div className="min-h-screen bg-black text-white p-4 lg:p-6 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div className="space-y-2">
          <h1 className="text-2xl lg:text-3xl font-bold text-white">
            Suas Transações
          </h1>
          <p className="text-gray-400">
            Gerencie seu saldo e histórico de transações
          </p>
        </div>
        <Button asChild className="bg-white text-red-800 hover:bg-gray-200">
          <Link href="/dashboard/creditos/comprar">
            <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
            </svg>
            Comprar Créditos
          </Link>
        </Button>
      </div>

      {/* Resumo dos Créditos */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="border-red-800/20 bg-black">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-400">Saldo Atual</p>
                <p className="text-3xl font-bold text-white">{formatCurrency(user.creditos)}</p>
              </div>
              <div className="w-12 h-12 bg-red-800/10 rounded-full flex items-center justify-center">
                <svg className="w-6 h-6 text-red-800" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
                </svg>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-black border-red-800/20">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-400">Total Adicionado</p>
                <p className="text-2xl font-bold text-white">{formatCurrency(totalAdded)}</p>
              </div>
              <div className="w-10 h-10 bg-green-800/20 rounded-full flex items-center justify-center">
                <svg className="w-6 h-6 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                </svg>
              </div>
            </div>
            <p className="text-xs text-gray-400 mt-1">
              Compras de créditos
            </p>
          </CardContent>
        </Card>

        <Card className="bg-black border-red-800/20">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-400">Total Gasto</p>
                <p className="text-2xl font-bold text-white">{formatCurrency(totalSpent)}</p>
              </div>
              <div className="w-10 h-10 bg-red-800/20 rounded-full flex items-center justify-center">
                <svg className="w-5 h-5 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12H9m12 0a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
            </div>
            <p className="text-xs text-gray-400 mt-1">
              Pagamentos de cartões
            </p>
          </CardContent>
        </Card>

        <Card className="bg-black border-red-800/20">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-400">Transações</p>
                <p className="text-2xl font-bold text-white">{transactions.length}</p>
              </div>
              <div className="w-10 h-10 bg-gray-800/20 rounded-full flex items-center justify-center">
                <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
                </svg>
              </div>
            </div>
            <p className="text-xs text-gray-400 mt-1">
              Histórico completo
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Histórico de Transações */}
      <Card className="bg-gradient-to-br from-red-800 to-red-600 rounded-lg border-red-800">
        <CardHeader>
          <div className="flex justify-between items-center">
            <div>
              <CardTitle className="text-white">Histórico de Transações</CardTitle>
              <CardDescription className="text-gray-300">
                Todas as suas movimentações de créditos
              </CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {transactions.length > 0 ? (
            <div className="space-y-4">
              {transactions.map((transaction) => (
                <div
                  key={transaction.id}
                  className="flex items-center justify-between p-4 bg-black/50 rounded-lg hover:bg-black/70 transition-colors"
                >
                  <div className="flex items-center space-x-4 flex-1">
                    {getTransactionIcon(transaction.type, transaction.status)}
                    
                    <div className="flex-1">
                      <div className="flex items-center space-x-2">
                        <p className="font-medium text-white">
                          {getTransactionTypeText(transaction.type)}
                        </p>
                        {getStatusBadge(transaction.status)}
                      </div>
                      
                      <p className="text-sm text-gray-400 mt-1">
                        {transaction.description}
                      </p>
                      
                      {transaction.paymentMethod && (
                        <p className="text-xs text-gray-400">
                          Método: {transaction.paymentMethod}
                        </p>
                      )}
                      
                      {transaction.cartaoName && (
                        <p className="text-xs text-gray-400">
                          Cartão: {transaction.cartaoName}
                        </p>
                      )}
                    </div>
                  </div>

                  <div className="text-right">
                    <p className={`font-bold text-lg ${
                      transaction.type === 'credit_purchase' || transaction.type === 'refund'
                        ? 'text-white'
                        : 'text-white'
                    }`}>
                      {(transaction.type === 'credit_purchase' || transaction.type === 'refund') ? '+' : '-'}
                      {formatCurrency(transaction.amount)}
                    </p>
                    
                    {transaction.finalAmount && transaction.finalAmount !== transaction.amount && (
                      <p className="text-xs text-gray-400">
                        Total pago: {formatCurrency(transaction.finalAmount)}
                      </p>
                    )}
                    
                    <p className="text-xs text-gray-400">
                      {new Date(transaction.date).toLocaleDateString('pt-BR', {
                        day: '2-digit',
                        month: '2-digit',
                        year: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit'
                      })}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8">
              <svg className="w-16 h-16 text-gray-400 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
              </svg>
              <h3 className="text-lg font-medium text-white mb-2">
                Nenhuma transação encontrada
              </h3>
              <p className="text-gray-400 mb-6">
                Compre créditos para começar a usar o Racha
              </p>
              <Button asChild className="bg-white text-red-800 hover:bg-gray-200">
                <Link href="/dashboard/creditos/comprar">
                  Comprar Créditos
                </Link>
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}