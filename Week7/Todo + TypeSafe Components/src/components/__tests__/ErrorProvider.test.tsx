// Error Provider Tests
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import React from 'react';
import ErrorProvider from '../ErrorProvider';
import { useErrorProvider } from '../../hooks/useErrorProvider';
import { useErrorRecovery } from '../../hooks/useErrorRecovery';
import type { ErrorReport } from '../../contexts/ErrorContext';

// Test components
const ErrorReportingComponent: React.FC = () => {
  const { reportError, state } = useErrorProvider();

  const handleReportError = () => {
    reportError(
      new Error('Test error'),
      { componentStack: 'Test stack' },
      'component',
      'TestComponent'
    );
  };

  return (
    <div>
      <button onClick={handleReportError} data-testid='report-error'>
        Report Error
      </button>
      <div data-testid='error-count'>{state.errors.length}</div>
      <div data-testid='unresolved-count'>{state.errors.filter(e => !e.resolved).length}</div>
    </div>
  );
};

const ErrorRecoveryComponent: React.FC = () => {
  const { state, resolveError, retryError } = useErrorProvider();
  const { recover } = useErrorRecovery();

  const handleResolve = () => {
    if (state.errors.length > 0) {
      resolveError(state.errors[0]!.id);
    }
  };

  const handleRetry = () => {
    if (state.errors.length > 0) {
      retryError(state.errors[0]!.id);
    }
  };

  const handleRecover = async () => {
    if (state.errors.length > 0) {
      await recover(state.errors[0]!.id);
    }
  };

  return (
    <div>
      <button onClick={handleResolve} data-testid='resolve-error'>
        Resolve Error
      </button>
      <button onClick={handleRetry} data-testid='retry-error'>
        Retry Error
      </button>
      <button onClick={handleRecover} data-testid='recover-error'>
        Recover Error
      </button>
      {state.errors.map(error => (
        <div key={error.id} data-testid={`error-${error.id}`}>
          <span data-testid={`error-message-${error.id}`}>{error.error.message}</span>
          <span data-testid={`error-resolved-${error.id}`}>{error.resolved.toString()}</span>
          <span data-testid={`error-retry-count-${error.id}`}>{error.retryCount}</span>
        </div>
      ))}
    </div>
  );
};

describe('ErrorProvider', () => {
  const user = userEvent.setup();

  beforeEach(() => {
    // Mock console to avoid test noise
    vi.spyOn(console, 'error').mockImplementation(() => {});
    vi.spyOn(console, 'log').mockImplementation(() => {});
  });

  describe('Basic Provider Functionality', () => {
    it('provides error context to child components', () => {
      render(
        <ErrorProvider>
          <ErrorReportingComponent />
        </ErrorProvider>
      );

      expect(screen.getByTestId('error-count')).toHaveTextContent('0');
      expect(screen.getByTestId('unresolved-count')).toHaveTextContent('0');
    });

    it('throws error when useErrorProvider is used outside provider', () => {
      // Suppress error boundary console logs for this test
      const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {});

      expect(() => {
        render(<ErrorReportingComponent />);
      }).toThrow('useErrorProvider must be used within an ErrorProvider');

      consoleSpy.mockRestore();
    });
  });

  describe('Error Reporting', () => {
    it('reports and tracks errors correctly', async () => {
      render(
        <ErrorProvider>
          <ErrorReportingComponent />
        </ErrorProvider>
      );

      const reportButton = screen.getByTestId('report-error');
      await user.click(reportButton);

      expect(screen.getByTestId('error-count')).toHaveTextContent('1');
      expect(screen.getByTestId('unresolved-count')).toHaveTextContent('1');
    });

    it('calls onError callback when error is reported', async () => {
      const mockOnError = vi.fn();

      render(
        <ErrorProvider onError={mockOnError}>
          <ErrorReportingComponent />
        </ErrorProvider>
      );

      const reportButton = screen.getByTestId('report-error');
      await user.click(reportButton);

      expect(mockOnError).toHaveBeenCalledWith(
        expect.objectContaining({
          error: expect.objectContaining({
            message: 'Test error',
          }),
          level: 'component',
          component: 'TestComponent',
          resolved: false,
          retryCount: 0,
        })
      );
    });

    it('generates unique error IDs', async () => {
      const reportedErrors: ErrorReport[] = [];
      const mockOnError = vi.fn((error: ErrorReport) => {
        reportedErrors.push(error);
      });

      render(
        <ErrorProvider onError={mockOnError}>
          <ErrorReportingComponent />
        </ErrorProvider>
      );

      const reportButton = screen.getByTestId('report-error');

      // Report multiple errors
      await user.click(reportButton);
      await user.click(reportButton);

      expect(reportedErrors).toHaveLength(2);
      expect(reportedErrors[0]!.id).not.toBe(reportedErrors[1]!.id);
      expect(reportedErrors[0]!.id).toMatch(/^error_\d+_[a-z0-9]+$/);
    });
  });

  describe('Error Resolution', () => {
    it('resolves errors correctly', async () => {
      render(
        <ErrorProvider>
          <ErrorReportingComponent />
          <ErrorRecoveryComponent />
        </ErrorProvider>
      );

      // Report an error
      const reportButton = screen.getByTestId('report-error');
      await user.click(reportButton);

      expect(screen.getByTestId('unresolved-count')).toHaveTextContent('1');

      // Resolve the error
      const resolveButton = screen.getByTestId('resolve-error');
      await user.click(resolveButton);

      expect(screen.getByTestId('unresolved-count')).toHaveTextContent('0');
    });

    it('increments retry count when retrying errors', async () => {
      render(
        <ErrorProvider>
          <ErrorReportingComponent />
          <ErrorRecoveryComponent />
        </ErrorProvider>
      );

      // Report an error
      const reportButton = screen.getByTestId('report-error');
      await user.click(reportButton);

      // Get the error ID from the rendered errors
      const errorElement = screen.getByTestId(/^error-error_/);
      const errorId = errorElement.getAttribute('data-testid')?.replace('error-', '') || '';

      // Initially retry count should be 0
      expect(screen.getByTestId(`error-retry-count-${errorId}`)).toHaveTextContent('0');

      // Retry the error
      const retryButton = screen.getByTestId('retry-error');
      await user.click(retryButton);

      // Retry count should be incremented
      expect(screen.getByTestId(`error-retry-count-${errorId}`)).toHaveTextContent('1');
    });
  });

  describe('Error Recovery Hook', () => {
    it('recovers from errors successfully', async () => {
      render(
        <ErrorProvider>
          <ErrorReportingComponent />
          <ErrorRecoveryComponent />
        </ErrorProvider>
      );

      // Report an error
      const reportButton = screen.getByTestId('report-error');
      await user.click(reportButton);

      expect(screen.getByTestId('unresolved-count')).toHaveTextContent('1');

      // Recover from the error
      const recoverButton = screen.getByTestId('recover-error');
      await user.click(recoverButton);

      expect(screen.getByTestId('unresolved-count')).toHaveTextContent('0');
    });

    it('handles recovery failures correctly', async () => {
      const FailingRecoveryComponent: React.FC = () => {
        const { state } = useErrorProvider();
        const { recover } = useErrorRecovery();

        const handleFailingRecover = async () => {
          if (state.errors.length > 0) {
            try {
              await recover(state.errors[0]!.id, async () => {
                throw new Error('Recovery failed');
              });
            } catch {
              // Expected to fail
            }
          }
        };

        return (
          <button onClick={handleFailingRecover} data-testid='failing-recover'>
            Failing Recover
          </button>
        );
      };

      render(
        <ErrorProvider>
          <ErrorReportingComponent />
          <ErrorRecoveryComponent />
          <FailingRecoveryComponent />
        </ErrorProvider>
      );

      // Report an error
      const reportButton = screen.getByTestId('report-error');
      await user.click(reportButton);

      // Get the error ID
      const errorElement = screen.getByTestId(/^error-error_/);
      const errorId = errorElement.getAttribute('data-testid')?.replace('error-', '') || '';

      // Initially retry count should be 0
      expect(screen.getByTestId(`error-retry-count-${errorId}`)).toHaveTextContent('0');

      // Try failing recovery
      const failingRecoverButton = screen.getByTestId('failing-recover');
      await user.click(failingRecoverButton);

      // Retry count should be incremented due to failed recovery
      expect(screen.getByTestId(`error-retry-count-${errorId}`)).toHaveTextContent('1');
      // Error should still be unresolved
      expect(screen.getByTestId(`error-resolved-${errorId}`)).toHaveTextContent('false');
    });
  });

  describe('Provider Configuration', () => {
    it('uses provided configuration options', () => {
      render(
        <ErrorProvider
          maxRetries={5}
          autoRetryDelay={2000}
          reportingEndpoint='https://api.example.com/errors'
        >
          <ErrorReportingComponent />
        </ErrorProvider>
      );

      // Provider should initialize without errors
      expect(screen.getByTestId('error-count')).toHaveTextContent('0');
    });

    it('handles external error reporting', async () => {
      // Mock fetch for error reporting
      const mockFetch = vi.fn().mockResolvedValue({
        ok: true,
        json: async () => ({ success: true }),
      });
      globalThis.fetch = mockFetch;

      render(
        <ErrorProvider reportingEndpoint='https://api.example.com/errors'>
          <ErrorReportingComponent />
        </ErrorProvider>
      );

      const reportButton = screen.getByTestId('report-error');
      await user.click(reportButton);

      // Wait for the fetch to be called
      await waitFor(() => {
        expect(mockFetch).toHaveBeenCalledWith(
          'https://api.example.com/errors',
          expect.objectContaining({
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: expect.stringContaining('Test error'),
          })
        );
      });
    });

    it('handles failed external error reporting gracefully', async () => {
      // Mock fetch to fail
      const mockFetch = vi.fn().mockRejectedValue(new Error('Network error'));
      globalThis.fetch = mockFetch;

      const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {});

      render(
        <ErrorProvider reportingEndpoint='https://api.example.com/errors'>
          <ErrorReportingComponent />
        </ErrorProvider>
      );

      const reportButton = screen.getByTestId('report-error');
      await user.click(reportButton);

      // Error should still be tracked locally even if reporting fails
      expect(screen.getByTestId('error-count')).toHaveTextContent('1');

      await waitFor(() => {
        expect(consoleSpy).toHaveBeenCalledWith('Failed to send error report:', expect.any(Error));
      });

      consoleSpy.mockRestore();
    });
  });

  describe('State Management', () => {
    it('clears all errors when requested', async () => {
      const ClearErrorsComponent: React.FC = () => {
        const { clearAllErrors } = useErrorProvider();

        return (
          <button onClick={clearAllErrors} data-testid='clear-errors'>
            Clear All Errors
          </button>
        );
      };

      render(
        <ErrorProvider>
          <ErrorReportingComponent />
          <ClearErrorsComponent />
        </ErrorProvider>
      );

      // Report multiple errors
      const reportButton = screen.getByTestId('report-error');
      await user.click(reportButton);
      await user.click(reportButton);

      expect(screen.getByTestId('error-count')).toHaveTextContent('2');

      // Clear all errors
      const clearButton = screen.getByTestId('clear-errors');
      await user.click(clearButton);

      expect(screen.getByTestId('error-count')).toHaveTextContent('0');
    });

    it('retrieves unresolved errors correctly', async () => {
      const UnresolvedErrorsComponent: React.FC = () => {
        const { getUnresolvedErrors } = useErrorProvider();
        const unresolvedErrors = getUnresolvedErrors();

        return <div data-testid='unresolved-errors'>{unresolvedErrors.length}</div>;
      };

      render(
        <ErrorProvider>
          <ErrorReportingComponent />
          <ErrorRecoveryComponent />
          <UnresolvedErrorsComponent />
        </ErrorProvider>
      );

      // Report two errors
      const reportButton = screen.getByTestId('report-error');
      await user.click(reportButton);
      await user.click(reportButton);

      expect(screen.getByTestId('unresolved-errors')).toHaveTextContent('2');

      // Resolve one error
      const resolveButton = screen.getByTestId('resolve-error');
      await user.click(resolveButton);

      expect(screen.getByTestId('unresolved-errors')).toHaveTextContent('1');
    });
  });
});
