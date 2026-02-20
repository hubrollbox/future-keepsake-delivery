# 📚 Sistema Editorial Keepla

Pipeline automatizado de geração, revisão e publicação de conteúdo para o blog Keepla.

## Fluxo completo

```
1. [Humano] Aciona workflow no GitHub → escolhe tema
2. [Auto]   IA gera o artigo + formata em Markdown + abre PR
3. [Humano] Equipa editorial revê, edita e faz merge
4. [Auto]   Merge dispara sincronização com Supabase → post publicado
```

## Estrutura de pastas

```
scripts/editorial/
├── database/
│   └── editorial-database.json   # Banco de temas e status
├── drafts/                       # Rascunhos .md (ignorado no .gitignore em dev)
├── reports/                      # Relatórios de auditoria SEO
├── .tmp/                         # Ficheiros temporários (geração)
├── types.ts                      # Tipos TypeScript do sistema
├── selectTopic.ts                # Gestão do banco editorial
├── generateDraft.ts              # Geração com IA
├── formatDraft.ts                # Formatação em Markdown
├── syncToSupabase.ts             # Sincronização com Supabase
└── seoAudit.ts                   # Auditoria SEO dos posts
```

## GitHub Actions Workflows

| Workflow | Acionador | Descrição |
|----------|-----------|-----------|
| `create-blog-draft-pr.yml` | Manual | Gera rascunho com IA e abre PR |
| `sync-blog-to-supabase.yml` | Merge na `main` | Sincroniza .md com Supabase |
| `seo-audit.yml` | 1.º do mês / Manual | Auditoria SEO dos posts |

## Setup inicial

### 1. Segredos obrigatórios no GitHub

Vai a **Settings > Secrets and variables > Actions** e adiciona:

| Nome | Descrição | Onde obter |
|------|-----------|------------|
| `AI_API_KEY` | Chave da API de IA | OpenAI ou Lovable AI Gateway |
| `SUPABASE_URL` | URL do projeto Supabase | Dashboard Supabase > Project Settings |
| `SUPABASE_SERVICE_ROLE_KEY` | Service Role Key | Dashboard Supabase > Project Settings > API |

### 2. Variável de ambiente (opcional)

Em **Settings > Secrets and variables > Variables**:
- `AI_BASE_URL` = `https://ai.gateway.lovable.dev/v1` (para usar Lovable AI)

### 3. Modelos de IA disponíveis

Para usar o Lovable AI Gateway (recomendado):
- `google/gemini-3-flash-preview` (padrão — rápido e eficaz)
- `google/gemini-2.5-flash` (mais capaz)
- `google/gemini-2.5-pro` (máxima qualidade)

Para usar OpenAI diretamente:
- `gpt-4o-mini` (económico)
- `gpt-4o` (máxima qualidade)

## Uso manual (linha de comandos)

```bash
# Listar temas disponíveis
npx ts-node scripts/editorial/selectTopic.ts list

# Listar apenas temas por escrever
npx ts-node scripts/editorial/selectTopic.ts list por_escrever

# Gerar rascunho para um tema
AI_API_KEY=sk-... npx ts-node scripts/editorial/generateDraft.ts topic-001

# Formatar o rascunho em Markdown
npx ts-node scripts/editorial/formatDraft.ts topic-001

# Validar um ficheiro de draft
npx ts-node scripts/editorial/formatDraft.ts validate scripts/editorial/drafts/2026-02-20-meu-artigo.md

# Sincronizar um ficheiro com o Supabase
SUPABASE_URL=... SUPABASE_SERVICE_ROLE_KEY=... npx ts-node scripts/editorial/syncToSupabase.ts scripts/editorial/drafts/ficheiro.md

# Auditoria SEO dos posts publicados
SUPABASE_URL=... SUPABASE_SERVICE_ROLE_KEY=... npx ts-node scripts/editorial/seoAudit.ts --report
```

## Gestão do banco editorial

O ficheiro `database/editorial-database.json` é a fonte de verdade dos temas.

### Estados de um tema:
- `por_escrever` — Ainda não iniciado
- `em_andamento` — Em geração
- `gerado` — Rascunho criado, aguarda revisão
- `em_revisao` — Em revisão editorial
- `publicado` — Publicado no blog

### Estrutura de um tema:
```json
{
  "id": "topic-001",
  "pillar": "emocoes-e-memorias",
  "status": "por_escrever",
  "priority": "alta",
  "title": "Título do artigo",
  "angle": "Ângulo editorial",
  "target_keyword": "palavra-chave principal",
  "secondary_keywords": ["kw1", "kw2"],
  "target_audience": "Descrição do público-alvo",
  "tone": "Tom do artigo",
  "estimated_word_count": 1700,
  "cta": "Chamada à ação final",
  "notes": "Notas para o sistema de geração"
}
```

## Regras de qualidade do conteúdo

Todo o conteúdo gerado segue estas regras (aplicadas via prompt):

1. ✅ Português Europeu sempre
2. ✅ Tom cálido, autêntico, próximo — nunca comercial agressivo
3. ✅ Estrutura: Introdução + 3-5 H2 + Conclusão com CTA
4. ✅ 1500-2000 palavras
5. ✅ NUNCA inventar dados, percentagens ou estudos
6. ✅ Máximo 4 linhas por parágrafo
7. ✅ Proibido: "No mundo atual", "Nos dias de hoje", "Como todos sabemos"
8. ✅ Keepla mencionado naturalmente, no máximo 2-3 vezes
