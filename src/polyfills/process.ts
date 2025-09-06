// Minimal browser polyfill for Node's process to satisfy libraries that reference it
// Ensures globalThis.process exists before any other modules run
(function(){
  const g = (typeof globalThis !== 'undefined') ? globalThis : (typeof window !== 'undefined' ? window : (typeof global !== 'undefined' ? global : {}));
  if (!('process' in g) || typeof (g as any).process === 'undefined') {
    (g as any).process = { env: {} } as any;
  } else if (typeof (g as any).process.env === 'undefined') {
    (g as any).process.env = {} as any;
  }
})();
