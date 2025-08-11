# 🕰️ FuturoPresente - Plataforma de Cápsulas do Tempo Digitais

<div align="center">

![FuturoPresente Logo](https://via.placeholder.com/200x80/DAB8C3/3D4A5A?text=FuturoPresente)

**Conecte momentos especiais através do tempo**

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?style=flat&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![React](https://img.shields.io/badge/React-20232A?style=flat&logo=react&logoColor=61DAFB)](https://reactjs.org/)
[![Supabase](https://img.shields.io/badge/Supabase-3ECF8E?style=flat&logo=supabase&logoColor=white)](https://supabase.com/)
[![Vite](https://img.shields.io/badge/Vite-646CFF?style=flat&logo=vite&logoColor=white)](https://vitejs.dev/)

</div>

## 📖 Sobre o Projeto

**FuturoPresente** é uma plataforma inovadora que permite criar, agendar e enviar cápsulas do tempo digitais. Conecte pessoas através do tempo, preservando momentos especiais e entregando-os no futuro perfeito.

### 🎯 Missão
Transformar a forma como as pessoas se conectam emocionalmente, permitindo que momentos especiais sejam preservados e entregues no momento certo, criando experiências únicas e duradouras.

## ✨ Principais Funcionalidades

### 🕰️ Cápsulas do Tempo Digitais
- **Criação Intuitiva**: Interface amigável para criar mensagens personalizadas
- **Agendamento Flexível**: Defina datas futuras para entrega automática
- **Múltiplos Formatos**: Suporte para texto, imagens e conteúdo multimídia
- **Validação Avançada**: Sistema robusto de validação de dados

### 🚀 Entrega Automática
- **Sistema Inteligente**: Processamento automático baseado em timezone de Portugal
- **Cron Jobs**: Execução a cada minuto para máxima precisão
- **Fallback Robusto**: Sistema de backup em caso de falhas
- **Logs Detalhados**: Monitoramento completo de todas as operações

### 🎮 Sistema de Gamificação
- **Conquistas**: Desbloqueie insígnias por atividades especiais
- **Missões**: Complete desafios e ganhe recompensas
- **Ranking**: Sistema de pontuação e classificação
- **Progressão**: Acompanhe seu crescimento na plataforma

### 🔐 Segurança e Privacidade
- **Autenticação Robusta**: Sistema seguro de login e registro
- **RLS (Row Level Security)**: Proteção de dados a nível de base de dados
- **Criptografia**: Dados sensíveis protegidos
- **Políticas de Privacidade**: Conformidade com GDPR

## 🛠️ Stack Tecnológica

### Frontend
- **React 18** - Biblioteca para interfaces de utilizador
- **TypeScript** - Tipagem estática para JavaScript
- **Vite** - Build tool moderna e rápida
- **Tailwind CSS** - Framework CSS utilitário
- **React Hook Form** - Gestão de formulários
- **Zod** - Validação de esquemas TypeScript-first

### Backend & Base de Dados
- **Supabase** - Backend-as-a-Service completo
  - PostgreSQL - Base de dados relacional
  - Auth - Autenticação e autorização
  - Edge Functions - Funções serverless
  - Storage - Armazenamento de ficheiros
  - Real-time - Atualizações em tempo real

### Integrações
- **Resend** - Serviço de envio de emails transacionais
- **Stripe** - Processamento de pagamentos
- **pg_cron** - Agendamento de tarefas na base de dados

### Ferramentas de Desenvolvimento
- **Cypress** - Testes end-to-end
- **ESLint** - Linting de código
- **Prettier** - Formatação de código 
## 🚀 Instalação e Configuração

### Pré-requisitos
- **Node.js** (versão 18 ou superior)
- **npm** ou **yarn**
- **Conta Supabase** (gratuita)
- **Conta Resend** (para envio de emails)
- **Conta Stripe** (para pagamentos - opcional)

### 1. Clone o Repositório
```bash
git clone https://github.com/seu-usuario/future-keepsake-delivery.git
cd future-keepsake-delivery
```

### 2. Instale as Dependências
```bash
npm install
# ou
yarn install
```

### 3. Configuração da Base de Dados

#### 3.1 Configurar Supabase
1. Crie um novo projeto no [Supabase](https://supabase.com/)
2. Execute as migrações SQL localizadas em `supabase/migrations/`
3. Configure as políticas RLS (Row Level Security)
4. Ative as extensões necessárias: `pg_cron`, `http`

#### 3.2 Deploy das Edge Functions
```bash
# Instalar Supabase CLI
npm install -g @supabase/cli

# Login no Supabase
supabase login

# Deploy das funções
supabase functions deploy send-keepsakes
supabase functions deploy send-contact-email
supabase functions deploy send-deliveries
```

### 4. Variáveis de Ambiente

Crie um arquivo `.env.local` na raiz do projeto:

```env
# === SUPABASE CONFIGURAÇÃO ===
VITE_SUPABASE_URL=https://seu-projeto.supabase.co
VITE_SUPABASE_ANON_KEY=sua_chave_anonima
VITE_SUPABASE_SERVICE_ROLE_KEY=sua_chave_service_role

# === EMAIL CONFIGURAÇÃO ===
VITE_RESEND_API_KEY=re_sua_chave_resend
RESEND_API_KEY=re_sua_chave_resend

# === PAGAMENTOS (OPCIONAL) ===
VITE_STRIPE_PUBLISHABLE_KEY=pk_test_sua_chave_stripe
STRIPE_SECRET_KEY=sk_test_sua_chave_stripe

# === APLICAÇÃO ===
VITE_APP_URL=http://localhost:5173
VITE_APP_NAME=FuturoPresente
VITE_SUPPORT_EMAIL=suporte@futuropresente.com

# === EDGE FUNCTIONS ===
SUPABASE_URL=https://seu-projeto.supabase.co
SUPABASE_SERVICE_ROLE_KEY=sua_chave_service_role
```

### 5. Executar o Projeto

```bash
# Desenvolvimento
npm run dev

# Build de produção
npm run build

# Preview da build
npm run preview
```

O projeto estará disponível em `http://localhost:5173`

## 📧 Sistema de Entrega Automática

### Funcionalidades Implementadas

#### 🔄 Processamento Automático
- **Cron Job**: Execução a cada minuto via `pg_cron`
- **Timezone**: Configurado para Portugal (`Europe/Lisbon`)
- **Fallback**: Sistema de backup em SQL caso Edge Function falhe
- **Logs**: Registro detalhado de todas as operações

#### 📨 Edge Function `send-keepsakes`
- **Localização**: `supabase/functions/send-keepsakes/`
- **Trigger**: Chamada automática via cron job
- **Funcionalidades**:
  - Busca cápsulas com `delivery_date <= NOW()` e `status = 'pending'`
  - Envia emails personalizados para destinatários
  - Atualiza status para `'sent'` e define `sent_at`
  - Cria notificações para utilizadores
  - Tratamento robusto de erros

#### 🗄️ Função SQL `send_due_capsules()`
- **Backup**: Executa quando Edge Function falha
- **Funcionalidades**: Mesma lógica da Edge Function em SQL puro
- **Performance**: Otimizada com índices específicos

### Scripts Disponíveis

```bash
# Desenvolvimento
npm run dev              # Servidor de desenvolvimento
npm run build           # Build de produção
npm run preview         # Preview da build
npm run lint            # Verificação de código
npm run type-check      # Verificação de tipos TypeScript

# Testes
npm run test            # Testes unitários
npm run test:e2e        # Testes end-to-end com Cypress
npm run cypress:open    # Interface gráfica do Cypress

# Base de Dados
npm run db:reset        # Reset da base de dados
npm run db:seed         # Seed de dados de teste
npm run db:migrate      # Executar migrações
``` 
📁 Estrutura do Projeto 
Code 
future-keepsake-delivery/ 
├── src/ 
│   ├── components/   # Componentes reutilizáveis 
│   ├── pages/        # Páginas da aplicação 
│   ├── contexts/     # Contextos globais (autenticação, carrinho, gamificação) 
│   ├── hooks/        # Hooks customizados 
├── supabase/ 
│   ├── migrations/   # Scripts de migração do banco de dados
│   └── functions/    # Edge Functions do Supabase
│       └── send-keepsakes/  # Função para entrega automática de keepsakes
├── scripts/         # Scripts utilitários
│   ├── testSendKeepsakes.js       # Teste da função send-keepsakes
│   ├── updateKeepsakeStatus.js    # Atualização manual de status
│   ├── serveKeepsakeFunction.js   # Servidor local da Edge Function
│   ├── deployKeepsakeFunction.js  # Implantação da Edge Function
│   └── checkDeploymentStatus.js   # Verificação do status da implantação 
🧪 Testes 
Execute testes E2E com o Cypress: 
 
bash 
npx cypress open 
🤝 Contribuindo 
Pull requests são bem-vindos! 
Para contribuir: 
 
Siga as boas práticas de código. 
Descreva claramente suas alterações no PR. 
Certifique-se de que os testes estejam passando. 
📄 Licença 
Este projeto está sob a licença MIT. 
Consulte o arquivo LICENSE para mais informações.
