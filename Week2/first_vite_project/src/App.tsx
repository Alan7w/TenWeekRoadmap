import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import UserProfile from './components/UserProfile'
import Greeting from './Greetings'
import Counter from './components/Counter'
import avatarImage from '../images/avatarImage.png'

function App() {
  return (
    <>
      <div>
        {/*Week2 day 2 Userprofile*/}
        <UserProfile
          name="Asad"
          avatarUrl={avatarImage}
          email="asad@example.com"
          bio="I am 22 years old!"
        />

        {/** Week2 day 3 Userprofile useState avatarUrl*/}
        <UserProfile
          name="Alan"
          avatarUrl={avatarImage}
          email="asadkonr@gmail.com"
        />
        <a href="https://vite.dev" target="_blank">
          <img src={viteLogo} className="logo" alt="Vite logo" />
        </a>
        <a href="https://react.dev" target="_blank">
          <img src={reactLogo} className="logo react" alt="React logo" />
        </a>
      </div>
      <h1>Vite + React</h1>
      <div className="card">
        {/*Week2 day 1 Greetings props*/}
        <Greeting name='Alan' message="You are 22 years old!" count={22}/>
        <Counter step={2}/>
        <p>
          Edit <code>src/App.tsx</code> and save to test HMR
        </p>
      </div>
      <p className="read-the-docs">
        Click on the Vite and React logos to learn more
      </p>
    </>
  )
}

export default App
