# Future Keepsake Delivery

![Logo FuturoPresente](public/placeholder.svg)

## Sobre a Plataforma

A Future Keepsake Delivery é uma solução moderna para gestão, armazenamento e entrega programada de keepsakes (lembranças e presentes para o futuro). Desenvolvida para empresas e consumidores finais, a plataforma oferece segurança, personalização e automação em todo o ciclo de vida do presente.

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

## Contribuição

Contribuições são bem-vindas! Siga as diretrizes e código de conduta do projeto.

## Suporte

Para dúvidas ou suporte, abra uma issue ou contacte a equipa de desenvolvimento.
