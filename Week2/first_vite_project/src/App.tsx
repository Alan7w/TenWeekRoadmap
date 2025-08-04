// import reactLogo from './assets/react.svg'
// import viteLogo from '/vite.svg'
import './App.css'
import Dashboard  from './components/Dashboard'
import UserProfile from './components/UserProfile'
import Greeting from './Greetings'
import Counter from './components/Counter'
import Card from './components/Card'
import Button from './components/Button'

function App() {
  return (
    <>
      <div>
        {/*Week2 day 1 Greetings props*/}
        {/* <Greeting name='Alan' message="You are 22 years old!" count={22}/>
        
        <Counter step={2}/> */}


        {/*Week2 day 2 Userprofile*/}
        {/* <UserProfile
          name="Asad"
          avatarUrl={avatarImage}
          email="asad@example.com"
          bio="I am 22 years old!"
        />
        <br />
        <br /> */}


        {/** Week2 day 3 Userprofile useState avatarUrl*/}
        {/* <UserProfile
          name="Alan"
          avatarUrl={avatarImage}
          email="asadkonr@gmail.com"
        />
        <br />
        <br /> */}


        {/* Week 2 day 5 - Card Wrapper and Button */}
        {/* <Card variant="outlined" className='first-custom-class'>
          <h1>This is Outlined Card</h1>
          <p>This is Outlined Card content</p>
        </Card>
        <br />

        <Card variant='elevated' 
        className='second-custom-class' 
        style={{margin: "2px", border: "2px solid magenta"}}>
          <h1>This is Elevated Card</h1>
          <p>This is Elevated Card content</p>
        </Card>
        <br />

        <Card variant='outlined' className='third-custom-class'
        header={<h2>This is the Second Outlined Card optional Header 2</h2>}
        footer={<footer>This is the Second Outlined Card optional Footer</footer>}
        >
          <h1>This is the Second Outlined Card</h1>
          <p>This is the Second Outlined Card content</p>
        </Card>
        <br />

        <Button variant='primary' 
        onClick={() => alert('Primary button clicked')}
        className='first-regular-button'>
          Click Me
        </Button>
        <br />

        <Button variant='secondary' 
        onClick={() => alert('Secondary button clicked')}
        className='second-regular-button'>
          Click Me too
        </Button>
        <br /> */}

        {/* Card with a Button */}
        {/* <Card variant='outlined' className='card-with-button'>
          <h2>Card with a Button</h2>
          <p>This a Card with a primary Button</p>
          <Button variant='primary' onClick={() => alert('Card button clicked')}>
            Click primary button
          </Button>
        </Card> */}



        {/* Week 2 day 6 - Mini Project: Mini Profile App */}
        <Dashboard>
          {/* Welcome Section - Full Width */}
          <Card variant='elevated' className='card-full-width card-content-center'>
            <h2 className='card-header'>Welcome to My Dashboard</h2>
            <Greeting name="Asadkhon" message="Welcome to your personal dashboard!" count={0} />
            <Counter step={1} label="Profile Views" id="profile-views" />
          </Card>
          
          {/* Main Profile Card - Full wide */}
          <Card variant='outlined' className='card-wide card-content-left'>
            <h3 className='card-header'>Profile Information</h3>
            <UserProfile 
              name='Asadkhon Rasulov' 
              email='asadbek09022003@gmail.com'
              bio='UofA student majoring in Computer Science and minoring in Game Design & Development'
            />
          </Card>
          
          {/* Action Buttons Card */}
          <Card variant='elevated' className='card-content-center'>
            <h3 className='card-header'>Quick Actions</h3>
            <div className='card-buttons-grid'>
              <Button variant='primary' onClick={() => alert('Editing profile...')}>
                Edit Profile
              </Button>
              <Button variant='secondary' onClick={() => alert('Viewing settings...')}>
                Settings
              </Button>
              <Button variant='primary' onClick={() =>alert("My phone numbers: 94-273-64-74 & 520-286-2668 and my personal email: asadkhonr@gmail.com")}>
                Contact Me
              </Button>
              <Button variant='secondary' onClick={() => alert("Downloading resume...")}>
                Download Resume
              </Button>
            </div>
          </Card>

          {/* Achievements */}
          <Card variant='outlined' className='card-content-center'>
            <h3 className='card-header'>🏆 Achievements</h3>
            <div className='card-stats'>
              <div>
                <Counter step={1} id="projects-this-year" />
                <p style={{margin: '0.5rem 0 0 0', fontSize: '0.9rem'}}>Projects this year</p>
              </div>
            </div>
          </Card>

          {/* Experience Stats */}
          <Card variant='elevated' className='card-content-center'>
            <h3 className='card-header'>📊 Experience</h3>
            <div className='card-stats'>
              <div>
                <Counter step={5} label="Projects" id="total-projects" />
              </div>
              <div>
                <Counter step={1} label="Years" id="experience-years" />
              </div>
              <div>
                <Counter step={10} label="Skills" id="skills-learned" />
              </div>
            </div>
          </Card>

          {/* About me - Wide */}
          <Card variant='outlined' className='card-wide card-content-left'>
            <h3 className='card-header'>About Me</h3>
            <p>
              UofA student majoring in Computer Science and minoring in Game Design & Development.
              I am 22 years old. I am from Uzbekistan. My purpose is to be a successful person
              both in my career and as a person in this life :)
            </p>
          </Card>
        </Dashboard>


        {/* <a href="https://vite.dev" target="_blank">
          <img src={viteLogo} className="logo" alt="Vite logo" />
        </a>
        <a href="https://react.dev" target="_blank">
          <img src={reactLogo} className="logo react" alt="React logo" />
        </a>
      </div>
      <h1>Vite + React</h1>
      <div className="card"> */}
        {/* <p>
          Edit <code>src/App.tsx</code> and save to test HMR
        </p> */}
      </div>
      {/* <p className="read-the-docs">
        Click on the Vite and React logos to learn more
      </p> */}
    </>
  )
}

export default App