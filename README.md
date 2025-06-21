# keepla

![Logo keepla](public/keepla%20logo.png)

## Sobre a Plataforma

A keepla é uma solução moderna para gestão, armazenamento e entrega programada de keepsakes (lembranças e presentes para o futuro). Desenvolvida para empresas e consumidores finais, a plataforma oferece segurança, personalização e automação em todo o ciclo de vida do presente.

## Funcionalidades Principais

- Cadastro e autenticação de utilizadores
- Gestão de keepsakes digitais e físicos
- Entregas programadas e notificações automáticas
- Dashboard intuitivo para administradores e utilizadores
- Integração com Supabase para backend seguro
- Interface responsiva e personalizável
- Exportação de dados (CSV)
- Onboarding e tooltips para melhor experiência
- Suporte a pagamentos por link externo
- Testes automatizados (unitários e E2E)
- Monitoramento de erros (Sentry) e métricas (Google Analytics)

## Tecnologias Utilizadas

- React + TypeScript
- Vite
- Tailwind CSS
- Supabase
- Cypress (E2E)
- Vitest (unitários)
- Sentry, Google Analytics

## Instalação e Configuração

1. **Clone o repositório:**

   ```sh
   git clone <URL_DO_SEU_REPOSITORIO>
   cd <NOME_DA_PASTA>
   npm install
   ```

2. **Configuração de ambiente:**

   - Copie `.env.example` para `.env` e preencha as variáveis:
     - `VITE_SUPABASE_URL=...`
     - `VITE_SUPABASE_ANON_KEY=...`
     - `VITE_SENTRY_DSN=...` (opcional)
     - `VITE_SENDGRID_API_KEY=...` (opcional)
     - `VITE_SENDGRID_SENDER=...` (opcional)
     - `VITE_GA_MEASUREMENT_ID=...` (opcional, para Google Analytics)

3. **Executar em desenvolvimento:**

   ```sh
   npm run dev
   ```

4. **Build para produção:**

   ```sh
   npm run build
   ```

   Os arquivos finais estarão na pasta `dist/`.

## Testes

- **Unitários:**

  ```sh
  npm test
  ```

  Usa Vitest e Testing Library.

- **E2E (Cypress):**

  Siga o guia em [`TESTES_E2E.md`](TESTES_E2E.md).

## Geração de Tipos Supabase

Para garantir a segurança de tipo e uma melhor experiência de desenvolvimento com o Supabase:

```sh
npm run supabase:gen-types
```

Gera tipos em `src/integrations/supabase/types.ts`.

## Estrutura de Pastas

```text
src/
├── components/         # Componentes React reutilizáveis
│   ├── ui/             # Componentes de UI genéricos
├── hooks/              # Hooks personalizados
├── integrations/       # Integrações externas (ex: Supabase)
├── lib/                # Funções utilitárias
├── pages/              # Páginas da aplicação
├── styles/             # Estilos globais
├── App.tsx             # Componente principal
├── main.tsx            # Entry point
└── setupTests.ts       # Configuração de testes
```

## Monitoramento e Métricas

- **Sentry:** Para rastreamento de erros em produção.
- **Google Analytics:** Para métricas de uso (ver `public/analytics_snippet.html`).

## Segurança e Boas Práticas

- Políticas RLS e constraints recomendadas em [`supabase/SEGURANCA_RLS.md`](supabase/SEGURANCA_RLS.md)
- Notificações automáticas agendadas (ver scripts e migrations em `supabase/migrations` e `scripts/`)

## Tabelas Sensíveis e Políticas RLS (Row Level Security)

As seguintes tabelas possuem dados sensíveis e estão protegidas por políticas RLS no Supabase:

| Tabela                   | Campo de Identificação do Usuário |
|--------------------------|-----------------------------------|
| admin_roles              | user_id                           |
| cart_items               | user_id                           |
| deliveries               | user_id                           |
| messages                 | user_id                           |
| notifications            | user_id                           |
| payments                 | user_id                           |
| scheduled_notifications  | user_email                        |
| user_achievements        | user_id                           |
| user_quests              | user_id                           |
| user_stats               | user_id                           |

### Políticas RLS Aplicadas

- **Acesso do usuário:** Cada usuário autenticado só pode acessar, inserir, atualizar ou deletar registros onde o campo de identificação corresponde ao seu próprio `auth.uid()` (ou `auth.email()` para `scheduled_notifications`).
- **Acesso de administrador:** Usuários com o claim JWT `role = 'admin'` têm acesso total a todas as linhas dessas tabelas.
- **Acesso público:** Não há acesso público a dados sensíveis.

#### Exemplo de política aplicada (cart_items):
```sql
-- Permitir acesso total para administradores
CREATE POLICY "Admin full access" ON cart_items
  FOR ALL USING (auth.role() = 'admin');

-- Permitir acesso ao próprio dado para usuários autenticados
CREATE POLICY "User access to own cart items" ON cart_items
  FOR ALL USING (user_id = auth.uid());
```

> As demais tabelas seguem o mesmo padrão, trocando o campo de identificação conforme a tabela.

#### scheduled_notifications
```sql
CREATE POLICY "User access to own scheduled notifications" ON scheduled_notifications
  FOR ALL USING (user_email = auth.email());
```

- Todas as políticas exigem que o usuário esteja autenticado (`auth.uid() IS NOT NULL`).
- As políticas são revisadas e mantidas em [`supabase/SEGURANCA_RLS.md`](supabase/SEGURANCA_RLS.md) e nos arquivos de migração em `supabase/migrations/`.

## Melhorias Recentes

- **Página de FAQ**: Agora inclui uma funcionalidade de busca para filtrar perguntas e respostas, além de um design consistente com o restante do site (header e footer).
- **Botão de Suporte no Rodapé**: Adicionado um botão na seção "Legal" do rodapé que redireciona para a página de FAQ.

## Atualizações Recentes

### Funcionalidades Adicionadas

- **Gestão de FAQs**: Adicionada funcionalidade para criar, editar e excluir FAQs no painel admin.
- **Editor de Conteúdo**: Implementado editor WYSIWYG utilizando `react-quill`.
- **Calendário de Entregas**: Adicionado calendário interativo com suporte a intervalos de datas usando `react-calendar`.

### Correções

- Corrigidos problemas de importação e tipos no arquivo `adminRoutes.ts`.
- Ajustados tipos no `OrdersCalendar.tsx` para lidar com intervalos de datas.
- Adicionado tipo `Database` no arquivo `supabase/types.ts` para resolver erro de importação.

### Melhorias Gerais

- Reinstalação e configuração de dependências para resolver problemas de módulos ausentes.
- Ajustes no `tsconfig.json` para incluir caminhos explícitos para módulos externos.

## Contribuição

Contribuições são bem-vindas! Siga as diretrizes e código de conduta do projeto.

### Como Contribuir

1. **Fork o repositório**
2. **Crie uma branch para sua feature ou correção**:

   ```sh
   git checkout -b minha-feature
   ```

3. **Faça commits claros e objetivos**
4. **Abra um Pull Request**

### Código de Conduta

Por favor, leia o [Código de Conduta](CONTRIBUTING.md) para detalhes sobre nossos padrões de contribuição.

## Suporte

Para dúvidas ou suporte, abra uma issue ou contacte a equipa de desenvolvimento.

---

## Checklist MVP

- [x] Cadastro e autenticação de utilizadores
- [x] Gestão de keepsakes digitais e físicos
- [x] Entregas programadas e notificações automáticas
- [x] Dashboard para admin e utilizador
- [x] Exportação de dados (CSV)
- [x] Onboarding e tooltips
- [x] Testes unitários e E2E
- [x] Monitoramento de erros (Sentry)
- [x] Métricas (Google Analytics)
- [x] Políticas de segurança (RLS, constraints)
- [x] Suporte a pagamentos por link externo (Stripe)

## Fluxos Principais do Usuário

### 1. Cadastro e Login

- Usuário acessa `/register` e cria conta.
- Recebe confirmação e faz login em `/login`.

### 2. Compra e Pagamento

- Usuário navega até `/products`.
- Adiciona produto ao carrinho e acessa `/checkout`.
- Preenche dados, finaliza compra e é redirecionado ao Stripe.
- Após pagamento, recebe confirmação e entrega é agendada.

### 3. Entregas e Notificações

- Usuário pode consultar entregas agendadas no dashboard.
- Notificações automáticas são enviadas conforme agendamento.

### 4. Administração

- Admin acessa `/admin` para gerenciar entregas, pagamentos, clientes e FAQs.

---

# FuturoPresente

## Banco de Dados: Tabelas e Segurança

A plataforma utiliza o Supabase como backend, com as principais tabelas:
- **profiles**: informações dos usuários
- **admin_roles**: permissões administrativas
- **cart_items**: itens do carrinho
- **warehouse_items**: estoque de cápsulas
- **deliveries**: entregas agendadas
- **messages**: mensagens entre usuários e sistema
- **payments**: pagamentos e status

A segurança é reforçada com Row Level Security (RLS) ativada nas tabelas sensíveis, garantindo que cada usuário só acesse seus próprios dados. As políticas de RLS e exemplos de uso estão detalhados em [`supabase/SEGURANCA_RLS.md`](supabase/SEGURANCA_RLS.md). Para detalhes sobre a estrutura das tabelas, consulte as [migrations](supabase/migrations/).
> Para exemplos de testes E2E, veja `cypress/e2e/`.
