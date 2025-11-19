import React, { createContext, useEffect, useState, useCallback } from 'react';
import type { FavoriteItem, FavoritesContextType, Product } from '../types';
import { safariStorage, generateId } from '../utils';

const FavoritesContext = createContext<FavoritesContextType | undefined>(undefined);
export { FavoritesContext };

interface FavoritesProviderProps { children: React.ReactNode; }

export const FavoritesProvider: React.FC<FavoritesProviderProps> = ({ children }) => {
  // Initialize favorites from localStorage
  const [items, setItems] = useState<FavoriteItem[]>(() => {
    const savedFavorites = safariStorage.getFavorites();
    return savedFavorites || [];
  });

  useEffect(() => {
    safariStorage.setFavorites(items);
  }, [items]);

  // Add product to favorites
  const addToFavorites = useCallback((product: Product) => {
    setItems(prevItems => {
      const existingItem = prevItems.find(item => item.productId === product.id);
      
      if (existingItem) {
        // Product already in favorites, don't add duplicate
        return prevItems;
      }

      // Add new favorite
      const newFavorite: FavoriteItem = {
        id: generateId(),
        productId: product.id,
        product,
        addedAt: new Date().toISOString(),
      };
      
      return [...prevItems, newFavorite];
    });
  }, []);

  const removeFromFavorites = useCallback((productId: string) => {
    setItems(prevItems => prevItems.filter(item => item.productId !== productId));
  }, []);

  const isFavorite = useCallback((productId: string) => {
    return items.some(item => item.productId === productId);
  }, [items]);

  const clearFavorites = useCallback(() => {
    setItems([]);
  }, []);

  const contextValue: FavoritesContextType = {
    items,
    addToFavorites,
    removeFromFavorites,
    isFavorite,
    clearFavorites,
  };

  return (
    <FavoritesContext.Provider value={contextValue}>
      {children}
    </FavoritesContext.Provider>
  );
};