import {useNavigate} from 'react-router-dom'
import '../App.css'
import Button from './ui/Button'

function Navbar () {
    const navigate = useNavigate()

    const handleNavigation = (path: string) => {
        navigate(path)
        scrollTo(0, 0) // Scroll to top when navigating
    }

    return (
        <div>
            <header className='app-header'>
                <h1 className='dashboard-title'>Welcome to my Blog! :)</h1>
                <nav className='nav-links'>
                    {/* <NavLink className='nav-link' to='/'>Home</NavLink>
                    <NavLink className='nav-link' to='/about'>About</NavLink>
                    <NavLink className='nav-link' to='/blog'>Blog</NavLink> */}

                    <Button 
                        variant='outlined'
                        size='small'
                        onClick={() => handleNavigation('/')}
                    >
                        Home
                    </Button>

                    <Button
                        variant='outlined'
                        size='small'
                        onClick={() => handleNavigation('/about')}
                    >
                        About
                    </Button>

                    <Button
                        variant='outlined'
                        size='small'
                        onClick={() => handleNavigation('/blog')}
                    >
                        Blog
                    </Button>

                    <Button
                        variant='outlined'
                        size='small'
                        onClick={() => handleNavigation('/weather')}
                    >
                        Weather
                    </Button>
                </nav>
            </header>
        </div>
    )
}

export default Navbar