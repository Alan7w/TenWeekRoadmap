import { AuthProvider } from './AuthContext';
import { CartProvider } from './CartContext';
import { FavoritesProvider } from './FavoritesContext';
import OrderProvider from './OrderContext';

interface AppProviderProps {
  children: React.ReactNode;
}

// This provider ensures all contexts are available throughout the app
export const AppProvider: React.FC<AppProviderProps> = ({ children }) => {
  return (
    <AuthProvider>
      <CartProvider>
        <FavoritesProvider>
          <OrderProvider>
            {children}
          </OrderProvider>
        </FavoritesProvider>
      </CartProvider>
    </AuthProvider>
  );
};