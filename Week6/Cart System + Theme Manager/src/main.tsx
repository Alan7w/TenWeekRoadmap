import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import { AuthProvider } from './contexts/AuthContext'
import { ThemeProvider } from './contexts/ThemeContext'
import { UIProvider } from './contexts/UIContext'
import { CartProvider } from './contexts/CartContext'
import { BrowserRouter } from 'react-router-dom'

createRoot(document.getElementById('root')!).render(
  <BrowserRouter>
    <AuthProvider>
      <ThemeProvider>
        <UIProvider>
          <CartProvider>
            <App />
          </CartProvider>
        </UIProvider>
      </ThemeProvider>
    </AuthProvider>
  </BrowserRouter>,
)
