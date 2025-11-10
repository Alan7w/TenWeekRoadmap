import type { ComponentType } from 'react';

/**
 * Route-based code splitting configuration
 */
export interface RouteConfig {
  path: string;
  component: () => Promise<{ default: ComponentType<Record<string, unknown>> }>;
  preload?: boolean;
  prefetchOnHover?: boolean;
}

/**
 * Generic lazy loading hook options
 */
export interface LazyLoadOptions {
  fallback?: React.ComponentType;
  errorFallback?: React.ComponentType<{ error: Error; retry: () => void }>;
  preload?: boolean;
  timeout?: number;
}

/**
 * Intersection Observer-based lazy loading options
 */
export interface IntersectionLazyLoadOptions extends LazyLoadOptions {
  rootMargin?: string;
  threshold?: number;
  triggerOnce?: boolean;
}

/**
 * Bundle analyzer utility for development
 */
export const bundleAnalysis = {
  logChunkSizes: () => {
    if (typeof window !== 'undefined' && 'performance' in window) {
      const entries = performance.getEntriesByType('navigation') as PerformanceNavigationTiming[];
      const navigation = entries[0];

      if (navigation) {
        console.log('Bundle Analysis:', {
          domContentLoaded:
            navigation.domContentLoadedEventEnd - navigation.domContentLoadedEventStart,
          loadComplete: navigation.loadEventEnd - navigation.loadEventStart,
          transferSize: navigation.transferSize,
          encodedBodySize: navigation.encodedBodySize,
          decodedBodySize: navigation.decodedBodySize,
        });
      }
    }
  },

  measureComponentRender: (componentName: string, renderFn: () => void) => {
    const start = performance.now();
    renderFn();
    const end = performance.now();
    console.log(`${componentName} render time: ${(end - start).toFixed(2)}ms`);
  },
};
