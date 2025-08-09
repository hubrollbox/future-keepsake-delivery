# Funcionalidade de Envio Automático de Cápsulas Digitais

Esta documentação descreve a implementação da funcionalidade de envio automático de cápsulas digitais (keepsakes) no projeto Future Keepsake Delivery.

## Visão Geral

A funcionalidade consiste em:

1. Uma Edge Function do Supabase (`send-keepsakes`) que processa as cápsulas digitais agendadas
2. Um cron job que executa a função diariamente
3. Integração com o serviço de email Resend para enviar as mensagens

## Componentes Implementados

### 1. Edge Function `send-keepsakes`

A Edge Function é responsável por:

- Buscar cápsulas digitais agendadas para hoje ou datas passadas
- Enviar emails para os destinatários e remetentes
- Atualizar o status das cápsulas para 'sent'
- Criar notificações para os usuários

### 2. Cron Job

Um cron job do PostgreSQL que executa a Edge Function diariamente às 00:05.

### 3. Migração SQL

A migração SQL cria:

- A função `invoke_send_keepsakes_function()` que chama a Edge Function
- Uma tabela `cron_job_logs` para registrar as execuções
- O agendamento do cron job

## Requisitos

- Supabase com PostgreSQL 14+
- Extensão `pg_cron` habilitada
- Conta no serviço Resend para envio de emails

## Configuração

### 1. Variáveis de Ambiente

Adicione as seguintes variáveis de ambiente no projeto Supabase:

```bash
RESEND_API_KEY=sua_chave_api_resend
SUPABASE_URL=sua_url_supabase
SUPABASE_SERVICE_ROLE_KEY=sua_chave_service_role
```

### 2. Implantação da Edge Function

```bash
# Navegue até o diretório da função
cd supabase/functions/send-keepsakes

# Implante a função
supabase functions deploy send-keepsakes --project-ref seu-ref-projeto
```

### 3. Execução da Migração SQL

```bash
# Navegue até o diretório raiz do projeto
cd future-keepsake-delivery

# Execute a migração
supabase migration up --project-ref seu-ref-projeto
```

### 4. Teste Manual

Você pode testar manualmente a função usando o script fornecido:

```bash
node scripts/testSendKeepsakes.js
```

## Fluxo de Funcionamento

1. O cron job é executado diariamente às 00:05
2. A função `invoke_send_keepsakes_function()` é chamada
3. A Edge Function `send-keepsakes` é invocada
4. A função busca todas as cápsulas digitais agendadas para hoje ou datas passadas
5. Para cada cápsula:
   - Busca informações do remetente e destinatários
   - Envia emails para os destinatários e remetente
   - Atualiza o status da cápsula para 'sent'
   - Cria uma notificação para o usuário
6. O resultado da execução é registrado na tabela `cron_job_logs`

## Tratamento de Erros

- Se ocorrer um erro ao processar uma cápsula, seu status é atualizado para 'error'
- Erros são registrados no console e na tabela `cron_job_logs`
- A função continua processando as demais cápsulas mesmo se ocorrer um erro em uma delas

## Monitoramento

Você pode monitorar a execução da função através:

1. Logs da Edge Function no painel do Supabase
2. Registros na tabela `cron_job_logs`
3. Status das cápsulas na tabela `keepsakes`

## Segurança

- A Edge Function usa a chave de serviço do Supabase para acessar o banco de dados
- A função não requer autenticação JWT para ser executada (é chamada pelo cron job)
- Emails são enviados usando o serviço Resend com TLS

## Manutenção

Para atualizar a função:

1. Modifique os arquivos na pasta `supabase/functions/send-keepsakes`
2. Reimplante a função usando o comando `supabase functions deploy send-keepsakes`

Para modificar o agendamento do cron job:

1. Atualize a expressão cron na migração SQL
2. Execute a migração novamente