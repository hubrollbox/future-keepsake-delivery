# Future Keepsake Delivery

![Logo FuturoPresente](public/placeholder.svg)

## Sobre a Plataforma

A Future Keepsake Delivery é uma solução moderna para gestão, armazenamento e entrega programada de keepsakes (lembranças e presentes para o futuro). Desenvolvida para empresas e consumidores finais, a plataforma oferece segurança, personalização e automação em todo o ciclo de vida do presente.

## Principais Funcionalidades
- Cadastro e autenticação de usuários
- Gestão de keepsakes digitais e físicos
- Entregas programadas e notificações automáticas
- Dashboard intuitivo para administradores e usuários
- Integração com Supabase para backend seguro
- Interface responsiva e personalizável
- Suporte a múltiplos métodos de pagamento (se aplicável)

## Tecnologias Utilizadas
- React + TypeScript
- Vite
- Tailwind CSS
- Supabase

## Como Operar e Implantar

### Instalação
```sh
git clone <URL_DO_SEU_REPOSITORIO>
cd <NOME_DA_PASTA>
npm install
```

### Configuração
Crie um arquivo `.env` na raiz do projeto com as seguintes variáveis:
- `VITE_SUPABASE_URL=...`
- `VITE_SUPABASE_ANON_KEY=...`

### Execução em Desenvolvimento
```sh
npm run dev
```

### Build para Produção
```sh
npm run build
```
Os arquivos finais estarão na pasta `dist/`.

### Testes

Para executar os testes automatizados do projeto, utilize o seguinte comando:

```bash
npm test
```

Este comando irá iniciar o Vitest e executar todos os arquivos de teste (com extensão `.test.ts`, `.test.tsx`, `.spec.ts`, `.spec.tsx`).

Os testes são configurados com `@testing-library/react` para garantir que os componentes funcionem como esperado do ponto de vista do usuário.

### Geração de Tipos Supabase

Para garantir a segurança de tipo e uma melhor experiência de desenvolvimento com o Supabase, é recomendável gerar os tipos TypeScript a partir do seu esquema de banco de dados. Para fazer isso, execute o seguinte comando:

```bash
npm run supabase:gen-types
```

Este comando utiliza a CLI do Supabase para inspecionar seu banco de dados e gerar automaticamente as definições de tipo em `src/integrations/supabase/types.ts`. Certifique-se de ter a CLI do Supabase configurada e autenticada.

### Estrutura de Pastas

```
src/
├── assets/
├── components/         # Componentes React reutilizáveis
│   ├── ui/             # Componentes de UI genéricos (botões, inputs, etc.)
├── hooks/              # Hooks React personalizados
├── integrations/       # Integrações com serviços externos (ex: Supabase)
│   └── supabase/
├── lib/                # Funções utilitárias e helpers
├── pages/              # Páginas da aplicação (rotas)
├── styles/             # Arquivos de estilo globais e configurações do Tailwind CSS
├── App.tsx             # Componente principal da aplicação
├── main.tsx            # Ponto de entrada da aplicação
├── vite-env.d.ts       # Declarações de tipo para variáveis de ambiente do Vite
└── setupTests.ts       # Configuração para o ambiente de teste (Vitest/Testing Library)
```

### Configuração do Supabase

Para otimizar o desempenho e a segurança da aplicação, é crucial configurar adequadamente o Supabase. Isso inclui:

- **Índices:** Adicione índices às colunas frequentemente consultadas para acelerar as operações de leitura. Exemplo:

  ```sql
  CREATE INDEX ON public.your_table (your_column);
  ```

- **Funções Personalizadas (Functions):** Utilize funções PL/pgSQL para encapsular lógica de negócios complexa ou para operações que exigem maior controle transacional. Exemplo de uma função simples:

  ```sql
  CREATE FUNCTION public.get_user_capsules(user_id uuid)
  RETURNS SETOF public.capsules
  LANGUAGE plpgsql
  AS $$
  BEGIN
    RETURN QUERY SELECT * FROM public.capsules WHERE user_id = get_user_capsules.user_id;
  END;
  $$;
  ```

- **Validações (Constraints):** Implemente validações diretamente no esquema do banco de dados para garantir a integridade dos dados. Exemplo de uma validação para garantir que um valor seja positivo:

  ```sql
  ALTER TABLE public.your_table
  ADD CONSTRAINT positive_value CHECK (your_column > 0);
  ```

- **Row Level Security (RLS):** Certifique-se de que as políticas de RLS estejam configuradas corretamente para controlar o acesso aos dados com base nas permissões do usuário. Isso é fundamental para a segurança da aplicação.

### Monitoramento de Erros

Para um monitoramento robusto de erros em produção, é altamente recomendável integrar uma ferramenta como o Sentry. Isso permitirá o rastreamento e a análise de erros em tempo real, facilitando a depuração e a manutenção da aplicação.

### Métricas de Performance

Para garantir uma experiência de usuário otimizada, é importante configurar o monitoramento de métricas de performance. Isso pode incluir o uso de ferramentas como Google Analytics, New Relic, ou outras soluções de APM (Application Performance Monitoring) para rastrear o tempo de carregamento da página, interatividade, e outros indicadores vitais de performance.

### Manutenção e Suporte

Para questões de manutenção, suporte ou contribuições, por favor, entre em contato com a equipa de desenvolvimento.

### Contribuição

Contribuições são bem-vindas! Por favor, siga as diretrizes de contribuição e o código de conduta do projeto.
