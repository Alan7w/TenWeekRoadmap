import { useEffect } from 'react';
import { useAuth } from '../contexts/useAuth';
import { useCart } from '../contexts/useCart';
import { useTheme } from '../contexts/useTheme';
import { useNavigate, Link } from 'react-router-dom';

export default function UserProfile() {
  const { isLoggedIn, currentUser, logout } = useAuth();
  const { items: cartItems, getTotalItems, getTotalPrice, clearCart } = useCart();
  const { theme, toggleTheme } = useTheme();
  const navigate = useNavigate();

  useEffect(() => {
    if (!isLoggedIn && !currentUser) {
      const timeoutId = setTimeout(() => {
        navigate('/signin');
      }, 100);
      return () => clearTimeout(timeoutId);
    }
  }, [isLoggedIn, currentUser, navigate]);

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  if (!isLoggedIn || !currentUser) {
    return (
      <div className="min-h-full flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-neutral-900 dark:text-neutral-100 mb-4">
            Please sign in to view your profile
          </h2>
          <Link
            to="/signin"
            className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            Sign In
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-4">
          <h1 className="text-3xl font-bold text-neutral-900 dark:text-neutral-100">
            User Profile
          </h1>
          <Link
            to="/"
            className="text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 transition-colors"
          >
            ← Back to MiniStore
          </Link>
        </div>
        <p className="text-neutral-600 dark:text-neutral-400">
          Manage your account settings and preferences
        </p>
      </div>

      <div className="grid md:grid-cols-2 gap-8">
        {/* User Information */}
        <div className="bg-white dark:bg-neutral-800 rounded-lg shadow-md border border-neutral-200 dark:border-neutral-700 p-6">
          <div className="flex items-center mb-6">
            <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center mr-4">
              <span className="text-white text-2xl font-bold">
                {currentUser.firstName.charAt(0).toUpperCase()}{currentUser.lastName.charAt(0).toUpperCase()}
              </span>
            </div>
            <div>
              <h2 className="text-xl font-semibold text-neutral-900 dark:text-neutral-100">
                {currentUser.firstName} {currentUser.lastName}
              </h2>
              <p className="text-neutral-600 dark:text-neutral-400">@{currentUser.username}</p>
            </div>
          </div>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-1">
                Email Address
              </label>
              <p className="text-neutral-900 dark:text-neutral-100 bg-neutral-50 dark:bg-neutral-700 px-3 py-2 rounded-md">
                {currentUser.email}
              </p>
            </div>

            <div>
              <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-1">
                Username
              </label>
              <p className="text-neutral-900 dark:text-neutral-100 bg-neutral-50 dark:bg-neutral-700 px-3 py-2 rounded-md">
                {currentUser.username}
              </p>
            </div>

            <div>
              <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-1">
                Member Since
              </label>
              <p className="text-neutral-900 dark:text-neutral-100 bg-neutral-50 dark:bg-neutral-700 px-3 py-2 rounded-md">
                {formatDate(currentUser.createdAt)}
              </p>
            </div>
          </div>
        </div>

        {/* Preferences & Settings */}
        <div className="space-y-6">
          {/* Theme Preference */}
          <div className="bg-white dark:bg-neutral-800 rounded-lg shadow-md border border-neutral-200 dark:border-neutral-700 p-6">
            <h3 className="text-lg font-semibold text-neutral-900 dark:text-neutral-100 mb-4">
              Theme Preference
            </h3>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                  theme === 'light' 
                    ? 'bg-yellow-100 text-yellow-600' 
                    : 'bg-blue-100 text-blue-600'
                }`}>
                  {theme === 'light' ? '☀️' : '🌙'}
                </div>
                <span className="text-neutral-900 dark:text-neutral-100 font-medium">
                  {theme === 'light' ? 'Light Mode' : 'Dark Mode'}
                </span>
              </div>
              <button
                onClick={toggleTheme}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors cursor-pointer"
              >
                Switch to {theme === 'light' ? 'Dark' : 'Light'}
              </button>
            </div>
          </div>

          {/* Shopping Cart Summary */}
          <div className="bg-white dark:bg-neutral-800 rounded-lg shadow-md border border-neutral-200 dark:border-neutral-700 p-6">
            <h3 className="text-lg font-semibold text-neutral-900 dark:text-neutral-100 mb-4">
              Shopping Cart
            </h3>
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-neutral-600 dark:text-neutral-400">Items in Cart:</span>
                <span className="text-neutral-900 dark:text-neutral-100 font-medium">
                  {getTotalItems()} item{getTotalItems() !== 1 ? 's' : ''}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-neutral-600 dark:text-neutral-400">Total Value:</span>
                <span className="text-neutral-900 dark:text-neutral-100 font-medium">
                  ${getTotalPrice().toFixed(2)}
                </span>
              </div>
              {getTotalItems() > 0 && (
                <div className="flex gap-2 pt-2">
                  <Link
                    to="/cart"
                    className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-center"
                  >
                    View Cart
                  </Link>
                  <button
                    onClick={clearCart}
                    className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors cursor-pointer"
                  >
                    Clear
                  </button>
                </div>
              )}
              {getTotalItems() === 0 && (
                <div className="text-center py-4">
                  <p className="text-neutral-500 dark:text-neutral-400 mb-3">Your cart is empty</p>
                  <Link
                    to="/products"
                    className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                  >
                    <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                    </svg>
                    Shop Now
                  </Link>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Recent Cart Items */}
      {cartItems.length > 0 && (
        <div className="mt-8">
          <h3 className="text-xl font-semibold text-neutral-900 dark:text-neutral-100 mb-4">
            Items in Your Cart
          </h3>
          <div className="bg-white dark:bg-neutral-800 rounded-lg shadow-md border border-neutral-200 dark:border-neutral-700 overflow-hidden">
            <div className="divide-y divide-neutral-200 dark:divide-neutral-700">
              {cartItems.map((item) => (
                <div key={item.id} className="p-4 flex items-center justify-between">
                  <div className="flex items-center">
                    {item.image && (
                      <img 
                        src={item.image} 
                        alt={item.name}
                        className="w-12 h-12 object-cover rounded-lg mr-4"
                      />
                    )}
                    <div>
                      <h4 className="font-medium text-neutral-900 dark:text-neutral-100">
                        {item.name}
                      </h4>
                      <p className="text-sm text-neutral-600 dark:text-neutral-400">
                        Quantity: {item.quantity}
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-medium text-neutral-900 dark:text-neutral-100">
                      ${(item.price * item.quantity).toFixed(2)}
                    </p>
                    <p className="text-sm text-neutral-600 dark:text-neutral-400">
                      ${item.price.toFixed(2)} each
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Account Actions */}
      <div className="mt-8 pt-8 border-t border-neutral-200 dark:border-neutral-700">
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link
            to="/products"
            className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-center"
          >
            Continue Shopping
          </Link>
          <button
            onClick={handleLogout}
            className="px-6 py-3 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors cursor-pointer"
          >
            Sign Out
          </button>
        </div>
      </div>
    </div>
  );
}