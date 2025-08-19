import {useNavigate} from 'react-router-dom'
import '../App.css'

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

                    <button 
                        className='nav-link'
                        onClick={() => handleNavigation('/')}
                    >
                        Home
                    </button>

                    <button
                        className='nav-link'
                        onClick={() => handleNavigation('/about')}
                    >
                        About
                    </button>

                    <button
                        className='nav-link'
                        onClick={() => handleNavigation('/blog')}
                    >
                        Blog
                    </button>
                </nav>
            </header>
        </div>
    )
}

export default Navbar