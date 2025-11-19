import { useContext } from 'react';
import { CartContext } from './CartContext';
import type { CartContextType } from '../types';

/**
 * Custom hook to use the Cart context
 */
export const useCart = (): CartContextType => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};