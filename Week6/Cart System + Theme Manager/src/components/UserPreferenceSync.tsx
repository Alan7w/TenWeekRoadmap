import { useEffect, useRef } from 'react';
import { useAuth } from '../contexts/useAuth';
import { useTheme } from '../contexts/useTheme';
import { useCart } from '../contexts/useCart';

export default function UserPreferenceSync() {
  const { isLoggedIn, currentUser, updateUserPreferences } = useAuth();
  const { theme } = useTheme();
  const { items: cartItems } = useCart();
  const lastUserId = useRef<string | null>(null);
  useEffect(() => {
    if (isLoggedIn && currentUser && currentUser.id !== lastUserId.current) {
      lastUserId.current = currentUser.id;
      
      const userTheme = currentUser.preferences.theme;
      if (userTheme && userTheme !== theme) {
        document.documentElement.classList.remove('light', 'dark');
        document.documentElement.classList.add(userTheme);
        localStorage.setItem('theme', userTheme);
        
        setTimeout(() => {
          window.dispatchEvent(new StorageEvent('storage', {
            key: 'theme',
            newValue: userTheme,
            oldValue: theme,
            storageArea: localStorage
          }));
        }, 0);
      }

      if (currentUser.preferences.cartItems?.length > 0) {
        localStorage.setItem('cart', JSON.stringify(currentUser.preferences.cartItems));
        setTimeout(() => {
          window.dispatchEvent(new StorageEvent('storage', {
            key: 'cart',
            newValue: JSON.stringify(currentUser.preferences.cartItems),
            oldValue: localStorage.getItem('cart'),
            storageArea: localStorage
          }));
        }, 0);
      }
    } else if (!isLoggedIn) {
      lastUserId.current = null;
    }
  }, [isLoggedIn, currentUser, theme]);

  // Sync theme and cart changes to user preferences when logged in - debounced
  useEffect(() => {
    if (isLoggedIn && currentUser && lastUserId.current === currentUser.id) {
      const timeoutId = setTimeout(() => {
        updateUserPreferences({
          theme,
          cartItems
        });
      }, 500);

      return () => clearTimeout(timeoutId);
    }
  }, [isLoggedIn, currentUser, theme, cartItems, updateUserPreferences]);

  useEffect(() => {
    if (!isLoggedIn) {
      localStorage.removeItem('cart');
    }
  }, [isLoggedIn]);

  return null;
}