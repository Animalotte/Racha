export class Usuario {
  id: string;
  nomeCompleto: string;
  email: string;
  cpf: string;
  dataNascimento: string;
  cep: string;
  endereco: string;
  cidade: string;
  estado: string;
  codigoUnico: string;
  creditos: number;
  dataCadastro: string;

  constructor(
    id: string,
    nomeCompleto: string,
    email: string,
    cpf: string,
    dataNascimento: string,
    cep: string,
    endereco: string,
    cidade: string,
    estado: string,
    codigoUnico: string,
    creditos: number,
    dataCadastro: string
  ) {
    this.id = id;
    this.nomeCompleto = nomeCompleto;
    this.email = email;
    this.cpf = cpf;
    this.dataNascimento = dataNascimento;
    this.cep = cep;
    this.endereco = endereco;
    this.cidade = cidade;
    this.estado = estado;
    this.codigoUnico = codigoUnico;
    this.creditos = creditos;
    this.dataCadastro = dataCadastro;
  }

  getPrimeiroNome(): string {
    return this.nomeCompleto.split(' ')[0]
  }
}