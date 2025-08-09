# Instruções de Implantação - Entrega Automática de Keepsakes

Este documento fornece instruções detalhadas para implantar a funcionalidade de entrega automática de keepsakes digitais no ambiente de produção.

## Pré-requisitos

1. Conta Supabase com acesso ao projeto
2. Conta Resend para envio de emails
3. Supabase CLI instalado e configurado
4. Node.js v16 ou superior
5. Variáveis de ambiente configuradas

## Configuração de Variáveis de Ambiente

Antes de iniciar a implantação, certifique-se de que as seguintes variáveis de ambiente estão configuradas no seu arquivo `.env`:

```
VITE_SUPABASE_URL=https://seu-projeto.supabase.co
VITE_SUPABASE_ANON_KEY=sua-chave-anon
SUPABASE_SERVICE_ROLE_KEY=sua-chave-service-role
RESEND_API_KEY=sua-chave-resend
SUPABASE_PROJECT_REF=referencia-do-projeto
```

Para o ambiente de produção, configure estas variáveis no painel do Supabase:

1. Acesse o painel do Supabase > Configurações do Projeto > API
2. Anote a URL do projeto e a chave anônima
3. Anote a chave de serviço (service role key)
4. Acesse Configurações do Projeto > Funções > Variáveis de Ambiente
5. Adicione as variáveis `SUPABASE_URL`, `SUPABASE_SERVICE_ROLE_KEY` e `RESEND_API_KEY`

## Passos para Implantação

### 1. Implantação da Edge Function

Utilize o script de implantação para enviar a Edge Function para o Supabase:

```bash
npm run keepsake:deploy
```

Este script irá:
- Implantar a função `send-keepsakes` no seu projeto Supabase
- Executar a migração SQL para configurar o cron job

Alternativamente, você pode implantar manualmente:

```bash
cd supabase/functions/send-keepsakes
supabase functions deploy send-keepsakes --project-ref seu-projeto-ref
```

### 2. Verificação da Implantação

Após a implantação, utilize o script de verificação de status para confirmar que todos os componentes foram implantados corretamente:

```bash
npm run keepsake:status
```

Este script irá verificar:
- Se a Edge Function está disponível e respondendo
- Se o cron job está configurado corretamente
- Se as tabelas do banco de dados estão acessíveis

Alternativamente, você pode verificar manualmente:

1. Acesse o painel do Supabase > Funções de Borda
2. Confirme que a função `send-keepsakes` está listada e ativa
3. Verifique os logs para garantir que não há erros

### 3. Execução da Migração SQL

Se a migração não foi executada automaticamente pelo script de implantação, execute-a manualmente:

```bash
supabase migration up --project-ref seu-projeto-ref
```

Ou execute o script SQL diretamente no Editor SQL do Supabase:

1. Acesse o painel do Supabase > Editor SQL
2. Cole o conteúdo do arquivo `supabase/migrations/20250720000000_add_keepsakes_cron_job.sql`
3. Execute o script

### 4. Verificação do Cron Job

Verifique se o cron job foi configurado corretamente:

```sql
SELECT * FROM cron.job;
```

Você deve ver uma entrada para `process-keepsakes-daily` configurada para executar diariamente às 00:05.

### 5. Teste Manual da Função

Para testar a função manualmente:

```bash
curl -X POST https://seu-projeto.supabase.co/functions/v1/send-keepsakes \
  -H "Authorization: Bearer sua-chave-anon" \
  -H "Content-Type: application/json"
```

Ou use o script de teste fornecido (após ajustar a URL para apontar para produção):

```bash
npm run keepsake:test
```

## Monitoramento e Manutenção

### Logs do Cron Job

Os logs de execução do cron job são armazenados na tabela `public.cron_job_logs`. Para visualizar os logs:

```sql
SELECT * FROM public.cron_job_logs ORDER BY created_at DESC LIMIT 10;
```

### Logs da Edge Function

Para visualizar os logs da Edge Function:

1. Acesse o painel do Supabase > Funções de Borda > send-keepsakes > Logs
2. Ou use o comando CLI:

```bash
supabase functions logs send-keepsakes --project-ref seu-projeto-ref
```

### Atualização Manual de Status

Se necessário, você pode atualizar manualmente o status dos keepsakes usando o script fornecido:

```bash
# Listar keepsakes por status
node scripts/updateKeepsakeStatus.js list scheduled

# Atualizar status de um keepsake específico
node scripts/updateKeepsakeStatus.js update <keepsake_id> sent
```

## Solução de Problemas

### Verificação Completa do Sistema

Para realizar uma verificação completa do sistema e identificar possíveis problemas, execute o script de verificação de status:

```bash
npm run keepsake:status
```

Este script irá verificar todos os componentes da funcionalidade de entrega automática e fornecer um relatório detalhado sobre o status de cada um.

### Função não está sendo executada

1. Execute o script de verificação de status para identificar problemas
2. Verifique os logs da função para identificar erros
3. Confirme que as variáveis de ambiente estão configuradas corretamente
4. Verifique se o cron job está ativo na tabela `cron.job`
5. Teste a função manualmente para verificar se há erros

### Emails não estão sendo enviados

1. Verifique se a API key do Resend está correta
2. Confirme que os templates de email estão formatados corretamente
3. Verifique os logs do Resend para identificar problemas de entrega

### Erros na migração SQL

1. Execute a migração manualmente através do Editor SQL
2. Verifique se a extensão `pg_cron` está habilitada
3. Confirme que o usuário tem permissões para criar jobs no cron

## Considerações de Segurança

- A Edge Function utiliza a chave de serviço para acessar o banco de dados, garantindo que tenha permissões adequadas
- A função é configurada com `verify_jwt: false` para permitir a execução pelo cron job
- Considere implementar autenticação adicional se a função for exposta publicamente

## Atualizações Futuras

Para atualizar a função no futuro:

1. Modifique o código da função em `supabase/functions/send-keepsakes/index.ts`
2. Execute o script de implantação novamente:

```bash
npm run keepsake:deploy
```

Ou implante manualmente:

```bash
cd supabase/functions/send-keepsakes
supabase functions deploy send-keepsakes --project-ref seu-projeto-ref
```