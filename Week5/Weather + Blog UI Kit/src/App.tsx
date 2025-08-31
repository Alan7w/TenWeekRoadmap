import Navbar from "./components/Navbar"
import { Route, Routes } from 'react-router-dom'
import { AnimatePresence } from 'framer-motion'
import HomePage from './pages/HomePage'
import AboutPage from './pages/AboutPage'
import BlogPage from './pages/BlogPage'
import NotFoundPage from './pages/NotFoundPage'
import PostDetail from './pages/PostDetail'
import WeatherApp from "./pages/WeatherApp"

function App() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-sample-50 to-sample-100">
      <Navbar />
      
      <div className="pt-24 px-4 sm:px-6 lg:px-8 pb-8 max-w-7xl mx-auto">
        <AnimatePresence mode="wait">
          <Routes>
            <Route path='/' element={<HomePage />} />
            <Route path='/home' element={<HomePage />} />
            <Route path='/about' element={<AboutPage />} />
            <Route path='/blog' element={<BlogPage />} />
            <Route path='/blog/:id' element={<PostDetail />} />
            <Route path='*' element={<NotFoundPage />} />
            <Route path="/weather" element={<WeatherApp />} />
          </Routes>
        </AnimatePresence>
      </div>
    </div>
  )
}

export default App