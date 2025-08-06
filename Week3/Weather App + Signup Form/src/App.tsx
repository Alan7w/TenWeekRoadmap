import './App.css'
import CatFacts from './components/CatFacts'
import WeatherApp from './components/WeatherApp'
import SignUpForm from './components/SignUpForm'

function App() {

  return (
    <>
      <h1>Weather App and Signup Form</h1>
      <p>Welcome to the Weather App and Signup Form project!</p>

      <CatFacts>
      </CatFacts>

      <WeatherApp></WeatherApp>

      <SignUpForm></SignUpForm>
    </>
  )
}

export default App
