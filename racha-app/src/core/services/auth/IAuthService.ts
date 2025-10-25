import { Usuario } from '@/core/models/Usuario'
export interface IAuthService {
  login(cpf: string, senha: string): Promise<Usuario | null>
  logout(): void
  getCurrentUser(): Usuario | null
  setCurrentUser(user: Usuario): void
}