# 📧 Análise Completa: Processo de Resend de Cápsulas

## 1. Visão Geral do Sistema

O Keepla (FuturoPresente) possui um sistema sofisticado de envio de cápsulas digitais (keepsakes) que integra **Resend** como serviço de email com agendamento automático via Supabase Edge Functions e cron jobs.

### Arquitetura de Alto Nível

```
[Frontend - Criar Delivery] 
    ↓
[Supabase Database - Armazenar]
    ↓
[Cron Job Daily @ 00:05]
    ↓
[Edge Function: send-keepsakes]
    ↓
[Resend API - Enviar Emails]
    ↓
[Atualizar Status + Notificações]
```

---

## 2. Fluxo Completo de Resend

### 2.1 **Fase 1: Criação do Delivery (Frontend)**

**Arquivo**: [src/features/create-delivery/useCreateDeliveryForm.ts](../src/features/create-delivery/useCreateDeliveryForm.ts)

#### Dados Coletados:
```typescript
interface DeliveryInsertData {
  title: string;
  recipient_name: string;
  recipient_email: string;
  delivery_date: string;
  delivery_time: string;
  delivery_method: "email" | "physical";
  location?: string;
  message?: string;
  digital_file_url?: string;
  user_id: string;
  description?: string;
  type: "digital" | "physical";
  payment_status: "pending" | "completed" | "failed";
}
```

#### Processo:
1. Usuário preenche formulário com detalhes da cápsula
2. Dados são validados através de `validateDeliveryData()`
3. Keepsake é inserida na tabela `keepsakes`
4. Destinatário é inserido na tabela `recipients`
5. Uma notificação é agendada em `scheduled_notifications`

**Status Inicial**: `pending` (na tabela keepsakes)

---

### 2.2 **Fase 2: Agendamento via Cron Job**

**Arquivo**: [database_schema_keepsakes.md](../docs/database_schema_keepsakes.md#cron-jobs)

#### Configuração:
- **Job Name**: `process-keepsakes-daily`
- **Schedule**: `5 0 * * *` (00:05 UTC / 01:05 Lisboa)
- **Função Chamada**: `invoke_send_keepsakes_function()`

#### O que acontece:
1. Cron job é acionado automaticamente a cada dia
2. Função RPC `invoke_send_keepsakes_function()` é executada
3. Edge Function `send-keepsakes` é invocada via HTTP POST
4. Resultado é registrado em `cron_job_logs`

---

### 2.3 **Fase 3: Edge Function `send-keepsakes`** ⚡

**Arquivo**: [supabase/functions/send-keepsakes/index.ts](../supabase/functions/send-keepsakes/index.ts)

Esta é a **função central** do processo de resend.

#### A. Buscar Keepsakes Pendentes

```typescript
// Busca keepsakes com status 'scheduled' e delivery_date <= agora
const { data: keepsakes } = await supabase
  .from('keepsakes')
  .select(`
    id,
    user_id,
    title,
    message,
    message_content,
    delivery_date,
    status,
    type,
    recipients ( name, email ),
    users ( email, full_name )
  `)
  .eq('status', 'scheduled')
  .eq('type', 'digital')
  .lte('delivery_date', now)
  .limit(BATCH_SIZE)
```

**BATCH_SIZE**: 50 keepsakes por execução

#### B. Sanitização de Dados (Segurança)

Antes de processar, todos os dados são sanitizados para prevenir XSS:

```typescript
function escapeHtml(unsafe: string): string {
  return unsafe
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;')
    .replace(/\//g, '&#x2F;')
}
```

- **Keepsake Data**: `sanitizeKeepsakeData()`
- **User Data**: `sanitizeUserData()`
- **Recipient Data**: `sanitizeRecipientData()`

#### C. Validações

1. **Rate Limiting por Usuário**
   - Máximo: 50 emails/hora por usuário
   - Cache em memória com reset automático
   - Previne abuso do serviço

2. **Validação de Email**
   ```typescript
   function isValidEmail(email: string): boolean {
     const emailRegex = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/
     return emailRegex.test(email) && email.length <= 254
   }
   ```

#### D. Construção de Templates de Email

Para cada keepsake, são gerados **2 emails**:

**1️⃣ Email para Destinatário:**
```html
📝 Cápsula Digital Recebida
- Saudação personalizada
- Título e mensagem da cápsula
- Data de entrega
- Assinatura da equipa FuturoPresente
```

**2️⃣ Email para Remetente (Confirmação):**
```html
✅ Sua Mensagem Foi Entregue!
- Confirmação de envio
- Nome do destinatário
- Título da mensagem
```

#### E. Envio com Resend e Retry

**Configuração de Retry:**
- MAX_RETRY_ATTEMPTS: 3 tentativas
- INITIAL_RETRY_DELAY: 1000ms (1 segundo)
- RETRY_BACKOFF_MULTIPLIER: 2 (exponential backoff)

**Exemplo de Delays:**
- Tentativa 1: Falha imediata
- Tentativa 2: Aguarda 1 segundo
- Tentativa 3: Aguarda 2 segundos
- Tentativa 4: Aguarda 4 segundos

```typescript
async function sendEmailWithRetry(
  to: string,
  subject: string,
  htmlContent: string,
  fromName: string,
  keepsakeId?: string,
  attempt: number = 1
) {
  try {
    const result = await resend.emails.send({
      from: `${fromName} <noreply@futurodopresente.com>`,
      to: [to],
      subject: subject,
      html: htmlContent,
    })
    
    return { success: true, result }
  } catch (error) {
    if (attempt < MAX_RETRY_ATTEMPTS) {
      const delayMs = INITIAL_RETRY_DELAY * Math.pow(RETRY_BACKOFF_MULTIPLIER, attempt - 1)
      await delay(delayMs)
      return sendEmailWithRetry(to, subject, htmlContent, fromName, keepsakeId, attempt + 1)
    }
    return { success: false, error }
  }
}
```

#### F. Processamento Paralelo Controlado

Emails são enviados em **lotes de 10** para controlar concorrência:

```typescript
const MAX_CONCURRENT_EMAILS = 10

for (let i = 0; i < emailPromises.length; i += MAX_CONCURRENT_EMAILS) {
  const batch = emailPromises.slice(i, i + MAX_CONCURRENT_EMAILS)
  const batchResults = await Promise.allSettled(batch)
  emailResults.push(...batchResults)
}
```

#### G. Análise de Resultados

Após envio, a função conta sucessos e falhas:

```typescript
const failedEmails = emailResults.filter(r => 
  r.status === 'rejected' || r.value?.success === false
)

// Status final:
const status = failedEmails.length > 0 ? 'partial_sent' : 'sent'
```

#### H. Atualização de Status (Transação Atômica)

```typescript
// RPC para executar atomicamente:
await supabase.rpc('execute_keepsake_completion', {
  p_keepsake_id: keepsake.id,
  p_status: status,
  p_sent_at: sentAt,
  p_user_id: keepsake.user_id,
  p_title: keepsake.title,
  p_failed_emails: failedEmails.length
})
```

**O que é atualizado:**
1. Status da keepsake: `sent` ou `partial_sent` ou `error`
2. Timestamp de envio
3. Criação de notificação para o usuário

#### I. Logging Estruturado

Cada operação é registrada com contexto:

```typescript
function logWithContext(level: 'info' | 'error' | 'warn', message: string, context = {}) {
  const timestamp = DateTime.now().setZone('Europe/Lisbon').toISO()
  const logEntry = {
    timestamp,
    level,
    message,
    context
  }
  console.log(JSON.stringify(logEntry))
}
```

**Exemplos de Logs:**
- ✅ Email enviado com sucesso
- ⚠️ Tentativa de reenvio
- ❌ Email rejeitado após todas as tentativas
- 📊 Rate limit atingido

---

### 2.4 **Fase 4: Atualização de Notificações** 🔔

**Arquivo**: [supabase/functions/send-keepsakes/index.ts](../supabase/functions/send-keepsakes/index.ts) (linhas 507+)

#### Notificação para o Usuário

```typescript
await supabase.from('notifications').insert({
  user_id: keepsake.user_id,
  title: status === 'sent' 
    ? 'Mensagem entregue' 
    : 'Mensagem parcialmente entregue',
  content: notificationContent,
  type: 'keepsake_delivery',
  status: 'unread',
  keepsake_id: keepsake.id
})
```

#### Notificação em Tempo Real

O frontend monitora mudanças via [src/hooks/useRealtimeDeliveries.tsx](../src/hooks/useRealtimeDeliveries.tsx):

```typescript
supabase
  .channel('delivery-updates')
  .on('postgres_changes', {
    event: 'UPDATE',
    schema: 'public',
    table: 'deliveries'
  }, (payload) => {
    if (payload.new.status === 'delivered') {
      createNotification(
        "Entrega Realizada",
        `A sua mensagem "${payload.new.title}" foi entregue!`,
        "delivery"
      )
    }
  })
  .subscribe()
```

---

## 3. Tratamento de Erros e Resilência

### 3.1 Cenários de Falha Possíveis

| Cenário | Tratamento | Resultado |
|---------|-----------|-----------|
| Email inválido | Validação regex + falha graciosa | Email pulado, continua com próxima |
| Resend API indisponível | Retry com exponential backoff (3x) | Se falha tudo: status `error` |
| Rate limit Resend excedido | Aguarda e continua em próxima execução | Registra em logs, tenta amanhã |
| Erro na atualização BD | Registra erro mas não falha | Email enviado mesmo com falha na notificação |
| Processamento timeout | Edge Function timeout (15 min Vercel) | Registra parcial em `cron_job_logs` |

### 3.2 Mecanismos de Proteção

1. **Rate Limiting**: 50 emails/hora por usuário
2. **Sanitização XSS**: Escape HTML em todos os inputs
3. **Validação Email**: Regex RFC 5321 compliant
4. **Batch Processing**: Máximo 50 keepsakes + 10 emails simultâneos
5. **Retry Exponencial**: Até 3 tentativas com delay crescente
6. **Transações Atômicas**: Atualização de status com RPC
7. **Logging Estruturado**: Rastreabilidade completa

---

## 4. Integrações e Dependências

### 4.1 Serviço Resend

**Arquivo**: [supabase/functions/send-keepsakes/index.ts](../supabase/functions/send-keepsakes/index.ts) (linhas 1-15)

```typescript
import { Resend } from 'npm:resend@2.0.0'

const resend = new Resend(Deno.env.get('RESEND_API_KEY'))
```

**Variáveis de Ambiente Necessárias:**
- `RESEND_API_KEY`: Chave de API do Resend

**Configurações:**
- From: `noreply@futurodopresente.com`
- Remetente: Personalizado (FuturoPresente, nome do usuário)

### 4.2 Timezone - Portugal

**Arquivo**: [supabase/functions/send-keepsakes/index.ts](../supabase/functions/send-keepsakes/index.ts) (linha 23)

```typescript
const PORTUGAL_TIMEZONE = 'Europe/Lisbon'

// Usado em:
const sentAt = DateTime.now().setZone(PORTUGAL_TIMEZONE).toISO()
```

Garante que timestamps estejam sempre em hora de Portugal (UTC+0/+1).

### 4.3 Supabase Edge Functions

- **Runtime**: Deno
- **Timeout**: 15 minutos (Vercel)
- **Linguagem**: TypeScript

**Dependências NPM:**
```typescript
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.38.4'
import { Resend } from 'npm:resend@2.0.0'
import { DateTime } from 'npm:luxon@3.4.4'
```

---

## 5. Monitoramento e Debugging

### 5.1 Logs Estruturados

**Exemplo de Log de Sucesso:**
```json
{
  "timestamp": "2025-01-25T08:30:45.123+01:00",
  "level": "info",
  "message": "Email enviado com sucesso",
  "context": {
    "keepsakeId": "uuid-123",
    "to": "usuario@example.com",
    "subject": "Sua mensagem foi entregue!",
    "attempt": 1,
    "result": { "id": "resend-email-id" }
  }
}
```

**Exemplo de Log de Erro:**
```json
{
  "timestamp": "2025-01-25T08:30:45.123+01:00",
  "level": "error",
  "message": "Email rejeitado",
  "context": {
    "keepsakeId": "uuid-123",
    "emailIndex": 1,
    "error": "Invalid email address"
  }
}
```

### 5.2 Scripts de Teste

**Arquivo**: [ops/scripts/testSendKeepsakes.js](../ops/scripts/testSendKeepsakes.js)

```bash
# Testar a Edge Function diretamente
npm run test:send-keepsakes
```

**Arquivo**: [ops/scripts/testResendEmail.js](../ops/scripts/testResendEmail.js)

```bash
# Testar Resend API
npm run test:resend-email seu-email@exemplo.com
```

### 5.3 Verificação de Status do Cron Job

**Comando SQL:**
```sql
SELECT * FROM cron.job WHERE jobname = 'process-keepsakes-daily';
SELECT * FROM cron_job_logs ORDER BY created_at DESC LIMIT 10;
```

---

## 6. Performance e Métricas

### 6.1 Capacidade de Processamento

| Métrica | Valor |
|---------|-------|
| Keepsakes por execução | 50 |
| Emails simultâneos | 10 |
| Emails máx por usuário/hora | 50 |
| Tentativas de retry | 3 |
| Timeout da Edge Function | 15 min |

### 6.2 Tempo Estimado

**Cenário**: 50 keepsakes com 2 emails cada (100 emails)

- **Sem erros**: ~10 segundos (10 lotes de 10 emails)
- **Com 1 retry**: ~12 segundos (adiciona 1-2 seg de delay)
- **Com 2 retries**: ~16 segundos (adiciona 3-6 seg de delay)

---

## 7. Fluxo Visual Completo

```
┌─────────────────────────────────────────────────────────────┐
│ FRONTEND: Usuário cria Delivery                             │
│ - Formulário + dados                                        │
│ - Validação local                                           │
└────────────────────┬────────────────────────────────────────┘
                     │
                     ▼
┌─────────────────────────────────────────────────────────────┐
│ SUPABASE: Inserir em Tabelas                                │
│ - keepsakes (title, message, delivery_date, status:pending) │
│ - recipients (name, email, keepsake_id)                    │
│ - scheduled_notifications                                  │
└────────────────────┬────────────────────────────────────────┘
                     │
                     │ [Aguarda até delivery_date]
                     │
                     ▼
┌─────────────────────────────────────────────────────────────┐
│ CRON JOB: Execução Diária (00:05)                           │
│ - Inicia: invoke_send_keepsakes_function()                  │
└────────────────────┬────────────────────────────────────────┘
                     │
                     ▼
┌─────────────────────────────────────────────────────────────┐
│ EDGE FUNCTION: send-keepsakes                               │
│ 1. Query: SELECT keepsakes WHERE status=scheduled & overdue │
│ 2. Loop: Para cada keepsake                                 │
│    a. Sanitizar dados (XSS prevention)                      │
│    b. Validar emails                                        │
│    c. Construir templates HTML                              │
│    d. Preparar 2 emails (destinatário + remetente)          │
│ 3. Batch: Enviar em lotes de 10 com Resend                 │
│ 4. Retry: Se falha, repetir 3x com exponential backoff      │
│ 5. Update: Atualizar status em Supabase (TX atômica)        │
└────────────────────┬────────────────────────────────────────┘
                     │
                     ▼
┌─────────────────────────────────────────────────────────────┐
│ RESEND API: Enviar Emails                                   │
│ - POST https://api.resend.com/emails                        │
│ - Auth: Bearer {RESEND_API_KEY}                             │
│ - Response: { id, created_at }                              │
└────────────────────┬────────────────────────────────────────┘
                     │
                     ▼
┌─────────────────────────────────────────────────────────────┐
│ SUPABASE: Atualizar Status                                  │
│ - keepsakes.status = 'sent' | 'partial_sent' | 'error'      │
│ - keepsakes.updated_at = now()                              │
│ - notifications INSERT (notificação para usuário)           │
└────────────────────┬────────────────────────────────────────┘
                     │
                     ▼
┌─────────────────────────────────────────────────────────────┐
│ FRONTEND (Real-time): Atualizar UI                          │
│ - Recebe atualização via subscription                       │
│ - Mostra status 'entregue' ao usuário                       │
│ - Toast/notificação visual                                  │
└─────────────────────────────────────────────────────────────┘
```

---

## 8. Potenciais Melhorias Futuras

### 8.1 Curto Prazo

- [ ] **Dashboard Admin**: Visualização de logs de envio
- [ ] **Retry Manual**: Botão para reenviar keepsakes falhadas
- [ ] **Webhook Resend**: Trackear deliveries, bounces, complaints
- [ ] **Analytics**: Métrica de taxa de entrega

### 8.2 Médio Prazo

- [ ] **Agendamento Fino**: Permitir hora exata de entrega (não só data)
- [ ] **Fallback Email**: Email alternativo se principal falhar
- [ ] **Email Templates**: Admin customizar templates
- [ ] **A/B Testing**: Testar variações de subject/conteúdo

### 8.3 Longo Prazo

- [ ] **SMS Delivery**: Integrar Twilio para SMS
- [ ] **Push Notifications**: Notificações push no app
- [ ] **Delayed Sending**: Enviar em intervalos (não tudo de uma vez)
- [ ] **ML Optimization**: Melhor hora de envio baseado em engagement

---

## 9. Sumário Executivo

### ✅ O que está implementado

1. **Sistema automático** de agendamento via cron jobs diários
2. **Edge Function robusta** com retry exponencial e rate limiting
3. **Sanitização XSS** em todos os dados de entrada
4. **Templates personalizados** para destinatários e remetentes
5. **Processamento paralelo controlado** (10 emails simultâneos)
6. **Logging estruturado** com rastreabilidade completa
7. **Atualização de status atômica** com transações
8. **Notificações em tempo real** para usuários via WebSocket

### ⚠️ Pontos de atenção

1. **Rate Limiting**: Máximo 50 emails/hora por usuário (pode ser insuficiente para alguns casos)
2. **Timezone Hardcoded**: Portugal sempre, sem flexibilidade
3. **Sem webhook Resend**: Não rastreia bounces/complaints
4. **Batch size fixo**: 50 keepsakes/execução pode ser bottleneck
5. **Sem retry persistente**: Se falha, só tenta amanhã

### 📊 Métricas Atuais

- **Taxa de sucesso**: Depende da Resend API + validação de emails
- **Latência média**: ~10-15 segundos por lote de 50
- **Capacidade diária**: Máximo ~86.400 emails (50 por hora)
- **Uptime**: Depende do Supabase + Resend + Vercel

