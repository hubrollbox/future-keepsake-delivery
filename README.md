# Keepla - Plataforma de Presentes com Alma

Keepla é uma plataforma inovadora para criar, enviar e receber cápsulas do tempo e presentes personalizados, conectando pessoas de forma significativa e duradoura.

## Principais Funcionalidades
- Criação de cápsulas do tempo digitais
- Envio de mensagens, fotos e vídeos para o futuro
- Gamificação: conquistas, missões e recompensas
- Gestão de entregas e notificações
- Área do usuário com histórico e estatísticas

## Tecnologias Utilizadas
- React + TypeScript
- Supabase (PostgreSQL, Auth, Storage)
- Stripe (pagamentos)
- Cypress (testes E2E)
- Vite (build e desenvolvimento)

## Como Rodar o Projeto Localmente
1. **Clone o repositório:**
   ```bash
   git clone https://github.com/seu-usuario/future-keepsake-delivery.git
   ```
2. **Instale as dependências:**
   ```bash
   npm install
   ```
3. **Configure as variáveis de ambiente:**
   - Copie `.env.example` para `.env` e preencha os dados necessários (Supabase, Stripe, etc).
4. **Inicie o servidor de desenvolvimento:**
   ```bash
   npm run dev
   ```
5. **Acesse:**
   - [http://localhost:5173](http://localhost:5173)

## Estrutura do Projeto
- `src/` - Código-fonte principal
- `src/components/` - Componentes reutilizáveis
- `src/pages/` - Páginas da aplicação
- `src/contexts/` - Contextos globais (auth, carrinho, gamificação)
- `src/hooks/` - Hooks customizados
- `supabase/migrations/` - Scripts de migração do banco de dados

## Testes
- Para rodar os testes E2E com Cypress:
  ```bash
  npx cypress open
  ```

## Contribuição
Pull requests são bem-vindos! Siga as boas práticas de código e descreva claramente suas alterações.

## Licença
Este projeto está sob a licença MIT.
