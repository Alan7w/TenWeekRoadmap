import { useNavigate } from 'react-router-dom'
import { useState } from 'react'
import Button from './ui/Button'
import ThemeToggle from './ui/ThemeToggle'

function Navbar() {
    const navigate = useNavigate()
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)

    const handleNavigation = (path: string) => {
        navigate(path)
        scrollTo(0, 0) // Scroll to top when navigating
    }

    return (
        <header className="fixed top-0 left-0 right-0 z-50 bg-[var(--navbar-bg)] backdrop-blur-lg border-b border-sample-200 dark:border-sample-800 transition-colors duration-300">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex items-center justify-between h-16">
                    <h1 className="text-xl sm:text-2xl font-bold text-sample-800 dark:text-sample-100">
                        Welcome to my Blog!
                    </h1>

                    <nav className="hidden md:flex items-center space-x-4">
                        <Button 
                            variant='outlined'
                            size='small'
                            onClick={() => handleNavigation('/')}
                            className="border-sample-600 text-sample-700 dark:border-sample-400 dark:text-sample-200 hover:bg-sample-50 dark:hover:bg-sample-800"
                        >
                            Home
                        </Button>

                        <Button
                            variant='outlined'
                            size='small'
                            onClick={() => handleNavigation('/about')}
                            className="border-sample-600 text-sample-700 dark:border-sample-400 dark:text-sample-200 hover:bg-sample-50 dark:hover:bg-sample-800"
                        >
                            About
                        </Button>

                        <Button
                            variant='outlined'
                            size='small'
                            onClick={() => handleNavigation('/blog')}
                            className="border-sample-600 text-sample-700 dark:border-sample-400 dark:text-sample-200 hover:bg-sample-50 dark:hover:bg-sample-800"
                        >
                            Blog
                        </Button>

                        <Button
                            variant='primary'
                            size='small'
                            onClick={() => handleNavigation('/weather')}
                            className="bg-sample-600 hover:bg-sample-700 text-white"
                        >
                            Weather
                        </Button>
                        
                        <ThemeToggle />
                    </nav>

                    <div className="md:hidden flex items-center space-x-2">
                        <ThemeToggle />
                        
                        <Button
                            variant='outlined'
                            size='small'
                            className="border-sample-600 text-sample-700 dark:border-sample-400 dark:text-sample-200"
                            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                        >
                            {isMobileMenuOpen ? 'Close' : 'Menu'}
                        </Button>
                    </div>
                </div>

                {/* Mobile menu */}
                {isMobileMenuOpen && (
                    <div className='md:hidden absolute top-full left-0 right-0 bg-[var(--navbar-bg)] backdrop-blur-lg border-b border-sample-200 dark:border-sample-800 shadow-lg'>
                        <nav className="flex flex-col p-4 px-4 py-4 space-y-2">
                            <Button
                                variant='outlined'
                                size='small'
                                onClick={() => handleNavigation('/')}
                                className="border-sample-600 text-sample-700 dark:border-sample-400 dark:text-sample-200 hover:bg-sample-50 dark:hover:bg-sample-800"
                            >
                                Home
                            </Button>

                            <Button
                                variant='outlined'
                                size='small'
                                onClick={() => handleNavigation('/about')}
                                className="border-sample-600 text-sample-700 dark:border-sample-400 dark:text-sample-200 hover:bg-sample-50 dark:hover:bg-sample-800"
                            >
                                About
                            </Button>

                            <Button
                                variant='outlined'
                                size='small'
                                onClick={() => handleNavigation('/blog')}
                                className="border-sample-600 text-sample-700 dark:border-sample-400 dark:text-sample-200 hover:bg-sample-50 dark:hover:bg-sample-800"
                            >
                                Blog
                            </Button>

                            <Button
                                variant='primary'
                                size='small'
                                onClick={() => handleNavigation('/weather')}
                                className="bg-sample-600 hover:bg-sample-700 text-white"
                            >
                                Weather
                            </Button>
                        </nav>
                    </div>
                )}
            </div>
        </header>
    )
}

export default Navbar