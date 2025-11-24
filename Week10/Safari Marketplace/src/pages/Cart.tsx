import { useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button, Loading } from '../components';
import { useCart, useFavorites, useAuth } from '../context';
import type { CartItem } from '../types';

const Cart: React.FC = () => {
  const { user, loading: authLoading } = useAuth();
  const { items, updateQuantity, removeItem, clearCart, getCartTotal, getCartItemsCount } = useCart();
  const { addToFavorites, isFavorite } = useFavorites();
  const navigate = useNavigate();
  
  // Calculate totals with memoization for performance
  const totals = useMemo(() => {
    const subtotal = getCartTotal();
    const shipping = subtotal > 50000 ? 0 : 5000; // Free shipping over ₦50,000
    const tax = subtotal * 0.075; // 7.5% VAT
    const total = subtotal + shipping + tax;
    
    return { subtotal, shipping, tax, total };
  }, [getCartTotal]);

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-NG', {
      style: 'currency',
      currency: 'NGN',
    }).format(price);
  };

  const handleMoveToFavorites = (item: CartItem) => {
    addToFavorites(item.product);
    removeItem(item.id);
  };

  const handleQuantityChange = (itemId: string, newQuantity: number) => {
    if (newQuantity < 1) return;
    updateQuantity(itemId, newQuantity);
  };

  const handleCheckout = () => {
    navigate('/checkout');
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
                d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"
              />
            </svg>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Please Sign In</h2>
            <p className="text-gray-600 mb-6">
              You need to be signed in to view your shopping cart and make purchases.
            </p>
            <Button onClick={() => navigate('/auth')} className="bg-safari-pink hover:bg-safari-pink-dark">
              Sign In / Create Account
            </Button>
          </div>
        </div>
      </div>
    );
  }

  // Show empty cart
  if (items.length === 0) {
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
                d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"
              />
            </svg>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Your Cart is Empty</h2>
            <p className="text-gray-600 mb-6">
              Looks like you haven't added anything to your cart yet. Start shopping to add items!
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
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Shopping Cart</h1>
          <p className="text-gray-600">
            {getCartItemsCount()} {getCartItemsCount() === 1 ? 'item' : 'items'} in your cart
          </p>
        </div>

        <div className="lg:grid lg:grid-cols-12 lg:gap-x-8">
          {/* Cart Items */}
          <div className="lg:col-span-8">
            <div className="bg-white rounded-lg shadow-sm">
              <div className="px-6 py-4 border-b border-gray-200">
                <div className="flex items-center justify-between">
                  <h2 className="text-lg font-medium text-gray-900">Items</h2>
                  {items.length > 0 && (
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      onClick={clearCart}
                      className="text-gray-500 hover:text-red-600"
                    >
                      Clear Cart
                    </Button>
                  )}
                </div>
              </div>
              
              <div className="divide-y divide-gray-200">
                {items.map((item) => (
                  <div key={item.id} className="p-6">
                    <div className="flex items-start space-x-4">
                      {/* Product Image */}
                      <div className="shrink-0">
                        <img
                          src={item.product.image}
                          alt={item.product.name}
                          className="w-20 h-20 object-cover rounded-lg"
                        />
                      </div>
                      
                      {/* Product Details */}
                      <div className="flex-1 min-w-0">
                        <h3 className="text-sm font-medium text-gray-900">
                          {item.product.name}
                        </h3>
                        <p className="text-sm text-gray-500 mt-1">
                          {item.product.description}
                        </p>
                        <div className="mt-2 flex items-center space-x-4 text-sm text-gray-500">
                          <span>Size: {item.selectedSize}</span>
                          <span>Color: {item.selectedColor}</span>
                        </div>
                      </div>
                      
                      {/* Price and Controls */}
                      <div className="flex flex-col items-end space-y-4">
                        <p className="text-sm font-medium text-gray-900">
                          {formatPrice(item.product.price * item.quantity)}
                        </p>
                        
                        {/* Quantity Controls */}
                        <div className="flex items-center space-x-2">
                          <button
                            onClick={() => handleQuantityChange(item.id, item.quantity - 1)}
                            className="w-8 h-8 rounded-full border border-black-300 flex items-center justify-center hover:cursor-pointer hover:bg-gray-50 disabled:border-gray-200"
                            disabled={item.quantity <= 1}
                          >
                            -
                          </button>
                          <span className="w-8 text-center text-sm font-medium">
                            {item.quantity}
                          </span>
                          <button
                            onClick={() => handleQuantityChange(item.id, item.quantity + 1)}
                            className="w-8 h-8 rounded-full border border-black-300 flex items-center justify-center hover:cursor-pointer hover:bg-gray-50 disabled:border-gray-200"
                          >
                            +
                          </button>
                        </div>
                        
                        {/* Item Actions */}
                        <div className="flex space-x-2">
                          {!isFavorite(item.product.id) && (
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleMoveToFavorites(item)}
                              className="text-xs"
                            >
                              Move to Favorites
                            </Button>
                          )}
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => removeItem(item.id)}
                            className="text-xs text-red-600 hover:text-red-700"
                          >
                            Remove
                          </Button>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-4 mt-8 lg:mt-0">
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h2 className="text-lg font-medium text-gray-900 mb-6">Order Summary</h2>
              
              <div className="space-y-4">
                <div className="flex justify-between text-sm">
                  <span>Subtotal ({getCartItemsCount()} items)</span>
                  <span>{formatPrice(totals.subtotal)}</span>
                </div>
                
                <div className="flex justify-between text-sm">
                  <span>Shipping</span>
                  <span>{totals.shipping === 0 ? 'Free' : formatPrice(totals.shipping)}</span>
                </div>
                
                <div className="flex justify-between text-sm">
                  <span>Tax (VAT)</span>
                  <span>{formatPrice(totals.tax)}</span>
                </div>
                
                <hr className="my-4" />
                
                <div className="flex justify-between text-base font-medium">
                  <span>Total</span>
                  <span>{formatPrice(totals.total)}</span>
                </div>
                
                {totals.shipping > 0 && (
                  <p className="text-xs text-gray-500 mt-2">
                    Free shipping on orders over {formatPrice(50000)}
                  </p>
                )}
              </div>
              
              <Button
                onClick={handleCheckout}
                className="w-full mt-6 bg-safari-pink hover:bg-safari-pink-dark"
                size="lg"
              >
                Proceed to Checkout
              </Button>
              
              <div className="mt-4 text-center">
                <Button
                  onClick={() => navigate('/clothes')}
                  className="text-sm text-safari-pink hover:text-safari-pink-dark"
                >
                  Continue Shopping
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Cart;