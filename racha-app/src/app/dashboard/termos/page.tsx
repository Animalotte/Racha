"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from 'next/navigation';
import { CSSProperties } from 'react'; 

export default function TermoDeUso() {
  const [aceitou, setAceitou] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const originalMargin = document.body.style.margin;
    const originalBackground = document.body.style.background;
    const originalBackgroundAttachment = document.body.style.backgroundAttachment;
    const originalFontFamily = document.body.style.fontFamily;

    const fontLink = document.createElement("link");
    fontLink.href = "https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap";
    fontLink.rel = "stylesheet";
    document.head.appendChild(fontLink);

    document.body.style.margin = "0";
    document.body.style.background = "linear-gradient(45deg, #5A0000 30%, #000000 80%)";
    document.body.style.backgroundAttachment = "fixed";
    document.body.style.fontFamily = "'Inter', sans-serif";

    return () => {
      document.body.style.margin = originalMargin;
      document.body.style.background = originalBackground;
      document.body.style.backgroundAttachment = originalBackgroundAttachment;
      document.body.style.fontFamily = originalFontFamily;
      document.head.removeChild(fontLink);
    };
  }, []);

  return (
    <div style={styles.wrapper}>
      <div style={styles.card}>
        <div style={styles.textoContainer}>
          <p style={styles.titulo}>Termos de Uso – Racha</p>
          <p style={styles.texto}>Última atualização: 19 de Outubro de 2025</p>

          <p style={styles.texto}>
            Bem-vindo(a) ao Racha! <br />
            Estes Termos de Uso descrevem as condições para o uso do nosso
            aplicativo e serviços. Eles foram elaborados de forma clara e
            transparente, conforme os princípios da Lei nº 13.709/2018 (LGPD) e
            das normas ISO/IEC 27001, 27701 e 29100, que tratam de segurança da
            informação e privacidade. <br />
            Ao acessar ou utilizar o Racha, você declara ter lido, compreendido
            e concordado com estes Termos.
          </p>

          <p style={styles.texto}>1. O que é o Racha</p>
          <p style={styles.texto}>
            1.1 O Racha é um aplicativo que facilita a divisão de despesas entre
            pessoas, permitindo organizar, registrar e gerenciar gastos por meio
            de cartões digitais compartilhados. <br />
            1.2 Nosso objetivo é tornar o processo de dividir contas simples,
            seguro e transparente — sem complicações.
          </p>

          <p style={styles.texto}>2. Quem pode usar o Racha</p>
          <p style={styles.texto}>
            2.1 Para utilizar o Racha, você deve ter pelo menos 18 anos e
            possuir CPF válido no Brasil. <br />
            2.2 Caso tenha entre 16 e 18 anos, o uso só é permitido com
            consentimento expresso dos responsáveis legais, conforme o artigo 14
            da LGPD. <br />
            2.3 Ao se cadastrar, você se compromete a fornecer informações
            verdadeiras, completas e atualizadas.
          </p>

          <p style={styles.texto}>3. Dados coletados e como são usados</p>
          <p style={styles.texto}>
            3.1 O Racha coleta apenas os dados necessários para o funcionamento
            da plataforma e segurança do usuário, incluindo: <br />
            - Nome completo e CPF – para identificação e autenticação; <br />
            - E-mail e telefone – para contato e suporte técnico; <br />
            - Dados bancários (chave PIX, conta, banco) – para transferências e
            divisão de valores; <br />- Histórico de transações – para controle
            e registro das despesas; <br />- Dados técnicos (IP, dispositivo,
            data e hora de acesso) – para segurança e auditoria.
          </p>

          <p style={styles.texto}>
            3.2 As informações são usadas para: <br />
            - Viabilizar as transações entre usuários; <br />
            - Garantir segurança e prevenção de fraudes; <br />- Melhorar o
            funcionamento e a experiência de uso do aplicativo; <br />- Cumprir
            obrigações legais e regulatórias.
          </p>

          <p style={styles.texto}>
            3.3 Todos os dados são tratados de acordo com a LGPD, seguindo
            princípios de finalidade, necessidade, transparência e segurança.
          </p>

          <p style={styles.texto}>4. Segurança da informação</p>
          <p style={styles.texto}>
            4.1 O Racha adota medidas técnicas e organizacionais compatíveis com
            os padrões internacionais de segurança, como: <br />
            - Criptografia de dados em repouso e em trânsito; <br />
            - Controle de acesso restrito a informações; <br />- Anonimização e
            pseudonimização de dados sempre que possível; <br />- Políticas
            internas de confidencialidade e resposta a incidentes.
          </p>

          <p style={styles.texto}>
            4.2 Mesmo com o uso de tecnologias avançadas, nenhum sistema é
            totalmente imune a falhas. Caso ocorra algum incidente de segurança,
            o Racha informará os usuários afetados, conforme exigido pela LGPD.
          </p>

          <p style={styles.texto}>5. Compartilhamento de informações</p>
          <p style={styles.texto}>
            5.1 O Racha não compartilha dados pessoais com terceiros, exceto:{" "}
            <br />
            - Quando houver autorização expressa do titular; <br />
            - Quando for obrigação legal, judicial ou regulatória; <br />
            - Quando for necessário para suporte técnico ou operações essenciais
            do sistema. <br />
            5.2 Qualquer compartilhamento seguirá o princípio da necessidade
            mínima e será protegido por acordos de confidencialidade e segurança
            da informação.
          </p>

          <p style={styles.texto}>6. Direitos do titular de dados</p>
          <p style={styles.texto}>
            6.1 Você pode, a qualquer momento: <br />
            - Solicitar acesso, correção ou atualização de seus dados; <br />
            - Pedir exclusão da conta ou revogação do consentimento; <br />
            - Requerer informações sobre o tratamento de dados; <br />-
            Solicitar portabilidade de informações, quando aplicável.
          </p>

          <p style={styles.texto}>
            6.2 Para exercer seus direitos, entre em contato com nosso
            Encarregado de Dados (DPO).
          </p>

          <p style={styles.texto}>7. Canal de atendimento</p>
          <p style={styles.texto}>
            Nome: Joaquim de Assis Santana <br />
            Cargo: Encarregado de Proteção de Dados (DPO) <br />
            E-mail: empresarialracha@gmail.com <br />
            Telefone: (31) 99835-9107 <br />
            Nosso canal está disponível para dúvidas, solicitações e exercício
            dos direitos previstos na LGPD.
          </p>

          <p style={styles.texto}>8. Responsabilidades do usuário</p>
          <p style={styles.texto}>
            8.1 O usuário se compromete a: <br />
            - Utilizar o aplicativo apenas para fins lícitos; <br />
            - Respeitar os direitos de outros usuários; <br />
            - Manter suas informações cadastrais atualizadas; <br />- Não
            compartilhar indevidamente dados ou credenciais de acesso.
          </p>

          <p style={styles.texto}>
            8.2 O usuário é responsável por todas as ações realizadas em sua
            conta.
          </p>

          <p style={styles.texto}>9. Conduta e uso indevido</p>
          <p style={styles.texto}>
            9.1 É proibido usar o Racha para: <br />- Atividades ilegais,
            fraudulentas ou que violem direitos de terceiros; <br />- Inserção
            de conteúdo ofensivo, discriminatório ou difamatório; <br />- Acesso
            não autorizado a sistemas ou contas de outros usuários; <br />-
            Qualquer tentativa de engenharia reversa, modificação ou cópia do
            sistema.
          </p>

          <p style={styles.texto}>
            9.2 O descumprimento destas regras pode resultar em suspensão ou
            encerramento da conta, sem prejuízo de medidas legais cabíveis.
          </p>

          <p style={styles.texto}>10. Atualizações dos Termos</p>
          <p style={styles.texto}>
            10.1 O Racha poderá atualizar estes Termos a qualquer momento,
            sempre que houver mudanças legais, técnicas ou operacionais
            relevantes. <br />
            10.2 Caso haja alterações significativas, os usuários serão
            notificados de forma clara antes que as novas condições entrem em
            vigor.
          </p>

          <p style={styles.texto}>11. Isenção de responsabilidade</p>
          <p style={styles.texto}>
            11.1 O Racha não se responsabiliza por: <br />
            - Problemas decorrentes de mau uso do aplicativo; <br />
            - Interrupções temporárias causadas por manutenção, falhas técnicas
            ou eventos de força maior; <br />- Transações financeiras realizadas
            incorretamente pelos próprios usuários.
          </p>

          <p style={styles.texto}>12. Disposições finais</p>
          <p style={styles.texto}>
            12.1 Este Termo é regido pela legislação brasileira, especialmente
            pela Lei Geral de Proteção de Dados (Lei nº 13.709/2018). <br />
            12.2 Fica eleito o foro da comarca de Belo Horizonte/MG para
            resolver eventuais controvérsias, com exclusão de qualquer outro.
          </p>

          <p style={styles.texto}>13. Aceite</p>
          <p style={styles.texto}>
            Ao criar uma conta ou utilizar o aplicativo Racha, você confirma ter
            lido, compreendido e concordado integralmente com estes Termos de
            Uso e com o tratamento de seus dados pessoais conforme descrito.{" "}
            <br />
            <br />
            Belo Horizonte/MG, 19 de Outubro de 2025. <br />
            <br />
            Pelo Projeto Racha: <br />
            Joaquim de Assis Santana – Encarregado de Dados (DPO) – CPF
            ***.***.***-**
          </p>
        </div>

        <div style={styles.checkboxContainer}>
          <input
            type="checkbox"
            id="aceitou"
            checked={aceitou}
            onChange={() => setAceitou(!aceitou)}
          />
          <label htmlFor="aceitou" style={styles.label}>
            Eu concordo com os termos de uso
          </label>
        </div>

        <button
          style={{
            ...styles.botao,
            backgroundColor: aceitou ? "#e50914" : "#555",
            cursor: aceitou ? "pointer" : "not-allowed",
          }}
          disabled={!aceitou}
          onClick={() => {
            alert("Você aceitou os termos!");
            router.push('/dashboard');
          }}>
          Ok
        </button>
      </div>
    </div>
  );
}

// --- ESTILOS EM JS ---
const styles: Record<string, CSSProperties> = {
  wrapper: {
    minHeight: "100vh",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    padding: "40px 20px",
  },
  card: {
    backgroundColor: "rgba(255, 255, 255, 0.96)",
    color: "#111",
    borderRadius: "14px",
    padding: "40px",
    maxWidth: "800px",
    width: "100%",
    boxShadow: "0 8px 40px rgba(0, 0, 0, 0.5)",
  },
  titulo: {
    textAlign: "center",
    marginBottom: "30px",
    fontSize: "2.2rem",
    fontWeight: '700',
  },
  textoContainer: {
    maxHeight: "300px",
    overflowY: "auto",
    paddingRight: "10px",
    marginBottom: "30px",
  },
  texto: {
    fontSize: "20px",
    lineHeight: "1.9",
    textAlign: "justify",
    marginBottom: "25px",
    color: "#333",
  },
  checkboxContainer: {
    display: "flex",
    alignItems: "center",
    marginBottom: "25px",
  },
  label: {
    marginLeft: "10px",
    fontSize: "17px",
  },
  botao: {
    width: "100%",
    padding: "14px",
    border: "none",
    borderRadius: "8px",
    color: "#fff",
    fontSize: "18px",
    fontWeight: '600',
    transition: "all 0.3s ease",
  },
};