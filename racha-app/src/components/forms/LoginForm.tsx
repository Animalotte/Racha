'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { toast } from 'sonner'
import Link from 'next/link'
import { useAuth } from '@/components/providers/auth-provider'
import { formatCPF } from '@/lib/utils/validation'

export const LoginForm = () => {
  const router = useRouter()
  const { login } = useAuth()
  const [cpf, setCPF] = useState('')
  const [senha, setSenha] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [errors, setErrors] = useState<{ cpf?: string; senha?: string }>({})

  const handleCPFChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/\D/g, '')
    setCPF(value)
    if (errors.cpf) {
      setErrors(prev => ({ ...prev, cpf: '' }))
    }
  }

  const handleSenhaChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSenha(e.target.value)
    if (errors.senha) {
      setErrors(prev => ({ ...prev, senha: '' }))
    }
  }

  const validateForm = (): boolean => {
    const newErrors: { cpf?: string; senha?: string } = {}
    if (!cpf) {
      newErrors.cpf = 'CPF é obrigatório'
    } else if (cpf.length !== 11) {
      newErrors.cpf = 'CPF deve ter 11 dígitos'
    }
    if (!senha) {
      newErrors.senha = 'Senha é obrigatória'
    }
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!validateForm()) {
      return
    }
    setIsLoading(true)

    console.log('Enviando login - CPF (sem máscara):', cpf, 'Senha:', senha);

    try {
      const success = await login(cpf, senha)
      if (success) {
        toast.success('Login realizado com sucesso!')
        router.push('/dashboard')
      } else {
        toast.error('CPF ou senha incorretos')
        setErrors({ 
          cpf: 'Credenciais inválidas',
          senha: 'Credenciais inválidas'
        })
      }
    } catch (error) {
      console.error('Erro no login:', error)
      toast.error('Erro interno. Tente novamente.')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary to-red-600 text-white border-0 shadow-lg flex items-center justify-center p-4">
      <Card className="w-full max-w-md bg-black border-red-600">
        <CardHeader className="text-center">
          <div className="flex items-center justify-center space-x-2 mb-4">
            <img src="/racha-logo-completa.png" alt="Racha Logo" width={200} height={200} />
          </div>
          <CardTitle className="text-2xl text-gray-100">Fazer Login</CardTitle>
          <CardDescription className="text-gray-400">
            Entre com seu CPF e senha para continuar
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="cpf" className="text-white">CPF</Label>
              <Input
                id="cpf"
                type="text"
                value={formatCPF(cpf)}
                onChange={handleCPFChange}
                placeholder="000.000.000-00"
                maxLength={14}
                className={`focus-visible:ring-0 focus-visible:ring-offset-0 focus:outline-none ${errors.cpf ? 'border-destructive' : ''}`}
                autoComplete="username"
              />
              {errors.cpf && <p className="text-sm text-destructive">{errors.cpf}</p>}
            </div>
            <div className="space-y-2">
              <Label htmlFor="senha" className="text-white">Senha</Label>
              <Input
                id="senha"
                type="password"
                value={senha}
                onChange={handleSenhaChange}
                placeholder="Digite sua senha"
                className={`focus-visible:ring-0 focus-visible:ring-offset-0 focus:outline-none ${errors.senha ? 'border-destructive' : ''}`}
                autoComplete="current-password"
              />
              {errors.senha && <p className="text-sm text-destructive">{errors.senha}</p>}
            </div>
            <Button 
              type="submit" 
              className="w-full racha-gradient racha-gradient-hover"
              disabled={isLoading}
            >
              {isLoading ? 'Entrando...' : 'Entrar'}
            </Button>
            <div className="text-center space-y-2">
              <p className="text-sm text-muted-foreground">
                Não tem uma conta?{' '}
                <Link href="/auth/cadastro" className="text-gray-500 hover:text-red-800">
                  Cadastre-se
                </Link>
              </p>
              <Link href="/" className="text-sm text-muted-foreground hover:text-red-800">
                ← Voltar ao início
              </Link>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}