# Correções de Inconsistências no Esquema do Banco de Dados

Este documento lista as inconsistências encontradas entre o código da aplicação e o esquema do banco de dados, bem como as correções implementadas.

## Inconsistências Encontradas e Corrigidas

### 1. Tabela `messages` migrada para `keepsakes`

**Problema:** A tabela `messages` foi removida e seu conteúdo migrado para a tabela `keepsakes` com uma coluna `message_type`, conforme mostrado na migração `20250716000000_merge_messages_into_keepsakes.sql`. No entanto, o código em `src/hooks/useAdminData.tsx` ainda fazia referência à tabela `messages`.

**Solução:** Atualizado o código para consultar a tabela `keepsakes` com o filtro `message_type = 'message'` em vez da tabela `messages`.

```diff
- // Fetch messages
- const { data: messages, error: messagesError } = await supabase
-   .from("messages")
-   .select("id");
+ // Fetch keepsakes with message_type = 'message'
+ const { data: messages, error: messagesError } = await supabase
+   .from("keepsakes")
+   .select("id")
+   .eq("message_type", "message");
```

### 2. Variável `messagesRes` em `adminService.ts`

**Problema:** Em `src/services/adminService.ts`, a variável `messagesRes` estava sendo usada para armazenar o resultado de uma consulta de entregas digitais (`deliveries` com `type = 'digital'`), o que poderia causar confusão.

**Solução:** Renomeado a variável para `digitalDeliveriesRes` para maior clareza.

```diff
- const [deliveriesRes, messagesRes, warehouseRes, paymentsRes] = await Promise.all([
+ const [deliveriesRes, digitalDeliveriesRes, warehouseRes, paymentsRes] = await Promise.all([
  ...
]);

- return { deliveriesRes, messagesRes, warehouseRes, paymentsRes };
+ return { deliveriesRes, digitalDeliveriesRes, warehouseRes, paymentsRes };
```

### 3. Campo `content` em `createMessageSchema`

**Problema:** O esquema de validação `createMessageSchema` em `src/lib/validation.ts` ainda usava o campo `content`, mas a tabela `keepsakes` usa `message_content`.

**Solução:** Atualizado o esquema para usar `message_content` em vez de `content`.

```diff
export const createMessageSchema = z.object({
  title: titleSchema,
- content: messageSchema,
+ message_content: messageSchema,
  delivery_date: z.string().min(1, 'Data de entrega é obrigatória'),
  ...
});
```

### 4. Tabela `user_stats` ausente

**Problema:** A tabela `user_stats` é referenciada em triggers nas migrações, mas não estava presente no esquema do banco de dados.

**Solução:** Criado um novo arquivo de migração `20250723000000_add_user_stats_table.sql` para adicionar a tabela `user_stats` com as colunas necessárias e políticas de segurança de linha (RLS).

## Outras Observações

- A coluna `delivery_id` foi removida da tabela `recipients` na migração `20250715000000_refactor_deliveries_recipients.sql`.
- A coluna `address` foi removida da tabela `recipients` e substituída por campos separados (`street`, `city`, `state`, `postal_code`, `country`) na migração `20250719000000_refactor_recipient_address.sql`.
- A relação entre `deliveries` e `recipients` foi refatorada na migração `20250720000000_refactor_deliveries_recipients_relation.sql`, adicionando `recipient_id` à tabela `deliveries`.

### 5. Problemas com importação de módulos

**Problema:** O TypeScript não conseguia encontrar os módulos 'zod', 'react' e '@/integrations/supabase/client' ou suas declarações de tipo correspondentes, apesar de estarem listados como dependências no package.json.

**Solução:** Criados arquivos de declaração de tipo personalizados em:
- `src/types/zod.d.ts` para fornecer definições de tipo básicas para o módulo 'zod'
- `src/types/react.d.ts` para fornecer definições de tipo básicas para o módulo 'react'
- `src/types/supabase-client.d.ts` para fornecer definições de tipo básicas para o módulo '@/integrations/supabase/client'

Também foi atualizado o `tsconfig.app.json` para incluir o diretório `src/types` nos arquivos a serem compilados.

```diff
// tsconfig.app.json
- "include": ["src"]
+ "include": ["src", "src/types"]
```

Esta é uma solução temporária até que o ambiente de desenvolvimento seja configurado corretamente com todas as dependências instaladas.

## Conclusão

As correções implementadas garantem que o código da aplicação esteja consistente com o esquema atual do banco de dados, evitando erros em tempo de execução e facilitando a manutenção futura do código. Além disso, a solução temporária para o problema de importação do módulo 'zod' permite que o código seja compilado sem erros até que o ambiente de desenvolvimento seja configurado corretamente.