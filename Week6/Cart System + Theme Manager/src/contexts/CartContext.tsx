import { useState, useEffect, useCallback } from 'react';
import { type CartItem } from './CartContextTypes';
import { CartContext } from './CartContextInstance';
import { useAuth } from './useAuth';
import { useNavigate } from 'react-router-dom';

interface CartProviderProps {
  children: React.ReactNode;
}

export function CartProvider({ children }: CartProviderProps) {
  const { isLoggedIn, currentUser } = useAuth();
  const navigate = useNavigate();
  const [cartItems, setCartItems] = useState<CartItem[]>([]);

  const validateAndParseCart = useCallback((savedCart: string | null): CartItem[] => {
    if (!savedCart) return [];
    
    try {
      const items = JSON.parse(savedCart);
      if (!Array.isArray(items)) return [];
      
      return items.filter(item => (
        item &&
        typeof item === 'object' &&
        typeof item.id === 'string' &&
        typeof item.name === 'string' &&
        typeof item.price === 'number'
      )).map(item => ({
        id: item.id,
        name: item.name,
        price: item.price,
        quantity: Math.max(1, parseInt(String(item.quantity)) || 1),
        image: item.image
      }));
    } catch (error) {
      console.error('Error parsing saved cart:', error);
      return [];
    }
  }, []);

  // Handle cart persistence
  useEffect(() => {
    const userKey = `cart_${currentUser?.id ?? 'temp'}`;
    const lastSavedCart = localStorage.getItem(userKey);
    
    if (isLoggedIn && currentUser) {
      if (lastSavedCart) {
        const validatedCart = validateAndParseCart(lastSavedCart);
        if (validatedCart.length > 0) {
          setCartItems(validatedCart);
        }
      }
    } else {
      // Clear cart on logout
      setCartItems([]);
    }
  }, [isLoggedIn, currentUser, validateAndParseCart]);

  // Save cart changes
  const saveCart = useCallback(() => {
    if (isLoggedIn && currentUser && cartItems.length > 0) {
      localStorage.setItem(`cart_${currentUser.id}`, JSON.stringify(cartItems));
    } else if (isLoggedIn && currentUser) {
      // Remove empty cart from storage
      localStorage.removeItem(`cart_${currentUser.id}`);
    }
  }, [isLoggedIn, currentUser, cartItems]);

  // Save cart when it changes
  useEffect(() => {
    saveCart();
  }, [saveCart]);

  const addItem = useCallback((newItem: Omit<CartItem, 'quantity'>) => {
    if (!isLoggedIn) {
      navigate('/signin', { state: { returnTo: '/products', pendingItem: newItem } });
      return;
    }

    setCartItems(currentItems => {
      const existingItem = currentItems.find(item => item.id === newItem.id);
      
      if (existingItem) {
        return currentItems.map(item =>
          item.id === newItem.id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      } else {
        return [...currentItems, { ...newItem, quantity: 1 }];
      }
    });
  }, [isLoggedIn, navigate]);

  const removeItem = useCallback((id: string) => {
    if (!isLoggedIn) return;
    setCartItems(currentItems => currentItems.filter(item => item.id !== id));
  }, [isLoggedIn]);

  const updateQuantity = useCallback((id: string, quantity: number) => {
    if (!isLoggedIn) return;
    
    const safeQuantity = Math.max(0, parseInt(String(quantity)) || 0);
    if (safeQuantity <= 0) {
      removeItem(id);
      return;
    }

    setCartItems(currentItems =>
      currentItems.map(item =>
        item.id === id ? { ...item, quantity: safeQuantity } : item
      )
    );
  }, [isLoggedIn, removeItem]);

  const clearCart = useCallback(() => {
    setCartItems([]);
    if (isLoggedIn && currentUser) {
      localStorage.removeItem(`cart_${currentUser.id}`);
    }
  }, [isLoggedIn, currentUser]);

  const getTotalItems = useCallback(() => {
    return cartItems.reduce((total, item) => total + item.quantity, 0);
  }, [cartItems]);

  const getTotalPrice = useCallback(() => {
    return cartItems.reduce((total, item) => total + (item.price * item.quantity), 0);
  }, [cartItems]);

  return (
    <CartContext.Provider
      value={{
        items: cartItems,
        addItem,
        removeItem,
        updateQuantity,
        clearCart,
        getTotalItems,
        getTotalPrice
      }}
    >
      {children}
    </CartContext.Provider>
  );
}