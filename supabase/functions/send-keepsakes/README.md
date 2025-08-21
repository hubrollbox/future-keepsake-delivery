# Edge Function: send-keepsakes

Esta Edge Function processa e envia keepsakes agendadas automaticamente.

## Funcionalidades

- ✅ Processamento em lote com controle de concorrência
- ✅ Rate limiting por usuário (50 emails/hora)
- ✅ Retry automático com exponential backoff
- ✅ Sanitização de dados (prevenção XSS)
- ✅ Logging estruturado com contexto
- ✅ Timezone correto para Portugal
- ✅ Tratamento robusto de erros

## Configuração

### Variáveis de Ambiente
```bash
RESEND_API_KEY=sua_chave_resend
SUPABASE_URL=sua_url_supabase
SUPABASE_SERVICE_ROLE_KEY=sua_chave_service_role
```

### Dependências
- `@supabase/supabase-js@2.38.4` - Cliente Supabase
- `resend@2.0.0` - Serviço de email
- `luxon@3.4.4` - Manipulação de timezone

## Deploy

```bash
supabase functions deploy send-keepsakes
```

## Uso

```bash
curl -X POST https://seu-projeto.supabase.co/functions/v1/send-keepsakes \
  -H "Authorization: Bearer sua_service_role_key"
```

## Notas sobre TypeScript

⚠️ **Os erros de TypeScript são esperados** para Edge Functions Deno:

- Os imports com URLs (`https://esm.sh/...`) e `npm:` são específicos do Deno
- O TypeScript não reconhece esses formatos, mas funcionam em runtime
- Use `npm run type-check` apenas para o código principal da aplicação
- Para Edge Functions, use `supabase functions deploy` diretamente

### Estrutura de Arquivos
```
send-keepsakes/
├── index.ts          # Função principal
├── deno.json         # Configuração Deno
├── deno.d.ts         # Tipos Deno
├── tsconfig.json     # Config TypeScript (Edge Function)
└── README.md         # Esta documentação
```

## Monitoramento

A função gera logs estruturados em JSON para facilitar o debugging:

```json
{
  "timestamp": "2024-01-15T10:30:00Z",
  "level": "info",
  "message": "Keepsake processada com sucesso",
  "keepsakeId": "uuid-da-keepsake"
}
```

## Troubleshooting

### Erro: "Cannot find module 'https://esm.sh/...'"
- ✅ **Normal** para Edge Functions Deno
- ✅ Funciona em runtime
- ❌ Não afeta deploy

### Erro: "Cannot find name 'Deno'"
- ✅ **Normal** para Edge Functions Deno
- ✅ Resolvido pelo `deno.d.ts`
- ❌ Não afeta deploy

### Rate Limiting
- Limite: 50 emails por usuário por hora
- Cache em memória (reset a cada deploy)
- Logs detalhados quando limite é excedido