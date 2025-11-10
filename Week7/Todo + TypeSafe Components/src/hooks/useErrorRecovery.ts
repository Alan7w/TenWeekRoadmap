import { useCallback } from 'react';
import { useErrorProvider } from './useErrorProvider';

/**
 * Error Recovery Hook
 */
export const useErrorRecovery = () => {
  const { retryError, resolveError } = useErrorProvider();

  const recover = useCallback(
    async (errorId: string, recoveryFunction?: () => Promise<void> | void) => {
      try {
        if (recoveryFunction) {
          await recoveryFunction();
        }
        resolveError(errorId);
      } catch (recoveryError) {
        retryError(errorId);
        throw recoveryError;
      }
    },
    [retryError, resolveError]
  );

  return { recover };
};
