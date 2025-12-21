/**
 * LAYOUT PATTERNS - Keepla Architecture Guide
 * 
 * Este documento define o padrão de organização de layouts
 * para manter consistência visual e navegacional.
 * 
 * Todos os layouts herdam:
 * - Navigation (topo)
 * - Footer (rodapé)
 * - ErrorBoundary
 * - Providers (Auth, Cart, Gamification)
 */

export type LayoutType = 'public' | 'authenticated' | 'admin' | 'minimal';

export interface LayoutConfig {
  name: LayoutType;
  description: string;
  includeNavigation: boolean;
  includeFooter: boolean;
  includeHeader: boolean;
  requiresAuth: boolean;
  requiresAdmin: boolean;
}

export const layoutPatterns: Record<LayoutType, LayoutConfig> = {
  public: {
    name: 'public',
    description: 'Páginas públicas com Navigation + Footer (landing, blog, sobre)',
    includeNavigation: true,
    includeFooter: true,
    includeHeader: true,
    requiresAuth: false,
    requiresAdmin: false,
  },

  authenticated: {
    name: 'authenticated',
    description: 'Páginas protegidas (dashboard, criar, editar). Requer login.',
    includeNavigation: true,
    includeFooter: true,
    includeHeader: true,
    requiresAuth: true,
    requiresAdmin: false,
  },

  admin: {
    name: 'admin',
    description: 'Painel administrativo. Requer role admin + auth.',
    includeNavigation: true,
    includeFooter: false,
    includeHeader: true,
    requiresAuth: true,
    requiresAdmin: true,
  },

  minimal: {
    name: 'minimal',
    description: 'Login, Registro. Sem Navigation/Footer.',
    includeNavigation: false,
    includeFooter: false,
    includeHeader: false,
    requiresAuth: false,
    requiresAdmin: false,
  },
};

/**
 * MAPEAMENTO DE ROTAS COM LAYOUTS
 * 
 * Public (Navigation + Footer):
 *   /                  - Landing
 *   /blog              - Blog list
 *   /blog/:slug        - Blog post
 *   /about             - Manifesto
 *   /how-it-works      - Como funciona
 *   /pricing           - Preços
 *   /products          - Presentes
 *   /contact           - Contacto
 *   /faq               - FAQ
 *   /partnerships      - Parcerias
 *   /terms             - Termos
 *   /privacy           - Privacidade
 * 
 * Minimal (sem headers):
 *   /login             - Login
 *   /register          - Registo
 * 
 * Authenticated (Navigation + Footer + Protected):
 *   /dashboard         - Dashboard do utilizador
 *   /create-keepsake   - Criar keepsake
 *   /edit-keepsake/:id - Editar keepsake
 *   /profile           - Perfil
 *   /checkout          - Checkout
 * 
 * Admin (Navigation + sem Footer):
 *   /admin/blog        - Blog Admin (create/edit)
 *   /admin/*           - Admin Dashboard geral
 * 
 * 404:
 *   *                  - Página não encontrada
 */

export const getLayoutType = (pathname: string): LayoutType => {
  // Admin paths
  if (pathname.startsWith('/admin')) return 'admin';

  // Authenticated paths
  if (
    pathname === '/dashboard' ||
    pathname === '/create-keepsake' ||
    pathname.startsWith('/edit-keepsake') ||
    pathname === '/profile' ||
    pathname === '/checkout'
  ) {
    return 'authenticated';
  }

  // Minimal paths (no nav)
  if (pathname === '/login' || pathname === '/register') {
    return 'minimal';
  }

  // Default: public with nav + footer
  return 'public';
};
