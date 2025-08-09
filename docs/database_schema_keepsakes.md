# Documentação do Schema de Banco de Dados - Keepsakes

Este documento descreve o schema do banco de dados relacionado à funcionalidade de envio automático de cápsulas digitais (keepsakes) no projeto Future Keepsake Delivery.

## Tabelas Principais

### `keepsakes`

Armazena as cápsulas digitais e físicas criadas pelos usuários.

| Coluna | Tipo | Descrição |
|--------|------|------------|
| `id` | `uuid` | Identificador único da cápsula |
| `user_id` | `uuid` | ID do usuário que criou a cápsula |
| `title` | `text` | Título da cápsula |
| `message_content` | `text` | Conteúdo da mensagem |
| `message_type` | `text` | Tipo da mensagem |
| `delivery_date` | `timestamp with time zone` | Data e hora programada para entrega |
| `status` | `text` | Status da cápsula ('scheduled', 'sent', 'error') |
| `type` | `text` | Tipo da cápsula ('digital', 'physical') |
| `created_at` | `timestamp with time zone` | Data e hora de criação |
| `updated_at` | `timestamp with time zone` | Data e hora da última atualização |

### `recipients`

Armazena os destinatários das cápsulas.

| Coluna | Tipo | Descrição |
|--------|------|------------|
| `id` | `uuid` | Identificador único do destinatário |
| `name` | `text` | Nome do destinatário |
| `email` | `text` | Email do destinatário |
| `keepsake_id` | `uuid` | ID da cápsula associada |
| `created_at` | `timestamp with time zone` | Data e hora de criação |
| `updated_at` | `timestamp with time zone` | Data e hora da última atualização |

### `notifications`

Armazena notificações para os usuários.

| Coluna | Tipo | Descrição |
|--------|------|------------|
| `id` | `uuid` | Identificador único da notificação |
| `user_id` | `uuid` | ID do usuário destinatário da notificação |
| `title` | `text` | Título da notificação |
| `content` | `text` | Conteúdo da notificação |
| `type` | `text` | Tipo da notificação (ex: 'keepsake_delivery') |
| `status` | `text` | Status da notificação ('read', 'unread') |
| `keepsake_id` | `uuid` | ID da cápsula associada (opcional) |
| `created_at` | `timestamp with time zone` | Data e hora de criação |

### `scheduled_notifications`

Armazena notificações agendadas para envio.

| Coluna | Tipo | Descrição |
|--------|------|------------|
| `id` | `uuid` | Identificador único da notificação agendada |
| `user_email` | `text` | Email do usuário |
| `recipient_id` | `uuid` | ID do destinatário |
| `delivery_date` | `timestamp with time zone` | Data e hora programada para envio |
| `status` | `text` | Status da notificação ('pending', 'sent', 'error') |
| `sent_at` | `timestamp with time zone` | Data e hora do envio (se enviada) |
| `keepsake_id` | `uuid` | ID da cápsula associada |
| `delivery_id` | `uuid` | ID da entrega associada |

### `cron_job_logs` (Nova tabela)

Armazena logs de execução dos cron jobs.

| Coluna | Tipo | Descrição |
|--------|------|------------|
| `id` | `serial` | Identificador único do log |
| `job_name` | `text` | Nome do cron job |
| `result` | `text` | Resultado da execução (JSON) |
| `created_at` | `timestamp with time zone` | Data e hora da execução |

## Funções e Procedimentos

### `invoke_send_keepsakes_function()`

Função que invoca a Edge Function `send-keepsakes` para processar cápsulas agendadas.

**Retorno:** `void`

**Descrição:** Esta função é chamada pelo cron job diariamente para processar cápsulas digitais agendadas para entrega. Ela invoca a Edge Function `send-keepsakes` usando uma requisição HTTP e registra o resultado na tabela `cron_job_logs`.

## Cron Jobs

### `process-keepsakes-daily`

**Agendamento:** `5 0 * * *` (Todos os dias às 00:05)

**Descrição:** Executa a função `invoke_send_keepsakes_function()` para processar cápsulas digitais agendadas para entrega.

## Fluxo de Dados

1. O cron job `process-keepsakes-daily` é executado diariamente às 00:05.
2. A função `invoke_send_keepsakes_function()` é chamada.
3. A Edge Function `send-keepsakes` é invocada via HTTP.
4. A Edge Function busca cápsulas digitais com `status = 'scheduled'` e `delivery_date <= now()`.
5. Para cada cápsula encontrada:
   - Busca informações do remetente na tabela `profiles`.
   - Busca destinatários na tabela `recipients`.
   - Envia emails para os destinatários e remetente usando o serviço Resend.
   - Atualiza o status da cápsula para 'sent' na tabela `keepsakes`.
   - Cria uma notificação para o usuário na tabela `notifications`.
6. O resultado da execução é registrado na tabela `cron_job_logs`.

## Índices

- `cron_job_logs_job_name_idx`: Índice na coluna `job_name` da tabela `cron_job_logs`.
- `cron_job_logs_created_at_idx`: Índice na coluna `created_at` da tabela `cron_job_logs`.

## Relacionamentos

- `keepsakes.user_id` → `profiles.id`
- `recipients.keepsake_id` → `keepsakes.id`
- `notifications.user_id` → `profiles.id`
- `notifications.keepsake_id` → `keepsakes.id`
- `scheduled_notifications.recipient_id` → `recipients.id`
- `scheduled_notifications.keepsake_id` → `keepsakes.id`
- `scheduled_notifications.delivery_id` → `deliveries.id`

## Notas de Implementação

- A Edge Function `send-keepsakes` é responsável por processar cápsulas digitais agendadas para entrega.
- O status da cápsula é atualizado para 'sent' após o envio bem-sucedido.
- Se ocorrer um erro durante o processamento, o status da cápsula é atualizado para 'error'.
- Uma notificação é criada para o usuário após o envio bem-sucedido.
- Os logs de execução do cron job são armazenados na tabela `cron_job_logs`.