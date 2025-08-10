declare namespace z {
  export type infer<T> = any;
  export type ZodSchema<T = any> = { parse: (data: unknown) => T };
  export class ZodError extends Error {
    errors: Array<{ path: (string | number)[]; message: string }>
  }
}
