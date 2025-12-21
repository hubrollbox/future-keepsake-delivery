/**
 * KEEPLA DESIGN SYSTEM - GUIA DE IMPLEMENTAÇÃO
 * 
 * Este arquivo centraliza as regras de design uniforme para todo o projeto.
 * Última atualização: Dezembro 2025
 * 
 * ============================================================================
 * 1. CORES - Brand Keepla Official
 * ============================================================================
 * 
 * Palette oficial (em tailwind.config.ts):
 * - keepla-black:   #000000 (textos, ícones principais)
 * - keepla-white:   #FFFFFF (backgrounds, inverso)
 * - keepla-red:     #E63946 (ÚNICO acento - CTAs, highlights, ícones destaque)
 * - keepla-gray:    #F5F5F5 (backgrounds suaves), #E0E0E0 (borders),
 *                   #6B6B6B (secundário), #262626 (principal)
 * 
 * ✅ COMO USAR:
 * <div className="bg-keepla-white text-keepla-black border-keepla-gray">
 * <button className="bg-keepla-red text-white hover:bg-keepla-red/90">
 * <span className="text-keepla-red font-bold">Destaque</span>
 * 
 * ❌ EVITAR:
 * - steel-blue, earthy-burgundy, misty-gray (mapeadas para compat, mas remover gradualmente)
 * - Gradientes
 * - Cores adicionais (gold, purple, blue puro)
 * 
 * NOTA: Classes de compat ainda existem no tailwind.config.ts, mas use os nomes
 * oficiais keepla-* em novo código.
 * 
 * ============================================================================
 * 2. TIPOGRAFIA - Inter + Georgia
 * ============================================================================
 * 
 * Inter (padrão):
 * - Títulos (h1, h2, h3, h4, h5, h6)
 * - Corpo de texto (p)
 * - Botões, UI, labels
 * 
 * Georgia (emocional):
 * - Frases emotivas / citações
 * - Slogans
 * - Subtítulos reflexivos
 * 
 * ✅ COMO USAR:
 * <h1 className="font-inter font-bold">Título</h1>
 * <p className="font-georgia italic">Frase emotiva</p>
 * <h4 className="text-slogan">Slogan em Georgia</h4>
 * 
 * ❌ EVITAR:
 * - font-fraunces (remover de todos os componentes - mapeada em CSS para compat)
 * - Outras fontes ornamentais
 * 
 * Classes pré-definidas (@layer components em typography.css):
 * - .text-body       → Inter, base, leading-relaxed
 * - .text-emotional  → Georgia, italic, lg
 * - .text-slogan     → Georgia, italic, 2xl, keepla-red
 * - .text-subtitle   → Georgia, italic, lg
 * 
 * ============================================================================
 * 3. ESPAÇAMENTO - Tailwind utilities
 * ============================================================================
 * 
 * Sistema padronizado em tailwind.config.ts:
 * - section-xs   → 2rem  (gentle spacing)
 * - section-md   → 4rem  (standard section)
 * - section-lg   → 5rem  (emotional / hero)
 * 
 * ✅ COMO USAR:
 * <section className="py-section-md">
 * <div className="py-section-lg md:py-section-lg">
 * 
 * ❌ EVITAR:
 * - .emotional-spacing, .gentle-spacing (removidos - usar utilities acima)
 * - Hardcoded padding values
 * 
 * ============================================================================
 * 4. NAVEGAÇÃO - Centralizada
 * ============================================================================
 * 
 * Importar de @/config/navigationConfig.ts:
 * 
 * import { navigationConfig, getMainNav, getFooterNav } from '@/config/navigationConfig';
 * 
 * ✅ COMO USAR:
 * const menuItems = getMainNav();
 * menuItems.map(item => <Link to={item.href}>{item.name}</Link>)
 * 
 * Benefícios:
 * - Única fonte de verdade para menus
 * - Fácil manutenção global
 * - Sincronização automática em Navigation, Footer, Mobile Nav
 * 
 * ============================================================================
 * 5. IMAGENS - Brand compliance
 * ============================================================================
 * 
 * Uso de hook para aplicar grayscale automático:
 * 
 * import { useKeepslaBrandImage, KeepslaBrandImage } from '@/hooks/useKeepslaBrandImage';
 * 
 * Opção 1 - Hook (customização):
 * const { getImgProps } = useKeepslaBrandImage({ src: '/photo.jpg', alt: 'Photo' });
 * <img {...getImgProps()} />
 * 
 * Opção 2 - Componente (simples):
 * <KeepslaBrandImage src="/photo.jpg" alt="Photo" />
 * 
 * Características:
 * - Automático: filter: grayscale(100%)
 * - Fallback em erro
 * - loading="eager" + decoding="async"
 * 
 * ============================================================================
 * 6. LAYOUTS - Padrão de estrutura
 * ============================================================================
 * 
 * Ver @/config/layoutPatterns.ts para mapeamento completo.
 * 
 * Tipos de layout:
 * 1. PUBLIC: Navigation + Footer
 *    /blog, /about, /pricing, /products, /contact, /faq, etc.
 * 
 * 2. AUTHENTICATED: Navigation + Footer + Protected
 *    /dashboard, /create-keepsake, /profile, /checkout
 * 
 * 3. ADMIN: Navigation + sem Footer + Admin-only
 *    /admin/blog, /admin/*
 * 
 * 4. MINIMAL: Sem Navigation/Footer
 *    /login, /register
 * 
 * Todos herdam: QueryClientProvider → AuthProvider → GamificationProvider → CartProvider
 * 
 * ============================================================================
 * 7. COMPONENTS EXEMPLO - Implementação completa
 * ============================================================================
 * 
 * BOTÃO
 * -----
 * <button className="bg-keepla-red text-white hover:bg-keepla-red/90 px-4 py-2 rounded-lg font-medium">
 *   Ação Principal
 * </button>
 * 
 * CARD
 * ----
 * <div className="bg-keepla-white border border-keepla-gray rounded-2xl p-6 shadow-sm">
 *   <h3 className="font-inter font-bold text-keepla-black mb-2">Título</h3>
 *   <p className="text-keepla-gray-700">Descrição</p>
 * </div>
 * 
 * HERO SECTION
 * -----------
 * <section className="py-section-lg bg-keepla-black text-keepla-white">
 *   <div className="container mx-auto text-center">
 *     <h1 className="font-inter font-bold text-h1 mb-4">Headline</h1>
 *     <p className="font-georgia italic text-xl mb-8">Slogan emotivo</p>
 *     <button className="bg-keepla-red text-white px-6 py-3 rounded-lg font-medium">
 *       CTA Principal
 *     </button>
 *   </div>
 * </section>
 * 
 * ============================================================================
 * 8. CHECKLIST - Antes de fazer commit
 * ============================================================================
 * 
 * ☑ Cores usam apenas keepla-* (preto, branco, red, gray)
 * ☑ Tipografia usa apenas Inter + Georgia (sem fraunces, display fonts)
 * ☑ Espaçamento usa section-xs/md/lg (sem .emotional-spacing, hardcodes)
 * ☑ Navegação importa de navigationConfig (mantém sincronização)
 * ☑ Imagens documentais usam KeepslaBrandImage ou useKeepslaBrandImage
 * ☑ Layout segue padrão de Public/Authenticated/Admin/Minimal
 * ☑ Sem gradientes, gold, metallic, texturas decorativas
 * ☑ Sem ícones coloridos além do vermelho único
 * ☑ Espaço em branco respeitado (não poluído visualmente)\n * ☑ Código documentado com comentários e JSDoc\n *\n * ============================================================================\n * REFERÊNCIAS RÁPIDAS\n * ============================================================================\n *\n * Config files:\n * - tailwind.config.ts (cores, spacing, fonts)\n * - src/config/navigationConfig.ts (menus)\n * - src/config/layoutPatterns.ts (layouts)\n * - src/styles/typography.css (@layer classes)\n * - src/styles/brand-utilities.css (variáveis CSS)\n * - docs/brand/README.md (manual de marca oficial)\n *\n * Hooks:\n * - useKeepslaBrandImage() (imagens com grayscale)\n *\n * Se tiver dúvidas sobre o padrão, abra uma issue referenciando este documento.\n */\n\nexport const designSystemVersion = '1.0.0';\nexport const lastUpdated = '2025-12-21';\n