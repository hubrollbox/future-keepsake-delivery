/**
 * Hook: useKeepslaBrandImage
 * 
 * Aplica automaticamente os estilos brand de Keepla:
 * - filter: grayscale(100%) para fotos documentais
 * - loading="eager" + decoding="async"
 * - fallback em erro
 */

import React, { useCallback, CSSProperties } from 'react';

interface KeepslaImageProps {
  src: string;
  alt: string;
  className?: string;
  style?: CSSProperties;
  fallbackSrc?: string;
  loading?: 'lazy' | 'eager';
  width?: number;
  height?: number;
  onError?: (e: React.SyntheticEvent<HTMLImageElement>) => void;
}

interface UseKeepslaBrandImageReturn {
  imageProps: KeepslaImageProps & { style: CSSProperties };
  getImageStyle: () => CSSProperties;
  getImgProps: (overrides?: Partial<KeepslaImageProps>) => KeepslaImageProps & { style: CSSProperties };
}

/**
 * Hook para aplicar estilos brand de Keepla em imagens
 * @param baseProps - Props básicos da imagem
 * @returns Props com estilos brand aplicados
 */
export function useKeepslaBrandImage(baseProps: KeepslaImageProps): UseKeepslaBrandImageReturn {
  const defaultFallback = '/lovable-uploads/a58d6383-77f7-451e-b692-d10c4298397e.png';
  
  const getImageStyle = useCallback((): CSSProperties => {
    return {
      filter: 'grayscale(100%)',
      ...baseProps.style,
    };
  }, [baseProps.style]);

  const handleError = useCallback((e: React.SyntheticEvent<HTMLImageElement>) => {
    const img = e.currentTarget;
    if (img.src !== (baseProps.fallbackSrc || defaultFallback)) {
      img.src = baseProps.fallbackSrc || defaultFallback;
    }
    baseProps.onError?.(e);
  }, [baseProps]);

  const getImgProps = useCallback((overrides?: Partial<KeepslaImageProps>) => {
    const props = { ...baseProps, ...overrides };
    return {
      ...props,
      loading: props.loading || 'eager',
      decoding: 'async' as const,
      onError: handleError,
      style: getImageStyle(),
    };
  }, [baseProps, handleError, getImageStyle]);

  return {
    imageProps: getImgProps(),
    getImageStyle,
    getImgProps,
  };
}

/**
 * Componente pronto: KeepslaBrandImage
 * Uso: <KeepslaBrandImage src="/photo.jpg" alt="Photo" />
 */
interface KeepslaBrandImageComponentProps extends KeepslaImageProps {
  documentalPhoto?: boolean; // Se true, aplica grayscale
}

export function KeepslaBrandImage({
  src,
  alt,
  className = '',
  style,
  fallbackSrc,
  loading = 'eager',
  documentalPhoto = true,
  width,
  height,
  onError,
}: KeepslaBrandImageComponentProps) {
  const defaultFallback = '/lovable-uploads/a58d6383-77f7-451e-b692-d10c4298397e.png';
  
  const handleError = (e: React.SyntheticEvent<HTMLImageElement>) => {
    const img = e.currentTarget;
    if (img.src !== (fallbackSrc || defaultFallback)) {
      img.src = fallbackSrc || defaultFallback;
    }
    onError?.(e);
  };

  const finalStyle: CSSProperties = {
    ...(documentalPhoto && { filter: 'grayscale(100%)' }),
    ...style,
  };

  return (
    <img
      src={src}
      alt={alt}
      className={className}
      style={finalStyle}
      loading={loading}
      decoding="async"
      onError={handleError}
      {...(width && { width })}
      {...(height && { height })}
    />
  );
}
