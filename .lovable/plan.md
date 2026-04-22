

## Redesign Visual: Novo Template Editorial

Vais ter um template completamente novo, focado em **contraste forte, legibilidade clara e elegância editorial** — abandonando o atual sistema de overlays sobre imagens que está a falhar.

### Princípios do novo template

1. **Separar texto de imagem** — em vez de empilhar texto sobre fotos com overlays, alternar **blocos sólidos** (preto ou branco) com **blocos de imagem** puros.
2. **Fundos sólidos para títulos** — heróis com fundo preto puro (#000) e texto branco, ou branco puro com texto preto. Zero ambiguidade de contraste.
3. **Imagens como protagonistas isoladas** — fotos a preto e branco aparecem em secções próprias, sem texto por cima (apenas legendas pequenas em baixo, se necessário).
4. **Tipografia editorial maior** — títulos hero passam a usar `Playfair Display` em tamanhos generosos (até 7xl), criando peso visual sem depender de imagens.
5. **Acento vermelho contido** — `#E63946` apenas em palavras-chave, linhas divisórias finas e CTAs.

### Estrutura do novo Hero (exemplo)

```text
┌─────────────────────────────────────┐
│  [PRETO SÓLIDO]                     │
│                                     │
│   Guarda o que                      │
│   o tempo                           │
│   não pode levar.        ← branco   │
│                                     │
│   ─── (linha vermelha fina)         │
│   Mensagens, cartas e cápsulas      │
│   para o futuro.                    │
│                                     │
│   [Criar memória]  [Ver como]       │
└─────────────────────────────────────┘
┌─────────────────────────────────────┐
│  [IMAGEM B&W PURA - sem texto]      │
│   Mãos a escrever uma carta         │
└─────────────────────────────────────┘
┌─────────────────────────────────────┐
│  [BRANCO SÓLIDO]                    │
│   Próxima secção em texto preto     │
└─────────────────────────────────────┘
```

### Mudanças concretas

**1. Novo componente `EditorialHero.tsx`**
- Substitui `PhotoBackground` + `PageHero` nos heróis principais.
- Fundo preto sólido, texto branco, título em `Playfair Display` 6xl/7xl.
- Acento vermelho numa linha divisória de 60px abaixo do título.
- CTAs: primário vermelho preenchido, secundário com borda branca.

**2. Novo componente `ImageBlock.tsx`**
- Bloco full-width com imagem B&W isolada (sem overlay, sem texto).
- Aspect ratio 21:9 desktop, 4:3 mobile.
- Legenda opcional em texto pequeno preto sobre fundo branco, abaixo da imagem.

**3. Novo componente `EditorialSection.tsx`**
- Substitui `SectionWithPhoto` nas alternâncias texto/imagem.
- Modo A: texto em fundo branco puro com tipografia preta.
- Modo B: texto em fundo preto puro com tipografia branca.
- Imagem aparece em coluna separada, **sem gradiente** por cima.

**4. Refactor de páginas**
- `Index.tsx` (Home): `HeroSection` → novo `EditorialHero` + `ImageBlock` separado.
- `About.tsx`: `PageHero` → `EditorialHero` preto.
- `HowItWorks.tsx`: `HowItWorksHero` → `EditorialHero` branco.
- `Partnerships.tsx`: `PartnershipHero` mantém-se mas envolto em `EditorialHero` preto.

**5. CSS limpo**
- Remover utilitários `.text-on-image` e `.text-on-image-soft` do `utilities.css` (deixam de ser necessários).
- Reduzir `.image-bw-dramatic` para `grayscale(100%) contrast(1.1)` (sem escurecer artificialmente — agora as imagens estão isoladas).
- Adicionar `.editorial-hero-dark` e `.editorial-hero-light` como classes de secção.

### Ficheiros a criar

- `src/components/layout/EditorialHero.tsx`
- `src/components/layout/ImageBlock.tsx`
- `src/components/layout/EditorialSection.tsx`

### Ficheiros a editar

- `src/pages/Index.tsx`
- `src/pages/About.tsx`
- `src/pages/HowItWorks.tsx`
- `src/pages/Partnerships.tsx`
- `src/components/home/HeroSection.tsx` (substituído pelo novo)
- `src/components/how-it-works/HowItWorksHero.tsx`
- `src/styles/utilities.css` (limpeza)

### Ficheiros mantidos (para retrocompatibilidade noutras zonas)

- `PhotoBackground.tsx`, `PageHero.tsx`, `SectionWithPhoto.tsx` ficam disponíveis mas deixam de ser usados nas páginas principais.

### Resultado esperado

- Contraste WCAG AAA em todos os títulos (preto puro sobre branco puro ou inverso).
- Identidade editorial mais sóbria e premium, alinhada com o manual de marca (`docs/brand/README.md`).
- Imagens valorizadas como peças autónomas, não como decoração de fundo.

