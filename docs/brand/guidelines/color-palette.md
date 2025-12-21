# Keepla.pt | Paleta Cromática

## 🎨 Cores Oficiais da Marca

A paleta Keepla é minimalista e emocional: **preto e branco da memória** + **vermelho do presente que pulsa**.

| Cor | Nome | Hex | HSL | Uso Principal |
|-----|------|-----|-----|---------------|
| 🔴 | **Keepla Red** | `#E63946` | `346° 80% 59%` | Acento emocional único - CTA, destaque, ícones |
| ⚫ | **Black** | `#000000` | `0° 0% 0%` | Fundos principais, texto, fotografia P&B |
| ⚪ | **White** | `#FFFFFF` | `0° 0% 100%` | Fundos alternativos, texto sobre escuro, equilíbrio |
| 🔘 | **Gray Neutral** | `#E0E0E0` | `0° 0% 88%` | Divisores subtis, fundos secundários, bordas |

---

## 🚫 O Que NÃO Fazer

- ❌ Nunca usar cores além da paleta oficial (preto, branco, cinzento, vermelho #E63946)
- ❌ Nunca usar fotografias coloridas
- ❌ Nunca usar gradientes
- ❌ Nunca usar dourado, metálicos ou efeitos de brilho
- ❌ Nunca criar múltiplas variações de vermelho

---

## ✅ O Que Fazer

- ✅ Fotografia sempre em **preto e branco**
- ✅ Usar **Keepla Red (#E63946)** como ÚNICO acento (CTAs, ícones, destaque)
- ✅ Manter **contrastes fortes** (preto/branco/vermelho)
- ✅ Fundos neutros (preto, branco ou cinzento #E0E0E0)
- ✅ Usar opacidade/transparency em vez de criar cores novas (ex: `keepla-red/80`)

---

## 💻 Variáveis CSS

```css
:root {
  /* Cores Oficiais Keepla - Fonte Única */
  --keepla-red: #E63946;           /* Único acento emocional */
  --keepla-black: #000000;         /* Texto e fundos principais */
  --keepla-white: #FFFFFF;         /* Fundos alternativos */
  --keepla-gray-100: #F5F5F5;      /* Fundos suaves */
  --keepla-gray-200: #E0E0E0;      /* Bordas e divisores */
  --keepla-gray-500: #6B6B6B;      /* Texto secundário */
  --keepla-gray-800: #262626;      /* Texto principal alternativo */
}
```

Variações de intensity usam **opacity**:
```css
.btn-primary {
  background-color: #E63946;  /* keepla-red */
}

.btn-primary:hover {
  background-color: #E63946;
  opacity: 0.9;  /* Variação por opacity, NÃO por cor diferente */
}
```

---

## 🎯 Exemplos de Uso

### Botão CTA Principal
```css
.btn-cta {
  background-color: #E63946;  /* Keepla Red */
  color: #FFFFFF;             /* White text */
  border-radius: 12px;
}

.btn-cta:hover {
  opacity: 0.9;  /* Variação por opacity */
}
```

### Acento de Destaque
```css
.brand-highlight {
  color: #E63946;  /* Keepla Red */
  font-weight: bold;
}
```

### Fundo Neutro
```css
.section-background {
  background-color: #E0E0E0;  /* Gray Neutral */
}
```

---

## 🌗 Dark Mode

Em contextos de dark mode:
- Fundo: `#000000` (Black)
- Texto: `#FFFFFF` (White)
- Destaque: `#E63946` (Keepla Red - mantém-se igual)
- Bordas/Divisores: `#333333` (cinzento mais escuro)

---

## 📊 Acessibilidade

Todos os contrastes cumprem WCAG AA:
- Preto sobre branco: 21:1 ✅
- Branco sobre #C6282E: 4.8:1 ✅
- Preto sobre #E0E0E0: 15.8:1 ✅
- #E63946 sobre branco: 4.5:1 ✅ (usar bold para texto pequeno)

---

## 🔗 Ver Também
- [Brand Book Completo](./brand-book.md)
- [Typography Guidelines](./typography.md)
- [Tone of Voice](./tone-of-voice.md)
