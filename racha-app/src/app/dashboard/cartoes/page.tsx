"use client";

import { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { useAuth } from "@/components/providers/auth-provider";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { formatCurrency } from "@/lib/utils/validation";
import { Cartao } from "@/core/models/Cartao";

export default function CartoesPage() {
  const { user } = useAuth();
  const searchParams = useSearchParams();
  const [cartoes, setCartoes] = useState<Cartao[]>([]);
  const [loading, setLoading] = useState(true);

  const loadCartoes = async () => {
    if (!user) {
      console.log("Usuário não carregado - não carregando cartões");
      setLoading(false);
      return;
    }

    try {
      console.log("Iniciando carregamento de cartões para usuário ID:", user.id);
      const response = await fetch(`http://localhost:5208/api/Cartao/usuario/${user.id}`);
      console.log("Resposta da API:", response.status, response.statusText);
      if (response.ok) {
        const data = await response.json();
        console.log("Cartões recebidos:", data);
        setCartoes(data);
      } else {
        console.error("Erro na resposta da API:", await response.text());
      }
    } catch (error) {
      console.error("Erro ao carregar cartões:", error);
    } finally {
      setLoading(false);
      console.log("Carregamento de cartões concluído");
    }
  };

  useEffect(() => {
    loadCartoes();
  }, [user]);

  useEffect(() => {
    if (searchParams.get("reload") === "true") {
      loadCartoes();
    }
  }, [searchParams]);

  const getStatusColor = (status: string) => {
    switch (status) {
      case "ativo":
        return "bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400";
      case "pendente":
        return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400";
      case "validado":
        return "bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-400";
      default:
        return "bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-400";
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case "ativo":
        return "Ativo";
      case "pendente":
        return "Pendente";
      case "validado":
        return "Validado";
      default:
        return "Desconhecido";
    }
  };

  const getProgressInfo = (cartao: Cartao) => {
    if (!user) return { text: "", progress: 0 };

    const pagamentosRealizados = cartao.pagamentosRealizados || 0;
    const participantesAceitos = cartao.participantesAceitos || 0;

    if (cartao.status === "pendente") {
      return {
        text: `${participantesAceitos}/${cartao.numeroParticipantes - 1} participantes aceitos`,
        progress: (participantesAceitos / (cartao.numeroParticipantes - 1)) * 100 || 0,
      };
    }

    if (cartao.status === "ativo") {
      return {
        text: `${pagamentosRealizados}/${cartao.numeroParticipantes} pagamentos realizados`,
        progress: (pagamentosRealizados / cartao.numeroParticipantes) * 100,
      };
    }

    return { text: "Cartão disponível", progress: 100 };
  };

  if (loading) {
    return (
      <div className="p-4 lg:p-6 space-y-6 bg-gradient-to-br from-primary to-red-600 text-white">
        <p className="text-center">Carregando cartões...</p>
      </div>
    );
  }

  return (
    <div className="p-4 lg:p-6 space-y-6 bg-gradient-to-br from-primary to-red-600 text-white border-0 shadow-lg">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div className="space-y-2">
          <h1 className="text-2xl lg:text-3xl font-bold text-foreground">Meus Cartões</h1>
          <p className="text-muted-foreground">Gerencie seus cartões compartilhados</p>
        </div>
        <Button asChild className="racha-gradient racha-gradient-hover">
          <Link href="/dashboard/cartoes/novo">
            <svg
              className="w-4 h-4 mr-2"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 6v6m0 0v6m0-6h6m-6 0H6"
              />
            </svg>
            Novo Cartão
          </Link>
        </Button>
      </div>

      {cartoes.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {cartoes.map((cartao) => {
            const progressInfo = getProgressInfo(cartao);
            const isCreator = cartao.criadorId === user?.id;

            return (
              <Card key={cartao.id} className="hover:shadow-lg transition-shadow">
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-black">{cartao.nome}</CardTitle>
                    <Badge className={getStatusColor(cartao.status)}>
                      {getStatusText(cartao.status)}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <div className="flex justify-between text-black">
                      <span className="text-muted-foreground">Participantes:</span>
                      <span>{cartao.numeroParticipantes} pessoas</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Valor por pessoa:</span>
                      <span className="font-medium text-primary">
                        {formatCurrency(cartao.valor / cartao.numeroParticipantes)}
                      </span>
                    </div>
                    
                    {cartao.descricao && (
                      <div className="text-sm text-muted-foreground">{cartao.descricao}</div>
                    )}
                  </div>

                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">{progressInfo.text}</span>
                      <span>{Math.round(progressInfo.progress)}%</span>
                    </div>
                    <div className="w-full bg-muted rounded-full h-2">
                      <div
                        className="bg-primary rounded-full h-2 transition-all duration-300"
                        style={{ width: `${progressInfo.progress}%` }}
                      ></div>
                    </div>
                  </div>

                  <div className="text-xs text-muted-foreground">
                    Criado em {new Date(cartao.dataCriacao).toLocaleDateString("pt-BR")}
                  </div>

                  <Button asChild size="sm" className="w-full bg-red-800">
                    <Link href={`/dashboard/cartoes/${cartao.id}`}>
                      {isCreator ? "Gerenciar" : "Ver Detalhes"}
                    </Link>
                  </Button>
                </CardContent>
              </Card>
            );
          })}
        </div>
      ) : (
        <div className="text-center py-12">
          <svg
            className="w-16 h-16 text-muted-foreground mx-auto mb-4"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={1}
              d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"
            />
          </svg>
          <h3 className="text-lg font-medium text-foreground mb-2">
            Nenhum cartão encontrado
          </h3>
          <p className="text-muted-foreground mb-6">
            Crie seu primeiro cartão para dividir contas com amigos
          </p>
          <Button asChild className="bg-black hover:bg-red-900">
            <Link href="/dashboard/cartoes/novo">Criar Primeiro Cartão</Link>
          </Button>
        </div>
      )}
    </div>
  );
}