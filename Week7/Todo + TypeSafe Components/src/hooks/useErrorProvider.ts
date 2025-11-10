import { useContext } from 'react';
import { ErrorContext, type ErrorContextValue } from '../contexts/ErrorContext';

/**
 * Hook to access error provider context
 */
export const useErrorProvider = (): ErrorContextValue => {
  const context = useContext(ErrorContext);
  if (!context) {
    throw new Error('useErrorProvider must be used within an ErrorProvider');
  }
  return context;
};
