// Advanced Error Recovery Strategies and Patterns
import React, { useState, useEffect, useCallback } from 'react';
import type { ReactNode } from 'react';
import ErrorBoundary from './ErrorBoundary';
import type { ErrorBoundaryProps, FallbackComponentProps } from './ErrorBoundary';

// Types for Recovery Strategies
export interface RetryConfig {
  maxAttempts: number;
  delay: number;
  backoffMultiplier?: number;
  maxDelay?: number;
}

export interface RecoveryStrategy {
  type: 'retry' | 'fallback' | 'redirect' | 'refresh';
  config?: RetryConfig;
  fallbackComponent?: React.ComponentType<FallbackComponentProps>;
  redirectUrl?: string;
}

export interface AsyncErrorBoundaryProps extends Omit<ErrorBoundaryProps, 'fallback'> {
  recoveryStrategy?: RecoveryStrategy;
  loadingComponent?: ReactNode;
  onRetry?: () => Promise<void>;
  retryConfig?: RetryConfig;
}

// Default retry configuration
const DEFAULT_RETRY_CONFIG: RetryConfig = {
  maxAttempts: 3,
  delay: 1000,
  backoffMultiplier: 2,
  maxDelay: 10000,
};

// Retry Error Boundary with automatic recovery
export const RetryErrorBoundary: React.FC<AsyncErrorBoundaryProps> = ({
  children,
  onRetry,
  retryConfig = DEFAULT_RETRY_CONFIG,
  ...props
}) => {
  const [retryCount, setRetryCount] = useState(0);
  const [isRetrying, setIsRetrying] = useState(false);
  const [resetKey, setResetKey] = useState(0);

  const handleRetry = useCallback(async () => {
    if (retryCount >= retryConfig.maxAttempts) {
      return;
    }

    setIsRetrying(true);

    try {
      // Calculate delay with exponential backoff
      const delay = Math.min(
        retryConfig.delay * Math.pow(retryConfig.backoffMultiplier || 2, retryCount),
        retryConfig.maxDelay || 10000
      );

      await new Promise(resolve => setTimeout(resolve, delay));

      if (onRetry) {
        await onRetry();
      }

      // Reset the error boundary
      setResetKey(prev => prev + 1);
      setRetryCount(prev => prev + 1);
    } catch (retryError) {
      console.error('Retry failed:', retryError);
      setRetryCount(prev => prev + 1);
    } finally {
      setIsRetrying(false);
    }
  }, [retryCount, retryConfig, onRetry]);

  if (isRetrying) {
    return (
      <div
        className='p-4 bg-blue-50 border border-blue-200 rounded-lg text-center'
        data-testid='retry-loading'
      >
        <div className='animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-2'></div>
        <p className='text-blue-800'>
          Retrying... (Attempt {retryCount + 1}/{retryConfig.maxAttempts})
        </p>
      </div>
    );
  }

  return (
    <ErrorBoundary
      {...props}
      resetKeys={[resetKey]}
      onError={error => {
        console.error('RetryErrorBoundary caught error:', error);
        // Auto-retry after a delay
        setTimeout(handleRetry, 1000);
      }}
    >
      {children}
    </ErrorBoundary>
  );
};

// Lazy Loading Error Boundary
export const LazyErrorBoundary: React.FC<{
  children: ReactNode;
  fallback?: ReactNode;
  timeout?: number;
}> = ({ children, fallback, timeout = 10000 }) => {
  const [hasTimedOut, setHasTimedOut] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setHasTimedOut(true);
    }, timeout);

    return () => clearTimeout(timer);
  }, [timeout]);

  const timeoutFallback = (
    <div
      className='p-4 bg-yellow-50 border border-yellow-200 rounded-lg text-center'
      data-testid='timeout-fallback'
    >
      <p className='text-yellow-800 mb-2'>Loading is taking longer than expected</p>
      <button
        onClick={() => window.location.reload()}
        className='px-4 py-2 bg-yellow-600 text-white rounded-md hover:bg-yellow-700'
      >
        Refresh Page
      </button>
    </div>
  );

  if (hasTimedOut) {
    return <>{fallback || timeoutFallback}</>;
  }

  return (
    <ErrorBoundary level='component' fallback={fallback}>
      {children}
    </ErrorBoundary>
  );
};

// Network Error Recovery Component
export const NetworkErrorBoundary: React.FC<{
  children: ReactNode;
  onNetworkError?: () => void;
}> = ({ children, onNetworkError }) => {
  const [isOnline, setIsOnline] = useState(navigator.onLine);

  useEffect(() => {
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => {
      setIsOnline(false);
      onNetworkError?.();
    };

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, [onNetworkError]);

  const networkFallback = (
    <div
      className='p-4 bg-orange-50 border border-orange-200 rounded-lg text-center'
      data-testid='network-fallback'
    >
      <div className='mb-4'>
        <svg
          className='mx-auto h-12 w-12 text-orange-500'
          fill='none'
          viewBox='0 0 24 24'
          stroke='currentColor'
        >
          <path
            strokeLinecap='round'
            strokeLinejoin='round'
            strokeWidth={2}
            d='M18.364 5.636l-3.536 3.536m0 5.656l3.536 3.536M9.172 9.172L5.636 5.636m3.536 9.192L5.636 18.364M12 2.25A9.75 9.75 0 1021.75 12 9.75 9.75 0 0012 2.25z'
          />
        </svg>
      </div>
      <h3 className='text-lg font-medium text-orange-800 mb-2'>Connection Lost</h3>
      <p className='text-orange-600 mb-4'>Please check your internet connection and try again.</p>
      <div className='space-y-2'>
        <div
          className={`inline-flex items-center px-3 py-1 rounded-full text-sm ${
            isOnline ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
          }`}
        >
          <div
            className={`w-2 h-2 rounded-full mr-2 ${isOnline ? 'bg-green-500' : 'bg-red-500'}`}
          ></div>
          {isOnline ? 'Online' : 'Offline'}
        </div>
        {isOnline && (
          <button
            onClick={() => window.location.reload()}
            className='px-4 py-2 bg-orange-600 text-white rounded-md hover:bg-orange-700'
          >
            Retry
          </button>
        )}
      </div>
    </div>
  );

  if (!isOnline) {
    return networkFallback;
  }

  return <ErrorBoundary level='section'>{children}</ErrorBoundary>;
};

// Permission Error Boundary
export const PermissionErrorBoundary: React.FC<{
  children: ReactNode;
  requiredPermissions?: string[];
  onPermissionError?: (missingPermissions: string[]) => void;
}> = ({ children }) => {
  return <ErrorBoundary level='section'>{children}</ErrorBoundary>;
};

// Data Loading Error Boundary with retry
export const DataErrorBoundary: React.FC<{
  children: ReactNode;
  onRetry?: () => Promise<void>;
  retryConfig?: RetryConfig;
}> = ({ children, onRetry, retryConfig = DEFAULT_RETRY_CONFIG }) => {
  return (
    <RetryErrorBoundary level='component' {...(onRetry && { onRetry })} retryConfig={retryConfig}>
      {children}
    </RetryErrorBoundary>
  );
};

export default RetryErrorBoundary;
