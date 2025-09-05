// This file provides TypeScript with information about React JSX

// Declare the JSX namespace to ensure TypeScript recognizes JSX syntax
declare namespace JSX {
  interface IntrinsicElements {
    [elemName: string]: any;
  }
}

// Declare the react module to ensure imports work correctly
declare module 'react' {
  // Named exports for hooks and other React features
  export const useState: any;
  export const useEffect: any;
  export const useCallback: any;
  export const useRef: any;
  export const useMemo: any;
  export const useContext: any;
  export const useReducer: any;
  export const useLayoutEffect: any;
  
  // Default export for React itself
  const React: any;
  export default React;
}

// Declare the react/jsx-runtime module
declare module 'react/jsx-runtime' {
  export const jsx: any;
  export const jsxs: any;
  export const Fragment: any;
}

// Declare the react/jsx-dev-runtime module
declare module 'react/jsx-dev-runtime' {
  export const jsx: any;
  export const jsxs: any;
  export const Fragment: any;
}