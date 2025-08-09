import './App.css'
import {Link, Route, Routes} from 'react-router-dom'
import HomePage from './pages/HomePage'
import AboutPage from './pages/AboutPage'
import BlogPage from './pages/BlogPage'
import NotFoundPage from './pages/NotFoundPage'

function App() {
  // Project: Blog App with React Router
  return (
    <>
      <header className='app-header'>
        <h1 className='app-title'>Welcome to my Blog! :)</h1>
        <nav className='nav-links'>
          <Link className='nav-link' to='/'>Home</Link>
          <Link className='nav-link' to='/about'>About</Link>
          <Link className='nav-link' to='/blog'>Blog</Link>
        </nav>
      </header>
      
      <div className='main-content'>
        <Routes>
          <Route path='/' element={<HomePage />} />
          <Route path='/home' element={<HomePage />} />
          <Route path='/about' element={<AboutPage />} />
          <Route path='/blog' element={<BlogPage />} />
          <Route path='*' element={<NotFoundPage />} />
        </Routes>
      </div>
    </>
  )
}

export default App
