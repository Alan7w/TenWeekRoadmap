// Error Boundary Utilities
import React from 'react';
import type { ReactNode } from 'react';
import ErrorBoundary from './ErrorBoundary';
import type { ErrorBoundaryProps } from './ErrorBoundary';

// HOC for wrapping components with error boundaries
export function withErrorBoundary<P extends object>(
  Component: React.ComponentType<P>,
  errorBoundaryProps?: Omit<ErrorBoundaryProps, 'children'>
) {
  const WrappedComponent = (props: P) => (
    <ErrorBoundary {...errorBoundaryProps}>
      <Component {...props} />
    </ErrorBoundary>
  );

  WrappedComponent.displayName = `withErrorBoundary(${Component.displayName || Component.name})`;

  return WrappedComponent;
}

// Hook for triggering errors (useful for testing)
export function useErrorHandler() {
  return (error: Error) => {
    throw error;
  };
}

// Error boundary presets for common use cases
export const createPageErrorBoundary = (fallback?: ReactNode) => ({
  level: 'page' as const,
  fallback,
  isolate: true,
});

export const createSectionErrorBoundary = (fallback?: ReactNode) => ({
  level: 'section' as const,
  fallback,
  isolate: false,
});

export const createComponentErrorBoundary = (fallback?: ReactNode) => ({
  level: 'component' as const,
  fallback,
  isolate: false,
});
