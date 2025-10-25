"use client";

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/components/providers/auth-provider';
import { Button } from '@/components/ui/button';
import { Card, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import Link from 'next/link';
import Image from "next/image";

export default function HomePage() {
  const { user, isLoading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!isLoading && user) {
      router.push('/dashboard');
    }
  }, [user, isLoading, router]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="animate-pulse">
          <div className="h-8 w-32 bg-muted rounded mb-4"></div>
          <div className="h-4 w-48 bg-muted rounded"></div>
        </div>
      </div>
    );
  }

  if (user) {
    return null
  }

  return (
    <div className="min-h-screen">
      <header className="bg-primary text-white sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-60 h-30 rounded-xl flex items-center justify-center backdrop-blur">
              <img src="/racha-logo-completa.png" alt="Logo Racha" width={600} height={600}/>
            </div>
          </div>
          <div className="flex space-x-3">
            <Button variant="ghost" className="text-white hover:bg-red-800 px-6 py-3 rounded-md">
              <Link href="/auth/login">Entrar</Link>
            </Button>
            <Button variant="ghost" className="text-white hover:bg-red-800 px-8 py-4 rounded-xl font-medium">
              <Link href="/auth/cadastro">Começar</Link>
            </Button>
          </div>
        </div>
      </header>

      {/* Hero Section*/}
      <section className="relative bg-gradient-to-br from-primary via-primary to-red-700 text-white">
        <div className="absolute inset-0 bg-black/10"></div>
        <div className="relative container mx-auto px-4 py-20 lg:py-32">
          <div className="max-w-3xl">
            <h1 className="text-4xl lg:text-6xl font-bold mb-6 leading-tight">
              Divida contas.
              <br />
              <span className="text-white/90"></span>
            </h1>
            <p className="text-xl lg:text-2xl text-white/80 mb-8 font-light">
              Crie cartões virtuais compartilhados e divida Netflix, Spotify e outras assinaturas com amigos.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <Button variant="outline" className="text-white  border-white hover:bg-red-800 text-lg px-8 py-4 rounded-xl font-semibold">
                <Link href="/auth/cadastro">Começar Gratuitamente</Link>
              </Button>
              <Button variant="outline" className="border-2 text-white  border-white hover:bg-red-800 text-lg px-8 py-4 rounded-xl">
                <Link href="/auth/login">Já sou cliente</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      <section className="py-20 px-4 bg-black">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center mb-16">
            <h2 className="text-3xl lg:text-4xl font-bold text-white mb-4">
              Simplicidade que funciona
            </h2>
            <p className="text-xl text-gray-400">
              Tudo que você precisa para dividir suas despesas forma fácil e inteligente 
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-red-500  rounded-2xl p-8 shadow-lg border border-gray-800 hover:border-primary/50 transition-colors">
              <div className="w-16 h-16 bg-gradient-to-br from-primary to-red-700 rounded-2xl flex items-center justify-center mb-6">
                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-white mb-3">Crie cartões</h3>
              <p className="text-white">
                Defina o valor, convide amigos e organize tudo em um só lugar.
              </p>
            </div>

            <div className="bg-red-500 rounded-2xl p-8 shadow-lg border border-gray-800 hover:border-primary/50 transition-colors">
              <div className="w-16 h-16 bg-gradient-to-br from-primary to-red-700 rounded-2xl flex items-center justify-center mb-6">
                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.25 2.25 0 11-4.5 0 2.25 2.25 0 014.5 0z" />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-white mb-3">Convide amigos</h3>
              <p className="text-gray-100">
                Compartilhe códigos únicos e receba notificações em tempo real.
              </p>
            </div>

            <div className="bg-red-500 rounded-2xl p-8 shadow-lg border border-gray-800 hover:border-primary/50 transition-colors">
              <div className="w-16 h-16 bg-gradient-to-br from-primary to-red-700 rounded-2xl flex items-center justify-center mb-6">
                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-white mb-3">Pague e use</h3>
              <p className="text-white">
                Cada um paga sua parte e o cartão virtual fica disponível.
              </p>
            </div>
          </div>
        </div>
      </section>


      <section className="py-20 px-4 bg-black">
        <div className="container mx-auto text-center max-w-2xl">
          <h2 className="text-3xl lg:text-4xl font-bold text-white mb-6">
            Comece hoje mesmo
          </h2>
          <p className="text-xl text-gray-400 mb-8">
            Cadastre-se gratuitamente e comece hoje a organizar suas dispesas
          </p>
          <Button className="bg-primary hover:bg-primary/90 text-white text-lg px-12 py-4 rounded-xl font-semibold">
            <Link href="/auth/cadastro">Criar Conta Gratuita</Link>
          </Button>
          <p className="text-sm text-gray-500 mt-4">
            Sem mensalidade • Sem taxas escondidas
          </p>
        </div>
      </section>

      <footer className="py-12 px-4 bg-gradient-to-br from-primary to-red-600 text-white border-0 shadow-lg">
        <div className="container mx-auto">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="flex items-center space-x-3 mb-4 md:mb-0">
                <img src="/racha-logo-completa.png" alt="Logo Racha" width={100} height={100}/>
            </div>
            <div className="flex space-x-6 text-sm text-white">
              <Link href="/termos" className="hover:text-primary transition-colors">Termos</Link>
              <span>© 2024 Racha</span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}