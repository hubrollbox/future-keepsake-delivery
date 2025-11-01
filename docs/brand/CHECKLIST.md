# Keepla.pt | Checklist de Conformidade Brand Book

Use esta checklist para garantir que qualquer novo design, componente ou página segue rigorosamente o **Brand Book Oficial da Keepla.pt**.

---

## ✅ Checklist de Design

### 🔘 Logotipo
- [ ] Logótipo é sempre **circular** (nunca horizontal ou outras variantes)
- [ ] Tamanho mínimo respeitado: **64px digital** / **20mm impressão**
- [ ] Zona de proteção: **½ do diâmetro** livre em redor
- [ ] Usado sobre fundo neutro (preto, branco ou cinzento #E0E0E0)

---

### 🎨 Cores
- [ ] Todas as cores usadas pertencem à **paleta oficial**:
  - `#E63946` (Keepla Red) - Apenas para destaque emocional
  - `#C6282E` (Deep Red CTA) - Todos os botões de ação
  - `#000000` (Black) - Fundos/texto
  - `#FFFFFF` (White) - Fundos alternativos/texto sobre escuro
  - `#E0E0E0` (Gray Neutral) - Divisores/fundos secundários
- [ ] **Nenhuma outra cor** foi introduzida
- [ ] Vermelho Keepla (`#E63946`) usado **apenas como destaque principal**
- [ ] Botões CTA usam **sempre** `#C6282E` como fundo

---

### 📸 Fotografia
- [ ] Todas as fotografias estão em **preto e branco** (grayscale 100%)
- [ ] Se houver imagens coloridas, são **apenas de produtos específicos**
- [ ] Luz das fotos é suave, real, sem filtros artificiais
- [ ] Imagens transmitem **intimidade, nostalgia e humanidade**

---

### 🖋️ Tipografia
- [ ] **Inter** usado para títulos, botões e texto corrido
- [ ] **Georgia Italic** usado para frases emotivas ou citações
- [ ] Hierarquia correta:
  - H1: Inter Bold
  - H2: Inter Bold
  - Subtítulos reflexivos: Georgia Italic
  - Corpo de texto: Inter Regular
  - Botões: Inter Medium/Bold
- [ ] `line-height` entre **1.4–1.8** para legibilidade
- [ ] `clamp()` usado para tipografia responsiva fluida
- [ ] **Nunca** `text-transform: uppercase` em textos longos

---

### 🧩 Layout e Espaçamento
- [ ] Design é **minimalista** com espaço em branco intencional
- [ ] Contrastes fortes entre **preto, branco e vermelho**
- [ ] Abordagem **mobile-first** aplicada
- [ ] Botões têm `border-radius` entre **8px–12px**
- [ ] Transições suaves: `transition: 0.3s ease`

---

### 🔘 Botões e CTAs
- [ ] Botão primário (CTA): fundo `#C6282E`, texto branco
- [ ] Botão outline: borda `#E63946`, texto `#E63946`, hover preenche
- [ ] Botão suave/neutro: fundo `#E0E0E0`, texto preto
- [ ] Texto do botão nunca em uppercase total
- [ ] Textos como: **"Quero ser cliente piloto"**, **"Começar a Guardar"**, etc.

---

### 📱 Ícones
- [ ] Ícones são **monocromáticos** (preto ou vermelho Keepla)
- [ ] Traço **fino e contínuo**
- [ ] Estilo minimalista (sem preenchimentos complexos)
- [ ] Formato **1:1** para Instagram Highlights (1080×1080px)

---

## ✍️ Checklist de Conteúdo

### 🪶 Tom de Voz
- [ ] Linguagem **emocional, humana e reflexiva**
- [ ] Falar sempre de **"tu"** (nunca "você" ou "o utilizador")
- [ ] Frases **curtas e com peso**
- [ ] Vocabulário-chave usado: **memória, tempo, presente, futuro, emoção, guardar, entregar**
- [ ] **Zero jargão técnico** (ex: "backend", "API", "cloud storage")
- [ ] Tom **nunca corporativo** ou frio

---

### 📝 Textos-Chave
- [ ] Tagline: **"Memórias que ficam, entregues para sempre"**
- [ ] Assinatura: **"O teu Guardião do Tempo 🕰️"**
- [ ] CTAs emocionais, não genéricos (evitar "Registar", "Inscrever")

---

## 🧪 Checklist Técnico

### 💻 CSS/Tailwind
- [ ] Variáveis CSS oficiais usadas:
  ```css
  --keepla-red: #E63946;
  --keepla-red-deep: #C6282E;
  --keepla-black: #000000;
  --keepla-white: #FFFFFF;
  --keepla-gray-neutral: #E0E0E0;
  ```
- [ ] Cores HSL corretas no `index.css`:
  ```css
  --keepla-red: 354 76% 59%;
  --keepla-red-deep: 354 62% 47%;
  ```
- [ ] Classes Tailwind personalizadas usam paleta oficial
- [ ] Nenhuma cor direta (ex: `#FF0000`, `blue-500`) no código

---

### 📦 Componentes
- [ ] Botões usam `variant="brand"` ou `variant="brand-outline"` ou `variant="gentle"`
- [ ] Variantes de botão seguem Brand Book (`src/lib/buttonVariants.ts`)
- [ ] Imagens aplicam `filter: grayscale(100%)` quando necessário
- [ ] Componentes não introduzem cores fora da paleta

---

### 🌐 Acessibilidade
- [ ] Contraste mínimo **4.5:1** para texto normal
- [ ] Contraste mínimo **3:1** para texto grande (>18px)
- [ ] Tamanho mínimo de texto: **14px** (0.875rem)
- [ ] Botões têm área mínima clicável: **44×44px**

---

## 🚀 Antes de Publicar

- [ ] Revisei todas as páginas principais (Home, About, How It Works, etc.)
- [ ] Verifiquei que **todas as fotografias** estão em P&B
- [ ] Confirmei que **todos os botões** usam `#C6282E`
- [ ] Logótipo aparece sempre **circular**
- [ ] Tom de voz é consistente em **todos os textos**
- [ ] Design é **minimalista e emocional**
- [ ] Mobile-first e responsivo funcionam perfeitamente

---

## 📚 Documentos de Referência

- [Brand Book Completo](./guidelines/brand-book.md)
- [Color Palette](./guidelines/color-palette.md)
- [Typography](./guidelines/typography.md)
- [Tone of Voice](./guidelines/tone-of-voice.md)

---

**Última atualização**: 2025-01-23  
**Versão Brand Book**: 1.0 Oficial
