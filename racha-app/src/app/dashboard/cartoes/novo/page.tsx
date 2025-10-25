"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/components/providers/auth-provider";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import Link from "next/link";
import { formatCurrency } from "@/lib/utils/validation";

interface Convidado {
  codigo: string;
  nome: string;
}

interface FormData {
  nome: string;
  valor: string;
  descricao: string;
  convidados: Convidado[];
}

interface FormErrors {
  [key: string]: string;
}

function parseMoneyToNumber(value: string): number {
  return parseFloat(value.replace(/\./g, "").replace(",", ".")) || 0;
}

function formatMoney(value: string) {
  const numericValue = value.replace(/\D/g, "");
  const amount = parseFloat(numericValue) / 100;
  if (isNaN(amount)) return "";
  return amount.toLocaleString("pt-BR", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
}

async function readResponseOnce(response: Response) {
  const text = await response.text();
  let json: any = null;
  try {
    if (text) {
      json = JSON.parse(text);
    }
  } catch {}
  return { text, json };
}

export default function NovoCartaoPage() {
  const router = useRouter();
  const { user } = useAuth();
  const [formData, setFormData] = useState<FormData>({
    nome: "",
    valor: "",
    descricao: "",
    convidados: [],
  });
  const [novoConvidado, setNovoConvidado] = useState("");
  const [verificandoUsuario, setVerificandoUsuario] = useState(false);
  const [errors, setErrors] = useState<FormErrors>({});
  const [isLoading, setIsLoading] = useState(false);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  const handleMoneyChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const formatted = formatMoney(e.target.value);
    setFormData((prev) => ({ ...prev, valor: formatted }));
    if (errors.valor) {
      setErrors((prev) => ({ ...prev, valor: "" }));
    }
  };

  const validateForm = (): boolean => {
    const newErrors: FormErrors = {};

    if (!formData.nome.trim()) {
      newErrors.nome = "Nome do cartão é obrigatório";
    } else if (formData.nome.trim().length < 3) {
      newErrors.nome = "Nome deve ter pelo menos 3 caracteres";
    }

    const valorNumerico = parseMoneyToNumber(formData.valor);
    if (!formData.valor || valorNumerico <= 0) {
      newErrors.valor = "Valor deve ser maior que zero";
    } else if (valorNumerico < 1) {
      newErrors.valor = "Valor mínimo é R$ 1,00";
    } else if (valorNumerico > 10000) {
      newErrors.valor = "Valor máximo é R$ 10.000,00";
    }

    if (formData.convidados.length === 0) {
      newErrors.convidados = "Convide pelo menos 1 pessoa";
    } else if (formData.convidados.length > 9) {
      newErrors.convidados = "Máximo de 9 convidados permitido";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      toast.error("Por favor, corrija os erros no formulário");
      return;
    }

    if (!user) {
      toast.error("Usuário não encontrado");
      return;
    }

    setIsLoading(true);

    try {
      const valorNumerico = parseMoneyToNumber(formData.valor);

      const novoCartao = {
        Nome: formData.nome.trim(),
        Valor: valorNumerico,
        Descricao: formData.descricao.trim(),
        CriadorId: user.id,
        DivisaoTipo: "igualitaria",
        CodigosConvidados: formData.convidados.map((c) => c.codigo),
      };

      const response = await fetch("http://localhost:5208/api/Cartao/criar", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify(novoCartao),
      });

      const { text, json } = await readResponseOnce(response);

      if (!response.ok) {
        let errorMessage =
          (json && (json.message || json.error || json.title)) ||
          text ||
          "Erro ao criar cartão";

        if (json && json.erros && Array.isArray(json.erros)) {
          errorMessage = json.erros.join("\n");
        }

        console.error("Erro do back-end:", { status: response.status, errorMessage });
        throw new Error(errorMessage);
      }

      const data = json ?? (text ? { raw: text } : null);
      console.log("Cartão criado:", data);

      if (data && data.cartaoId) {
        toast.success("Cartão criado e convites enviados com sucesso!");
        router.push("/dashboard/cartoes?reload=true");
      } else {
        throw new Error("Erro ao obter o ID do cartão criado");
      }
    } catch (error) {
      console.error("Erro ao criar cartão:", error);
      toast.error(
        error instanceof Error ? error.message : "Erro interno. Tente novamente."
      );
    } finally {
      setIsLoading(false);
    }
  };

  const handleAddConvidado = async () => {
    if (!novoConvidado.trim()) {
      toast.error("Digite o código do usuário");
      return;
    }

    const upperCode = novoConvidado.trim().toUpperCase();

    if (formData.convidados.some((c) => c.codigo === upperCode)) {
      toast.error("Este usuário já foi convidado");
      return;
    }

    setVerificandoUsuario(true);

    try {
      const response = await fetch(
        `http://localhost:5208/api/Usuario/por-codigo/${upperCode}`,
        {
          headers: { Accept: "application/json" },
        }
      );

      const { text, json } = await readResponseOnce(response);

      if (!response.ok) {
        const msg =
          (json && (json.message || json.error || json.title)) ||
          text ||
          "Usuário não encontrado";
        toast.error(msg);
        return;
      }

      const targetUser = json ?? {};
      if (targetUser.id === user?.id) {
        toast.error("Você não pode convidar a si mesmo");
        return;
      }

      setFormData((prev) => ({
        ...prev,
        convidados: [
          ...prev.convidados,
          { codigo: upperCode, nome: targetUser.nomeCompleto || "Usuário Desconhecido" },
        ],
      }));

      setNovoConvidado("");
      toast.success(`${targetUser.nomeCompleto || "Usuário"} adicionado à lista`);
    } catch (error) {
      console.error("Erro ao verificar usuário:", error);
      toast.error("Erro ao verificar usuário");
    } finally {
      setVerificandoUsuario(false);
    }
  };

  const handleRemoveConvidado = (codigo: string) => {
    setFormData((prev) => ({
      ...prev,
      convidados: prev.convidados.filter((c) => c.codigo !== codigo),
    }));
    toast.success("Convidado removido");
  };

  const valorPorPessoa =
    formData.convidados.length > 0 && formData.valor
      ? parseMoneyToNumber(formData.valor) / (formData.convidados.length + 1)
      : 0;

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary to-red-600 text-white p-4 lg:p-6 space-y-6">
      <div className="space-y-2">
        <div className="flex items-center space-x-2 text-sm text-gray-400">
          <Link href="/dashboard/cartoes" className="hover:text-white">
            Cartões
          </Link>
          <span>•</span>
          <span>Novo Cartão</span>
        </div>
        <h1 className="text-2xl lg:text-3xl font-bold text-white">
          Criar Novo Cartão
        </h1>
        <p className="text-gray-400">
          Configure um cartão pré-pago para dividir com amigos
        </p>
      </div>

      <Card className="bg-black/50 border-red-800/20">
        <CardHeader>
          <CardTitle className="text-white">Dados do Cartão</CardTitle>
          <CardDescription className="text-gray-300">
            Defina o nome, valor e quantos participantes
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="nome" className="text-white">Nome do Cartão</Label>
              <Input
                id="nome"
                name="nome"
                type="text"
                value={formData.nome}
                onChange={handleInputChange}
                placeholder="Ex: Netflix, Spotify, Uber Eats..."
                className={`bg-black border-white text-white placeholder-gray-400 ${errors.nome ? "border-destructive" : ""}`}
              />
              {errors.nome && <p className="text-sm text-red-400">{errors.nome}</p>}
              <p className="text-xs text-gray-400">
                Dê um nome que identifique facilmente o serviço
              </p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="valor" className="text-white">Valor Total</Label>
              <div className="relative">
                <Input
                  id="valor"
                  name="valor"
                  type="text"
                  value={formData.valor}
                  onChange={handleMoneyChange}
                  placeholder="0,00"
                  className={`pl-8 bg-black border-white text-white placeholder-gray-400 ${errors.valor ? "border-destructive" : ""}`}
                />
                <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 text-sm">
                  R$
                </span>
              </div>
              {errors.valor && <p className="text-sm text-red-400">{errors.valor}</p>}
            </div>

            <div className="space-y-4">
              <Label className="text-white">Convidar Participantes</Label>

              <div className="flex space-x-2">
                <Input
                  value={novoConvidado}
                  onChange={(e) => setNovoConvidado(e.target.value.toUpperCase())}
                  placeholder="Código único do usuário"
                  className="flex-1 bg-black border-white text-white placeholder-gray-400"
                />
                <Button
                  type="button"
                  onClick={handleAddConvidado}
                  disabled={verificandoUsuario || !novoConvidado.trim()}
                  variant="outline"
                  className="text-white border-white hover:bg-red-800/50"
                >
                  {verificandoUsuario ? "Verificando..." : "Adicionar"}
                </Button>
              </div>

              {errors.convidados && (
                <p className="text-sm text-red-400">{errors.convidados}</p>
              )}

              {formData.convidados.length > 0 && (
                <div className="border border-red-800/20 rounded-lg p-4 space-y-3 bg-black/30">
                  <p className="font-medium text-sm text-white">
                    Participantes Convidados ({formData.convidados.length})
                  </p>
                  <div className="space-y-2">
                    {formData.convidados.map((convidado) => (
                      <div
                        key={convidado.codigo}
                        className="flex items-center justify-between bg-black/50 rounded-lg p-3"
                      >
                        <div>
                          <p className="font-medium text-sm text-white">{convidado.nome}</p>
                          <p className="text-xs text-gray-400">{convidado.codigo}</p>
                        </div>
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          onClick={() => handleRemoveConvidado(convidado.codigo)}
                          className="text-red-400 hover:text-red-300"
                        >
                          Remover
                        </Button>
                      </div>
                    ))}
                  </div>
                  <p className="text-xs text-gray-400">
                    Total de participantes: {formData.convidados.length + 1} (incluindo você)
                  </p>
                </div>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="descricao" className="text-white">Descrição (Opcional)</Label>
              <Input
                id="descricao"
                name="descricao"
                type="text"
                value={formData.descricao}
                onChange={handleInputChange}
                placeholder="Detalhes adicionais sobre o cartão..."
                className="bg-black border-white text-white placeholder-gray-400"
              />
              <p className="text-xs text-gray-400">
                Informações extras para os participantes
              </p>
            </div>

            {formData.valor && (
              <div className="bg-black/50 rounded-lg p-4 space-y-2 border border-red-800/20">
                <h4 className="font-medium text-white">Resumo do Cartão</h4>
                <div className="space-y-1 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-400">Valor total:</span>
                    <span className="text-white">{formatCurrency(parseMoneyToNumber(formData.valor))}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">Participantes:</span>
                    <span className="text-white">{formData.convidados.length + 1} pessoas</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">Valor por pessoa:</span>
                    <span className="text-white">{formatCurrency(valorPorPessoa)}</span>
                  </div>
                </div>
              </div>
            )}

            <Button
              type="submit"
              className="w-full bg-white text-red-800 hover:bg-gray-200"
              disabled={isLoading}
            >
              {isLoading ? "Criando..." : "Criar Cartão"}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}