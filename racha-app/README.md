# Racha - Sistema de Cartões Compartilhados

**Racha** é uma aplicação web completa que permite criar cartões pré-pagos virtuais e dividir os custos com amigos de forma fácil e segura. Inspirado no design do Inter Bank, mas com identidade visual própria usando tons de vermelho, preto e branco.

## Funcionalidades Principais

## Sistema de Autenticação
- **Cadastro completo** com validação de CPF e idade mínima (16 anos)
- **Preenchimento automático de endereço** via integração com API de CEP (ViaCEP)
- **Login seguro** usando CPF e senha
- **Código único** gerado automaticamente para cada usuário

### Sistema de Cartões Compartilhados
- **Criação de cartões** com nome, valor e número de participantes
- **Estados inteligentes**: Pendente → Ativo → Validado
- **Sistema de convites** via código único dos usuários
- **Divisão igualitária** de valores entre participantes
- **Liberação de dados** do cartão apenas após todos pagarem
- **Listagem e filtros** (todos, criados, participando)

### Sistema de Notificações
- **Central de notificações** com convites recebidos
- **Contador visual** de notificações não lidas
- **Aceitação/rejeição** de convites
- **Atualização automática** via polling

### Sistema de Créditos
- **Compra de créditos** com taxa fixa de 2%
- **Métodos de pagamento** simulados (PIX, Cartão, Boleto, Transferência)
- **Histórico completo** de transações
- **Validação de saldo** antes de operações
- **Estatísticas detalhadas** de uso

### Configurações e Perfil
- **Preferências de tema** com preview visual
- **Informações da conta** e estatísticas
- **Zona de perigo** para ações críticas

## Como Executar

### Pré-requisitos
- Node.js 18+ instalado
- pnpm, npm ou yarn

### Instalação e Execução

```bash
# Instalar dependências
pnpm install

# Executar em modo de desenvolvimento
pnpm dev

# Ou executar build de produção
pnpm run build --no-lint
pnpm start
```

A aplicação estará disponível em `http://localhost:3000`

## Como Usar a Aplicação

### 1. Primeiro Acesso
1. Acesse a página inicial
2. Clique em **"Cadastrar"**
3. Preencha todos os dados e crie sua conta

### 2. Comprando Créditos
1. Após criar sua conta faça login com CPF e senha
2. Vá em **"Créditos"** → **"Comprar Créditos"**
3. Escolha o valor
4. Selecione um método de pagamento
5. Confirme a compra para os créditos caírem na sua conta

### 3. Criando um Cartão
1. No dashboard, clique em **"Criar Cartão"**
2. Defina nome (ex: "Netflix"), valor (ex: R$ 40,90) e digite o **código único** dos seus amigos
3. Os convite serão enviados para a aba de notificações deles
3. O cartão iniciará com status **"Pendente"**
4. Quando todos aceitarem o convite, o cartão fica **"Ativo"**

### 5. Pagando Sua Parte
1. Quando convidado, aceite na aba **"Notificações"**
2. Vá na aba "Meus Cartões" e clique para ver os detalhes do cartão, após isso vai aparecer uma opção para
você pagar mostrando o valor, clique em **"Pagar"**
3. O valor será descontado dos seus créditos
4. Quando todos pagarem, o cartão fica **"Validado"**

### 6. Dados do Cartão
1. Após o cartão ser **validado**, seus dados ficarão disponíveis
2. Número, CVV e validade são gerados automaticamente
3. Use apenas para demonstração (não funciona para compras reais)


**Racha** - Dividir nunca foi tão fácil! 
