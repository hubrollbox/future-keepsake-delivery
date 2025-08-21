
const CACHE_NAME = 'keepla-v2'; // Incrementar versão para forçar atualização
const urlsToCache = [
  '/',
  '/manifest.json',
  '/favicon.ico',
  // Assets will be added dynamically during runtime
];

// Forçar ativação imediata do novo SW
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
        // Forçar ativação imediata
        return self.skipWaiting();
      })
  );
});

// Tomar controle de todas as páginas abertas
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
      // Tomar controle de todas as páginas abertas
      return self.clients.claim();
    })
  );
});

self.addEventListener('fetch', (event) => {
  // Ignorar requisições não-GET
  if (event.request.method !== 'GET') {
    return;
  }

  // Ignorar requisições para APIs externas
  if (event.request.url.includes('/api/') || 
      event.request.url.includes('supabase.co') ||
      event.request.url.includes('resend.com')) {
    return;
  }

  event.respondWith(
    caches.match(event.request)
      .then((response) => {
        // Retornar versão em cache se disponível
        if (response) {
          return response;
        }

        // Se não estiver em cache, buscar da rede
        return fetch(event.request).then((response) => {
          // Verificar se a resposta é válida
          if (!response || response.status !== 200 || response.type !== 'basic') {
            return response;
          }

          // Clonar a resposta para poder armazená-la no cache
          const responseToCache = response.clone();

          caches.open(CACHE_NAME)
            .then((cache) => {
              cache.put(event.request, responseToCache);
            });

          return response;
        });
      })
      .catch(() => {
        // Fallback para página offline se disponível
        if (event.request.destination === 'document') {
          return caches.match('/');
        }
      })
  );
});

// Mensagem para atualizar a página quando o SW for atualizado
self.addEventListener('message', (event) => {
  if (event.data && event.data.type === 'SKIP_WAITING') {
    self.skipWaiting();
  }
});
