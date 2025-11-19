import { createContext, useEffect, useState, useCallback } from 'react';
import type { CartItem, CartContextType, Product, ClothingSize, ShoeSize, ProductColor } from '../types';
import { safariStorage, generateId } from '../utils';

const CartContext = createContext<CartContextType | undefined>(undefined);
export { CartContext };

interface CartProviderProps { children: React.ReactNode; }

export const CartProvider: React.FC<CartProviderProps> = ({ children }) => {
  // Initialize cart from localStorage
  const [items, setItems] = useState<CartItem[]>(() => {
    const savedCart = safariStorage.getCart();
    return savedCart || [];
  });

  useEffect(() => {
    safariStorage.setCart(items);
  }, [items]);

  // Add item to cart
  const addItem = useCallback((
    product: Product,
    size: ClothingSize | ShoeSize,
    color: ProductColor,
    quantity: number = 1
  ) => {
    setItems(prevItems => {
      const existingItemIndex = prevItems.findIndex(
        item =>
          item.productId === product.id &&
          item.selectedSize === size &&
          item.selectedColor === color
      );

      if (existingItemIndex !== -1) {
        // Update existing item quantity
        const updatedItems = [...prevItems];
        updatedItems[existingItemIndex].quantity += quantity;
        return updatedItems;
      } else {
        // Add new item
        const newItem: CartItem = {
          id: generateId(),
          productId: product.id,
          product,
          quantity,
          selectedSize: size,
          selectedColor: color,
          addedAt: new Date().toISOString(),
        };
        return [...prevItems, newItem];
      }
    });
  }, []);

  // Remove item from cart
  const removeItem = useCallback((itemId: string) => {
    setItems(prevItems => prevItems.filter(item => item.id !== itemId));
  }, []);

  // Update item quantity
  const updateQuantity = useCallback((itemId: string, quantity: number) => {
    if (quantity <= 0) {
      removeItem(itemId);
      return;
    }

    setItems(prevItems =>
      prevItems.map(item =>
        item.id === itemId ? { ...item, quantity } : item
      )
    );
  }, [removeItem]);

  const clearCart = useCallback(() => {
    setItems([]);
  }, []);

  const getCartTotal = useCallback(() => {
    return items.reduce((total, item) => total + (item.product.price * item.quantity), 0);
  }, [items]);

  const getCartItemsCount = useCallback(() => {
    return items.reduce((count, item) => count + item.quantity, 0);
  }, [items]);

  const contextValue: CartContextType = {
    items,
    addItem,
    removeItem,
    updateQuantity,
    clearCart,
    getCartTotal,
    getCartItemsCount,
  };

  return (
    <CartContext.Provider value={contextValue}>
      {children}
    </CartContext.Provider>
  );
};