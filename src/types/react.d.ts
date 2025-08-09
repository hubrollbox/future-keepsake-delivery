declare module 'react' {
  // React Hooks
  export function useState<T>(initialState: T | (() => T)): [T, (newState: T | ((prevState: T) => T)) => void];
  export function useEffect(effect: () => void | (() => void), deps?: ReadonlyArray<any>): void;
  export function useContext<T>(context: React.Context<T>): T;
  export function useReducer<S, A>(reducer: (state: S, action: A) => S, initialState: S): [S, (action: A) => void];
  export function useCallback<T extends (...args: any[]) => any>(callback: T, deps: ReadonlyArray<any>): T;
  export function useMemo<T>(factory: () => T, deps: ReadonlyArray<any>): T;
  export function useRef<T>(initialValue: T): { current: T };
  export function useLayoutEffect(effect: () => void | (() => void), deps?: ReadonlyArray<any>): void;
  export function useImperativeHandle<T, R extends T>(ref: React.Ref<T>, init: () => R, deps?: ReadonlyArray<any>): void;
  export function useDebugValue<T>(value: T, format?: (value: T) => any): void;
  
  // React Components
  export type FC<P = {}> = FunctionComponent<P>;
  export interface FunctionComponent<P = {}> {
    (props: P, context?: any): ReactElement<any, any> | null;
    displayName?: string;
  }
  export type ComponentType<P = {}> = FC<P>;
  
  // React Elements
  export type ReactNode = ReactElement | string | number | boolean | null | undefined | ReactNodeArray;
  export interface ReactElement<P = any, T extends string | JSXElementConstructor<any> = string | JSXElementConstructor<any>> {
    type: T;
    props: P;
    key: Key | null;
  }
  export type JSXElementConstructor<P> = ((props: P) => ReactElement | null) | (new (props: P) => Component<P, any>);
  export type ReactNodeArray = Array<ReactNode>;
  export type Key = string | number;
  
  // React Component Classes
  export class Component<P = {}, S = {}> {
    constructor(props: P, context?: any);
    setState<K extends keyof S>(
      state: ((prevState: Readonly<S>, props: Readonly<P>) => (Pick<S, K> | S | null)) | (Pick<S, K> | S | null),
      callback?: () => void
    ): void;
    forceUpdate(callback?: () => void): void;
    render(): ReactNode;
    readonly props: Readonly<P>;
    state: Readonly<S>;
    context: any;
    refs: {
      [key: string]: any;
    };
  }
  
  // Context API
  export interface Context<T> {
    Provider: Provider<T>;
    Consumer: Consumer<T>;
    displayName?: string;
  }
  export interface Provider<T> {
    value: T;
  }
  export interface Consumer<T> {
    (value: T): ReactNode;
  }
  export function createContext<T>(defaultValue: T): Context<T>;
  
  // Fragment
  export const Fragment: unique symbol;
  
  // React DOM
  export function createElement<P extends {}>(type: FunctionComponent<P> | ComponentClass<P> | string, props?: P | null, ...children: ReactNode[]): ReactElement<P>;
  export function cloneElement<P>(element: ReactElement<P>, props?: Partial<P> & { children?: ReactNode }, ...children: ReactNode[]): ReactElement<P>;
  
  // Types for compatibility
  export type ComponentClass<P = {}> = new (props: P) => Component<P>;
  export type CSSProperties = any;
  export type RefObject<T> = { readonly current: T | null };
  export type Ref<T> = RefCallback<T> | RefObject<T> | null;
  export type RefCallback<T> = (instance: T | null) => void;
}