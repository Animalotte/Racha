export class Cartao {
  id: number;
  nome: string;
  valor: number;
  numeroParticipantes: number;
  status: "pendente" | "ativo" | "validado";
  dataCriacao: string;
  pagamentosRealizados: number;
  participantesAceitos?: number;
  criadorId?: number;
  criadorNome?: string;
  descricao?: string;

  constructor(
    id: number,
    nome: string,
    valor: number,
    numeroParticipantes: number,
    status: "pendente" | "ativo" | "validado",
    dataCriacao: string,
    pagamentosRealizados: number,
    participantesAceitos?: number,
    criadorId?: number,
    criadorNome?: string,
    descricao?: string
  ) {
    this.id = id;
    this.nome = nome;
    this.valor = valor;
    this.numeroParticipantes = numeroParticipantes;
    this.status = status;
    this.dataCriacao = dataCriacao;
    this.pagamentosRealizados = pagamentosRealizados;
    this.participantesAceitos = participantesAceitos;
    this.criadorId = criadorId;
    this.criadorNome = criadorNome;
    this.descricao = descricao;
  }
}

interface Participante {
  id: number;
  nome: string;
  email: string;
  status: "pendente" | "aceito";
  valorPago: number;
  pagamentoRealizado: boolean;
}

interface DadosCartao {
  numero: string;
  cvv: string;
  validade: string;
  nome: string;
}