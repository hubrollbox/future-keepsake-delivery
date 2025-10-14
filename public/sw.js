const CACHE_NAME = 'keepla-v3';
const urlsToCache = [
  '/',
  '/manifest.json',
  '/favicon.ico',
];

// Instalação do Service Worker
self.addEventListener('install', (event) => {
  console.log('Service Worker installing...');
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => {
        console.log('Cache opened');
        return cache.addAll(urlsToCache);
      })
      .then(() => {
        console.log('Service Worker installed');
        return self.skipWaiting();
      })
  );
});

// Ativação e limpeza de caches antigos
self.addEventListener('activate', (event) => {
  console.log('Service Worker activating...');
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (cacheName !== CACHE_NAME) {
            console.log('Deleting old cache:', cacheName);
            return caches.delete(cacheName);
          }
        })
      );
    }).then(() => {
      console.log('Service Worker activated');
      return self.clients.claim();
    })
  );
});

// Interceção de pedidos
self.addEventListener('fetch', (event) => {
  const request = event.request;
  const url = new URL(request.url);

  // Ignorar métodos não-GET
  if (request.method !== 'GET') return;

  // Ignorar esquemas não suportados (ex: chrome-extension)
  if (url.protocol !== 'http:' && url.protocol !== 'https:') return;

  // Ignorar chamadas para APIs externas
  if (
    url.href.includes('/api/') ||
    url.href.includes('supabase.co') ||
    url.href.includes('resend.com')
  ) return;

  // Não guardar documentos HTML no cache
  if (request.destination === 'document') {
    return event.respondWith(fetch(request));
  }

  // Tratar logos com estratégia network-first para evitar versões antigas em cache
  const isKeeplaLogo = url.pathname.includes('/keepla-logo');
  if (isKeeplaLogo) {
    return event.respondWith(
      fetch(request)
        .then((networkResponse) => {
          if (
            networkResponse &&
            networkResponse.status === 200 &&
            networkResponse.type === 'basic'
          ) {
            const responseToCache = networkResponse.clone();
            caches.open(CACHE_NAME).then((cache) => {
              cache.put(request, responseToCache);
            });
          }
          return networkResponse;
        })
        .catch(async () => {
          const cached = await caches.match(request);
          if (cached) return cached;
          return self.Response.error();
        })
    );
  }

  event.respondWith(
    caches.match(request)
      .then((cachedResponse) => {
        if (cachedResponse) return cachedResponse;

        return fetch(request).then((networkResponse) => {
          if (
            !networkResponse ||
            networkResponse.status !== 200 ||
            networkResponse.type !== 'basic'
          ) {
            return networkResponse;
          }

          const isStaticAsset = url.pathname.match(/\.(js|css|png|jpg|jpeg|gif|svg|ico|woff|woff2)$/);
          if (isStaticAsset) {
            const responseToCache = networkResponse.clone();
            caches.open(CACHE_NAME).then((cache) => {
              cache.put(request, responseToCache);
            });
          }

          return networkResponse;
        });
      })
      .catch(() => {
        if (url.pathname.match(/\.(js|css|png|jpg|jpeg|gif|svg|ico)$/)) {
          return caches.match(request);
        }
      })
  );
});

// Mensagem para ativar o novo SW imediatamente
self.addEventListener('message', (event) => {
  if (event.data && event.data.type === 'SKIP_WAITING') {
    self.skipWaiting();
  }
});
