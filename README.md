# keepla

![Logo keepla](public/keepla%20logo.png)

## Sobre a Plataforma

A keepla é uma solução moderna para gestão, armazenamento e entrega programada de keepsakes (lembranças e presentes para o futuro). Desenvolvida para empresas e consumidores finais, a plataforma oferece segurança, personalização e automação em todo o ciclo de vida do presente.

## Funcionalidades Principais

- Cadastro e autenticação de utilizadores (Supabase Auth)
- Gestão de keepsakes digitais e físicos
- Entregas programadas e notificações automáticas
- Dashboard intuitivo para administradores e utilizadores
- Integração com Supabase (banco de dados, autenticação, storage)
- Interface responsiva e personalizável (React + Tailwind CSS)
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

   - Copie `.env.example` para `.env` e preencha as variáveis obrigatórias:
     - `VITE_SUPABASE_URL=...` (URL do seu projeto Supabase)
     - `VITE_SUPABASE_ANON_KEY=...` (chave anônima do Supabase)
   - Variáveis opcionais:
     - `VITE_SENTRY_DSN=...` (monitoramento de erros)
     - `VITE_GA_MEASUREMENT_ID=...` (Google Analytics)
     - `VITE_STRIPE_PUBLIC_KEY=...` (pagamentos)
   - **Importante:** O arquivo `.env` não é versionado por segurança. Certifique-se de que ele existe localmente.

3. **Configuração do Supabase:**

   - Crie um projeto no [Supabase](https://supabase.com/).
   - Importe as migrações SQL da pasta `supabase/migrations` para criar as tabelas e políticas necessárias.
   - Ative o Row Level Security (RLS) nas tabelas e configure as policies conforme os exemplos das migrações.
   - Certifique-se de que o usuário autenticado tem permissão para acessar sua própria linha na tabela `profiles`.
   - Preencha a tabela `profiles` com os dados dos usuários, se necessário.

4. **Executar em desenvolvimento:**

   ```sh
   npm run dev
   ```

   O app estará disponível em [http://localhost:5173](http://localhost:5173).

5. **Build para produção:**

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

## Solução de Problemas

- **Erro de sessão/autenticação:**
  - Verifique se as variáveis do Supabase estão corretas no `.env`.
  - Confirme que o projeto Supabase está ativo e as policies de RLS permitem acesso ao usuário autenticado.
  - Certifique-se de que o usuário existe na tabela `profiles`.
  - Reinicie o servidor de desenvolvimento após alterar o `.env`.

- **Erro 406 ao buscar perfil:**
  - Ocorre quando não há linha correspondente na tabela `profiles` para o usuário autenticado.
  - Solução: crie o perfil manualmente ou ajuste a lógica de criação de perfil após o registro.

- **Problemas com dependências:**
  - Execute `npm install` para garantir que todas as dependências estejam presentes.

## Contribuição

Pull requests são bem-vindos! Para grandes mudanças, abra uma issue primeiro para discutir o que você gostaria de modificar.

## Licença

[MIT](LICENSE)
