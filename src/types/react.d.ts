declare module 'react' {
  export interface Component<P = {}, S = {}, SS = any> {}
  export interface ComponentClass<P = {}, S = {}> {}
  export interface FunctionComponent<P = {}> {}
  export type FC<P = {}> = FunctionComponent<P>;
  export type ReactNode = any;
  export type ReactElement = any;
  export type ComponentType<P = {}> = ComponentClass<P> | FunctionComponent<P>;
  
  // Hooks
  export function useState<S>(initialState: S | (() => S)): [S, (value: S | ((prevState: S) => S)) => void];
  export function useEffect(effect: () => void | (() => void), deps?: any[]): void;
  export function useCallback<T extends (...args: any[]) => any>(callback: T, deps: any[]): T;
  export function useMemo<T>(factory: () => T, deps: any[]): T;
  export function useRef<T>(initialValue: T): { current: T };
  export function useContext<T>(context: any): T;
  export function useReducer<R extends (state: any, action: any) => any>(
    reducer: R,
    initialState: Parameters<R>[0]
  ): [Parameters<R>[0], (action: Parameters<R>[1]) => void];
  
  // JSX
  export namespace JSX {
    interface Element {}
    interface IntrinsicElements {
      [elemName: string]: any;
    }
  }
}

declare module 'react-dom' {
  export function render(element: any, container: any): void;
  export function createRoot(container: any): {
    render(element: any): void;
    unmount(): void;
  };
}

// Global JSX namespace
declare global {
  namespace JSX {
    interface Element {}
    interface IntrinsicElements {
      [elemName: string]: any;
    }
  }
}