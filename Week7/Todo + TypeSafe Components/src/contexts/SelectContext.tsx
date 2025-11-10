// Select Context Provider
import React, { createContext } from 'react';
import type { SelectContextValue } from '../types';

const SelectContext = createContext<SelectContextValue<unknown> | undefined>(undefined);

interface SelectProviderProps<T> {
  children: React.ReactNode;
  value: SelectContextValue<T>;
}

export function SelectProvider<T>({ children, value }: SelectProviderProps<T>) {
  return (
    <SelectContext.Provider value={value as SelectContextValue<unknown>}>
      {children}
    </SelectContext.Provider>
  );
}

export { SelectContext };
