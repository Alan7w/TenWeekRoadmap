import './App.css'
import { Routes, Route } from 'react-router-dom'
import Navbar from './components/Navbar'
import UserPreferenceSync from './components/UserPreferenceSync'
import Home from './pages/Home'
import Products from './pages/Products'
import Cart from './pages/Cart'
import About from './pages/About'
import SignIn from './pages/SignIn'
import UserProfile from './pages/UserProfile'
import NotFound from './pages/NotFound'

function App() {
  
  return (
    <>
      <UserPreferenceSync />
      <Navbar />
      <main className="pt-20 min-h-screen bg-white text-neutral-900 dark:bg-neutral-950 dark:text-neutral-100 transition-colors duration-200">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/home" element={<Home />} />
          <Route path="/products" element={<Products />} />
          <Route path="/cart" element={<Cart />} />
          <Route path="/about" element={<About />} />
          <Route path="/signin" element={<SignIn />} />
          <Route path="/profile" element={<UserProfile />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </main>
    </>
  )
}

export default App
