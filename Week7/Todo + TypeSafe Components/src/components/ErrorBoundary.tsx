// Enhanced Error Boundary Component with Recovery Strategies
import React, { Component } from 'react';
import type { ReactNode, ErrorInfo as ReactErrorInfo } from 'react';

// Types
export interface ErrorInfo {
  componentStack: string;
  errorBoundary?: string;
  errorBoundaryStack?: string;
}

export interface ErrorBoundaryState {
  hasError: boolean;
  error: Error | null;
  errorInfo: ErrorInfo | null;
  errorId: string;
  retryCount: number;
}

export interface ErrorBoundaryProps {
  children: ReactNode;
  fallback?: ReactNode;
  onError?: (error: Error, errorInfo: ErrorInfo) => void;
  resetOnPropsChange?: boolean;
  resetKeys?: Array<string | number>;
  isolate?: boolean;
  level?: 'page' | 'section' | 'component';
  className?: string;
  'data-testid'?: string;
}

export interface FallbackComponentProps {
  error: Error;
  errorInfo: ErrorInfo | null;
  resetErrorBoundary: () => void;
  retryCount: number;
  level: 'page' | 'section' | 'component';
}

// Default Fallback Components
export const DefaultFallback: React.FC<FallbackComponentProps> = ({
  error,
  resetErrorBoundary,
  retryCount,
  level,
}) => {
  const isPage = level === 'page';
  const containerClass = isPage
    ? 'min-h-screen flex items-center justify-center bg-gray-50'
    : 'p-4 bg-red-50 border border-red-200 rounded-lg';

  return (
    <div className={containerClass} data-testid='error-fallback'>
      <div className='text-center max-w-md'>
        <div className='mb-4'>
          <svg
            className='mx-auto h-12 w-12 text-red-500'
            fill='none'
            viewBox='0 0 24 24'
            stroke='currentColor'
          >
            <path
              strokeLinecap='round'
              strokeLinejoin='round'
              strokeWidth={2}
              d='M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.994-.833-2.464 0L3.34 16.5c-.77.833.192 2.5 1.732 2.5z'
            />
          </svg>
        </div>

        <h2 className={`font-semibold text-gray-900 mb-2 ${isPage ? 'text-2xl' : 'text-lg'}`}>
          {isPage ? 'Something went wrong' : 'Error loading this section'}
        </h2>

        <p className='text-gray-600 mb-4 text-sm'>
          {isPage
            ? 'We apologize for the inconvenience. Please try refreshing the page.'
            : 'This component encountered an error. You can try again or continue using the rest of the application.'}
        </p>

        {retryCount > 0 && (
          <p className='text-yellow-600 text-xs mb-4'>Retry attempt: {retryCount}</p>
        )}

        <div className='space-y-2'>
          <button
            onClick={resetErrorBoundary}
            className='w-full px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors'
            data-testid='retry-button'
          >
            Try Again
          </button>

          {isPage && (
            <button
              onClick={() => (window.location.href = '/')}
              className='w-full px-4 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-gray-500 transition-colors'
            >
              Go to Home
            </button>
          )}
        </div>

        {import.meta.env?.DEV && (
          <details className='mt-4 text-left'>
            <summary className='cursor-pointer text-sm text-gray-500 hover:text-gray-700'>
              Error Details (Development)
            </summary>
            <pre className='mt-2 p-2 bg-gray-100 rounded text-xs overflow-auto max-h-32'>
              {error.stack}
            </pre>
          </details>
        )}
      </div>
    </div>
  );
};

export const MinimalFallback: React.FC<FallbackComponentProps> = ({ resetErrorBoundary }) => (
  <div
    className='p-2 bg-yellow-50 border border-yellow-200 rounded text-center'
    data-testid='minimal-fallback'
  >
    <p className='text-sm text-yellow-800 mb-2'>Unable to load</p>
    <button
      onClick={resetErrorBoundary}
      className='text-xs px-2 py-1 bg-yellow-600 text-white rounded hover:bg-yellow-700'
      data-testid='minimal-retry-button'
    >
      Retry
    </button>
  </div>
);

// Enhanced Error Boundary Class Component
export class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  private resetTimeoutId: number | null = null;

  constructor(props: ErrorBoundaryProps) {
    super(props);

    this.state = {
      hasError: false,
      error: null,
      errorInfo: null,
      errorId: '',
      retryCount: 0,
    };
  }

  static getDerivedStateFromError(error: Error): Partial<ErrorBoundaryState> {
    // Generate unique error ID for tracking
    const errorId = `error_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

    return {
      hasError: true,
      error,
      errorId,
    };
  }

  override componentDidCatch(error: Error, errorInfo: ReactErrorInfo) {
    // Store error info - convert React's ErrorInfo to our custom type
    const customErrorInfo: ErrorInfo = {
      componentStack: errorInfo.componentStack || 'Unknown',
      errorBoundary: 'ErrorBoundary',
      errorBoundaryStack: errorInfo.componentStack || 'Unknown',
    };

    this.setState({
      errorInfo: customErrorInfo,
    });

    // Report error to external service or logging
    this.reportError(error, customErrorInfo);

    // Call custom error handler
    if (this.props.onError) {
      this.props.onError(error, customErrorInfo);
    }

    // Log to console in development
    if (import.meta.env?.DEV) {
      console.group('🚨 Error Boundary Caught Error');
      console.error('Error:', error);
      console.error('Error Info:', errorInfo);
      console.error('Component Stack:', errorInfo.componentStack);
      console.groupEnd();
    }
  }

  override componentDidUpdate(prevProps: ErrorBoundaryProps) {
    const { resetKeys } = this.props;
    const { hasError } = this.state;

    // Reset error boundary when resetKeys change
    if (hasError && resetKeys && prevProps.resetKeys) {
      const hasResetKeyChanged = resetKeys.some(
        (key, index) => key !== prevProps.resetKeys![index]
      );

      if (hasResetKeyChanged) {
        this.resetErrorBoundary();
      }
    }
  }

  override componentWillUnmount() {
    if (this.resetTimeoutId) {
      clearTimeout(this.resetTimeoutId);
    }
  }

  private reportError = (error: Error, errorInfo: ErrorInfo) => {
    // In a real application, you would send this to an error reporting service
    // like Sentry, LogRocket, Bugsnag, etc.
    const errorReport = {
      message: error.message,
      stack: error.stack,
      componentStack: errorInfo.componentStack,
      timestamp: new Date().toISOString(),
      userAgent: navigator.userAgent,
      url: window.location.href,
      level: this.props.level || 'component',
      errorId: this.state.errorId,
    };

    // Simulate error reporting
    console.log('📊 Error Report:', errorReport);
  };

  private resetErrorBoundary = () => {
    this.setState(prevState => ({
      hasError: false,
      error: null,
      errorInfo: null,
      errorId: '',
      retryCount: prevState.retryCount + 1,
    }));
  };

  override render() {
    const {
      children,
      fallback,
      level = 'component',
      className = '',
      'data-testid': testId,
    } = this.props;
    const { hasError, error, errorInfo, retryCount } = this.state;

    if (hasError && error) {
      // Use custom fallback if provided
      if (fallback) {
        return fallback;
      }

      // Use appropriate default fallback based on level
      const FallbackComponent = level === 'component' ? MinimalFallback : DefaultFallback;

      return (
        <div className={className} data-testid={testId}>
          <FallbackComponent
            error={error}
            errorInfo={errorInfo}
            resetErrorBoundary={this.resetErrorBoundary}
            retryCount={retryCount}
            level={level}
          />
        </div>
      );
    }

    return children;
  }
}

export default ErrorBoundary;
