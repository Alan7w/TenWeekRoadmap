import { useContext } from 'react';
import { CartContext } from './CartContextInstance';
import type { CartContextType } from './CartContextTypes';

export function useCart(): CartContextType {
  const context = useContext(CartContext);
  
  if (context === undefined) {
    throw new Error('useCart must be used within a CartProvider');
  }
  
  return context;
}