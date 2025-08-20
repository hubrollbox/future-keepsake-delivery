# 📡 Documentação da API

Esta documentação descreve as APIs e integrações utilizadas no **FuturoPresente**.

## 📋 Índice

- [Visão Geral](#visão-geral)
- [Autenticação](#autenticação)
- [Supabase APIs](#supabase-apis)
- [Edge Functions](#edge-functions)
- [Integrações Externas](#integrações-externas)
- [Webhooks](#webhooks)
- [Rate Limiting](#rate-limiting)
- [Tratamento de Erros](#tratamento-de-erros)

## 🌐 Visão Geral

O FuturoPresente utiliza uma arquitetura baseada em Supabase com as seguintes APIs:

- **Supabase Database API**: CRUD operations via PostgREST
- **Supabase Auth API**: Autenticação e autorização
- **Supabase Storage API**: Upload e gerenciamento de arquivos
- **Edge Functions**: Funções serverless customizadas
- **Resend API**: Envio de emails transacionais
- **Stripe API**: Processamento de pagamentos

### Base URLs

```
Production: https://seu-projeto.supabase.co
Development: http://localhost:54321
```

## 🔐 Autenticação

### Headers Obrigatórios

```http
Authorization: Bearer <jwt_token>
apikey: <supabase_anon_key>
Content-Type: application/json
```

### Tipos de Autenticação

1. **Anonymous Key**: Para operações públicas
2. **JWT Token**: Para operações autenticadas
3. **Service Role**: Para operações administrativas

### Exemplo de Autenticação

```typescript
import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  process.env.VITE_SUPABASE_URL!,
  process.env.VITE_SUPABASE_ANON_KEY!
)

// Login
const { data, error } = await supabase.auth.signInWithPassword({
  email: 'user@example.com',
  password: 'password'
})
```

## 🗄️ Supabase APIs

### Database API (PostgREST)

Todas as operações de banco seguem o padrão REST via PostgREST.

#### Keepsakes

**Listar Keepsakes**
```http
GET /rest/v1/keepsakes?select=*
```

**Criar Keepsake**
```http
POST /rest/v1/keepsakes
Content-Type: application/json

{
  "title": "Minha Cápsula do Tempo",
  "content": "Conteúdo da mensagem",
  "delivery_date": "2024-12-25T10:00:00Z",
  "recipient_email": "destinatario@example.com",
  "recipient_name": "João Silva"
}
```

**Atualizar Keepsake**
```http
PATCH /rest/v1/keepsakes?id=eq.<keepsake_id>
Content-Type: application/json

{
  "title": "Título Atualizado",
  "content": "Novo conteúdo"
}
```

**Deletar Keepsake**
```http
DELETE /rest/v1/keepsakes?id=eq.<keepsake_id>
```

#### Filtros e Ordenação

```http
# Filtrar por status
GET /rest/v1/keepsakes?status=eq.pending

# Ordenar por data de criação
GET /rest/v1/keepsakes?order=created_at.desc

# Paginação
GET /rest/v1/keepsakes?limit=10&offset=20

# Busca por texto
GET /rest/v1/keepsakes?title=ilike.*aniversário*
```

#### Notificações

**Listar Notificações**
```http
GET /rest/v1/notifications?select=*&order=created_at.desc
```

**Marcar como Lida**
```http
PATCH /rest/v1/notifications?id=eq.<notification_id>
Content-Type: application/json

{
  "status": "read"
}
```

### Auth API

**Registro**
```http
POST /auth/v1/signup
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "password123",
  "data": {
    "full_name": "João Silva"
  }
}
```

**Login**
```http
POST /auth/v1/token?grant_type=password
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "password123"
}
```

**Logout**
```http
POST /auth/v1/logout
Authorization: Bearer <jwt_token>
```

**Reset de Senha**
```http
POST /auth/v1/recover
Content-Type: application/json

{
  "email": "user@example.com"
}
```

### Storage API

**Upload de Arquivo**
```http
POST /storage/v1/object/keepsake-attachments/<file_path>
Authorization: Bearer <jwt_token>
Content-Type: multipart/form-data

<file_data>
```

**Download de Arquivo**
```http
GET /storage/v1/object/public/keepsake-attachments/<file_path>
```

**Deletar Arquivo**
```http
DELETE /storage/v1/object/keepsake-attachments/<file_path>
Authorization: Bearer <jwt_token>
```

## ⚡ Edge Functions

### send-keepsakes

Processa e envia keepsakes agendadas.

**Endpoint**
```http
POST /functions/v1/send-keepsakes
Authorization: Bearer <service_role_key>
```

**Resposta**
```json
{
  "success": true,
  "processed": 5,
  "sent": 4,
  "failed": 1,
  "details": [
    {
      "keepsake_id": "uuid",
      "status": "sent",
      "recipient_email": "user@example.com"
    }
  ]
}
```

### send-contact-email

Envia emails de contato do formulário.

**Endpoint**
```http
POST /functions/v1/send-contact-email
Content-Type: application/json

{
  "name": "João Silva",
  "email": "joao@example.com",
  "subject": "Dúvida sobre o serviço",
  "message": "Gostaria de saber mais sobre..."
}
```

**Resposta**
```json
{
  "success": true,
  "message": "Email enviado com sucesso",
  "email_id": "resend_email_id"
}
```

## 🔌 Integrações Externas

### Resend API

**Configuração**
```typescript
import { Resend } from 'resend'

const resend = new Resend(process.env.RESEND_API_KEY)
```

**Envio de Email**
```typescript
const { data, error } = await resend.emails.send({
  from: 'FuturoPresente <noreply@futuropresente.com>',
  to: ['destinatario@example.com'],
  subject: 'Sua Cápsula do Tempo Chegou!',
  html: emailTemplate,
  attachments: [
    {
      filename: 'attachment.pdf',
      content: fileBuffer
    }
  ]
})
```

### Stripe API

**Criar Checkout Session**
```typescript
const session = await stripe.checkout.sessions.create({
  payment_method_types: ['card'],
  line_items: [
    {
      price_data: {
        currency: 'eur',
        product_data: {
          name: 'Plano Premium'
        },
        unit_amount: 999 // €9.99
      },
      quantity: 1
    }
  ],
  mode: 'subscription',
  success_url: `${process.env.VITE_APP_URL}/success`,
  cancel_url: `${process.env.VITE_APP_URL}/cancel`
})
```

## 🪝 Webhooks

### Stripe Webhooks

**Endpoint**: `/api/webhooks/stripe`

**Eventos Suportados**:
- `checkout.session.completed`
- `invoice.payment_succeeded`
- `invoice.payment_failed`
- `customer.subscription.updated`
- `customer.subscription.deleted`

**Exemplo de Handler**
```typescript
export async function POST(request: Request) {
  const body = await request.text()
  const signature = request.headers.get('stripe-signature')!
  
  let event: Stripe.Event
  
  try {
    event = stripe.webhooks.constructEvent(
      body,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET!
    )
  } catch (err) {
    return new Response('Webhook signature verification failed', {
      status: 400
    })
  }
  
  switch (event.type) {
    case 'checkout.session.completed':
      // Processar pagamento concluído
      break
    case 'invoice.payment_failed':
      // Processar falha no pagamento
      break
  }
  
  return new Response('OK', { status: 200 })
}
```

### Resend Webhooks

**Endpoint**: `/api/webhooks/resend`

**Eventos Suportados**:
- `email.sent`
- `email.delivered`
- `email.bounced`
- `email.complained`

## 🚦 Rate Limiting

### Limites por Endpoint

| Endpoint | Limite | Janela |
|----------|--------|---------|
| `/auth/*` | 10 req/min | Por IP |
| `/rest/v1/keepsakes` (POST) | 5 req/min | Por usuário |
| `/functions/v1/send-contact-email` | 3 req/min | Por IP |
| `/rest/v1/*` (GET) | 100 req/min | Por usuário |

### Headers de Rate Limit

```http
X-RateLimit-Limit: 100
X-RateLimit-Remaining: 95
X-RateLimit-Reset: 1640995200
```

### Resposta de Rate Limit Excedido

```json
{
  "error": "Rate limit exceeded",
  "message": "Too many requests. Please try again later.",
  "retry_after": 60
}
```

## ❌ Tratamento de Erros

### Códigos de Status HTTP

| Código | Descrição |
|--------|----------|
| 200 | Sucesso |
| 201 | Criado com sucesso |
| 400 | Requisição inválida |
| 401 | Não autenticado |
| 403 | Não autorizado |
| 404 | Recurso não encontrado |
| 409 | Conflito |
| 422 | Entidade não processável |
| 429 | Rate limit excedido |
| 500 | Erro interno do servidor |

### Formato de Erro Padrão

```json
{
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "Dados de entrada inválidos",
    "details": {
      "field": "email",
      "issue": "Formato de email inválido"
    }
  }
}
```

### Códigos de Erro Customizados

| Código | Descrição |
|--------|----------|
| `KEEPSAKE_NOT_FOUND` | Keepsake não encontrada |
| `DELIVERY_DATE_PAST` | Data de entrega no passado |
| `EMAIL_SEND_FAILED` | Falha no envio de email |
| `FILE_TOO_LARGE` | Arquivo muito grande |
| `INVALID_FILE_TYPE` | Tipo de arquivo inválido |
| `SUBSCRIPTION_REQUIRED` | Assinatura necessária |

## 📊 Monitoramento e Logs

### Logs de API

Todos os requests são logados com:
- Timestamp
- Method e URL
- Status code
- Response time
- User ID (se autenticado)
- IP address

### Métricas Disponíveis

- Requests per minute/hour/day
- Error rates por endpoint
- Response times médios
- Usuários ativos
- Keepsakes criadas/enviadas

### Health Check

```http
GET /health
```

**Resposta**
```json
{
  "status": "healthy",
  "timestamp": "2024-01-15T10:30:00Z",
  "services": {
    "database": "healthy",
    "storage": "healthy",
    "email": "healthy",
    "payments": "healthy"
  },
  "version": "1.0.0"
}
```

## 🔧 Ferramentas de Desenvolvimento

### Postman Collection

Importe a collection do Postman disponível em `/docs/postman/`

### OpenAPI Specification

Documentação OpenAPI disponível em `/docs/openapi.yaml`

### SDK JavaScript

```typescript
import { FuturoPresente } from '@futuropresente/sdk'

const client = new FuturoPresente({
  apiKey: 'your-api-key',
  baseUrl: 'https://seu-projeto.supabase.co'
})

// Criar keepsake
const keepsake = await client.keepsakes.create({
  title: 'Minha Cápsula',
  content: 'Conteúdo...',
  deliveryDate: new Date('2024-12-25')
})
```

## 📞 Suporte

Para dúvidas sobre a API:

- 📧 Email: api@futuropresente.com
- 📚 Documentação: https://docs.futuropresente.com
- 🐛 Issues: https://github.com/owner/repo/issues

---

**Versão da API**: 1.0.0  
**Última atualização**: Janeiro 2024