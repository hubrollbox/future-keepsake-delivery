

## Build Fix: `manualChunks` format

The build tool (Rolldown, which replaced Rollup in newer Vite) requires `manualChunks` to be a **function**, not an object. The current `vite.config.ts` uses the object format which is no longer supported.

### Change

In `vite.config.ts`, convert `manualChunks` from an object to a function:

```ts
manualChunks(id) {
  if (id.includes('react-dom') || id.includes('react/')) return 'react';
  if (id.includes('@supabase/ssr')) return 'supabase';
  if (id.includes('@radix-ui/')) return 'ui';
  if (id.includes('react-router-dom') || id.includes('date-fns')) return 'utils';
}
```

This is a one-line conceptual change that fixes the build error.

