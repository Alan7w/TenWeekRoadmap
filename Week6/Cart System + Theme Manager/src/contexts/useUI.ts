import { useContext } from 'react';
import { UIContext, type UIContextType } from './UIContextTypes';

export function useUI(): UIContextType {
  const context = useContext(UIContext);
  
  if (context === undefined) {
    throw new Error('useUI must be used within a UIProvider');
  }
  
  return context;
}