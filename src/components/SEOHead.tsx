import { useEffect } from 'react';

interface SEOHeadProps {
  title?: string;
  description?: string;
  keywords?: string;
  image?: string | undefined;
  url?: string;
  type?: 'website' | 'article' | 'product';
  author?: string;
  publishedTime?: string | undefined;
}

const DEFAULT_TITLE = 'Keepla - Memórias que ficam, entregues para sempre';
const DEFAULT_DESCRIPTION = 'Guarda hoje, entrega amanhã. Plataforma para agendar entregas de keepsakes digitais e físicos para datas futuras. Porque há memórias que merecem chegar no momento certo.';
const DEFAULT_IMAGE = '/keepla-logo-red.png';
const SITE_NAME = 'Keepla.pt';

export default function SEOHead({
  title,
  description = DEFAULT_DESCRIPTION,
  keywords = 'keepsake, cápsula do tempo, memórias, presentes futuros, entrega programada, keepla',
  image,
  url,
  type = 'website',
  author = 'Keepla',
  publishedTime,
}: SEOHeadProps) {
  const fullTitle = title ? `${title} | ${SITE_NAME}` : DEFAULT_TITLE;
  const currentUrl = url || (typeof window !== 'undefined' ? window.location.href : '');
  
  // Usar imagem específica se fornecida, caso contrário usar default
  const imageToUse = image || DEFAULT_IMAGE;
  
  // Garantir URL absoluta para a imagem
  const absoluteImage = imageToUse.startsWith('http') 
    ? imageToUse 
    : `${typeof window !== 'undefined' ? window.location.origin : ''}${imageToUse.startsWith('/') ? '' : '/'}${imageToUse}`;

  useEffect(() => {
    // Update document title
    document.title = fullTitle;

    // Helper function to update or create meta tag
    const setMetaTag = (name: string, content: string, isProperty = false) => {
      const selector = isProperty ? `meta[property="${name}"]` : `meta[name="${name}"]`;
      let element = document.querySelector(selector) as HTMLMetaElement;
      
      if (!element) {
        element = document.createElement('meta');
        if (isProperty) {
          element.setAttribute('property', name);
        } else {
          element.setAttribute('name', name);
        }
        document.head.appendChild(element);
      }
      element.setAttribute('content', content);
    };

    // Basic meta tags
    setMetaTag('description', description);
    setMetaTag('keywords', keywords);
    setMetaTag('author', author);

    // Open Graph tags - essenciais para Facebook, LinkedIn, WhatsApp
    const ogTitle: string = title ?? (DEFAULT_TITLE.split(' - ')[0] ?? 'Keepla');
    const ogDescription: string = description ?? DEFAULT_DESCRIPTION;
    setMetaTag('og:title', ogTitle, true);
    setMetaTag('og:description', ogDescription, true);
    setMetaTag('og:image:width', '1200', true);
    setMetaTag('og:image:height', '630', true);
    setMetaTag('og:image:alt', title ? title : 'Keepla', true);
    setMetaTag('og:url', currentUrl, true);
    setMetaTag('og:type', type, true);
    setMetaTag('og:site_name', SITE_NAME, true);
    setMetaTag('og:locale', 'pt_PT', true);

    // Twitter Card tags - essenciais para Twitter/X
    setMetaTag('twitter:card', 'summary_large_image');
    setMetaTag('twitter:title', ogTitle);
    setMetaTag('twitter:description', description || DEFAULT_DESCRIPTION);
    setMetaTag('twitter:image', absoluteImage);
    setMetaTag('twitter:image:alt', ogTitle);

    // Article specific tags
    if (type === 'article') {
      if (publishedTime) {
        setMetaTag('article:published_time', publishedTime, true);
      }
      setMetaTag('article:author', author, true);
      setMetaTag('article:publisher', 'https://keepla.pt', true);
    }

    // Canonical URL
    let canonical = document.querySelector('link[rel="canonical"]') as HTMLLinkElement;
    if (!canonical) {
      canonical = document.createElement('link');
      canonical.setAttribute('rel', 'canonical');
      document.head.appendChild(canonical);
    }
    canonical.setAttribute('href', currentUrl);

  }, [fullTitle, description, keywords, absoluteImage, currentUrl, type, author, publishedTime, title]);

  return null;
}
