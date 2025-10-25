"use client"

import { useState } from 'react'
import { useAuth } from '@/components/providers/auth-provider'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { toast } from 'sonner'
import Link from 'next/link'
import { formatCurrency } from '@/lib/utils/validation'

const PRESET_VALUES = [
  { label: 'R$ 50', value: 50 },
  { label: 'R$ 100', value: 100 },
  { label: 'R$ 200', value: 200 },
  { label: 'R$ 500', value: 500 },
]

const PAYMENT_METHODS = [
  { id: 'pix', name: 'PIX'},
  { id: 'card', name: 'Cartão de Crédito' },
  { id: 'boleto', name: 'Boleto Bancário'},
  { id: 'bank', name: 'Transferência Bancária' },
]

export default function ComprarCreditosPage() {
  const { user, updateUser } = useAuth()
  const [amount, setAmount] = useState<number>(100)
  const [paymentMethod, setPaymentMethod] = useState<string>('pix')
  const [step, setStep] = useState<'amount' | 'payment' | 'processing' | 'success'>('amount')

  const TAX_RATE = 0.02 // 2%
  const finalAmount = amount + (amount * TAX_RATE)

  const handleAmountChange = (value: string) => {
    const numericValue = parseFloat(value) || 0
    if (numericValue >= 10 && numericValue <= 10000) {
      setAmount(numericValue)
    }
  }

  const handlePresetSelect = (value: number) => {
    setAmount(value)
  }

  const handleNextStep = () => {
    if (step === 'amount') {
      if (amount < 10) {
        toast.error('Valor mínimo é R$ 10,00')
        return
      }
      if (amount > 10000) {
        toast.error('Valor máximo é R$ 10.000,00')
        return
      }
      setStep('payment')
    } else if (step === 'payment') {
      if (!paymentMethod) {
        toast.error('Selecione um método de pagamento')
        return
      }
      processPayment()
    }
  }

  const processPayment = async () => {
    setStep('processing')

    try {
      console.log('Amount selecionado:', amount)
      console.log('FinalAmount calculado (com taxa):', finalAmount)
      console.log('Valor enviado para API (deve ser amount, sem taxa):', { Valor: amount, PaymentMethod: paymentMethod })

      await new Promise(resolve => setTimeout(resolve, 3000))

      if (user) {
        const response = await fetch(`http://localhost:5208/api/Usuario/${user.id}/adicionar-creditos`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ Valor: amount, PaymentMethod: paymentMethod })
        })

        const data = await response.json()
        if (!response.ok) {
          throw new Error(data.message || 'Erro ao adicionar créditos')
        }
        const newCredits = Number(data.creditosAtualizados) || (user.creditos + amount)
        console.log('Créditos retornados pelo backend:', newCredits)

        updateUser({ creditos: newCredits }, true)

        setStep('success')
        toast.success('Créditos adicionados com sucesso!')
      }
    } catch (error) {
      console.error('Erro no pagamento:', error)
      toast.error('Erro ao processar o pagamento. Tente novamente.')
      setStep('payment')
    }
  }

  const getPaymentMethodDetails = (methodId: string) => {
    const method = PAYMENT_METHODS.find(m => m.id === methodId)
    if (!method) return null

    switch (methodId) {
      case 'pix':
        return {
          ...method,
          description: 'Aprovação instantânea',
          processingTime: 'Imediato'
        }
      case 'card':
        return {
          ...method,
          description: 'Parcelamento disponível',
          processingTime: '1-2 minutos'
        }
      case 'boleto':
        return {
          ...method,
          description: 'Vencimento em 3 dias',
          processingTime: '1-3 dias úteis'
        }
      case 'bank':
        return {
          ...method,
          description: 'TED/DOC bancário',
          processingTime: '1 dia útil'
        }
      default:
        return method
    }
  }

  if (!user) return null

  return (
    <div className="min-h-screen bg-black text-white p-4 lg:p-6 max-w-2xl mx-auto space-y-6">
      {/* Header */}
      <div className="space-y-2">
        <div className="flex items-center space-x-2 text-sm text-gray-400">
          <Link href="/dashboard/creditos" className="hover:text-white">
            Créditos
          </Link>
          <span>•</span>
          <span>Comprar</span>
        </div>
        <h1 className="text-2xl lg:text-3xl font-bold">
          Comprar Créditos
        </h1>
        <p className="text-gray-400">
          Adicione créditos à sua conta para participar de cartões
        </p>
      </div>

      {/* Saldo Atual */}
      <Card className="border-red-800/20 bg-black">
        <CardContent className="pt-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-400">Saldo atual</p>
              <p className="text-3xl font-bold text-white">{formatCurrency(user.creditos ?? 0)}</p>
            </div>
            <div className="w-12 h-12 bg-red-800/10 rounded-full flex items-center justify-center">
              <svg className="w-6 h-6 text-red-800" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
              </svg>
            </div>
          </div>
        </CardContent>
      </Card>

      {step === 'amount' && (
        <Card className="bg-gradient-to-br from-red-800 to-red-600 rounded-lg">
          <CardHeader>
            <CardTitle className="text-white">Escolher Valor</CardTitle>
            <CardDescription className="text-gray-300">
              Defina quanto você quer adicionar à sua conta
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Valores Pré-definidos */}
            <div>
              <Label className="text-white text-base font-medium">Valores rápidos</Label>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mt-2">
                {PRESET_VALUES.map((preset) => (
                  <Button
                    key={preset.value}
                    variant={amount === preset.value ? 'default' : 'outline'}
                    className={`h-12 ${amount === preset.value ? 'bg-white text-red-800 hover:bg-gray-200' : 'text-white border-white hover:bg-red-700/50'}`}
                    onClick={() => handlePresetSelect(preset.value)}
                  >
                    {preset.label}
                  </Button>
                ))}
              </div>
            </div>

            {/* Valor Personalizado */}
            <div className="space-y-2">
              <Label htmlFor="customAmount" className="text-white">Valor personalizado</Label>
              <div className="relative">
                <Input
                  id="customAmount"
                  type="number"
                  min="10"
                  max="10000"
                  value={amount}
                  onChange={(e) => handleAmountChange(e.target.value)}
                  className="pl-8 bg-black border-white text-white placeholder-gray-400"
                  placeholder="Digite o valor"
                />
                <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-white text-sm">
                  R$
                </span>
              </div>
              <p className="text-xs text-gray-400">
                Valor mínimo: R$ 10,00 • Valor máximo: R$ 10.000,00
              </p>
            </div>

            {/* Resumo do Valor */}
            <div className="bg-black/50 rounded-lg p-4 space-y-2">
              <h4 className="font-medium text-white">Resumo da Compra</h4>
              <div className="space-y-1 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-400">Créditos:</span>
                  <span className="text-white">{formatCurrency(amount)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Taxa (2%):</span>
                  <span className="text-white">{formatCurrency(amount * TAX_RATE)}</span>
                </div>
                <div className="border-t pt-1 mt-2 border-gray-700">
                  <div className="flex justify-between font-medium">
                    <span>Total a pagar:</span>
                    <span className="text-white">{formatCurrency(finalAmount)}</span>
                  </div>
                </div>
              </div>
            </div>

            <Button 
              onClick={handleNextStep}
              className="w-full bg-white text-red-800 hover:bg-gray-200"
              disabled={amount < 10}
            >
              Continuar
            </Button>
          </CardContent>
        </Card>
      )}

      {step === 'payment' && (
        <Card className="bg-gradient-to-br from-red-800 to-red-600 rounded-lg">
          <CardHeader>
            <CardTitle className="text-white">Método de Pagamento</CardTitle>
            <CardDescription className="text-gray-300">
              Escolha como você quer pagar pelos créditos
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Resumo do Valor */}
            <div className="bg-black/50 rounded-lg p-4 border border-red-800/20">
              <div className="flex justify-between items-center">
                <div>
                  <p className="text-gray-400 text-sm">Você vai receber:</p>
                  <p className="text-xl font-bold text-white">{formatCurrency(amount)} em créditos</p>
                </div>
                <div className="text-right">
                  <p className="text-gray-400 text-sm">Total a pagar:</p>
                  <p className="text-xl font-bold text-white">{formatCurrency(finalAmount)}</p>
                </div>
              </div>
            </div>

            {/* Métodos de Pagamento */}
            <div className="space-y-3">
              {PAYMENT_METHODS.map((method) => {
                const details = getPaymentMethodDetails(method.id)
                const isSelected = paymentMethod === method.id
                
                return (
                  <div
                    key={method.id}
                    className={`border rounded-lg p-4 cursor-pointer transition-all ${isSelected ? 'bg-black/70 border-red-800' : 'bg-black/30 border-gray-700 hover:border-red-800/50'}`}
                    onClick={() => setPaymentMethod(method.id)}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <div>
                          <p className="font-medium text-white">{method.name}</p>
                          {details && 'description' in details && (
                            <p className="text-gray-400 text-sm">{details.description}</p>
                          )}
                        </div>
                      </div>
                      <div className="text-right">
                        {details && 'processingTime' in details && (
                          <p className="text-gray-400 text-sm">{details.processingTime}</p>
                        )}
                        <div className={`w-4 h-4 rounded-full border-2 ${isSelected ? 'bg-red-800 border-white' : 'border-gray-400'}`}>
                          {isSelected && (
                            <svg className="w-full h-full text-white" fill="currentColor" viewBox="0 0 16 16">
                              <path d="M13.854 3.646a.5.5 0 010 .708l-7 7a.5.5 0 01-.708 0l-3.5-3.5a.5.5 0 1 1 .708-.708L6.5 10.293l6.646-6.647a.5.5 0 01.708 0z"/>
                            </svg>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>

            {/* Botões */}
            <div className="flex space-x-3">
              <Button 
                variant="outline" 
                onClick={() => setStep('amount')}
                className="flex-1 text-white border-white hover:bg-red-800/50"
              >
                Voltar
              </Button>
              <Button 
                onClick={handleNextStep}
                className="flex-1 bg-white text-red-800 hover:bg-gray-200"
                disabled={!paymentMethod}
              >
                Pagar {formatCurrency(finalAmount)}
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {step === 'processing' && (
        <Card className="bg-gradient-to-br from-red-800 to-red-600 rounded-lg text-center">
          <CardContent className="py-12">
            <div className="w-16 h-16 bg-white/10 rounded-full flex items-center justify-center mx-auto mb-6">
              <div className="w-8 h-8 border-4 border-white border-t-transparent rounded-full animate-spin"></div>
            </div>
            <h3 className="text-xl font-bold text-white mb-2">
              Processando Pagamento
            </h3>
            <p className="text-gray-400 mb-4">
              Aguarde enquanto processamos seu pagamento...
            </p>
            <p className="text-gray-400 text-sm">
              Método: {PAYMENT_METHODS.find(m => m.id === paymentMethod)?.name}
            </p>
          </CardContent>
        </Card>
      )}

      {step === 'success' && (
        <Card className="bg-gradient-to-br from-red-800 to-red-600 rounded-lg text-center">
          <CardContent className="py-12">
            <div className="w-16 h-16 bg-white/10 rounded-full flex items-center justify-center mx-auto mb-6">
              <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <h3 className="text-xl font-bold text-white mb-2">
              Pagamento Aprovado!
            </h3>
            <p className="text-gray-400 mb-6">
              Seus créditos foram adicionados com sucesso
            </p>
            
            <div className="bg-black/50 rounded-lg p-4 max-w-sm mx-auto mb-6">
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-400">Créditos adicionados:</span>
                  <span className="text-white">{formatCurrency(amount)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Novo saldo:</span>
                  <span className="text-white">{formatCurrency(user.creditos ?? 0)}</span>
                </div>
              </div>
            </div>

            <div className="flex space-x-3">
              <Button 
                variant="outline" 
                asChild
                className="flex-1 text-white border-white hover:bg-red-800/50"
              >
                <Link href="/dashboard/creditos">
                  Ver Histórico
                </Link>
              </Button>
              <Button 
                asChild
                className="flex-1 bg-white text-red-800 hover:bg-gray-200"
              >
                <Link href="/dashboard">
                  Voltar ao Início
                </Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
