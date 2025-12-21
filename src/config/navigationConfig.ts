/**
 * Navigation Configuration - Fonte Única de Verdade
 * Reutilizável em: Navigation.tsx, Footer.tsx, Mobile Nav
 * 
 * Mantém sincronização de menus em todo o site
 */

export interface NavItem {
  name: string;
  href: string;
  external?: boolean; // Para links externos
}

export interface NavConfig {
  mainNav: NavItem[];
  footerNav: NavItem[];
  footerLegal: NavItem[];
  footerSocial: Array<{ name: string; href: string; icon: string }>;
}

export const navigationConfig: NavConfig = {
  mainNav: [
    { name: "Presentes com Alma", href: "/products" },
    { name: "Manifesto", href: "/about" },
    { name: "Como Funciona", href: "/how-it-works" },
    { name: "Preços", href: "/pricing" },
    { name: "Contacto", href: "/contact" },
  ],

  footerNav: [
    { name: "Blog", href: "/blog" },
    { name: "FAQ", href: "/faq" },
    { name: "Parcerias", href: "/partnerships" },
    { name: "Presentes com Alma", href: "/products" },
    { name: "Como Funciona", href: "/how-it-works" },
  ],

  footerLegal: [
    { name: "Política de Privacidade", href: "/privacy" },
    { name: "Termos de Serviço", href: "/terms" },
    { name: "Compliance GDPR", href: "/gdpr" },
  ],

  footerSocial: [
    { name: "Facebook", href: "https://facebook.com/keepla", icon: "facebook" },
    { name: "LinkedIn", href: "https://linkedin.com/company/keepla", icon: "linkedin" },
    { name: "Instagram", href: "https://instagram.com/keepla", icon: "instagram" },
    { name: "WhatsApp", href: "https://wa.me/", icon: "whatsapp" },
  ],
};

export const getMainNav = (): NavItem[] => navigationConfig.mainNav;
export const getFooterNav = (): NavItem[] => navigationConfig.footerNav;
export const getFooterLegal = (): NavItem[] => navigationConfig.footerLegal;
export const getFooterSocial = () => navigationConfig.footerSocial;
