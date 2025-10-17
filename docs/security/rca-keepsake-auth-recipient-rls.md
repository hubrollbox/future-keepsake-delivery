# Análise de Causa Raiz (RCA) — Criação de Cápsula e Segurança de Destinatários

Este documento descreve a causa raiz, correções aplicadas e medidas de prevenção relacionadas ao fluxo de criação de cápsulas do tempo (keepsakes) e à proteção dos dados sensíveis dos destinatários, com foco em autenticação (useAuth) e políticas RLS (Row‑Level Security) no Supabase.

## Contexto

- O fluxo de criação de cápsulas utiliza `useAuth` para obter o `user` e validar sessão antes de qualquer inserção.
- A criação é orquestrada pelo hook `useKeepsakeForm` e pela página `CreateKeepsake`:
  - `CreateKeepsake` redireciona para `/login` quando não há sessão.
  - `useKeepsakeForm.submitKeepsake` verifica `user` e impede submissão sem autenticação.
  - Inserções realizadas:
    - Tabela `keepsakes`: inclui `user_id`, `title`, `message_content`, `delivery_date`, `type`, `status`, `total_cost`.
    - Tabela `recipients`: inclui `keepsake_id`, `name`, `delivery_channel` (fixo `email`), `email`, `relationship` (opcional), `channel_cost` (opcional).

## Sintomas Observados

- Falhas ao inserir/ler destinatários em alguns cenários (erros RLS) ou risco de acesso incorreto a dados sensíveis.
- Incompatibilidades históricas de políticas que referenciavam `user_id` diretamente na tabela `recipients` (que não possui `user_id`).

## Causa Raiz

1. Tabela `recipients` não possui coluna `user_id`. As políticas RLS anteriores tentavam validar acesso por `user_id` na própria tabela, o que é semanticamente incorreto.
2. A validação de posse deve ser feita por meio da relação com `keepsakes` (que possui `user_id`). Sem isso, operações poderiam falhar (bloqueio indevido) ou, em cenários mal configurados, permitir acesso indevido.

## Correções Aplicadas

- Políticas RLS reforçadas para `recipients` com verificação por posse do keepsake:

```sql
CREATE POLICY "recipients_secure_keepsake_owner_access" ON public.recipients
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM public.keepsakes 
      WHERE keepsakes.id = recipients.keepsake_id 
      AND keepsakes.user_id = auth.uid()
    )
  );
```

- Migrações relevantes no repositório:
  - `supabase/migrations/20250128000000_fix_recipients_security_vulnerability.sql`
  - `supabase/migrations/20250903001029_fffe1762-c50c-4711-8bc1-0cbcb7b5a08b.sql`
  - `supabase/migrations/20250903001119_7ed341ea-a759-471f-a8c6-c6ed477332b0.sql`
  - `supabase/migrations/20250902101334_278c2597-a24a-4c2e-b62e-e7055b4c52d5.sql`

- No cliente:
  - `CreateKeepsake.tsx` redireciona usuários não autenticados.
  - `useKeepsakeForm.submitKeepsake` valida sessão e aborta sem `user`.
  - Inserção de `keepsakes` usa `user.id` corretamente, e `recipients` referencia `keepsake_id` do keepsake recém-criado.

## Medidas Preventivas

- Garantir que todos os acessos a dados sensíveis (nome, email, telefone, endereço) sejam protegidos por políticas RLS com base na posse do recurso (join com `keepsakes`).
- Validar sessão de usuário antes de qualquer operação de escrita/leitura sensível no cliente.
- Manter tipos gerados do Supabase atualizados para refletir colunas e defaults (evita payloads inválidos).
- Implementar testes de segurança de RLS:
  - Verificar que um usuário só consegue inserir/consultar `recipients` de keepsakes próprios.
  - Assegurar que admins têm acesso conforme funções seguras (`is_admin_secure()`).

## Como Validar (Checklist)

- Autenticação:
  - Acessar `/create-keepsake` sem sessão deve redirecionar para `/login`.
  - Tentar submeter cápsula sem sessão deve exibir erro e não gravar dados.

- Banco de Dados:
  - `SELECT schemaname, tablename, rowsecurity FROM pg_tables WHERE tablename = 'recipients';` deve indicar RLS habilitado.
  - `SELECT * FROM pg_policies WHERE tablename = 'recipients';` deve listar políticas seguras baseadas em `keepsakes.user_id`.
  - Consultas de recipients de outro usuário devem retornar zero linhas.

- Cliente:
  - Submeter fluxo completo cria `keepsakes` com `user_id = auth.uid()` e `recipients` vinculados via `keepsake_id`.

## Referências de Código

- `src/hooks/useKeepsakeForm.ts` — submissão (`submitKeepsake`) com validação de sessão e inserções.
- `src/pages/CreateKeepsake.tsx` — proteção de rota e orquestração de passos.
- `src/validations/keepsakeValidationSchema.ts` — validações fortes (inclui obrigatório de email quando canal é `email`).
- `src/integrations/supabase/types.ts` — tipos da tabela `recipients` (campos obrigatórios: `delivery_channel`, `email`, `keepsake_id`, `name`).

---

Status: corrigido e monitorado. Novos testes de RLS são recomendados para evitar regressões.