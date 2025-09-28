import { useContext } from 'react';
import { UIContext, type UIContextType } from './UIContextTypes';

// Custom hook to use the UI context
export function useUI(): UIContextType {
  const context = useContext(UIContext);
  
  if (context === undefined) {
    throw new Error('useUI must be used within a UIProvider');
  }
  
  return context;
}