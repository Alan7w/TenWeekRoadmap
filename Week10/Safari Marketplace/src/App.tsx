import { Routes, Route } from 'react-router-dom';
import './App.css';

// Context Provider
import { AppProvider } from './context';

// Layout components
import { Header, Footer } from './components';

// Pages
import Home from './pages/Home';
import Clothes from './pages/Clothes';
import Shoes from './pages/Shoes';
import Accessories from './pages/Accessories';
import Cart from './pages/Cart';
import Checkout from './pages/Checkout';
import Auth from './pages/Auth';
import Account from './pages/Account';
import Favorites from './pages/Favorites';
import NotFound from './pages/NotFound';

function App() {
  return (
    <AppProvider>
      <div className="min-h-screen bg-white flex flex-col">
        <Header />
        
        <main className="grow">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/home" element={<Home />} />
            <Route path="/clothes" element={<Clothes />} />
            <Route path="/shoes" element={<Shoes />} />
            <Route path="/accessories" element={<Accessories />} />
            <Route path="/cart" element={<Cart />} />
            <Route path="/favorites" element={<Favorites />} />
            <Route path="/checkout" element={<Checkout />} />
            <Route path="/auth" element={<Auth />} />
            <Route path="/account/*" element={<Account />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </main>
        
        <Footer />
      </div>
    </AppProvider>
  );
}

export default App;
