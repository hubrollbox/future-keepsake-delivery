// Integração Sentry para monitoramento de erros no frontend
// Instale a dependência: npm install @sentry/react

import * as Sentry from "@sentry/react";

Sentry.init({
  dsn: import.meta.env.VITE_SENTRY_DSN, // Adicione a DSN do seu projeto Sentry no .env
  tracesSampleRate: 1.0, // Ajuste conforme necessário
  environment: import.meta.env.MODE,
});

// Use Sentry.ErrorBoundary nos pontos de entrada da app (ex: App.tsx)
