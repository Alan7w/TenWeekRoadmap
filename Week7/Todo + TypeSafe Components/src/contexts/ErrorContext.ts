import { createContext } from 'react';
import type { ErrorInfo } from '../components/ErrorBoundary';

// Types
export interface ErrorReport {
  id: string;
  error: Error;
  errorInfo: ErrorInfo | null;
  timestamp: string;
  component?: string;
  level: 'page' | 'section' | 'component';
  resolved: boolean;
  retryCount: number;
}

export interface ErrorState {
  errors: ErrorReport[];
  isReporting: boolean;
  reportingEndpoint?: string;
  maxRetries: number;
  autoRetryDelay: number;
}

export type ErrorAction =
  | {
      type: 'ADD_ERROR';
      payload: Omit<ErrorReport, 'id' | 'timestamp' | 'resolved' | 'retryCount'>;
    }
  | { type: 'RESOLVE_ERROR'; payload: { id: string } }
  | { type: 'RETRY_ERROR'; payload: { id: string } }
  | { type: 'CLEAR_ERRORS' }
  | { type: 'SET_REPORTING'; payload: { isReporting: boolean } }
  | {
      type: 'UPDATE_CONFIG';
      payload: Partial<Pick<ErrorState, 'reportingEndpoint' | 'maxRetries' | 'autoRetryDelay'>>;
    };

export interface ErrorContextValue {
  state: ErrorState;
  reportError: (
    error: Error,
    errorInfo: ErrorInfo | null,
    level?: 'page' | 'section' | 'component',
    component?: string
  ) => string;
  resolveError: (id: string) => void;
  retryError: (id: string) => void;
  clearAllErrors: () => void;
  getUnresolvedErrors: () => ErrorReport[];
  getErrorById: (id: string) => ErrorReport | undefined;
}

// Context
export const ErrorContext = createContext<ErrorContextValue | null>(null);
