import { useState, useEffect } from 'react';
import { AuthContext, type User, type RegisterData, type StoredUser } from './AuthContextTypes';
import type { CartItem } from './CartContextTypes';
import type { Theme } from './ThemeContextTypes';
import { useLocalStorage } from './useLocalStorage';

interface AuthProviderProps {
  children: React.ReactNode;
}

export function AuthProvider({ children }: AuthProviderProps) {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  
  const demoUsers: StoredUser[] = [
    {
      id: 'demo_user_1',
      username: 'demo',
      email: 'demo@example.com',
      firstName: 'Demo',
      lastName: 'User',
      password: 'demo123',
      createdAt: new Date().toISOString(),
      preferences: {
        theme: 'light' as Theme,
        cartItems: [] as CartItem[]
      }
    },
    {
      id: 'demo_user_2',
      username: 'jane',
      email: 'jane@example.com',
      firstName: 'Jane',
      lastName: 'Smith',
      password: 'jane123',
      createdAt: new Date().toISOString(),
      preferences: {
        theme: 'dark' as Theme,
        cartItems: [] as CartItem[]
      }
    }
  ];

  const [users, setUsers] = useLocalStorage<StoredUser[]>('users', demoUsers);
  const [authState, setAuthState] = useLocalStorage<{
    isLoggedIn: boolean;
    userId: string | null;
  }>('authState', { isLoggedIn: false, userId: null });

  useEffect(() => {
    if (authState.isLoggedIn && authState.userId) {
      if (!currentUser || currentUser.id !== authState.userId) {
        const user = users.find(u => u.id === authState.userId);
        if (user) {
          // eslint-disable-next-line @typescript-eslint/no-unused-vars
          const { password, ...userWithoutPassword } = user;
          setCurrentUser(userWithoutPassword);
          setIsLoggedIn(true);
        } else {
          setAuthState({ isLoggedIn: false, userId: null });
          setCurrentUser(null);
          setIsLoggedIn(false);
        }
      }
    } else if (!authState.isLoggedIn && (currentUser || isLoggedIn)) {
      setCurrentUser(null);
      setIsLoggedIn(false);
    }
  }, [authState.isLoggedIn, authState.userId, currentUser, isLoggedIn, users, setAuthState]);

  const createUserId = (): string => {
    return `user_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  };

  const login = (username: string, password: string): boolean => {
    const user = users.find(u => 
      (u.username === username || u.email === username) && u.password === password
    );

    if (user) {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const { password, ...userWithoutPassword } = user;
      
      // Update all states synchronously
      setCurrentUser(userWithoutPassword);
      setIsLoggedIn(true);
      setAuthState({ isLoggedIn: true, userId: user.id });
      return true;
    }
    
    return false;
  };

  const register = (userData: RegisterData): boolean => {
    const existingUser = users.find(u => 
      u.username === userData.username || u.email === userData.email
    );
    
    if (existingUser) {
      return false;
    }

    const newUser: StoredUser = {
      id: createUserId(),
      username: userData.username,
      email: userData.email,
      firstName: userData.firstName,
      lastName: userData.lastName,
      password: userData.password,
      createdAt: new Date().toISOString(),
      preferences: {
        theme: 'light' as Theme,
        cartItems: [] as CartItem[]
      }
    };

    setUsers(prevUsers => [...prevUsers, newUser]);
    
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { password, ...userWithoutPassword } = newUser;
    
    setCurrentUser(userWithoutPassword);
    setIsLoggedIn(true);
    setAuthState({ isLoggedIn: true, userId: newUser.id });
    
    return true;
  };

  const logout = () => {
    setCurrentUser(null);
    setIsLoggedIn(false);
    setAuthState({ isLoggedIn: false, userId: null });
  };

  const updateUserPreferences = (preferences: Partial<User['preferences']>) => {
    if (!currentUser) return;

    const updatedUsers = users.map(user => 
      user.id === currentUser.id 
        ? { 
            ...user, 
            preferences: { ...user.preferences, ...preferences }
          }
        : user
    );
    
    setUsers(updatedUsers);
    
    setCurrentUser(prevUser => 
      prevUser ? {
        ...prevUser,
        preferences: { ...prevUser.preferences, ...preferences }
      } : null
    );
  };

  return (
    <AuthContext.Provider 
      value={{
        isLoggedIn,
        currentUser,
        login,
        register,
        logout,
        updateUserPreferences
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}