import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useToggle } from '../../hooks';
import { useCart, useFavorites, useAuth } from '../../context';
import { Search } from '../ui';

const Header: React.FC = () => {
  const { value: isMobileMenuOpen, toggle: toggleMobileMenu } = useToggle();
  const { getCartItemsCount } = useCart();
  const { getFavoritesCount } = useFavorites();
  const { isAuthenticated, user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const navigation = [
    { name: 'Home', href: '/' },
    { name: 'Clothes', href: '/clothes' },
    { name: 'Shoes', href: '/shoes' },
    { name: 'Accessories', href: '/accessories' },
  ];

  // Helper function to check if a path is active
  const isActivePath = (path: string) => {
    if (path === '/' && (location.pathname === '/' || location.pathname === '/home')) {
      return true;
    }
    return location.pathname === path;
  };

  // Helper function to check if an icon should be active
  const isIconActive = (path: string) => {
    if (path === '/favorites' && location.pathname === '/favorites') {
      return true;
    }
    if (path === '/auth' && (
      location.pathname === '/auth' || 
      (location.pathname.startsWith('/account') && location.pathname !== '/favorites')
    )) {
      return true;
    }
    return location.pathname === path;
  };

  return (
    <header className="bg-white shadow-sm border-b border-gray-200">
      {/* Main Header */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div className="shrink-0">
            <Link to="/" className="flex items-center">
              <span className="text-2xl font-bold text-pink-500 tracking-tight">
                Safari
              </span>
            </Link>
          </div>

          {/* Navigation - Desktop */}
          <nav className="hidden md:flex items-center space-x-8">
            {navigation.map((item) => {
              const isActive = isActivePath(item.href);
              return (
                <Link
                  key={item.name}
                  to={item.href}
                  className={`px-3 py-2 text-sm font-medium transition-colors duration-200 ${
                    isActive
                      ? 'text-pink-500 border-b-2 border-pink-500'
                      : 'text-gray-900 hover:text-pink-500'
                  }`}
                >
                  {item.name}
                </Link>
              );
            })}
          </nav>

          {/* Search Bar */}
          <div className="flex-1 max-w-lg mx-8 hidden md:block">
            <Search />
          </div>

          {/* Right Icons */}
          <div className="flex items-center space-x-4">
            {/* User Account */}
            {isAuthenticated ? (
              <div className="relative group">
                <button
                  className="p-2 text-gray-600 hover:text-pink-500 transition-colors duration-200 hover:cursor-pointer"
                >
                  <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                    />
                  </svg>
                </button>
                
                {/* Dropdown Menu */}
                <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg opacity-0 group-hover:opacity-100 invisible group-hover:visible transition-all duration-200 z-50">
                  <div className="py-1">
                    <div className="px-4 py-2 text-sm text-gray-700 border-b">
                      Hello, {user?.firstName}!
                    </div>
                    <button
                      onClick={() => navigate('/account')}
                      className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 hover:cursor-pointer"
                    >
                      My Account
                    </button>
                    <button
                      onClick={() => navigate('/account/orders')}
                      className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 hover:cursor-pointer"
                    >
                      Order History
                    </button>
                    <button
                      onClick={() => navigate('/account/favorites')}
                      className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 hover:cursor-pointer"
                    >
                      Favorites
                    </button>
                    <hr className="my-1" />
                    <button
                      onClick={() => {
                        logout();
                        navigate('/');
                      }}
                      className="block w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-gray-100 hover:cursor-pointer"
                    >
                      Sign Out
                    </button>
                  </div>
                </div>
              </div>
            ) : (
              <button
                onClick={() => navigate('/auth')}
                className={`p-2 transition-colors duration-200 hover:cursor-pointer ${
                  isIconActive('/auth')
                    ? 'text-pink-500'
                    : 'text-gray-600 hover:text-pink-500'
                }`}
              >
                <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                  />
                </svg>
              </button>
            )}

            {/* Shopping Cart */}
            <button
              onClick={() => navigate('/cart')}
              className={`relative p-2 transition-colors duration-200 hover:cursor-pointer ${
                isIconActive('/cart')
                  ? 'text-pink-500'
                  : 'text-gray-600 hover:text-pink-500'
              }`}
            >
              <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M3 3h2l.4 2M7 13h10l4-8H5.4m2.6 8L6 21h12M6 13v6a1 1 0 001 1h10a1 1 0 001-1v-6M6 13L4 5"
                />
              </svg>
              {/* Cart Count Badge */}
              {getCartItemsCount() > 0 && (
                <span className="absolute -top-1 -right-1 bg-pink-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                  {getCartItemsCount()}
                </span>
              )}
            </button>

            {/* Wishlist/Favorites */}
            <button
              onClick={() => navigate('/favorites')}
              className={`relative p-2 transition-colors duration-200 hover:cursor-pointer ${
                isIconActive('/favorites')
                  ? 'text-pink-500'
                  : 'text-gray-600 hover:text-pink-500'
              }`}
            >
              <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
                />
              </svg>
              {/* Favourites Count Badge */}
              {getFavoritesCount() > 0 && (
                <span className="absolute -top-1 -right-1 bg-pink-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                  {getFavoritesCount()}
                </span>
              )}
            </button>

            {/* Mobile menu button */}
            <button
              onClick={toggleMobileMenu}
              className="md:hidden p-2 text-gray-600 hover:text-pink-500 transition-colors duration-200 hover:cursor-pointer"
            >
              <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 6h16M4 12h16M4 18h16"
                />
              </svg>
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Navigation Menu */}
      {isMobileMenuOpen && (
        <div className="md:hidden border-t border-gray-200">
          <div className="px-4 pt-2 pb-3 space-y-1">
            {/* Mobile Search */}
            <div className="mb-4">
              <Search />
            </div>

            {/* Mobile Navigation Links */}
            {navigation.map((item) => {
              const isActive = isActivePath(item.href);
              return (
                <Link
                  key={item.name}
                  to={item.href}
                  className={`block px-3 py-2 text-base font-medium transition-colors duration-200 ${
                    isActive
                      ? 'text-pink-500 bg-pink-50'
                      : 'text-gray-900 hover:text-pink-500 hover:bg-gray-50'
                  }`}
                  onClick={() => toggleMobileMenu()}
                >
                  {item.name}
                </Link>
              );
            })}
          </div>
        </div>
      )}
    </header>
  );
};

export default Header;