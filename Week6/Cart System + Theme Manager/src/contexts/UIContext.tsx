import { useState } from 'react';
import { UIContext } from './UIContextTypes';

interface UIProviderProps {
  children: React.ReactNode;
}

export function UIProvider({ children }: UIProviderProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

  const toggleMobileMenu = () => setMobileMenuOpen(prev => !prev);
  const closeMobileMenu = () => setMobileMenuOpen(false);

  return (
    <UIContext.Provider 
      value={{ 
        isMobileMenuOpen: mobileMenuOpen, 
        toggleMobileMenu, 
        closeMobileMenu,
        searchQuery: searchTerm,
        setSearchQuery: setSearchTerm 
      }}
    >
      {children}
    </UIContext.Provider>
  );
}