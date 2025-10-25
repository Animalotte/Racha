'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { toast } from 'sonner'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import Link from 'next/link'
import { formatCPF, formatCEP, validarEmail, validarCPF, validarSenha, validarCamposObrigatorios } from '@/lib/utils/validation'
import { fetchAddressByCEP } from '@/lib/utils/cep'

export const CadastroForm = () => {
  const router = useRouter()

  const [formData, setFormData] = useState({
    nomeCompleto: '',
    email: '',
    cpf: '',
    dataNascimento: '',
    cep: '',
    endereco: '',
    cidade: '',
    estado: '',
    senha: ''
  })

  const [errors, setErrors] = useState<Record<string, string>>({})
  const [isLoading, setIsLoading] = useState(false)

  const handleChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    let newValue = value

    if (name === 'cpf') {
      newValue = value.replace(/\D/g, '')
    } else if (name === 'cep') {
      newValue = value.replace(/\D/g, '')
      if (newValue.length === 8) {
        const address = await fetchAddressByCEP(newValue)
        if (address) {
          setFormData(prev => ({
            ...prev,
            endereco: address.logradouro,
            cidade: address.localidade,
            estado: address.uf
          }))
          toast.success('Endereço preenchido automaticamente!')
        } else {
          toast.error('CEP inválido ou não encontrado.')
        }
      }
    }

    setFormData(prev => ({ ...prev, [name]: newValue }))
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }))
    }
  }

  const validarFormulario = (): boolean => {
    console.log('Estado de formData antes da validação:', formData)
    const novosErros: Record<string, string> = {}
    if (!validarCamposObrigatorios(formData)) {
      novosErros.geral = 'Todos os campos são obrigatórios.'
    }
    if (!validarEmail(formData.email)) {
      novosErros.email = 'Email inválido.'
    }
    if (!validarCPF(formData.cpf)) {
      novosErros.cpf = 'CPF inválido.'
    }
    if (!validarSenha(formData.senha)) {
      novosErros.senha = 'A senha deve ter pelo menos 6 caracteres.'
    }
    if (formData.dataNascimento && !/^\d{4}-\d{2}-\d{2}$/.test(formData.dataNascimento)) {
      novosErros.dataNascimento = 'Data de nascimento deve estar no formato yyyy-MM-dd.'
    }
    setErrors(novosErros)
    return Object.keys(novosErros).length === 0
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!validarFormulario()) {
      return
    }
    setIsLoading(true)

    const usuarioData = {
      NomeCompleto: formData.nomeCompleto,
      Email: formData.email,
      Cpf: formData.cpf,
      DataNascimento: formData.dataNascimento,
      Cep: formData.cep,
      Endereco: formData.endereco,
      Cidade: formData.cidade,
      Estado: formData.estado,
      Senha: formData.senha
    }
    console.log('Dados enviados:', usuarioData)

    try {
      const response = await fetch('http://localhost:5208/api/Usuario/criar', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(usuarioData)
      })

      const responseData = await response.json()
      console.log('Resposta da API:', responseData)

      if (response.ok) {
        toast.success('Usuário cadastrado com sucesso!')
        router.push('/auth/login')
      } else {
        toast.error(responseData.message || 'Erro ao cadastrar usuário.')
      }
    } catch (error) {
      console.error('Erro na requisição:', error)
      toast.error('Erro de conexão com o servidor.')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary to-red-600 text-white flex items-center justify-center p-4">
      <Card className="w-full max-w-md bg-black border-red-600">
        <CardHeader className="text-center">
          <div className="flex items-center justify-center space-x-2 mb-4">
            <img src="/racha-logo-completa.png" alt="Racha Logo" width={200} height={200} />
          </div>
          <CardTitle className="text-2xl text-gray-100">Cadastro</CardTitle>
          <CardDescription className="text-gray-400">
            Preencha os dados para criar sua conta
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="nomeCompleto" className="text-white">Nome Completo</Label>
              <Input id="nomeCompleto" name="nomeCompleto" value={formData.nomeCompleto} onChange={handleChange} placeholder="Seu nome completo" className={errors.nomeCompleto ? 'border-destructive' : ''} />
              {errors.nomeCompleto && <p className="text-sm text-destructive">{errors.nomeCompleto}</p>}
            </div>
            <div className="space-y-2">
              <Label htmlFor="email" className="text-white">Email</Label>
              <Input id="email" type="email" name="email" value={formData.email} onChange={handleChange} placeholder="seu@email.com" className={errors.email ? 'border-destructive' : ''} />
              {errors.email && <p className="text-sm text-destructive">{errors.email}</p>}
            </div>
            <div className="space-y-2">
              <Label htmlFor="cpf" className="text-white">CPF</Label>
              <Input id="cpf" name="cpf" value={formatCPF(formData.cpf)} onChange={handleChange} placeholder="000.000.000-00" maxLength={14} className={errors.cpf ? 'border-destructive' : ''} />
              {errors.cpf && <p className="text-sm text-destructive">{errors.cpf}</p>}
            </div>
            <div className="space-y-2">
              <Label htmlFor="dataNascimento" className="text-white">Data de Nascimento</Label>
              <Input id="dataNascimento" type="date" name="dataNascimento" value={formData.dataNascimento} onChange={handleChange} className={errors.dataNascimento ? 'border-destructive' : ''} />
              {errors.dataNascimento && <p className="text-sm text-destructive">{errors.dataNascimento}</p>}
            </div>
            <div className="space-y-2">
              <Label htmlFor="cep" className="text-white">CEP</Label>
              <Input id="cep" name="cep" value={formatCEP(formData.cep)} onChange={handleChange} placeholder="00000-000" maxLength={9} className={errors.cep ? 'border-destructive' : ''} />
              {errors.cep && <p className="text-sm text-destructive">{errors.cep}</p>}
            </div>
            <div className="space-y-2">
              <Label htmlFor="endereco" className="text-white">Endereço</Label>
              <Input id="endereco" name="endereco" value={formData.endereco} onChange={handleChange} placeholder="Rua, número" className={errors.endereco ? 'border-destructive' : ''} />
              {errors.endereco && <p className="text-sm text-destructive">{errors.endereco}</p>}
            </div>
            <div className="space-y-2">
              <Label htmlFor="cidade" className="text-white">Cidade</Label>
              <Input id="cidade" name="cidade" value={formData.cidade} onChange={handleChange} placeholder="Cidade" className={errors.cidade ? 'border-destructive' : ''} />
              {errors.cidade && <p className="text-sm text-destructive">{errors.cidade}</p>}
            </div>
            <div className="space-y-2">
              <Label htmlFor="estado" className="text-white">Estado</Label>
              <Input id="estado" name="estado" value={formData.estado} onChange={handleChange} placeholder="UF" maxLength={2} className={errors.estado ? 'border-destructive' : ''} />
              {errors.estado && <p className="text-sm text-destructive">{errors.estado}</p>}
            </div>
            <div className="space-y-2">
              <Label htmlFor="senha" className="text-white">Senha</Label>
              <Input id="senha" type="password" name="senha" value={formData.senha} onChange={handleChange} placeholder="Digite sua senha" className={errors.senha ? 'border-destructive' : ''} />
              {errors.senha && <p className="text-sm text-destructive">{errors.senha}</p>}
            </div>
            {errors.geral && <p className="text-sm text-destructive text-center">{errors.geral}</p>}
            <Button type="submit" className="w-full bg-red-600 text-white py-2 rounded-lg hover:bg-red-700" disabled={isLoading}>
              {isLoading ? 'Cadastrando...' : 'Cadastrar'}
            </Button>
            <div className="text-center space-y-2">
              <p className="text-sm text-gray-400">
                Já tem uma conta?{' '}
                <Link href="/auth/login" className="text-gray-300 hover:text-red-400">
                  Faça login
                </Link>
              </p>
              <Link href="/" className="text-sm text-gray-400 hover:text-red-400">
                ← Voltar ao início
              </Link>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}