import { useState, useEffect } from "react"
import {motion, AnimatePresence} from "framer-motion"

function ScrollToTop () {
    const [isVisible, setIsVisible] = useState(false)

    useEffect(() => {
        const toggleVisibility = () => {
            setIsVisible(window.pageYOffset > 300)
        }

        window.addEventListener('scroll', toggleVisibility)
        return () => window.removeEventListener('scroll', toggleVisibility)
    }, [])

    const scrollToTop = () => {
        window.scrollTo({
            top: 0,
            behavior: "smooth"
        })
    }

    return (
        <AnimatePresence>
            {isVisible && (
                <motion.button
                    initial={{ opacity: 0, scale: 0, y: 20 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0, y: 20 }}
                    onClick={scrollToTop}
                    className="fixed bottom-8 right-8 z-50 bg-sample-600 text-white p-3 rounded-full shadow-lg hover:bg-sample-700 transition-colors duration-200"
                    whileHover={{ scale: 1.1, y: -2 }}
                    whileTap={{ scale: 0.9 }}
                >
                    <motion.svg
                        className="w-6 h-6"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                        animate={{y: [0, -3, 0]}}
                        transition={{duration: 1.5, repeat: Infinity}}
                    >
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 10l7-7m0 0l7 7m-7-7v18" />
                    </motion.svg>
                </motion.button>
            )}
        </AnimatePresence>
    )
}

export default ScrollToTop