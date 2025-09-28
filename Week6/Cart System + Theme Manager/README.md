# MiniStore - Cart System + Theme Manager

A modern, responsive marketplace built with React, TypeScript, and Tailwind CSS, demonstrating advanced Context API patterns and modern web development practices.

## 🚀 Features

### ✅ **Completed (Day 1)**
- **Theme Management**: Complete light/dark mode with system preference detection
- **Mobile-Responsive Design**: Hamburger menu for mobile navigation
- **Context API Integration**: Multiple contexts working together seamlessly
- **Beautiful UI**: Purple gradient branding across all pages
- **Cart System Foundation**: Context-based cart state management
- **Search Functionality**: Global search state management

## 🏗️ **Architecture & Context API Usage**

This project demonstrates proper React Context API usage with multiple contexts:

### 1. **ThemeContext** (`src/contexts/ThemeContext.tsx`)
Manages application theme state with localStorage persistence.

```tsx
const { theme, toggleTheme } = useTheme();
```

**Features:**
- Automatic system preference detection
- localStorage persistence  
- Document class application for CSS theming
- Type-safe with TypeScript

### 2. **UIContext** (`src/contexts/UIContext.tsx`)
Manages global UI state like mobile menu and search.

```tsx
const { 
  isMobileMenuOpen, 
  toggleMobileMenu, 
  closeMobileMenu,
  searchQuery, 
  setSearchQuery 
} = useUI();
```

**Features:**
- Mobile menu state management
- Global search query state
- Centralized UI interactions

### 3. **CartContext** (`src/contexts/CartContext.tsx`)
Manages shopping cart state with localStorage persistence.

```tsx
const { 
  items, 
  addItem, 
  removeItem, 
  getTotalItems, 
  getTotalPrice 
} = useCart();
```

**Features:**
- Add/remove items from cart
- Quantity management
- Total calculations
- localStorage persistence
- Type-safe cart operations

## 🎨 **Design System & Context Integration**

If you are developing a production application, we recommend updating the configuration to enable type-aware lint rules:

```js
export default tseslint.config([
  globalIgnores(['dist']),
  {
    files: ['**/*.{ts,tsx}'],
    extends: [
      // Other configs...

      // Remove tseslint.configs.recommended and replace with this
      ...tseslint.configs.recommendedTypeChecked,
      // Alternatively, use this for stricter rules
      ...tseslint.configs.strictTypeChecked,
      // Optionally, add this for stylistic rules
      ...tseslint.configs.stylisticTypeChecked,

      // Other configs...
    ],
    languageOptions: {
      parserOptions: {
        project: ['./tsconfig.node.json', './tsconfig.app.json'],
        tsconfigRootDir: import.meta.dirname,
      },
      // other options...
    },
  },
])
```

You can also install [eslint-plugin-react-x](https://github.com/Rel1cx/eslint-react/tree/main/packages/plugins/eslint-plugin-react-x) and [eslint-plugin-react-dom](https://github.com/Rel1cx/eslint-react/tree/main/packages/plugins/eslint-plugin-react-dom) for React-specific lint rules:

```js
// eslint.config.js
import reactX from 'eslint-plugin-react-x'
import reactDom from 'eslint-plugin-react-dom'

export default tseslint.config([
  globalIgnores(['dist']),
  {
    files: ['**/*.{ts,tsx}'],
    extends: [
      // Other configs...
      // Enable lint rules for React
      reactX.configs['recommended-typescript'],
      // Enable lint rules for React DOM
      reactDom.configs.recommended,
    ],
    languageOptions: {
      parserOptions: {
        project: ['./tsconfig.node.json', './tsconfig.app.json'],
        tsconfigRootDir: import.meta.dirname,
      },
      // other options...
    },
  },
])
```
