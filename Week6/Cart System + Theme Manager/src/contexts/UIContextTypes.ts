import { createContext } from 'react';

export interface UIContextType {
  isMobileMenuOpen: boolean;
  toggleMobileMenu: () => void;
  closeMobileMenu: () => void;
  searchQuery: string;
  setSearchQuery: (query: string) => void;
}

export const UIContext = createContext<UIContextType | undefined>(undefined);