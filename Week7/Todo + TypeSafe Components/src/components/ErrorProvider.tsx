// Error Boundary Provider for Global Error State Management
import React, { useReducer, useCallback } from 'react';
import type { ReactNode } from 'react';
import type { ErrorInfo } from './ErrorBoundary';
import {
  ErrorContext,
  type ErrorReport,
  type ErrorState,
  type ErrorAction,
  type ErrorContextValue,
} from '../contexts/ErrorContext';

export interface ErrorProviderProps {
  children: ReactNode;
  reportingEndpoint?: string;
  maxRetries?: number;
  autoRetryDelay?: number;
  onError?: (errorReport: ErrorReport) => void;
}

// Initial State
const initialState: ErrorState = {
  errors: [],
  isReporting: false,
  maxRetries: 3,
  autoRetryDelay: 1000,
};

// Reducer
function errorReducer(state: ErrorState, action: ErrorAction): ErrorState {
  switch (action.type) {
    case 'ADD_ERROR': {
      const newError: ErrorReport = {
        ...action.payload,
        id: generateErrorId(),
        timestamp: new Date().toISOString(),
        resolved: false,
        retryCount: 0,
      };

      return {
        ...state,
        errors: [...state.errors, newError],
      };
    }

    case 'RESOLVE_ERROR':
      return {
        ...state,
        errors: state.errors.map(error =>
          error.id === action.payload.id ? { ...error, resolved: true } : error
        ),
      };

    case 'RETRY_ERROR':
      return {
        ...state,
        errors: state.errors.map(error =>
          error.id === action.payload.id ? { ...error, retryCount: error.retryCount + 1 } : error
        ),
      };

    case 'CLEAR_ERRORS':
      return {
        ...state,
        errors: [],
      };

    case 'SET_REPORTING':
      return {
        ...state,
        isReporting: action.payload.isReporting,
      };

    case 'UPDATE_CONFIG':
      return {
        ...state,
        ...action.payload,
      };

    default:
      return state;
  }
}

// Helper Functions
function generateErrorId(): string {
  return `error_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
}

// Provider Component
export const ErrorProvider: React.FC<ErrorProviderProps> = ({
  children,
  reportingEndpoint,
  maxRetries = 3,
  autoRetryDelay = 1000,
  onError,
}) => {
  const [state, dispatch] = useReducer(errorReducer, {
    ...initialState,
    ...(reportingEndpoint && { reportingEndpoint }),
    maxRetries,
    autoRetryDelay,
  });

  const reportError = useCallback(
    (
      error: Error,
      errorInfo: ErrorInfo | null,
      level: 'page' | 'section' | 'component' = 'component',
      component?: string
    ): string => {
      const errorReport: Omit<ErrorReport, 'id' | 'timestamp' | 'resolved' | 'retryCount'> = {
        error,
        errorInfo,
        level,
        ...(component && { component }),
      };

      dispatch({ type: 'ADD_ERROR', payload: errorReport });

      // Get the error ID that would be generated
      const errorId = generateErrorId();

      // Send to external reporting service if configured
      if (state.reportingEndpoint) {
        sendErrorReport(errorReport, state.reportingEndpoint);
      }

      // Call custom error handler
      if (onError) {
        const fullErrorReport: ErrorReport = {
          ...errorReport,
          id: errorId,
          timestamp: new Date().toISOString(),
          resolved: false,
          retryCount: 0,
        };
        onError(fullErrorReport);
      }

      return errorId;
    },
    [state.reportingEndpoint, onError]
  );

  const resolveError = useCallback((id: string) => {
    dispatch({ type: 'RESOLVE_ERROR', payload: { id } });
  }, []);

  const retryError = useCallback((id: string) => {
    dispatch({ type: 'RETRY_ERROR', payload: { id } });
  }, []);

  const clearAllErrors = useCallback(() => {
    dispatch({ type: 'CLEAR_ERRORS' });
  }, []);

  const getUnresolvedErrors = useCallback(() => {
    return state.errors.filter(error => !error.resolved);
  }, [state.errors]);

  const getErrorById = useCallback(
    (id: string) => {
      return state.errors.find(error => error.id === id);
    },
    [state.errors]
  );

  const contextValue: ErrorContextValue = {
    state,
    reportError,
    resolveError,
    retryError,
    clearAllErrors,
    getUnresolvedErrors,
    getErrorById,
  };

  return <ErrorContext.Provider value={contextValue}>{children}</ErrorContext.Provider>;
};

// Error reporting function
async function sendErrorReport(
  errorReport: Omit<ErrorReport, 'id' | 'timestamp' | 'resolved' | 'retryCount'>,
  endpoint: string
): Promise<void> {
  try {
    const payload = {
      message: errorReport.error.message,
      stack: errorReport.error.stack,
      componentStack: errorReport.errorInfo?.componentStack,
      level: errorReport.level,
      component: errorReport.component,
      timestamp: new Date().toISOString(),
      userAgent: navigator.userAgent,
      url: window.location.href,
    };

    await fetch(endpoint, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
    });
  } catch (reportingError) {
    console.error('Failed to send error report:', reportingError);
  }
}

export default ErrorProvider;
