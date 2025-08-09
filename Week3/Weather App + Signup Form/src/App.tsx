import './App.css'
// import CatFacts from './components/CatFacts'
import { Link, Route, Routes} from 'react-router-dom'
import WeatherPage from './pages/WeatherPage'
import SignUpPage from './pages/SigUpPage'
import TodoListPage from './pages/TodoListPage'

function App() {
  // Project: Weather, Todo & Signup Dashboard
  return (
    <>
      <header className='app-header'>
        <h1 className='dashboard-title'>Weather, Todo & Signup Dashboard</h1>
        <nav className='nav-links'>
          <Link className='nav-link' to="/"> Home </Link>
          <Link className='nav-link' to="/signup"> Sign Up </Link>
          <Link className='nav-link' to="/todos"> Todo List </Link>
        </nav>
      </header>
      <div className='main-content'>
        <Routes>
          <Route path="/" element={<WeatherPage />} />
          <Route path="/signup" element={<SignUpPage />} />
          <Route path="/todos" element={<TodoListPage/>}/>
        </Routes>
      </div>
    </>
  )
}

export default App
