import { useCart, useFavorites, useAuth } from '../context';
import { mockProducts } from '../data';
import { Button } from '../components';

/**
 * Context Test Component - For testing contexts functionality
 */
export const ContextTest: React.FC = () => {
  const { addItem, getCartItemsCount, items: cartItems } = useCart();
  const { addToFavorites, items: favoriteItems, isFavorite } = useFavorites();
  const { user, isAuthenticated } = useAuth();

  const testProduct = mockProducts[0]; // Get first product for testing

  const handleAddToCart = () => {
    if (testProduct) {
      addItem(testProduct, testProduct.sizes[0], testProduct.colors[0], 1);
    }
  };

  const handleAddToFavorites = () => {
    if (testProduct) {
      addToFavorites(testProduct);
    }
  };

  return (
    <div className="p-8 bg-gray-50 rounded-lg">
      <h2 className="text-2xl font-bold mb-6">Context Test Panel</h2>
      
      {/* Auth Status */}
      <div className="mb-6">
        <h3 className="text-lg font-semibold mb-2">Auth Status</h3>
        <p className="text-gray-600">
          Status: {isAuthenticated ? 'Authenticated' : 'Not authenticated'}
        </p>
        {user && (
          <p className="text-gray-600">
            User: {user.firstName} {user.lastName} ({user.email})
          </p>
        )}
      </div>

      {/* Cart Test */}
      <div className="mb-6">
        <h3 className="text-lg font-semibold mb-2">Cart Test</h3>
        <p className="text-gray-600 mb-2">Cart Items: {getCartItemsCount()}</p>
        {cartItems.length > 0 && (
          <div className="text-sm text-gray-500">
            {cartItems.map(item => (
              <div key={item.id}>
                {item.product.name} x {item.quantity}
              </div>
            ))}
          </div>
        )}
        <Button onClick={handleAddToCart} className="mt-2">
          Add Test Product to Cart
        </Button>
      </div>

      {/* Favorites Test */}
      <div className="mb-6">
        <h3 className="text-lg font-semibold mb-2">Favorites Test</h3>
        <p className="text-gray-600 mb-2">Favorites: {favoriteItems.length}</p>
        <p className="text-gray-600 mb-2">
          Test Product Favorited: {isFavorite(testProduct?.id || '') ? 'Yes' : 'No'}
        </p>
        <Button onClick={handleAddToFavorites} variant="outline" className="mt-2">
          Add Test Product to Favorites
        </Button>
      </div>

      {/* Product Data Test */}
      <div>
        <h3 className="text-lg font-semibold mb-2">Product Data</h3>
        <p className="text-gray-600">Total Products: {mockProducts.length}</p>
        {testProduct && (
          <div className="text-sm text-gray-500 mt-2">
            Test Product: {testProduct.name} - ₦{testProduct.price.toLocaleString()}
          </div>
        )}
      </div>
    </div>
  );
};

export default ContextTest;