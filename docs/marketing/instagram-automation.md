# Automação de partilha de novos posts no Instagram

Este guia descreve o que é necessário para publicar automaticamente no Instagram sempre que um post do blog da Keepla for publicado.

## 1) Pré-requisitos obrigatórios (Meta)

Para **publicação automática** via API, a Meta exige:

1. Conta Instagram **Business** ou **Creator** (contas pessoais não servem para publish API).
2. Conta Instagram ligada a uma **Facebook Page**.
3. App no **Meta for Developers** com:
   - Instagram Graph API
   - Facebook Login
4. Permissões:
   - `instagram_basic`
   - `instagram_content_publish`
   - `pages_show_list`
   - `pages_read_engagement`
5. Token de acesso válido (idealmente long-lived) e rotina de renovação.

> Sem estes pontos, não é possível garantir publicação automática programática.

## 2) Onde ligar isto no fluxo atual da Keepla

A Keepla já tem pipeline editorial e sincronização para Supabase:

- O workflow `sync-blog-to-supabase.yml` sincroniza drafts para a tabela `blog_posts` após merge na `main`.
- O script `scripts/editorial/syncToSupabase.ts` já faz upsert/publicação do post e conhece `slug`, `title`, `cover_image`, etc.

### Trigger recomendado

Após o passo de sync, dispare uma etapa de **social publish** apenas quando:

- o post ficou com `status = published`
- e ainda não foi partilhado no Instagram

## 3) Arquitetura recomendada

### Opção A (mais simples): GitHub Actions → Meta API

1. No final do workflow de sync, chamar um script `scripts/editorial/shareToInstagram.ts`.
2. O script:
   - recebe dados do post (imagem, legenda, URL)
   - cria media container (`/{ig-user-id}/media`)
   - publica (`/{ig-user-id}/media_publish`)
   - grava resultado (ex: `instagram_post_id`, `shared_at`) no Supabase

**Prós:** implementação rápida.
**Contras:** gestão de token no GitHub e retries mais limitados.

### Opção B (mais robusta): Supabase Edge Function dedicada

1. Workflow/sync chama uma Edge Function `share-blog-to-instagram`.
2. A função fala com Meta API, faz retry controlado e grava estado em BD.
3. Opcional: fila para retries (se API da Meta estiver temporariamente indisponível).

**Prós:** melhor observabilidade e controlo operacional.
**Contras:** um pouco mais de setup.

## 4) Dados mínimos a guardar na base

Na tabela `blog_posts` (ou tabela auxiliar `social_shares`):

- `instagram_shared` (boolean)
- `instagram_shared_at` (timestamp)
- `instagram_media_id` (text)
- `instagram_permalink` (text, se disponível)
- `instagram_error` (text)
- `share_attempts` (int)

Isto evita duplicações e ajuda no debug.

## 5) Regras práticas para reduzir falhas

1. Validar `cover_image` pública e acessível por URL HTTPS.
2. Gerar legenda com limite seguro (ex.: <= 2.000 chars).
3. Incluir CTA + URL curta para o blog.
4. Implementar idempotência: se `instagram_shared = true`, não voltar a publicar.
5. Retry com backoff (ex.: 3 tentativas).
6. Log estruturado com `post_id`, `slug`, `attempt`, `meta_error_code`.

## 6) Checklist de implementação

- [ ] Criar app no Meta Developers e obter permissões.
- [ ] Configurar secrets:
  - `META_APP_ID`
  - `META_APP_SECRET`
  - `META_IG_USER_ID`
  - `META_PAGE_ID`
  - `META_LONG_LIVED_TOKEN`
- [ ] Definir tabela/campos de tracking de partilha.
- [ ] Implementar script/função de publish.
- [ ] Integrar no workflow `sync-blog-to-supabase.yml`.
- [ ] Testar em ambiente de staging com um post real.
- [ ] Ativar monitorização e alertas para falhas.

## 7) Exemplo de fluxo final

1. Equipa faz merge de um draft.
2. Workflow sincroniza para Supabase.
3. Se status publicado, chama serviço de Instagram.
4. Serviço publica com imagem + caption.
5. Guarda sucesso/erro no Supabase.
6. Dashboard/admin pode mostrar estado da partilha.

---

Se quiseres, posso avançar já com a implementação técnica (script + integração no workflow + persistência de estado) num próximo passo.
