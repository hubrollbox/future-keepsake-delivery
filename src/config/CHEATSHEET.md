#!/bin/bash
# Cheat Sheet - Keepla Design System
# Copiar/colar para desenvolvimento rápido

# ==============================================================================
# CORES - Use APENAS estas classes
# ==============================================================================

# Texto
.text-keepla-black      # #000000 - Texto principal
.text-keepla-gray-900   # #262626 - Texto principal alternativo
.text-keepla-gray-700   # #4A4A4A - Texto secundário
.text-keepla-gray-500   # #7A7A7A - Meta / labels

# Backgrounds
.bg-keepla-white        # #FFFFFF - Fundo padrão
.bg-keepla-gray-100     # #F5F5F5 - Fundo suave
.bg-keepla-gray-200     # #E0E0E0 - Fundo alternativo
.bg-keepla-black        # #000000 - Fundo escuro

# Destaque (ÚNICO acento)
.text-keepla-red        # #E63946 - Destaque emocional
.bg-keepla-red          # #E63946 - Botão principal
.border-keepla-red      # #E63946 - Border destaque

# Borders
.border-keepla-gray     # #E5E5E5 - Border padrão

# ==============================================================================
# TIPOGRAFIA - Inter (padrão) + Georgia (emocional)
# ==============================================================================

.font-inter             # Títulos, UI, botões, corpo texto
.font-georgia           # Frases emotivas, slogans, citações

# Classes pré-definidas
.text-body              # Inter, base, leading-relaxed
.text-emotional         # Georgia italic, lg
.text-slogan            # Georgia italic, 2xl, keepla-red
.text-subtitle          # Georgia italic, lg

# ==============================================================================
# ESPAÇAMENTO - Tailwind utilities
# ==============================================================================

py-section-xs           # 2rem (gentle spacing)
py-section-md           # 4rem (standard section)
py-section-lg           # 5rem (emotional / hero)

px-section-xs           # 2rem
px-section-md           # 4rem
px-section-lg           # 5rem

# ==============================================================================
# EXEMPLO DE BOTÃO (completo)
# ==============================================================================

<button className="
  bg-keepla-red 
  text-white 
  hover:bg-keepla-red/90 
  px-4 py-2 
  rounded-lg 
  font-medium
  transition-colors
">
  Ação Principal
</button>

# ==============================================================================
# EXEMPLO DE CARD (completo)
# ==============================================================================

<div className="
  bg-keepla-white 
  border border-keepla-gray 
  rounded-2xl 
  p-6 
  shadow-sm
">
  <h3 className="font-inter font-bold text-keepla-black mb-2">Título</h3>
  <p className="text-keepla-gray-700 leading-relaxed">Descrição</p>
</div>

# ==============================================================================
# EXEMPLO DE HERO SECTION (completo)
# ==============================================================================

<section className="py-section-lg bg-keepla-black text-keepla-white">
  <div className="container mx-auto text-center">
    <h1 className="font-inter font-bold text-h1 mb-4">Headline</h1>
    <p className="font-georgia italic text-xl mb-8">Slogan emotivo</p>
    <button className="
      bg-keepla-red 
      text-white 
      px-6 py-3 
      rounded-lg 
      font-medium 
      hover:bg-keepla-red/90
    ">
      CTA Principal
    </button>
  </div>
</section>

# ==============================================================================
# HOOKS & IMPORTS
# ==============================================================================

# Navegação centralizada
import { getMainNav, getFooterNav } from '@/config/navigationConfig';

# Imagens com grayscale automático
import { KeepslaBrandImage } from '@/hooks/useKeepslaBrandImage';
<KeepslaBrandImage src="/photo.jpg" alt="Photo" />

# Layout patterns (referência)
import { layoutPatterns, getLayoutType } from '@/config/layoutPatterns';

# ==============================================================================
# CHECKLIST ANTES DE COMMIT
# ==============================================================================

☑ Cores → apenas keepla-black, keepla-white, keepla-red, keepla-gray-*
☑ Tipografia → apenas font-inter e font-georgia
☑ Espaçamento → section-xs, section-md, section-lg (ou padrão Tailwind)
☑ Navegação → importada de navigationConfig
☑ Imagens → usando KeepslaBrandImage quando documentais
☑ Sem gradientes, gold, metallic, texturas
☑ Sem ícones coloridos além do vermelho
☑ Espaço em branco respeitado
☑ Código com comentários/JSDoc

# ==============================================================================
# LINKS DE REFERÊNCIA
# ==============================================================================

Design System: src/config/DESIGN_SYSTEM.md
Layout Patterns: src/config/layoutPatterns.ts
Navigation Config: src/config/navigationConfig.ts
Typography: src/styles/typography.css
Brand Book: docs/brand/README.md
Implementation: docs/IMPLEMENTATION_SUMMARY.md

# ==============================================================================
