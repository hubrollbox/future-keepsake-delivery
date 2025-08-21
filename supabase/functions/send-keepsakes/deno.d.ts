/// <reference types="https://deno.land/x/deno@v1.40.0/lib/deno.ns.d.ts" />

declare global {
  interface Window {
    Deno: typeof Deno;
  }
  
  const Deno: {
    env: {
      get(key: string): string | undefined;
    };
    serve: (handler: (req: Request) => Response | Promise<Response>) => void;
  };
  
  const crypto: {
    randomUUID(): string;
  };
}

export {};
