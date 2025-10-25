"use client"

import { useState } from 'react'
import { useAuth } from '@/components/providers/auth-provider'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { toast } from 'sonner'
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion'

const faqData = [
  {
    question: "O que é o Racha?",
    answer: "O Racha é um web app que te permite criar cartões pré-pagos virtuais e dividir o custo de qualquer despesa com amigos. Você cria um cartão, convida participantes, cada um paga sua parte com créditos, e quando todos pagarem, os dados do cartão são liberados."
  },
  {
    question: "Como convidar participantes?",
    answer: "Durante a criação do cartão, você pode convidar amigos usando seus códigos únicos. Eles receberão uma notificação e poderão aceitar ou rejeitar o convite."
  },
  {
    question: "O que são créditos?",
    answer: "Créditos são a moeda interna do Racha. Você compra créditos (1 crédito = R$ 1,00) e os usa para pagar sua parte nos cartões. Uma taxa de 2% é cobrada na compra."
  },
  {
    question: "Quando os dados do cartão são liberados?",
    answer: "Os dados do cartão (número, CVV, validade) são liberados apenas quando todos os participantes pagaram suas partes. Antes disso, o cartão fica com status pendente ou ativo."
  },
  {
    question: "Como funciona a divisão de valores?",
    answer: "Por padrão, o valor é dividido igualmente entre todos os participantes. Se você criar um cartão de R$ 40,90 para 4 pessoas, cada um pagará R$ 10,23."
  },
  {
    question: "Posso cancelar um cartão?",
    answer: "Atualmente não há opção de cancelar cartões. Esta é uma funcionalidade que será implementada em versões futuras."
  },
  {
    question: "Os cartões funcionam para compras reais?",
    answer: "Não, esta é uma demonstração/simulação. Os cartões gerados são fictícios e servem apenas para mostrar como o sistema funcionaria."
  },
  {
    question: "Como encontro meu código único?",
    answer: "Seu código único está disponível nas aba de configurações e na aba de notificações. Compartilhe-o com amigos para receber convites."
  }
]

export default function SuportePage() {
  const { user } = useAuth()
  const [ticketData, setTicketData] = useState({
    assunto: '',
    categoria: '',
    descricao: '',
    prioridade: 'normal'
  })
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleInputChange = (field: string, value: string) => {
    setTicketData(prev => ({ ...prev, [field]: value }))
  }

  const handleSubmitTicket = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!ticketData.assunto || !ticketData.categoria || !ticketData.descricao) {
      toast.error('Preencha todos os campos obrigatórios')
      return
    }

    setIsSubmitting(true)

    try {
      await new Promise(resolve => setTimeout(resolve, 2000))
      
      const tickets = JSON.parse(localStorage.getItem('racha_tickets') || '[]')
      const newTicket = {
        id: Date.now().toString(),
        userId: user?.id,
        userName: user?.nomeCompleto || user?.nomeCompleto,
        userEmail: user?.email,
        ...ticketData,
        status: 'aberto',
        dataAbertura: new Date().toISOString(),
        protocolo: `RCH${Date.now().toString().slice(-6)}`
      }
      
      tickets.push(newTicket)
      localStorage.setItem('racha_tickets', JSON.stringify(tickets))
      
      setTicketData({
        assunto: '',
        categoria: '',
        descricao: '',
        prioridade: 'normal'
      })
      
      toast.success(`Ticket criado com sucesso! Protocolo: ${newTicket.protocolo}`)
      
    } catch (error) {
      toast.error('Erro ao criar ticket. Tente novamente.')
    } finally {
      setIsSubmitting(false)
    }
  }

  if (!user) return null

  return (
    <div className="min-h-screen p-6 lg:p-10 bg-black text-white">
      {/* Cabeçalho */}
      <div className="mb-8">
        <h1 className="text-3xl lg:text-4xl font-bold">Suporte</h1>
        <p className="text-sm opacity-80">Tire suas dúvidas ou entre em contato conosco</p>
      </div>

      <Tabs defaultValue="faq" className="space-y-6">
        <TabsList className="grid w-full grid-cols-2 max-w-md mx-auto bg-white/10 rounded-xl backdrop-blur-md">
          <TabsTrigger
            value="faq"
            className="data-[state=active]:bg-red-600 data-[state=active]:text-white text-gray-200 transition-colors"
          >
            Perguntas Frequentes
          </TabsTrigger>
          <TabsTrigger
            value="ticket"
            className="data-[state=active]:bg-red-600 data-[state=active]:text-white text-gray-200 transition-colors"
          >
            Abrir Ticket
          </TabsTrigger>
        </TabsList>

        {/* FAQ */}
        <TabsContent value="faq" className="space-y-6">
          <Card className="bg-red-600/20 border border-red-500/30 shadow-lg text-white">
            <CardHeader>
              <CardTitle>Perguntas Frequentes</CardTitle>
              <CardDescription className="text-gray-300">
                Respostas para as dúvidas mais comuns sobre o Racha
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Accordion type="single" collapsible className="w-full">
                {faqData.map((item, index) => (
                  <AccordionItem key={index} value={`item-${index}`}>
                    <AccordionTrigger className="text-left text-white hover:text-red-400">{item.question}</AccordionTrigger>
                    <AccordionContent className="text-gray-300">{item.answer}</AccordionContent>
                  </AccordionItem>
                ))}
              </Accordion>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Ticket */}
        <TabsContent value="ticket" className="space-y-6">
          <Card className="bg-red-600/20 border border-red-500/30 shadow-lg text-white">
            <CardHeader>
              <CardTitle>Abrir Ticket</CardTitle>
              <CardDescription className="text-gray-300">
                Descreva seu problema ou dúvida e nossa equipe te ajudará
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmitTicket} className="space-y-4">
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="assunto" className="text-white">Assunto *</Label>
                    <Input
                      id="assunto"
                      className="bg-white/10 border-white/20 text-white placeholder:text-gray-400"
                      value={ticketData.assunto}
                      onChange={(e) => handleInputChange('assunto', e.target.value)}
                      placeholder="Resumo do problema ou dúvida"
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="categoria" className="text-white">Categoria *</Label>
                    <Select value={ticketData.categoria} onValueChange={(value) => handleInputChange('categoria', value)}>
                      <SelectTrigger className="bg-white/10 border-white/20 text-white">
                        <SelectValue placeholder="Selecione uma categoria" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="cartao">Problemas com Cartões</SelectItem>
                        <SelectItem value="pagamento">Pagamentos e Créditos</SelectItem>
                        <SelectItem value="conta">Conta e Perfil</SelectItem>
                        <SelectItem value="convite">Convites e Notificações</SelectItem>
                        <SelectItem value="tecnico">Problema Técnico</SelectItem>
                        <SelectItem value="sugestao">Sugestão/Melhoria</SelectItem>
                        <SelectItem value="outros">Outros</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="descricao" className="text-white">Descrição *</Label>
                  <Textarea
                    id="descricao"
                    className="bg-white/10 border-white/20 text-white placeholder:text-gray-400"
                    value={ticketData.descricao}
                    onChange={(e) => handleInputChange('descricao', e.target.value)}
                    rows={5}
                    placeholder="Descreva detalhadamente seu problema..."
                    required
                  />
                </div>

                <Button
                  type="submit"
                  className="w-full bg-red-600 text-white font-bold hover:bg-red-700 transition"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? 'Enviando...' : 'Enviar Ticket'}
                </Button>
              </form>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
