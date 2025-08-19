import Navbar  from "./components/Navbar"
import {Route, Routes} from 'react-router-dom'
import HomePage from './pages/HomePage'
import AboutPage from './pages/AboutPage'
import BlogPage from './pages/BlogPage'
import NotFoundPage from './pages/NotFoundPage'
import PostDetail from './pages/PostDetail'

function App() {
  // Project: Blog App with React Router
  return (
    <>
      <Navbar />
      <div className='main-content'>
          <Routes>
              <Route path='/' element={<HomePage />} />
              <Route path='/home' element={<HomePage />} />
              <Route path='/about' element={<AboutPage />} />
              <Route path='/blog' element={<BlogPage />} />
              <Route path='/blog/:id' element={<PostDetail />} />
              <Route path='*' element={<NotFoundPage />} />
          </Routes>
      </div>
    </>
  )
}

export default App
