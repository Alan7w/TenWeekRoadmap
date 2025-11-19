import { useContext } from 'react';
import { FavoritesContext } from './FavoritesContext';
import type { FavoritesContextType } from '../types';

/**
 * Custom hook to use the Favorites context
 */
export const useFavorites = (): FavoritesContextType => {
  const context = useContext(FavoritesContext);
  if (!context) {
    throw new Error('useFavorites must be used within a FavoritesProvider');
  }
  return context;
};