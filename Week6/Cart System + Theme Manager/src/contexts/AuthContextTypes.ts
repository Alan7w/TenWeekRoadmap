import { createContext } from 'react';
import type { CartItem } from './CartContextTypes';
import type { Theme } from './ThemeContextTypes';

export interface User {
  id: string;
  username: string;
  email: string;
  firstName: string;
  lastName: string;
  createdAt: string;
  preferences: {
    theme: Theme;
    cartItems: CartItem[];
  };
}

export interface AuthContextType {
  isLoggedIn: boolean;
  currentUser: User | null;
  login: (username: string, password: string) => boolean;
  register: (userData: RegisterData) => boolean;
  logout: () => void;
  updateUserPreferences: (preferences: Partial<User['preferences']>) => void;
}

export interface RegisterData {
  username: string;
  email: string;
  password: string;
  firstName: string;
  lastName: string;
}

export interface StoredUser extends Omit<User, 'id'> {
  id: string;
  password: string; // Only stored locally for demo purposes
}

export const AuthContext = createContext<AuthContextType | undefined>(undefined);