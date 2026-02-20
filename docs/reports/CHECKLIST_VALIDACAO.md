# 🎯 CHECKLIST DE VALIDAÇÃO - Verificação Rápida

**Objetivo**: Confirmar se tudo está funcional  
**Tempo estimado**: 5-10 minutos  
**Status**: Pós-correções

---

## 📋 Validação Imediata (Sem esperar cron)

### 1. Build TypeScript ✅

```bash
npm run build:prod
```

**Esperado:**
```
✅ Lint passa (0 erros críticos)
✅ TypeScript compila (tsc --noEmit sucede)
✅ Vite build gera dist/
```

**Se falhar:**
```
❌ Procurar por: "TS2614" ou "useAdminData"
❌ Solução: Verificar se src/hooks/useAdminData.ts foi criado
```

---

### 2. Iniciar Dev Server ✅

```bash
npm run dev
```

**Esperado:**
```
✅ Server inicia em http://localhost:8080
✅ Hot reload funciona
✅ Browser abre sem erros
```

**Se falhar:**
```
❌ Procurar por: Network error, module not found
❌ Solução: Limpar node_modules: rm -rf node_modules && npm install
```

---

### 3. Testar Frontend Básico ✅

**Em http://localhost:8080:**

```
[ ] Homepage carrega
[ ] Navbar funciona
[ ] Botão "Login" redirecionará para /login
[ ] Sem erros no console (F12 > Console)
```

---

### 4. Testar Admin Dashboard ✅

**Em http://localhost:8080/admin:**

```
[ ] Dashboard carrega (stats visíveis)
[ ] useAdminData hook funciona (zero erros)
[ ] Aba "Mensagens" carrega
[ ] Select de filtro funciona
[ ] aria-label presente no select (inspecionar HTML)
```

**Inspecionar HTML (F12):**
```html
<!-- Esperado: -->
<select aria-label="Filtrar mensagens por estado" title="...">
```

---

### 5. Testar Criar Keepsake ✅

**Em http://localhost:8080/create-keepsake:**

```
[ ] Formulário carrega
[ ] Campos aceitam input
[ ] Validação funciona (alertas de erro)
[ ] Botão "Enviar" sem erros
```

---

## 🔧 Testes de Funcionalidade Resend

### 6. Verificar Database Schema ✅

```bash
# No Supabase console:
# Ir para: Database > Tables

[ ] Tabela "keepsakes" existe
[ ] Tabela "recipients" existe
[ ] Tabela "deliveries" existe
[ ] Tabela "notifications" existe
[ ] Tabela "cron_job_logs" existe
```

---

### 7. Verificar Cron Job ✅

```bash
# No Supabase console:
# Ir para: Database > Scheduled Jobs

[ ] Job "process-keepsakes-daily" existe
[ ] Status: "enabled"
[ ] Schedule: "5 0 * * *" (00:05 daily)
```

---

### 8. Verificar Edge Functions ✅

```bash
# No Supabase console:
# Ir para: Edge Functions

[ ] "send-keepsakes" existe
[ ] "send-keepsake-email" existe
[ ] Status: "deployed"
```

---

### 9. Testar RLS Policies ✅

```bash
# No Supabase console:
# Ir para: Database > Policies

[ ] Tabela "deliveries" tem RLS ativado
[ ] Políticas existem:
  - deliveries_read
  - deliveries_write
  - deliveries_modify
  - deliveries_remove
```

---

## 📊 Matriz de Testes

| Teste | Comando/Local | Esperado | Status |
|-------|---------------|----------|--------|
| Build | `npm run build:prod` | ✅ Sem erros | ? |
| Dev | `npm run dev` | ✅ Inicia em :8080 | ? |
| Homepage | http://localhost:8080 | ✅ Carrega | ? |
| Admin | http://localhost:8080/admin | ✅ Dashboard OK | ? |
| Create | http://localhost:8080/create-keepsake | ✅ Form OK | ? |
| Select a11y | F12 > inspecionar select | ✅ aria-label OK | ? |
| DB Tables | Supabase console | ✅ Todas presentes | ? |
| Cron Job | Supabase console | ✅ Enabled | ? |
| Edge Functions | Supabase console | ✅ Deployed | ? |
| RLS | Supabase console | ✅ Ativado | ? |

---

## 🚨 Troubleshooting Rápido

### Erro: "useAdminData is not exported"
```
❌ src/hooks/useAdminData.ts não foi criado
✅ Solução: Criar arquivo (veja RELATORIO_CORRECOES.md)
```

### Erro: "React.useState is not found"
```
❌ Import incorreto de React
✅ Solução: Verificar tsconfig.json jsx: "react-jsx"
```

### Erro: "AuthProvider is not exported"
```
❌ src/contexts/AuthProvider.tsx não tem export
✅ Solução: Verificar arquivo (já deveria estar OK)
```

### Erro: "Module not found: @/hooks/useAdminData"
```
❌ Arquivo não existe ou path alias errado
✅ Solução: Criar src/hooks/useAdminData.ts
```

### Dashboard não carrega stats
```
❌ useAdminData retorna erro
✅ Solução: Verificar Supabase connection + RLS policies
```

### Select mostra warning a11y
```
❌ aria-label não foi adicionado
✅ Solução: Adicionar aria-label (já feito em AdminMessages.tsx)
```

---

## ✅ Validação de Resend (Sem aguardar 24h)

### Opção 1: Testar Edge Function Manualmente

```bash
# Chamar send-keepsakes diretamente
curl -X POST https://[seu-project].supabase.co/functions/v1/send-keepsakes \
  -H "Authorization: Bearer [anon-key]" \
  -H "Content-Type: application/json" \
  -d '{}'
```

**Esperado:**
```json
{
  "message": "Processamento concluído",
  "processed": 0,
  "sent": 0,
  "errors": 0
}
```

---

### Opção 2: Criar Keepsake de Teste + Verificar Logs

```bash
# 1. Criar keepsake com delivery_date = hoje
# 2. Executar curl acima
# 3. Verificar em Supabase: cron_job_logs (deve ter log da execução)
# 4. Verificar status da keepsake (deve ser 'sent' ou 'partial_sent')
```

---

## 🎬 Script de Validação Automática (Opcional)

```bash
#!/bin/bash
# validate.sh - Validação automatizada

echo "🔍 Iniciando validação do projeto..."

# 1. Check files exist
echo "✓ Verificando arquivos..."
[ -f "src/hooks/useAdminData.ts" ] && echo "  ✅ useAdminData.ts existe" || echo "  ❌ useAdminData.ts falta"
[ -f "src/contexts/AuthProvider.tsx" ] && echo "  ✅ AuthProvider.tsx existe" || echo "  ❌ AuthProvider.tsx falta"

# 2. TypeScript check
echo "✓ Verificando TypeScript..."
npx tsc --noEmit > /dev/null 2>&1 && echo "  ✅ TypeScript OK" || echo "  ❌ TypeScript com erros"

# 3. Check aria-label
echo "✓ Verificando acessibilidade..."
grep -q 'aria-label="Filtrar mensagens por estado"' src/components/admin/AdminMessages.tsx && echo "  ✅ aria-label OK" || echo "  ❌ aria-label falta"

# 4. Package.json exists
echo "✓ Verificando dependências..."
[ -f "package.json" ] && echo "  ✅ package.json OK" || echo "  ❌ package.json falta"

echo ""
echo "✨ Validação concluída!"
```

**Usar:**
```bash
chmod +x validate.sh
./validate.sh
```

---

## 📞 Sumário de Validação

### Status Esperado Após Correções
- ✅ `npm run build:prod` sucede
- ✅ `npm run dev` inicia sem erros
- ✅ Frontend carrega em http://localhost:8080
- ✅ Admin dashboard funciona
- ✅ useAdminData.ts existe e funciona
- ✅ Select tem aria-label
- ✅ RLS policies configuradas
- ✅ Cron job agendado
- ✅ Edge Functions deployed
- ✅ Resend API integrada

### Se Tudo Passar ✅
Projeto está pronto para:
- Testes de integração
- Deployment em staging
- Aguardar cron job (amanhã 00:05)
- Validação de emails reais

### Se Algo Falhar ❌
Referir-se a:
1. `DIAGNOSTICO_FINAL.md` - Detalhes dos erros
2. `RELATORIO_CORRECOES.md` - O que foi feito
3. `VERIFICACAO_STATUS.md` - Status por componente

---

**Última atualização**: 25 de Janeiro de 2026  
**Tempo estimado de validação**: 5-10 minutos  
**Próximo passo**: Executar `npm run build:prod`

