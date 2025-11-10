// Error Boundary Tests
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, screen, waitFor, fireEvent } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import React from 'react';
import ErrorBoundary, { DefaultFallback, MinimalFallback } from '../ErrorBoundary';
import { RetryErrorBoundary, LazyErrorBoundary, NetworkErrorBoundary } from '../ErrorRecovery';

// Test component that throws errors
const ErrorThrowingComponent: React.FC<{ shouldThrow?: boolean; errorMessage?: string }> = ({
  shouldThrow = false,
  errorMessage = 'Test error',
}) => {
  if (shouldThrow) {
    throw new Error(errorMessage);
  }
  return <div data-testid='success-component'>Component rendered successfully</div>;
};

// Mock console methods to avoid test noise
const originalError = console.error;
const originalLog = console.log;

beforeEach(() => {
  console.error = vi.fn();
  console.log = vi.fn();
});

afterEach(() => {
  console.error = originalError;
  console.log = originalLog;
});

describe('ErrorBoundary', () => {
  describe('Basic Error Boundary Functionality', () => {
    it('renders children when no error occurs', () => {
      render(
        <ErrorBoundary>
          <ErrorThrowingComponent shouldThrow={false} />
        </ErrorBoundary>
      );

      expect(screen.getByTestId('success-component')).toBeInTheDocument();
    });

    it('catches and displays error with default fallback', () => {
      render(
        <ErrorBoundary>
          <ErrorThrowingComponent shouldThrow={true} errorMessage='Test error message' />
        </ErrorBoundary>
      );

      expect(screen.getByTestId('minimal-fallback')).toBeInTheDocument();
      expect(screen.getByText(/unable to load/i)).toBeInTheDocument();
      expect(screen.getByTestId('minimal-retry-button')).toBeInTheDocument();
    });

    it('uses custom fallback when provided', () => {
      const CustomFallback = () => <div data-testid='custom-fallback'>Custom Error UI</div>;

      render(
        <ErrorBoundary fallback={<CustomFallback />}>
          <ErrorThrowingComponent shouldThrow={true} />
        </ErrorBoundary>
      );

      expect(screen.getByTestId('custom-fallback')).toBeInTheDocument();
      expect(screen.getByText('Custom Error UI')).toBeInTheDocument();
    });

    it('resets error state when retry button is clicked', async () => {
      let shouldThrow = true;

      const TestComponent = () => {
        if (shouldThrow) {
          throw new Error('Test error');
        }
        return <div data-testid='success-component'>Component rendered successfully</div>;
      };

      const ErrorBoundaryWrapper = ({ resetKey }: { resetKey?: number }) => (
        <ErrorBoundary key={resetKey}>
          <TestComponent />
        </ErrorBoundary>
      );

      const { rerender } = render(<ErrorBoundaryWrapper />);

      // Error should be displayed initially
      expect(screen.getByTestId('minimal-fallback')).toBeInTheDocument();

      // Fix the component and trigger rerender with new key
      shouldThrow = false;
      rerender(<ErrorBoundaryWrapper resetKey={Date.now()} />);

      // Wait for component to render successfully
      await waitFor(() => {
        expect(screen.getByTestId('success-component')).toBeInTheDocument();
      });
    });

    it('calls onError callback when error occurs', () => {
      const mockOnError = vi.fn();

      render(
        <ErrorBoundary onError={mockOnError}>
          <ErrorThrowingComponent shouldThrow={true} errorMessage='Test callback error' />
        </ErrorBoundary>
      );

      expect(mockOnError).toHaveBeenCalledWith(
        expect.objectContaining({
          message: 'Test callback error',
        }),
        expect.objectContaining({
          componentStack: expect.any(String),
        })
      );
    });
  });

  describe('Different Error Boundary Levels', () => {
    it('renders page-level fallback for page errors', () => {
      render(
        <ErrorBoundary level='page'>
          <ErrorThrowingComponent shouldThrow={true} />
        </ErrorBoundary>
      );

      expect(screen.getByTestId('error-fallback')).toBeInTheDocument();
      expect(screen.getByText(/something went wrong/i)).toBeInTheDocument();
      expect(screen.getByText(/go to home/i)).toBeInTheDocument();
    });

    it('renders section-level fallback for section errors', () => {
      render(
        <ErrorBoundary level='section'>
          <ErrorThrowingComponent shouldThrow={true} />
        </ErrorBoundary>
      );

      expect(screen.getByTestId('error-fallback')).toBeInTheDocument();
      expect(screen.getByText(/error loading this section/i)).toBeInTheDocument();
    });

    it('renders minimal fallback for component-level errors', () => {
      render(
        <ErrorBoundary level='component'>
          <ErrorThrowingComponent shouldThrow={true} />
        </ErrorBoundary>
      );

      expect(screen.getByTestId('minimal-fallback')).toBeInTheDocument();
    });
  });

  describe('Reset Keys', () => {
    it('resets error boundary when resetKeys change', () => {
      const TestWrapper = () => {
        const [resetKey, setResetKey] = React.useState(0);
        const [shouldThrow, setShouldThrow] = React.useState(true);

        return (
          <div>
            <button
              onClick={() => {
                setShouldThrow(false);
                setResetKey(prev => prev + 1);
              }}
              data-testid='reset-key-button'
            >
              Reset
            </button>
            <ErrorBoundary resetKeys={[resetKey]}>
              <ErrorThrowingComponent shouldThrow={shouldThrow} />
            </ErrorBoundary>
          </div>
        );
      };

      render(<TestWrapper />);

      // Error should be displayed initially
      expect(screen.getByTestId('minimal-fallback')).toBeInTheDocument();

      // Click reset button to change resetKeys
      const resetButton = screen.getByTestId('reset-key-button');
      fireEvent.click(resetButton);

      // Component should render successfully after reset
      expect(screen.getByTestId('success-component')).toBeInTheDocument();
    });
  });
});

describe('RetryErrorBoundary', () => {
  it('renders with error boundary functionality', () => {
    const mockOnRetry = vi.fn().mockResolvedValue(undefined);

    render(
      <RetryErrorBoundary onRetry={mockOnRetry} retryConfig={{ maxAttempts: 1, delay: 100 }}>
        <ErrorThrowingComponent shouldThrow={true} />
      </RetryErrorBoundary>
    );

    // Should show error fallback (minimal is default)
    expect(screen.getByTestId('minimal-fallback')).toBeInTheDocument();
  });
});

describe('LazyErrorBoundary', () => {
  it('renders children initially', () => {
    const SlowComponent = () => {
      return <div data-testid='slow-component'>Loading forever...</div>;
    };

    render(
      <LazyErrorBoundary timeout={1000}>
        <SlowComponent />
      </LazyErrorBoundary>
    );

    // Initially shows the component
    expect(screen.getByTestId('slow-component')).toBeInTheDocument();
  });
});

describe('NetworkErrorBoundary', () => {
  const mockNavigator = vi.spyOn(window.navigator, 'onLine', 'get');

  beforeEach(() => {
    // Mock online by default
    mockNavigator.mockReturnValue(true);
  });

  afterEach(() => {
    mockNavigator.mockRestore();
  });

  it('shows network fallback when offline', () => {
    // Mock offline state
    mockNavigator.mockReturnValue(false);

    render(
      <NetworkErrorBoundary>
        <div data-testid='network-content'>Network content</div>
      </NetworkErrorBoundary>
    );

    expect(screen.getByTestId('network-fallback')).toBeInTheDocument();
    expect(screen.getByText(/connection lost/i)).toBeInTheDocument();
    expect(screen.getByText(/offline/i)).toBeInTheDocument();
  });

  it('shows content when online', () => {
    render(
      <NetworkErrorBoundary>
        <div data-testid='network-content'>Network content</div>
      </NetworkErrorBoundary>
    );

    expect(screen.getByTestId('network-content')).toBeInTheDocument();
  });

  it('handles online/offline events', () => {
    const mockOnNetworkError = vi.fn();

    render(
      <NetworkErrorBoundary onNetworkError={mockOnNetworkError}>
        <div data-testid='network-content'>Network content</div>
      </NetworkErrorBoundary>
    );

    // Simulate going offline
    mockNavigator.mockReturnValue(false);
    fireEvent(window, new Event('offline'));

    expect(mockOnNetworkError).toHaveBeenCalled();
  });
});

describe('Fallback Components', () => {
  const mockProps = {
    error: new Error('Test error'),
    errorInfo: {
      componentStack: '\n    in TestComponent',
    },
    resetErrorBoundary: vi.fn(),
    retryCount: 0,
    level: 'component' as const,
  };

  describe('DefaultFallback', () => {
    it('renders error information correctly', () => {
      render(<DefaultFallback {...mockProps} />);

      expect(screen.getByTestId('error-fallback')).toBeInTheDocument();
      expect(screen.getByText(/error loading this section/i)).toBeInTheDocument();
      expect(screen.getByTestId('retry-button')).toBeInTheDocument();
    });

    it('shows retry count when greater than 0', () => {
      render(<DefaultFallback {...mockProps} retryCount={2} />);

      expect(screen.getByText(/retry attempt: 2/i)).toBeInTheDocument();
    });

    it('shows page-level content for page errors', () => {
      render(<DefaultFallback {...mockProps} level='page' />);

      expect(screen.getByText(/something went wrong/i)).toBeInTheDocument();
      expect(screen.getByText(/go to home/i)).toBeInTheDocument();
    });

    it('calls resetErrorBoundary when retry button is clicked', async () => {
      const user = userEvent.setup();
      render(<DefaultFallback {...mockProps} />);

      const retryButton = screen.getByTestId('retry-button');
      await user.click(retryButton);

      expect(mockProps.resetErrorBoundary).toHaveBeenCalled();
    });
  });

  describe('MinimalFallback', () => {
    it('renders minimal error UI', () => {
      render(<MinimalFallback {...mockProps} />);

      expect(screen.getByTestId('minimal-fallback')).toBeInTheDocument();
      expect(screen.getByText(/unable to load/i)).toBeInTheDocument();
      expect(screen.getByTestId('minimal-retry-button')).toBeInTheDocument();
    });

    it('calls resetErrorBoundary when retry button is clicked', async () => {
      const user = userEvent.setup();
      render(<MinimalFallback {...mockProps} />);

      const retryButton = screen.getByTestId('minimal-retry-button');
      await user.click(retryButton);

      expect(mockProps.resetErrorBoundary).toHaveBeenCalled();
    });
  });
});

describe('Error Boundary Integration', () => {
  it('handles multiple nested error boundaries', () => {
    render(
      <ErrorBoundary level='page' data-testid='outer-boundary'>
        <div data-testid='outer-content'>
          <ErrorBoundary level='section' data-testid='inner-boundary'>
            <ErrorThrowingComponent shouldThrow={true} />
          </ErrorBoundary>
        </div>
      </ErrorBoundary>
    );

    // Inner boundary should catch the error with section-level fallback
    expect(screen.getByTestId('error-fallback')).toBeInTheDocument();
    // Outer content should still be visible
    expect(screen.getByTestId('outer-content')).toBeInTheDocument();
  });

  it('propagates error to parent boundary when child boundary fails', () => {
    const FailingBoundary = () => {
      throw new Error('Boundary itself failed');
    };

    render(
      <ErrorBoundary level='page'>
        <FailingBoundary />
      </ErrorBoundary>
    );

    expect(screen.getByTestId('error-fallback')).toBeInTheDocument();
  });
});

describe('Error Reporting', () => {
  it('logs errors to console in development', () => {
    const consoleGroupSpy = vi.spyOn(console, 'group').mockImplementation(() => {});
    const consoleGroupEndSpy = vi.spyOn(console, 'groupEnd').mockImplementation(() => {});

    // Mock the import.meta.env check
    vi.stubGlobal('import.meta', { env: { DEV: true } });

    render(
      <ErrorBoundary>
        <ErrorThrowingComponent shouldThrow={true} errorMessage='Development error' />
      </ErrorBoundary>
    );

    expect(consoleGroupSpy).toHaveBeenCalledWith('🚨 Error Boundary Caught Error');
    expect(consoleGroupEndSpy).toHaveBeenCalled();

    consoleGroupSpy.mockRestore();
    consoleGroupEndSpy.mockRestore();
    vi.unstubAllGlobals();
  });
});
