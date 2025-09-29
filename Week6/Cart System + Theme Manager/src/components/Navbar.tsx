import { useState } from 'react';
import { NavLink } from 'react-router-dom';
import { useUI } from '../contexts/useUI';
import { useCart } from '../contexts/useCart';
import { useAuth } from '../contexts/useAuth';
import ThemeToggle from './ThemeToggle';

export default function Navbar() {
  const { searchQuery, setSearchQuery, isMobileMenuOpen, toggleMobileMenu, closeMobileMenu } = useUI();
  const { getTotalItems } = useCart();
  const { isLoggedIn, currentUser, logout } = useAuth();
  const [showUserMenu, setShowUserMenu] = useState(false);

  return (
    <header className="fixed top-0 left-0 right-0 z-50 w-full border-b border-neutral-200/60 bg-white/95 backdrop-blur supports-[backdrop-filter]:bg-white/90 dark:border-neutral-800 dark:bg-neutral-950/95 dark:supports-[backdrop-filter]:bg-neutral-950/90 shadow-sm">
      <nav className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3">
        {/* Logo */}
        <NavLink 
          to="/" 
          className="flex items-center gap-2 text-xl font-bold text-neutral-900 dark:text-neutral-100 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
        >
          <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
            <span className="text-white text-sm font-bold">M</span>
          </div>
          MiniStore
        </NavLink>

        {/* Search Bar - Hidden on mobile, shown on desktop */}
        <div className="hidden md:flex flex-1 max-w-lg mx-8">
          <div className="relative w-full">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <svg 
                className="h-5 w-5 text-neutral-400" 
                fill="none" 
                stroke="currentColor" 
                viewBox="0 0 24 24"
              >
                <path 
                  strokeLinecap="round" 
                  strokeLinejoin="round" 
                  strokeWidth={2} 
                  d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" 
                />
              </svg>
            </div>
            <input
              type="text"
              placeholder="Search products..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-neutral-300 rounded-lg bg-white dark:bg-neutral-800 dark:border-neutral-600 text-neutral-900 dark:text-neutral-100 placeholder-neutral-500 dark:placeholder-neutral-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
            />
          </div>
        </div>

        {/* Desktop Navigation Links */}
        <div className="hidden md:flex items-center gap-1 text-sm">
          <NavLink
            to="/products"
            className={({ isActive }) =>
              `rounded-lg px-3 py-2 font-medium transition-all hover:bg-neutral-100 dark:hover:bg-neutral-800 ${
                isActive 
                  ? 'text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-950/30' 
                  : 'text-neutral-700 dark:text-neutral-300'
              }`
            }
          >
            Products
          </NavLink>
          
          <NavLink
            to="/cart"
            className={({ isActive }) =>
              `relative rounded-lg px-3 py-2 font-medium transition-all hover:bg-neutral-100 dark:hover:bg-neutral-800 ${
                isActive 
                  ? 'text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-950/30' 
                  : 'text-neutral-700 dark:text-neutral-300'
              }`
            }
          >
            <span className="flex items-center gap-1">
              <svg 
                className="w-4 h-4" 
                fill="none" 
                stroke="currentColor" 
                viewBox="0 0 24 24"
              >
                <path 
                  strokeLinecap="round" 
                  strokeLinejoin="round" 
                  strokeWidth={2} 
                  d="M3 3h2l.4 2M7 13h10l4-8H5.4m0 0L7 13m0 0l-2.5 5H21M7 13v6a2 2 0 002 2h6a2 2 0 002-2v-6" 
                />
              </svg>
              Cart
              {/* Cart count badge - placeholder for future implementation */}
              {getTotalItems() > 0 && (
                <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white text-xs rounded-full flex items-center justify-center font-medium">
                  {getTotalItems()}
                </span>
              )}
            </span>
          </NavLink>
          
          <NavLink
            to="/about"
            className={({ isActive }) =>
              `rounded-lg px-3 py-2 font-medium transition-all hover:bg-neutral-100 dark:hover:bg-neutral-800 ${
                isActive 
                  ? 'text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-950/30' 
                  : 'text-neutral-700 dark:text-neutral-300'
              }`
            }
          >
            About
          </NavLink>

          {/* Authentication & Theme Toggle */}
          <div className="ml-2 pl-2 border-l border-neutral-200 dark:border-neutral-700 flex items-center gap-2">
            {isLoggedIn ? (
              <div className="relative">
                <button
                  onClick={() => setShowUserMenu(!showUserMenu)}
                  className="flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium text-neutral-700 dark:text-neutral-300 hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors cursor-pointer"
                >
                  <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
                    <span className="text-white text-xs font-bold">
                      {currentUser?.firstName.charAt(0).toUpperCase()}{currentUser?.lastName.charAt(0).toUpperCase()}
                    </span>
                  </div>
                  <span className="hidden sm:block">{currentUser?.firstName}</span>
                  <svg className={`w-4 h-4 transition-transform ${showUserMenu ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </button>
                
                {/* User dropdown menu */}
                {showUserMenu && (
                  <div className="absolute right-0 mt-2 w-48 py-2 bg-white dark:bg-neutral-800 rounded-lg shadow-lg border border-neutral-200 dark:border-neutral-700 z-[60]">
                    <div className="px-4 py-2 border-b border-neutral-200 dark:border-neutral-700">
                      <p className="text-sm font-medium text-neutral-900 dark:text-neutral-100">
                        {currentUser?.firstName} {currentUser?.lastName}
                      </p>
                      <p className="text-xs text-neutral-500 dark:text-neutral-400">
                        @{currentUser?.username}
                      </p>
                    </div>
                    <NavLink
                      to="/profile"
                      onClick={() => setShowUserMenu(false)}
                      className="block w-full text-left px-4 py-2 text-sm text-neutral-700 dark:text-neutral-300 hover:bg-neutral-50 dark:hover:bg-neutral-700 transition-colors"
                    >
                      View Profile
                    </NavLink>
                    <button
                      onClick={() => {
                        logout();
                        setShowUserMenu(false);
                      }}
                      className="w-full text-left px-4 py-2 text-sm text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-950/20 transition-colors cursor-pointer"
                    >
                      Sign Out
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <NavLink
                to="/signin"
                className="px-4 py-2 rounded-lg text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 transition-colors"
              >
                Sign In
              </NavLink>
            )}
            <ThemeToggle />
          </div>
        </div>

        {/* Mobile Menu Button & Theme Toggle */}
        <div className="md:hidden flex items-center gap-2">
          <ThemeToggle />
          <button
            onClick={toggleMobileMenu}
            className="p-2 rounded-lg text-neutral-700 dark:text-neutral-300 hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors cursor-pointer"
            aria-label="Toggle mobile menu"
          >
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              {isMobileMenuOpen ? (
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              ) : (
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 6h16M4 12h16M4 18h16"
                />
              )}
            </svg>
          </button>
        </div>
      </nav>

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div className="md:hidden border-t border-neutral-200 dark:border-neutral-800 bg-white/95 dark:bg-neutral-950/95 backdrop-blur-sm">
          <nav className="px-4 py-4 space-y-2">
            <NavLink
              to="/products"
              className={({ isActive }) =>
                `flex items-center px-4 py-3 rounded-xl font-medium text-base transition-all ${
                  isActive 
                    ? 'text-blue-600 dark:text-blue-400 bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-950/50 dark:to-purple-950/50 border border-blue-200 dark:border-blue-800' 
                    : 'text-neutral-700 dark:text-neutral-300 hover:bg-neutral-100 dark:hover:bg-neutral-800 hover:text-blue-600 dark:hover:text-blue-400'
                }`
              }
              onClick={closeMobileMenu}
            >
              <svg className="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
              </svg>
              Products
            </NavLink>
            
            <NavLink
              to="/cart"
              className={({ isActive }) =>
                `flex items-center px-4 py-3 rounded-xl font-medium text-base transition-all ${
                  isActive 
                    ? 'text-blue-600 dark:text-blue-400 bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-950/50 dark:to-purple-950/50 border border-blue-200 dark:border-blue-800' 
                    : 'text-neutral-700 dark:text-neutral-300 hover:bg-neutral-100 dark:hover:bg-neutral-800 hover:text-blue-600 dark:hover:text-blue-400'
                }`
              }
              onClick={closeMobileMenu}
            >
              <div className="relative mr-3">
                <svg 
                  className="w-5 h-5" 
                  fill="none" 
                  stroke="currentColor" 
                  viewBox="0 0 24 24"
                >
                  <path 
                    strokeLinecap="round" 
                    strokeLinejoin="round" 
                    strokeWidth={2} 
                    d="M3 3h2l.4 2M7 13h10l4-8H5.4m0 0L7 13m0 0l-2.5 5H21M7 13v6a2 2 0 002 2h6a2 2 0 002-2v-6" 
                  />
                </svg>
                {getTotalItems() > 0 && (
                  <span className="absolute -top-2 -right-2 w-4 h-4 bg-red-500 text-white text-xs rounded-full flex items-center justify-center font-bold">
                    {getTotalItems()}
                  </span>
                )}
              </div>
              Cart
            </NavLink>
            
            <NavLink
              to="/about"
              className={({ isActive }) =>
                `flex items-center px-4 py-3 rounded-xl font-medium text-base transition-all ${
                  isActive 
                    ? 'text-blue-600 dark:text-blue-400 bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-950/50 dark:to-purple-950/50 border border-blue-200 dark:border-blue-800' 
                    : 'text-neutral-700 dark:text-neutral-300 hover:bg-neutral-100 dark:hover:bg-neutral-800 hover:text-blue-600 dark:hover:text-blue-400'
                }`
              }
              onClick={closeMobileMenu}
            >
              <svg className="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              About
            </NavLink>

            {/* Mobile Authentication */}
            <div className="pt-4 border-t border-neutral-200 dark:border-neutral-700 mt-4">
              {isLoggedIn ? (
                <div className="space-y-2">
                  <div className="px-4 py-2">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
                        <span className="text-white text-sm font-bold">
                          {currentUser?.firstName.charAt(0).toUpperCase()}{currentUser?.lastName.charAt(0).toUpperCase()}
                        </span>
                      </div>
                      <div>
                        <p className="text-sm font-medium text-neutral-900 dark:text-neutral-100">
                          {currentUser?.firstName} {currentUser?.lastName}
                        </p>
                        <p className="text-xs text-neutral-500 dark:text-neutral-400">
                          @{currentUser?.username}
                        </p>
                      </div>
                    </div>
                  </div>
                  <NavLink
                    to="/profile"
                    onClick={closeMobileMenu}
                    className="w-full flex items-center px-4 py-3 rounded-xl font-medium text-base text-neutral-700 dark:text-neutral-300 hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-all"
                  >
                    <svg className="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                    </svg>
                    View Profile
                  </NavLink>
                  <button
                    onClick={() => {
                      logout();
                      closeMobileMenu();
                    }}
                    className="w-full flex items-center px-4 py-3 rounded-xl font-medium text-base text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-950/20 transition-all cursor-pointer"
                  >
                    <svg className="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                    </svg>
                    Sign Out
                  </button>
                </div>
              ) : (
                <NavLink
                  to="/signin"
                  onClick={closeMobileMenu}
                  className="w-full flex items-center justify-center px-4 py-3 rounded-xl font-medium text-base text-white bg-blue-600 hover:bg-blue-700 transition-all"
                >
                  <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                  </svg>
                  Sign In
                </NavLink>
              )}
            </div>
          </nav>
        </div>
      )}

      {/* Click outside to close user menu */}
      {showUserMenu && (
        <div 
          className="fixed inset-0 z-[50]" 
          onClick={() => setShowUserMenu(false)}
        />
      )}
    </header>
  );
}


