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
      <h1>Weather, Todo & Signup Dashboard</h1>
      <nav>
        <Link to="/"> Home </Link>
        <Link to="/signup"> Sign Up </Link>
        <Link to="/todos"> Todo List </Link>
      </nav>
      <Routes>
        <Route path="/" element={<WeatherPage />} />
        <Route path="/signup" element={<SignUpPage />} />
        <Route path="/todos" element={<TodoListPage/>}/>
      </Routes>
    </>
  )
}

export default App
