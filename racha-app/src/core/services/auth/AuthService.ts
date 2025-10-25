import { IAuthService } from './IAuthService'
import { Usuario } from '@/core/models/Usuario'

export class AuthService implements IAuthService {
  private currentUser: Usuario | null = null
  private readonly storageKey = 'racha_user'

  async login(cpf: string, senha: string): Promise<Usuario | null> {
    try {
      const response = await fetch('http://localhost:5208/api/Usuario/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ Cpf: cpf, Senha: senha })
      })

      if (!response.ok) {
        const error = await response.json().catch(() => ({}))
        console.error('Login falhou:', error)
        return null
      }

      const data = await response.json()

      const user = new Usuario(
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

      this.currentUser = user
      localStorage.setItem(this.storageKey, JSON.stringify(user))
      return user
    } catch (error) {
      console.error('Erro no login:', error)
      return null
    }
  }

  getCurrentUser(): Usuario | null {
    if (this.currentUser) return this.currentUser
    const raw = localStorage.getItem(this.storageKey)
    if (!raw) return null
    try {
      const data = JSON.parse(raw)
      const user = new Usuario(
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
      this.currentUser = user
      return user
    } catch {
      return null
    }
  }

  logout(): void {
    this.currentUser = null
    localStorage.removeItem(this.storageKey)
  }

  setCurrentUser(user: Usuario): void {
    this.currentUser = user
    localStorage.setItem(this.storageKey, JSON.stringify(user))
  }
}