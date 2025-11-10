import React, { useState, useCallback, useRef, useEffect } from 'react';

/**
 * Image lazy loading with progressive enhancement
 */
export interface LazyImageProps extends Omit<React.ImgHTMLAttributes<HTMLImageElement>, 'onError'> {
  src: string;
  placeholder?: string;
  blurDataURL?: string;
  threshold?: number;
  rootMargin?: string;
  onLoad?: () => void;
  onError?: (error: Error) => void;
}

export const LazyImage: React.FC<LazyImageProps> = ({
  src,
  placeholder,
  blurDataURL,
  threshold = 0.1,
  rootMargin = '50px',
  onLoad,
  onError,
  className = '',
  style,
  ...imgProps
}) => {
  const [isLoaded, setIsLoaded] = useState(false);
  const [isInView, setIsInView] = useState(false);
  const [hasError, setHasError] = useState(false);
  const imgRef = useRef<HTMLImageElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  // Intersection Observer
  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const observer = new IntersectionObserver(
      entries => {
        const entry = entries[0];
        if (entry?.isIntersecting) {
          setIsInView(true);
          observer.disconnect();
        }
      },
      { threshold, rootMargin }
    );

    observer.observe(container);
    return () => observer.disconnect();
  }, [threshold, rootMargin]);

  // Handle image load
  const handleLoad = useCallback(() => {
    setIsLoaded(true);
    onLoad?.();
  }, [onLoad]);

  // Handle image error
  const handleError = useCallback(() => {
    setHasError(true);
    onError?.(new Error('Failed to load image'));
  }, [onError]);

  return (
    <div
      ref={containerRef}
      className={`lazy-image-container ${className}`}
      style={{
        position: 'relative',
        overflow: 'hidden',
        ...style,
      }}
    >
      {/* Placeholder */}
      {!isLoaded && !hasError && (
        <div
          className='lazy-image-placeholder'
          style={{
            position: 'absolute',
            inset: 0,
            background: blurDataURL
              ? `url(${blurDataURL})`
              : placeholder
                ? `url(${placeholder})`
                : '#f0f0f0',
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            filter: blurDataURL ? 'blur(10px)' : 'none',
            transform: blurDataURL ? 'scale(1.1)' : 'none',
          }}
        />
      )}

      {/* Actual image */}
      {isInView && !hasError && (
        <img
          ref={imgRef}
          src={src}
          onLoad={handleLoad}
          onError={handleError}
          className={`lazy-image ${isLoaded ? 'loaded' : 'loading'}`}
          style={{
            opacity: isLoaded ? 1 : 0,
            transition: 'opacity 0.3s ease-in-out',
            width: '100%',
            height: '100%',
            objectFit: 'cover',
          }}
          {...imgProps}
        />
      )}

      {/* Error state */}
      {hasError && (
        <div
          className='lazy-image-error'
          style={{
            position: 'absolute',
            inset: 0,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            background: '#f5f5f5',
            color: '#666',
            fontSize: '14px',
          }}
        >
          Failed to load image
        </div>
      )}
    </div>
  );
};
