# 🕰️ Keepla - Future Keepsake Delivery

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?style=flat&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![React](https://img.shields.io/badge/React-20232A?style=flat&logo=react&logoColor=61DAFB)](https://reactjs.org/)
[![Supabase](https://img.shields.io/badge/Supabase-3ECF8E?style=flat&logo=supabase&logoColor=white)](https://supabase.com/)
[![Vite](https://img.shields.io/badge/Vite-646CFF?style=flat&logo=vite&logoColor=white)](https://vitejs.dev/)

> **Conecte momentos especiais através do tempo.**
>
> [📚 Documentação Completa](docs/README.md) | [🎨 Brand Book](docs/brandbook/README.md)

## 📖 Sobre o Projeto

**Keepla** (anteriormente FuturoPresente) é uma plataforma inovadora que permite criar, agendar e enviar cápsulas do tempo digitais. Nossa missão é transformar a forma como as pessoas se conectam emocionalmente, permitindo que memórias, mensagens e sentimentos sejam preservados hoje e entregues no momento perfeito no futuro.

---

## ✨ Funcionalidades Principais

### 🕰️ Cápsulas do Tempo (Keepsakes)
- **Criação Intuitiva**: Interface amigável para criar mensagens personalizadas.
- **Agendamento Preciso**: Defina datas exatas para entrega futura.
- **Multimídia**: Suporte para texto e imagens (expansível para vídeo/áudio).
- **Status em Tempo Real**: Acompanhe o status (Agendado, Enviado, Entregue).

### 🚀 Entrega Inteligente
- **Processamento Automático**: Cron jobs via `pg_cron` e Supabase Edge Functions.
- **Timezone Aware**: Entregas baseadas no fuso horário de Portugal.
- **Notificações**: Emails transacionais via Resend.

### 🎮 Gamificação & Engajamento (Novo!)
- **Sistema de Pontos**: Ganhe pontos por atividades (login diário, leitura de blog, partilhas).
- **Streaks**: Recompensas por consistência (7, 30, 90 dias).
- **Níveis e Progresso**: Visualização clara do crescimento do usuário.
- **Anti-fraude**: Validação server-side de limites e intervalos de ações.

### 📝 Blog & Conteúdo
- **Gestão de Conteúdo**: Sistema de blog integrado com Supabase.
- **Leitura Engajada**: Tracking de tempo de leitura para recompensas.

### 🔐 Segurança e Privacidade
- **Autenticação Segura**: Supabase Auth com proteção RLS (Row Level Security).
- **Dados Protegidos**: Criptografia e políticas estritas de acesso.
- **Conformidade**: Preparado para GDPR.

---

## 🛠️ Stack Tecnológica

### Frontend
- **Framework**: [React 18](https://reactjs.org/)
- **Build Tool**: [Vite](https://vitejs.dev/)
- **Linguagem**: [TypeScript](https://www.typescriptlang.org/)
- **Estilização**: [Tailwind CSS](https://tailwindcss.com/)
- **Componentes**: [shadcn/ui](https://ui.shadcn.com/)
- **Estado/Data Fetching**: [TanStack Query](https://tanstack.com/query/latest)
- **Roteamento**: [React Router](https://reactrouter.com/)

### Backend (Serverless)
- **Plataforma**: [Supabase](https://supabase.com/)
- **Banco de Dados**: PostgreSQL
- **Edge Functions**: Deno / TypeScript
- **Storage**: Supabase Storage

### Integrações
- **Emails**: [Resend](https://resend.com/)
- **Pagamentos**: [Stripe](https://stripe.com/)

---

## 🚀 Como Começar

### Pré-requisitos
- Node.js (v18+)
- npm ou yarn ou bun

### Instalação

1. **Clone o repositório**
   ```bash
   git clone https://github.com/seu-usuario/keepla.git
   cd keepla
   ```

2. **Instale as dependências**
   ```bash
   npm install
   # ou
   bun install
   ```

3. **Configuração de Ambiente**
   Crie um arquivo `.env` na raiz baseado no `.env.example`:
   ```env
   VITE_SUPABASE_URL=sua_url_supabase
   VITE_SUPABASE_ANON_KEY=sua_chave_anonima
   ```

4. **Execute o servidor de desenvolvimento**
   ```bash
   npm run dev
   ```
   Acesse `http://localhost:8080` (ou a porta indicada).

---

## 📂 Estrutura do Projeto

```
/
├── public/              # Assets estáticos
├── src/
│   ├── components/      # Componentes React reutilizáveis
│   │   ├── dashboard/   # Componentes específicos do dashboard
│   │   ├── gamification/# Componentes de gamificação
│   │   └── ui/          # Componentes base (shadcn)
│   ├── contexts/        # React Contexts (Auth, Gamification, Cart)
│   ├── hooks/           # Custom React Hooks
│   ├── integrations/    # Configurações de serviços externos (Supabase)
│   ├── pages/           # Páginas da aplicação (Rotas)
│   ├── services/        # Camada de serviço (API calls, lógica de negócios)
│   └── styles/          # Arquivos CSS globais
├── supabase/            # Migrations e configurações do Supabase
└── docs/                # Documentação detalhada do projeto
```

---

## 📜 Scripts Disponíveis

- `npm run dev`: Inicia o servidor de desenvolvimento.
- `npm run build`: Compila o projeto para produção.
- `npm run preview`: Visualiza o build de produção localmente.
- `npm run lint`: Executa a verificação de linting.

---

## 🤝 Contribuição

Contribuições são bem-vindas! Por favor, leia o arquivo [CONTRIBUTING.md](docs/development/CONTRIBUTING.md) para detalhes sobre nosso código de conduta e o processo para enviar pull requests.

---

## 📄 Licença

Este projeto está licenciado sob a Licença MIT - veja o arquivo [LICENSE](LICENSE) para detalhes.
