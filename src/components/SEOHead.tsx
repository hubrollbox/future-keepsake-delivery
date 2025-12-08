import { useEffect } from 'react';

interface SEOHeadProps {
  title?: string;
  description?: string;
  keywords?: string;
  image?: string;
  url?: string;
  type?: 'website' | 'article' | 'product';
  author?: string;
  publishedTime?: string;
}

const DEFAULT_TITLE = 'Keepla - Memórias que ficam, entregues para sempre';
const DEFAULT_DESCRIPTION = 'Guarda hoje, entrega amanhã. Plataforma para agendar entregas de keepsakes digitais e físicos para datas futuras. Porque há memórias que merecem chegar no momento certo.';
const DEFAULT_IMAGE = '/keepla-logo-red.png';
const SITE_NAME = 'Keepla.pt';

export default function SEOHead({
  title,
  description = DEFAULT_DESCRIPTION,
  keywords = 'keepsake, cápsula do tempo, memórias, presentes futuros, entrega programada, keepla',
  image = DEFAULT_IMAGE,
  url,
  type = 'website',
  author = 'Keepla',
  publishedTime,
}: SEOHeadProps) {
  const fullTitle = title ? `${title} | ${SITE_NAME}` : DEFAULT_TITLE;
  const currentUrl = url || (typeof window !== 'undefined' ? window.location.href : '');
  const absoluteImage = image.startsWith('http') 
    ? image 
    : `${typeof window !== 'undefined' ? window.location.origin : ''}${image}`;

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

    // Open Graph tags
    setMetaTag('og:title', fullTitle, true);
    setMetaTag('og:description', description, true);
    setMetaTag('og:image', absoluteImage, true);
    setMetaTag('og:url', currentUrl, true);
    setMetaTag('og:type', type, true);
    setMetaTag('og:site_name', SITE_NAME, true);
    setMetaTag('og:locale', 'pt_PT', true);

    // Twitter Card tags
    setMetaTag('twitter:card', 'summary_large_image');
    setMetaTag('twitter:title', fullTitle);
    setMetaTag('twitter:description', description);
    setMetaTag('twitter:image', absoluteImage);

    // Article specific tags
    if (type === 'article' && publishedTime) {
      setMetaTag('article:published_time', publishedTime, true);
      setMetaTag('article:author', author, true);
    }

    // Canonical URL
    let canonical = document.querySelector('link[rel="canonical"]') as HTMLLinkElement;
    if (!canonical) {
      canonical = document.createElement('link');
      canonical.setAttribute('rel', 'canonical');
      document.head.appendChild(canonical);
    }
    canonical.setAttribute('href', currentUrl);

  }, [fullTitle, description, keywords, absoluteImage, currentUrl, type, author, publishedTime]);

  return null;
}
