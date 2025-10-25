"use client";

import { useState, useEffect } from "react";
import { useAuth } from "@/components/providers/auth-provider";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { toast } from "sonner";

interface Stats {
  createdCards: number;
  participations: number;
}

export default function ConfiguracoesPage() {
  const { user } = useAuth();
  const [stats, setStats] = useState<Stats>({ createdCards: 0, participations: 0 });

  const API = "http://localhost:5208/api/Usuario";

  useEffect(() => {
    if (user) {
      loadUserStats();
    }
  }, [user]);

  const loadUserStats = async () => {
    try {
      if (!user?.id) return;
      const res = await fetch(`${API}/stats/${user.id}`);
      if (res.ok) {
        const data = await res.json();
        setStats({ createdCards: data.createdCards || 0, participations: data.participations || 0 });
      }
    } catch (error) {
      console.error("Erro ao carregar estatísticas:", error);
    }
  };

  if (!user) return null;

  return (
    <div className="min-h-screen bg-black text-white p-6 lg:p-10 space-y-8">
      {/* Header */}
      <div className="space-y-2">
        <h1 className="text-2xl lg:text-3xl font-semibold">Configurações</h1>
        <p className="text-white/60">Gerencie sua conta e preferências</p>
      </div>

      <div className="grid gap-8 md:grid-cols-2">
        {/* Informações Pessoais */}
        <Card className="bg-gradient-to-br from-primary to-red-600 text-white shadow-lg border-white-80 rounded-xl">
          <CardHeader>
            <CardTitle className="text-white/90">Informações Pessoais</CardTitle>
            <CardDescription className="text-white/60">
              Veja seus dados pessoais
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <Label className="text-white/60">Nome Completo</Label>
                <p className="text-white py-1">{user.nomeCompleto || "Não informado"}</p>
              </div>
              <div>
                <Label className="text-white/60">Email</Label>
                <p className="text-white py-1">{user.email || "Não informado"}</p>
              </div>
            </div>

            <Separator className="bg-white" />

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <Label className="text-white/60">CPF</Label>
                <p className="text-white py-1 text-sm">{user.cpf || "Não informado"}</p>
              </div>
              <div>
                <Label className="text-white/60">CEP</Label>
                <p className="text-white py-1 text-sm">{user.cep || "Não informado"}</p>
              </div>
            </div>

            <Separator className="bg-white" />

            <div className="space-y-4">
              <h4 className="font-medium text-white/90">Endereço</h4>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="md:col-span-2">
                  <Label className="text-white/60">Endereço</Label>
                  <p className="text-white py-1">{user.endereco || "Não informado"}</p>
                </div>
                <div>
                  <Label className="text-white/60">Cidade</Label>
                  <p className="text-white py-1">{user.cidade || "Não informado"}</p>
                </div>
              </div>
              <div>
                <Label className="text-white/60">Estado</Label>
                <p className="text-white py-1">{user.estado || "Não informado"}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Informações da Conta */}
        <Card className="bg-gradient-to-br from-primary to-red-600 text-white shadow-lg  border-white-80  rounded-xl">
          <CardHeader>
            <CardTitle className="text-white/90">Informações da Conta</CardTitle>
            <CardDescription className="text-white/60">
              Dados sobre sua conta e estatísticas
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-3">
                <div>
                  <p className="text-sm text-white/60">Membro desde</p>
                  <p className="font-medium text-white">
                    {new Date(user.dataCadastro).toLocaleDateString("pt-BR")}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-white/60">Saldo atual</p>
                  <p className="font-bold text-lg text-white">
                    R$ {user.creditos.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}
                  </p>
                </div>
              </div>

              <div className="space-y-3">
                <div>
                  <p className="text-sm text-white/60">Código Único</p>
                  <div className="flex items-center gap-2">
                    <p className="font-mono font-bold text-white bg-red-900 px-3 py-2 rounded border border-red-800/30">
                      {user.codigoUnico}
                    </p>
                    <Button
                      variant="outline"
                      size="sm"
                      className="border border-red-800/40 bg-red-900/20 text-white hover:bg-black"
                      onClick={() => {
                        navigator.clipboard.writeText(user.codigoUnico);
                        toast.success("Código copiado!");
                      }}>
                      Copiar
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
