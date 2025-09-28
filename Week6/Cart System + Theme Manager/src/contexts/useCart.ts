import { useContext } from 'react';
import { CartContext, type CartContextType } from './CartContextTypes';

// Custom hook to use the cart context
export function useCart(): CartContextType {
  const context = useContext(CartContext);
  
  if (context === undefined) {
    throw new Error('useCart must be used within a CartProvider');
  }
  
  return context;
}