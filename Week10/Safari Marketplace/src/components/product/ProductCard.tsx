import { useState } from 'react';
import type { Product } from '../../types';
import { Button, Confirmation } from '../ui';
import { useCart, useFavorites, useAuth } from '../../context';
import { useNavigate } from 'react-router-dom';

interface ProductCardProps {
  product: Product;
}

const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
  const { addItem } = useCart();
  const { addToFavorites, removeFromFavorites, isFavorite } = useFavorites();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [confirmation, setConfirmation] = useState<{ message: string; type: 'success' | 'error' } | null>(null);
  const isProductFavorited = isFavorite(product.id);

  const handleAddToCart = () => {
    if (!user) {
      navigate('/auth');
      return;
    }
    
    try {
      addItem(product, product.sizes[0], product.colors[0], 1);
      setConfirmation({ message: 'Added to cart!', type: 'success' });
    } catch {
      setConfirmation({ message: 'Failed to add to cart', type: 'error' });
    }
  };

  const handleToggleFavorite = () => {
    if (!user) {
      navigate('/auth');
      return;
    }
    
    try {
      if (isProductFavorited) {
        removeFromFavorites(product.id);
        setConfirmation({ message: 'Removed from favorites', type: 'success' });
      } else {
        addToFavorites(product);
        setConfirmation({ message: 'Added to favorites!', type: 'success' });
      }
    } catch {
      setConfirmation({ message: 'Failed to update favorites', type: 'error' });
    }
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-NG', {
      style: 'currency',
      currency: 'NGN',
    }).format(price);
  };

  return (
    <div className="group relative bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow duration-200">
      {/* Product Image */}
      <div className="aspect-square w-full overflow-hidden rounded-t-lg bg-gray-200">
        <img
          src={product.image}
          alt={product.name}
          className="h-full w-full object-cover object-center group-hover:scale-105 transition-transform duration-200"
          loading="lazy"
        />
        
        {/* Add to Cart Button */}
        <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-200">
          <Button
            onClick={handleAddToCart}
            variant="primary"
            size="sm"
            className="bg-safari-pink hover:bg-safari-pink-dark text-white font-medium shadow-lg"
          >
            ADD TO CART
          </Button>
        </div>

        {/* Favorite Button */}
        <div className="absolute top-3 right-3">
          <button
            onClick={handleToggleFavorite}
            className={`w-10 h-10 rounded-full bg-white hover:bg-gray-50 hover:cursor-pointer shadow-sm border border-gray-300 inline-flex items-center justify-center transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500 ${
              isProductFavorited ? 'text-red-500' : 'text-gray-400'
            }`}
            aria-label={isProductFavorited ? 'Remove from favorites' : 'Add to favorites'}
          >
            <svg 
              className="h-5 w-5" 
              fill={isProductFavorited ? "currentColor" : "none"} 
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

        {/* Stock Status */}
        {!product.inStock && (
          <div className="absolute inset-0 bg-gray-500 bg-opacity-75 flex items-center justify-center">
            <span className="text-white font-medium">Out of Stock</span>
          </div>
        )}
      </div>

      {/* Product Info */}
      <div className="p-4">
        <h3 className="text-sm font-medium text-gray-900 mb-2 line-clamp-2">
          {product.name}
        </h3>
        
        <p className="text-lg font-bold text-gray-900">
          {formatPrice(product.price)}
        </p>

        {/* Available Sizes */}
        <div className="mt-2">
          <p className="text-xs text-gray-500 mb-1">Available sizes:</p>
          <div className="flex flex-wrap gap-1">
            {product.sizes.slice(0, 4).map((size, index) => (
              <span
                key={index}
                className="px-2 py-1 text-xs bg-gray-100 text-gray-700 rounded"
              >
                {size}
              </span>
            ))}
            {product.sizes.length > 4 && (
              <span className="px-2 py-1 text-xs bg-gray-100 text-gray-700 rounded">
                +{product.sizes.length - 4}
              </span>
            )}
          </div>
        </div>

        {/* Available Colors */}
        <div className="mt-3">
          <p className="text-xs text-gray-500 mb-2">Available colors:</p>
          <div className="flex space-x-1">
            {product.colors.slice(0, 5).map((color, index) => (
              <div
                key={index}
                className="w-4 h-4 rounded-full border border-gray-300"
                style={{
                  backgroundColor: color === 'white' ? '#ffffff' : 
                                  color === 'black' ? '#000000' :
                                  color === 'brown' ? '#8B4513' :
                                  color === 'beige' ? '#F5F5DC' :
                                  color === 'blue' ? '#0000FF' :
                                  color === 'green' ? '#008000' :
                                  color === 'red' ? '#FF0000' :
                                  color === 'pink' ? '#FFC0CB' :
                                  color === 'purple' ? '#800080' :
                                  color === 'orange' ? '#FFA500' :
                                  color === 'gold' ? '#FFD700' :
                                  color === 'taupe' ? '#483C32' :
                                  color === 'gray' || color === 'grey' ? '#808080' :
                                  '#CCCCCC'
                }}
                title={color}
              />
            ))}
            {product.colors.length > 5 && (
              <div className="w-4 h-4 rounded-full border border-gray-300 bg-gray-100 flex items-center justify-center">
                <span className="text-xs text-gray-600">+</span>
              </div>
            )}
          </div>
        </div>
      </div>
      
      {/* Confirmation Notification */}
      {confirmation && (
        <Confirmation
          message={confirmation.message}
          type={confirmation.type}
          onClose={() => setConfirmation(null)}
        />
      )}
    </div>
  );
};

export default ProductCard;