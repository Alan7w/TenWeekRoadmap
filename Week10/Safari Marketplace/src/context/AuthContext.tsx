import { createContext, useEffect, useState, useCallback } from 'react';
import type { User, AuthContextType } from '../types';
import { safariStorage, generateId, isValidEmail } from '../utils';

const AuthContext = createContext<AuthContextType | undefined>(undefined);
export { AuthContext };

interface AuthProviderProps { children: React.ReactNode; }

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  // Initialize auth state from localStorage
  useEffect(() => {
    const initializeAuth = async () => {
      try {
        const savedUser = safariStorage.getUser();
        if (savedUser) {
          setUser(savedUser);
        }
      } catch (error) {
        console.error('Error initializing auth:', error);
      } finally {
        setLoading(false);
      }
    };

    initializeAuth();
  }, []);

  // Login function
  const login = useCallback(async (email: string, password: string): Promise<boolean> => {
    try {
      setLoading(true);
      
      const users = safariStorage.getUsers();
      const foundUser = users.find(
        (u: User) => u.email === email && u.password === password
      );

      if (foundUser) {
        setUser(foundUser);
        safariStorage.setUser(foundUser);
        return true;
      } else {
        return false;
      }
    } catch (error) {
      console.error('Login error:', error);
      return false;
    } finally {
      setLoading(false);
    }
  }, []);

  // Register function
  const register = useCallback(async (userData: Omit<User, 'id' | 'createdAt' | 'addresses'>): Promise<boolean> => {
    try {
      setLoading(true);
      
      if (!isValidEmail(userData.email)) {
        return false;
      }

      const existingUsers = safariStorage.getUsers();
      
      const emailExists = existingUsers.some((u: User) => u.email === userData.email);
      if (emailExists) {
        return false;
      }

      const newUser: User = {
        ...userData,
        id: generateId(),
        addresses: [],
        createdAt: new Date().toISOString(),
      };

      // Add to users list and save
      const updatedUsers = [...existingUsers, newUser];
      safariStorage.setUsers(updatedUsers);

      // Set as current user
      setUser(newUser);
      safariStorage.setUser(newUser);

      return true;
    } catch (error) {
      console.error('Registration error:', error);
      return false;
    } finally {
      setLoading(false);
    }
  }, []);

  // Logout function
  const logout = useCallback(() => {
    setUser(null);
    safariStorage.removeUser();
    // Optionally clear cart and favorites on logout
    // safariStorage.clearCart();
    // safariStorage.clearFavorites();
  }, []);

  // Update user function
  const updateUser = useCallback((updatedData: Partial<User>) => {
    if (!user) return;

    const updatedUser = { ...user, ...updatedData };
    setUser(updatedUser);
    safariStorage.setUser(updatedUser);

    const users = safariStorage.getUsers();
    const userIndex = users.findIndex((u: User) => u.id === user.id);
    if (userIndex !== -1) {
      users[userIndex] = updatedUser;
      safariStorage.setUsers(users);
    }
  }, [user]);

  const contextValue: AuthContextType = {
    user,
    login,
    register,
    logout,
    updateUser,
    isAuthenticated: !!user,
    loading,
  };

  return (
    <AuthContext.Provider value={contextValue}>
      {children}
    </AuthContext.Provider>
  );
};