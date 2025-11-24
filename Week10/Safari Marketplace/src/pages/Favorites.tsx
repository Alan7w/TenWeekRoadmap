import { useNavigate, Link } from 'react-router-dom';
import { Button, Loading } from '../components';
import { useCart, useFavorites, useAuth } from '../context';

const Favorites: React.FC = () => {
  const { user, loading: authLoading } = useAuth();
  const { items, removeFromFavorites } = useFavorites();
  const { addItem } = useCart();
  const navigate = useNavigate();

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-NG', {
      style: 'currency',
      currency: 'NGN',
    }).format(price);
  };

  const handleAddToCart = (productId: string) => {
    const favoriteItem = items.find(item => item.productId === productId);
    if (favoriteItem) {
      addItem(favoriteItem.product, favoriteItem.product.sizes[0], favoriteItem.product.colors[0], 1);
    }
  };

  // Show loading while checking authentication
  if (authLoading) {
    return (
      <div className="container mx-auto px-4 py-8 flex justify-center items-center min-h-[400px]">
        <Loading text="Loading..." size="lg" />
      </div>
    );
  }

  // Redirect to auth if not logged in
  if (!user) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-2xl mx-auto text-center">
          <div className="bg-gray-50 rounded-lg p-8">
            <svg 
              className="w-16 h-16 text-gray-300 mx-auto mb-4" 
              fill="none" 
              viewBox="0 0 24 24" 
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1}
                d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
              />
            </svg>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Please Sign In</h2>
            <p className="text-gray-600 mb-6">
              You need to be signed in to view your favorites and save items for later.
            </p>
            <Button onClick={() => navigate('/auth')} className="bg-safari-pink hover:bg-safari-pink-dark">
              Sign In / Create Account
            </Button>
          </div>
        </div>
      </div>
    );
  }

  // Show empty favorites
  if (items.length === 0) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">My Favorites</h1>
          <p className="text-gray-600">Items you love, saved for later</p>
        </div>
        
        <div className="max-w-2xl mx-auto text-center">
          <div className="bg-gray-50 rounded-lg p-8">
            <svg 
              className="w-16 h-16 text-gray-300 mx-auto mb-4" 
              fill="none" 
              viewBox="0 0 24 24" 
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1}
                d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
              />
            </svg>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">No Favorites Yet</h2>
            <p className="text-gray-600 mb-6">
              Start browsing and tap the heart icon to save items you love!
            </p>
            <div className="space-x-4">
              <Button onClick={() => navigate('/clothes')} variant="outline">
                Shop Clothes
              </Button>
              <Button onClick={() => navigate('/shoes')} variant="outline">
                Shop Shoes
              </Button>
              <Button onClick={() => navigate('/accessories')} variant="outline">
                Shop Accessories
              </Button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-gray-50 min-h-screen py-8">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">My Favorites</h1>
          <p className="text-gray-600">
            {items.length} {items.length === 1 ? 'item' : 'items'} saved
          </p>
        </div>

        {/* Favorites Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {items.map((item) => (
            <div
              key={item.id}
              className="bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow duration-200 overflow-hidden"
            >
              {/* Product Image */}
              <div className="aspect-square bg-gray-100 relative">
                <img
                  src={item.product.image}
                  alt={item.product.name}
                  className="w-full h-full object-cover"
                  loading="lazy"
                />
                
                {/* Remove from Favorites Button */}
                <button
                  onClick={() => removeFromFavorites(item.productId)}
                  className="absolute top-3 right-3 w-10 h-10 rounded-full bg-white hover:bg-gray-50 hover:cursor-pointer shadow-sm border border-gray-300 inline-flex items-center justify-center transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500 text-red-500"
                  aria-label="Remove from favorites"
                >
                  <svg 
                    className="h-5 w-5" 
                    fill="currentColor" 
                    viewBox="0 0 24 24" 
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
                    />
                  </svg>
                </button>
              </div>

              {/* Product Details */}
              <div className="p-4">
                <h3 className="text-sm font-medium text-gray-900 mb-1 line-clamp-2">
                  {item.product.name}
                </h3>
                <p className="text-xs text-gray-500 mb-2 line-clamp-2">
                  {item.product.description}
                </p>
                
                <div className="flex items-center justify-between mb-3">
                  <span className="text-lg font-bold text-gray-900">
                    {formatPrice(item.product.price)}
                  </span>
                  {!item.product.inStock && (
                    <span className="text-xs text-red-600 bg-red-50 px-2 py-1 rounded">
                      Out of Stock
                    </span>
                  )}
                </div>

                {/* Available Sizes */}
                {item.product.sizes.length > 0 && (
                  <div className="mb-3">
                    <p className="text-xs text-gray-500 mb-1">Available sizes:</p>
                    <div className="flex flex-wrap gap-1">
                      {item.product.sizes.slice(0, 4).map((size) => (
                        <span 
                          key={size} 
                          className="text-xs bg-gray-100 text-gray-700 px-2 py-1 rounded"
                        >
                          {size}
                        </span>
                      ))}
                      {item.product.sizes.length > 4 && (
                        <span className="text-xs bg-gray-100 text-gray-700 px-2 py-1 rounded">
                          +{item.product.sizes.length - 4}
                        </span>
                      )}
                    </div>
                  </div>
                )}

                {/* Available Colors */}
                {item.product.colors.length > 0 && (
                  <div className="mb-4">
                    <p className="text-xs text-gray-500 mb-1">Available colors:</p>
                    <div className="flex space-x-1">
                      {item.product.colors.slice(0, 5).map((color) => (
                        <div
                          key={color}
                          className="w-4 h-4 rounded-full border border-gray-200"
                          style={{ backgroundColor: getColorValue(color) }}
                          title={color}
                        />
                      ))}
                      {item.product.colors.length > 5 && (
                        <div className="flex items-center justify-center w-4 h-4 rounded-full bg-gray-100 border border-gray-200">
                          <span className="text-xs text-gray-600">+{item.product.colors.length - 5}</span>
                        </div>
                      )}
                    </div>
                  </div>
                )}

                {/* Actions */}
                <div className="space-y-2">
                  <Button
                    onClick={() => handleAddToCart(item.productId)}
                    disabled={!item.product.inStock}
                    className="w-full bg-safari-pink hover:bg-safari-pink-dark disabled:bg-gray-300"
                    size="sm"
                  >
                    {item.product.inStock ? 'Add to Cart' : 'Out of Stock'}
                  </Button>
                  
                  <Link 
                    to={`/${item.product.category}/${item.productId}`}
                    className="block text-center"
                  >
                    <Button variant="outline" size="sm" className="w-full text-xs">
                      View Details
                    </Button>
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Continue Shopping */}
        <div className="mt-12 text-center">
          <Button
            onClick={() => navigate('/clothes')}
            className="text-safari-pink hover:text-safari-pink-dark font-medium"
          >
            Continue Shopping
          </Button>
        </div>
      </div>
    </div>
  );
};

// Helper function to get color value
const getColorValue = (color: string): string => {
  const colorMap: Record<string, string> = {
    white: '#FFFFFF',
    black: '#000000',
    brown: '#8B4513',
    beige: '#F5F5DC',
    blue: '#0000FF',
    green: '#008000',
    red: '#FF0000',
    pink: '#FFC0CB',
    purple: '#800080',
    orange: '#FFA500',
    gold: '#FFD700',
    taupe: '#483C32',
    grey: '#808080',
    gray: '#808080',
  };
  return colorMap[color] || '#CCCCCC';
};

export default Favorites;