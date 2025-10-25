"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { useAuth } from "@/components/providers/auth-provider";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import Link from "next/link";
import { formatCurrency } from "@/lib/utils/validation";

interface Participante {
  id: number;
  nome: string;
  email: string;
  status: "pendente" | "aceito";
  pagamentoRealizado: boolean;
  valorPago?: number;
}

interface DadosCartao {
  numero: string;
  cvv: string;
  validade: string;
  nome: string;
}

interface Cartao {
  id: number;
  nome: string;
  valor: number;
  numeroParticipantes: number;
  descricao?: string;
  criadorId: number;
  criadorNome: string;
  status: "pendente" | "ativo" | "validado";
  dataCriacao: string;
  participantes: Participante[];
  pagamentosRealizados: number;
  dadosCartao?: DadosCartao;
}

async function readResponseOnce(response: Response) {
  const text = await response.text();
  let json: any = null;
  try {
    if (text) {
      json = JSON.parse(text);
    }
  } catch {

  }
  return { text, json };
}

export default function CartaoDetailsPage() {
  const { id: cartaoId } = useParams();
  const router = useRouter();
  const { user, updateUser } = useAuth();

  const [cartao, setCartao] = useState<Cartao | null>(null);
  const [codigoConvite, setCodigoConvite] = useState("");
  const [loading, setLoading] = useState(true);
  const [enviando, setEnviando] = useState(false);
  const [pagando, setPagando] = useState(false);

  const API = "http://localhost:5208/api/Cartao";

  const loadCartao = async () => {
    setLoading(true);
    try {
      if (!user?.id || !cartaoId) return;
      const res = await fetch(`${API}/${cartaoId}`);
      if (!res.ok) throw new Error("Cartão não encontrado");
      const data: Cartao = await res.json();
      setCartao(data);
    } catch {
      toast.error("Erro ao carregar cartão");
      router.push("/dashboard/cartoes");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadCartao();
  }, [user?.id, cartaoId]);

  const isCreator = cartao?.criadorId === Number(user?.id);
  const myParticipant = cartao?.participantes.find(p => p.id === Number(user?.id));
  const isParticipant = !!myParticipant && myParticipant.status === "aceito";

  const valorPorPessoa = cartao ? cartao.valor / cartao.numeroParticipantes : 0;
  const acceptedCount = cartao?.participantes.filter(p => p.status === "aceito").length ?? 0;

  useEffect(() => {
    if (cartao) {
      console.log('Cartão carregado:', cartao);
      console.log('Usuário ID:', user?.id, ' (tipo:', typeof user?.id, ')');
      console.log('Participantes IDs:', cartao.participantes.map(p => ({id: p.id, type: typeof p.id})));
      console.log('isCreator:', isCreator);
      console.log('myParticipant:', myParticipant);
      console.log('isParticipant:', isParticipant);
      console.log('Status do cartão:', cartao.status);
    }
  }, [cartao, user]);

  const handleConvidar = async () => {
    if (!cartao || !user) return;
    if (acceptedCount >= cartao.numeroParticipantes) {
      toast.error("Número máximo de participantes já atingido");
      return;
    }
    setEnviando(true);
    try {
      const response = await fetch(`${API}/${cartao.id}/convidar`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ CodigoUnico: codigoConvite.trim().toUpperCase() })
      });

      const { text, json } = await readResponseOnce(response);

      if (!response.ok) {
        const errorMessage =
          (json && (json.message || json.error || json.title)) ||
          text ||
          "Erro ao convidar";
        throw new Error(errorMessage);
      }

      setCodigoConvite("");
      toast.success("Convite enviado!");
      loadCartao();
    } catch (e: any) {
      toast.error(e.message);
    } finally {
      setEnviando(false);
    }
  };

  const aceitarConvite = async () => {
    try {
      const response = await fetch(`${API}/${cartao!.id}/aceitar`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ UsuarioId: Number(user!.id) })
      });

      const { text, json } = await readResponseOnce(response);

      if (!response.ok) {
        const errorMessage =
          (json && (json.message || json.error || json.title)) ||
          text ||
          "Erro ao aceitar";
        throw new Error(errorMessage);
      }

      toast.success("Convite aceito!");
      loadCartao();
    } catch (e: any) {
      toast.error(e.message);
    }
  };

  const rejeitarConvite = async () => {
    try {
      const response = await fetch(`${API}/${cartao!.id}/rejeitar`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ UsuarioId: Number(user!.id) })
      });

      const { text, json } = await readResponseOnce(response);

      if (!response.ok) {
        const errorMessage =
          (json && (json.message || json.error || json.title)) ||
          text ||
          "Erro ao rejeitar";
        throw new Error(errorMessage);
      }

      toast.success("Convite rejeitado");
      loadCartao();
    } catch (e: any) {
      toast.error(e.message);
    }
  };

  const pagar = async () => {
    if (!cartao || !user) return;
    if (myParticipant?.pagamentoRealizado) {
      toast.info("Você já pagou sua parte");
      return;
    }
    if ((user.creditos ?? 0) < valorPorPessoa) {
      toast.error("Saldo insuficiente");
      router.push("/dashboard/creditos/comprar");
      return;
    }

    setPagando(true);
    try {
      const response = await fetch(`${API}/${cartao.id}/pagar`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ParticipanteId: Number(user.id) })
      });

      const { text, json } = await readResponseOnce(response);

      if (!response.ok) {
        const errorMessage =
          (json && (json.message || json.error || json.title)) ||
          text ||
          "Erro ao pagar";
        throw new Error(errorMessage);
      }

      updateUser({ creditos: (user.creditos ?? 0) - valorPorPessoa });
      toast.success("Pagamento realizado!");
      loadCartao();
    } catch (e: any) {
      toast.error(e.message);
    } finally {
      setPagando(false);
    }
  };

  if (loading) {
    return (
      <div className="p-4 lg:p-6 max-w-4xl mx-auto">
        <div className="animate-pulse space-y-6">
          <div className="h-8 bg-muted rounded w-1/3"></div>
          <div className="h-32 bg-muted rounded"></div>
          <div className="h-48 bg-muted rounded"></div>
        </div>
      </div>
    );
  }

  if (!cartao) {
    return (
      <div className="p-4 lg:p-6 text-center">
        <p className="text-muted-foreground">Cartão não encontrado</p>
        <Button asChild className="mt-4">
          <Link href="/dashboard/cartoes">Voltar</Link>
        </Button>
      </div>
    );
  }

  const badgeColor = (s: string) => {
    if (s === "ativo") return "bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400";
    if (s === "pendente") return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400";
    if (s === "validado") return "bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-400";
    return "bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-400";
  };

  return (
    <div className="p-4 lg:p-6 max-w-4xl mx-auto space-y-6 bg-gradient-to-br from-black to-red-900 text-white">
      <div className="space-y-2">
        <div className="flex items-center space-x-2 text-sm text-gray-300">
          <Link href="/dashboard/cartoes" className="hover:text-white">Cartões</Link>
          <span>•</span>
          <span>{cartao.nome}</span>
        </div>
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h1 className="text-2xl lg:text-3xl font-bold text-white">{cartao.nome}</h1>
            <p className="text-gray-300">
              {isCreator ? "Criado por você" : `Criado por ${cartao.criadorNome || 'Desconhecido'}`}
            </p>
          </div>
          <Badge className={badgeColor(cartao.status)}>
            {cartao.status === "ativo" ? "Ativo" : cartao.status === "pendente" ? "Pendente" : "Validado"}
          </Badge>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Card className="bg-gradient-to-br from-primary to-red-600 text-white border-0 shadow-lg">
          <CardHeader><CardTitle className="text-white">Informações</CardTitle></CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div><p className="text-sm text-gray-200">Valor Total</p><p className="text-2xl font-bold">{formatCurrency(cartao.valor)}</p></div>
              <div><p className="text-sm text-gray-200">Por Pessoa</p><p className="text-2xl font-bold">{formatCurrency(valorPorPessoa)}</p></div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div><p className="text-sm text-gray-200">Participantes</p><p className="text-lg font-medium">{cartao.numeroParticipantes}</p></div>
              <div><p className="text-sm text-gray-200">Pagamentos</p><p className="text-lg font-medium text-green-300">{cartao.pagamentosRealizados ?? 0}/{cartao.numeroParticipantes}</p></div>
            </div>
            {cartao.descricao && <div><p className="text-sm text-gray-200">Descrição</p><p className="text-sm">{cartao.descricao}</p></div>}
            <div><p className="text-sm text-gray-200">Criado em</p><p className="text-sm">{new Date(cartao.dataCriacao).toLocaleDateString("pt-BR")}</p></div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-primary to-red-600 text-white border-0 shadow-lg">
          <CardHeader><CardTitle className="text-white">Ações</CardTitle></CardHeader>
          <CardContent className="space-y-4">
            {isCreator && cartao.status === "pendente" && acceptedCount < cartao.numeroParticipantes && (
              <div className="space-y-3">
                <Label htmlFor="convite" className="text-gray-200">Convidar</Label>
                <div className="flex space-x-2">
                  <Input
                    id="convite"
                    value={codigoConvite}
                    onChange={e => setCodigoConvite(e.target.value)}
                    placeholder="Código único"
                    className="flex-1 bg-gray-800 text-white border-gray-700"
                  />
                  <Button onClick={handleConvidar} disabled={enviando || !codigoConvite.trim()} className="bg-white text-primary hover:bg-gray-200">
                    {enviando ? "Enviando…" : "Convidar"}
                  </Button>
                </div>
                <p className="text-xs text-gray-200">{cartao.numeroParticipantes - acceptedCount} vagas restantes</p>
              </div>
            )}

            {cartao.status === "pendente" && !isCreator && myParticipant?.status === "pendente" && (
              <div className="space-y-3">
                <Button onClick={aceitarConvite} className="w-full bg-green-600 hover:bg-green-700">Aceitar</Button>
                <Button onClick={rejeitarConvite} variant="outline" className="w-full text-red-400 border-red-400 hover:bg-red-900/20">Rejeitar</Button>
              </div>
            )}

            {cartao.status === "ativo" && isParticipant && (
              <div className="space-y-3">
                <div className="bg-white/10 border border-white/20 rounded-lg p-4 text-center">
                  <p className="text-sm text-gray-200 mb-2">Sua parte</p>
                  <p className="text-2xl font-bold">{formatCurrency(valorPorPessoa)}</p>
                  <p className="text-xs text-gray-200 mt-1">Saldo: {formatCurrency(user?.creditos ?? 0)}</p>
                </div>

                {myParticipant?.pagamentoRealizado ? (
                  <div className="bg-green-900/20 border border-green-700 rounded-lg p-4 text-center">
                    <p className="text-sm font-medium text-green-400">Você já pagou</p>
                  </div>
                ) : (
                  <Button onClick={pagar} disabled={pagando} className="w-full bg-white text-primary hover:bg-gray-200">
                    {pagando ? "Processando…" : "Pagar Agora"}
                  </Button>
                )}
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      <Card className="bg-gradient-to-br from-primary to-red-600 text-white border-0 shadow-lg">
        <CardHeader>
          <CardTitle className="text-white">
            Participantes ({acceptedCount}/{cartao.numeroParticipantes})
          </CardTitle>
          <CardDescription className="text-gray-200">Status e pagamentos</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {cartao.participantes
              .sort((a, b) => (a.id === cartao.criadorId ? -1 : b.id === cartao.criadorId ? 1 : 0))
              .map(p => (
                <div key={p.id} className="flex items-center justify-between p-4 bg-white/10 border border-white/20 rounded-lg">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-gray-800 rounded-full flex items-center justify-center">
                      <svg className="w-5 h-5 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                      </svg>
                    </div>
                    <div>
                      <p className="font-medium flex items-center">
                        {p.id === cartao.criadorId && (
                          <svg className="w-4 h-4 text-yellow-400 mr-1" fill="currentColor" viewBox="0 0 24 24">
                            <path d="M12 3l3 6h6l-3 5 3 6H3l3-6-3-5h6l3-6z" />
                          </svg>
                        )}
                        {p.nome} {p.id === Number(user?.id) && "(Você)"}
                      </p>
                      <p className="text-sm text-gray-300">{p.email}</p>
                      {p.pagamentoRealizado && p.valorPago !== undefined && (
                        <p className="text-xs text-green-400">
                          Pagamento realizado: {formatCurrency(p.valorPago)}
                        </p>
                      )}
                    </div>
                  </div>

                  <div className="flex items-center space-x-2">
                    {p.id === cartao.criadorId && <Badge className="bg-white text-primary border-white">Criador</Badge>}
                    <Badge className={p.status === "aceito" ? "bg-gray-800 text-green-400 border-green-600" : "bg-gray-800 text-yellow-400 border-yellow-600"}>
                      {p.status === "aceito" ? "Participando" : "Pendente"}
                    </Badge>
                    {p.pagamentoRealizado ? (
                      <Badge className="bg-white text-primary border-white">Pago</Badge>
                    ) : p.status === "aceito" ? (
                      <Badge className="bg-gray-800 text-red-400 border-red-600">Deve pagar</Badge>
                    ) : null}
                  </div>
                </div>
              ))}

            {cartao.status === "pendente" && acceptedCount < cartao.numeroParticipantes && (
              <div className="text-center p-4 bg-white/10 border border-white/20 rounded-lg">
                <p className="text-sm text-gray-300">
                  {cartao.numeroParticipantes - acceptedCount} convites ainda não aceitos
                </p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {cartao.status === "validado" && cartao.dadosCartao && (
        <Card className="bg-gradient-to-br from-primary to-red-600 text-white border-0 shadow-lg">
          <CardHeader>
            <CardTitle className="text-white">Cartão Disponível</CardTitle>
            <CardDescription className="text-gray-200">Use os dados abaixo</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="bg-gradient-to-br from-primary to-red-600 rounded-xl p-6 text-white relative overflow-hidden shadow-lg">
              <div className="relative z-10">
                <div className="flex justify-between items-start mb-8">
                  <div>
                    <p className="text-gray-200 text-sm">CARTÃO VIRTUAL</p>
                    <p className="font-bold text-lg">{cartao.dadosCartao.nome}</p>
                  </div>
                  <div className="w-12 h-8 bg-gradient-to-br from-yellow-400 to-yellow-600 rounded"></div>
                </div>
                <div className="mb-6">
                  <p className="text-2xl font-mono tracking-wider">{cartao.dadosCartao.numero}</p>
                </div>
                <div className="flex justify-between items-end">
                  <div>
                    <p className="text-gray-200 text-xs">VÁLIDO ATÉ</p>
                    <p className="font-mono text-lg">{cartao.dadosCartao.validade}</p>
                  </div>
                  <div>
                    <p className="text-gray-200 text-xs">CVV</p>
                    <p className="font-mono text-lg">{cartao.dadosCartao.cvv}</p>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}