import { STORAGE_KEYS } from '../types';
import type { User, CartItem, FavoriteItem, Order } from '../types';

/**
 * Generic localStorage utility functions
 */

export const localStorage = {

  get: <T>(key: string): T | null => {
    try {
      const item = window.localStorage.getItem(key);
      return item ? JSON.parse(item) : null;
    } catch (error) {
      console.error(`Error getting localStorage key "${key}":`, error);
      return null;
    }
  },

  set: <T>(key: string, value: T): void => {
    try {
      window.localStorage.setItem(key, JSON.stringify(value));
    } catch (error) {
      console.error(`Error setting localStorage key "${key}":`, error);
    }
  },

  remove: (key: string): void => {
    try {
      window.localStorage.removeItem(key);
    } catch (error) {
      console.error(`Error removing localStorage key "${key}":`, error);
    }
  },

  clear: (): void => {
    try {
      window.localStorage.clear();
    } catch (error) {
      console.error('Error clearing localStorage:', error);
    }
  },

  exists: (key: string): boolean => {
    return window.localStorage.getItem(key) !== null;
  },
};

/**
 * Safari-specific localStorage utilities
 */
export const safariStorage = {
  // Auth utilities
  getUser: () => localStorage.get<User>(STORAGE_KEYS.AUTH),
  setUser: (user: User) => localStorage.set(STORAGE_KEYS.AUTH, user),
  removeUser: () => localStorage.remove(STORAGE_KEYS.AUTH),

  // Users database utilities
  getUsers: () => localStorage.get<User[]>(STORAGE_KEYS.USERS) || [],
  setUsers: (users: User[]) => localStorage.set(STORAGE_KEYS.USERS, users),

  // Cart utilities
  getCart: () => localStorage.get<CartItem[]>(STORAGE_KEYS.CART) || [],
  setCart: (cart: CartItem[]) => localStorage.set(STORAGE_KEYS.CART, cart),
  clearCart: () => localStorage.remove(STORAGE_KEYS.CART),

  // Favorites utilities
  getFavorites: () => localStorage.get<FavoriteItem[]>(STORAGE_KEYS.FAVORITES) || [],
  setFavorites: (favorites: FavoriteItem[]) => localStorage.set(STORAGE_KEYS.FAVORITES, favorites),
  clearFavorites: () => localStorage.remove(STORAGE_KEYS.FAVORITES),

  // Orders utilities
  getOrders: () => localStorage.get<Order[]>(STORAGE_KEYS.ORDERS) || [],
  setOrders: (orders: Order[]) => localStorage.set(STORAGE_KEYS.ORDERS, orders),

  clearAll: () => {
    Object.values(STORAGE_KEYS).forEach(key => localStorage.remove(key));
  },
};

export const generateId = (): string => {
  return Date.now().toString(36) + Math.random().toString(36).substr(2);
};

export const formatCurrency = (amount: number, currency = '₦'): string => {
  return `${currency}${amount.toLocaleString()}`;
};

export const formatDate = (dateString: string): string => {
  return new Date(dateString).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
};

export const isValidEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

export const generateOrderNumber = (): string => {
  return `ORD${Date.now()}${Math.random().toString(36).substr(2, 4).toUpperCase()}`;
};

export const calculateCartTotal = (items: CartItem[]): number => {
  return items.reduce((total, item) => total + (item.product.price * item.quantity), 0);
};

export const debounce = <T extends (...args: unknown[]) => void>(
  func: T,
  wait: number
): ((...args: Parameters<T>) => void) => {
  let timeout: ReturnType<typeof setTimeout>;
  
  return (...args: Parameters<T>) => {
    clearTimeout(timeout);
    timeout = setTimeout(() => func(...args), wait);
  };
};

export const getImagePlaceholder = (category: string): string => {
  const placeholders = {
    clothes: 'https://images.unsplash.com/photo-1523381210434-271e8be1f52b?w=400&h=400&fit=crop',
    shoes: 'https://images.unsplash.com/photo-1549298916-b41d501d3772?w=400&h=400&fit=crop',
    accessories: 'https://images.unsplash.com/photo-1611652022419-a9419f74343a?w=400&h=400&fit=crop',
  };
  
  return placeholders[category as keyof typeof placeholders] || placeholders.accessories;
};