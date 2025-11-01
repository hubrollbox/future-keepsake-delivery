# Keepla.pt | Paleta Cromática

## 🎨 Cores Oficiais da Marca

A paleta Keepla é minimalista e emocional: **preto e branco da memória** + **vermelho do presente que pulsa**.

| Cor | Nome | Hex | HSL | Uso Principal |
|-----|------|-----|-----|---------------|
| 🔴 | **Keepla Red** | `#E63946` | `354° 76% 59%` | Selo da marca, destaque emocional, elementos-chave |
| 🔴 | **Deep Red CTA** | `#C6282E` | `354° 62% 47%` | Botões, call-to-actions, interações críticas |
| ⚫ | **Black** | `#000000` | `0° 0% 0%` | Fundos principais, texto, fotografia P&B |
| ⚪ | **White** | `#FFFFFF` | `0° 0% 100%` | Fundos alternativos, texto sobre escuro, equilíbrio |
| 🔘 | **Gray Neutral** | `#E0E0E0` | `0° 0% 88%` | Divisores subtis, fundos secundários, bordas |

---

## 🚫 O Que NÃO Fazer

- ❌ Nunca usar cores além da paleta oficial
- ❌ Nunca usar fotografias coloridas (exceto em produtos específicos)
- ❌ Nunca diluir o vermelho Keepla (manter sempre #E63946 ou #C6282E)
- ❌ Nunca usar gradientes com outras cores

---

## ✅ O Que Fazer

- ✅ Fotografia sempre em **preto e branco**
- ✅ Usar **Keepla Red (#E63946)** apenas como destaque emocional principal
- ✅ Usar **Deep Red CTA (#C6282E)** em todos os botões de ação
- ✅ Manter **contrastes fortes** (preto/branco/vermelho)
- ✅ Fundos neutros (preto, branco ou cinzento #E0E0E0)

---

## 💻 Variáveis CSS

```css
:root {
  /* Cores principais Keepla */
  --keepla-red: #E63946;           /* 354° 76% 59% */
  --keepla-red-deep: #C6282E;      /* 354° 62% 47% */
  --keepla-black: #000000;         /* 0° 0% 0% */
  --keepla-white: #FFFFFF;         /* 0° 0% 100% */
  --keepla-gray-neutral: #E0E0E0;  /* 0° 0% 88% */
  
  /* Aliases semânticos */
  --color-primary: var(--keepla-red);
  --color-cta: var(--keepla-red-deep);
  --color-background: var(--keepla-white);
  --color-text: var(--keepla-black);
  --color-border: var(--keepla-gray-neutral);
}
```

---

## 🎯 Exemplos de Uso

### Botão CTA Principal
```css
.btn-cta {
  background-color: #C6282E;  /* Deep Red CTA */
  color: #FFFFFF;              /* White text */
  border-radius: 12px;
}
```

### Selo de Destaque
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
- CTA: `#C6282E` (Deep Red CTA - mantém-se igual)
- Bordas/Divisores: `#333333` (cinzento mais escuro que #E0E0E0)

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
