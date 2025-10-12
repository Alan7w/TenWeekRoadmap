// Select Context Hook
import { useContext } from 'react';
import { SelectContext } from '../contexts/SelectContext';
import type { SelectContextValue } from '../types';

export function useSelectContext<T>(): SelectContextValue<T> {
  const context = useContext(SelectContext);
  
  if (!context) {
    throw new Error(
      'useSelectContext must be used within a SelectProvider. ' +
      'Make sure your component is wrapped with a Select component.'
    );
  }
  
  return context as SelectContextValue<T>;
}

export function useOptionalSelectContext<T>(): SelectContextValue<T> | undefined {
  return useContext(SelectContext) as SelectContextValue<T> | undefined;
}

export function useTodoSelectContext() {
  return useSelectContext<string>();
}

export function usePrioritySelectContext() {
  return useSelectContext<'low' | 'medium' | 'high' | 'critical'>();
}

export function useCategorySelectContext() {
  return useSelectContext<'work' | 'personal' | 'shopping' | 'health' | 'other'>();
}

export function useStatusSelectContext() {
  return useSelectContext<'pending' | 'in_progress' | 'completed' | 'cancelled'>();
}