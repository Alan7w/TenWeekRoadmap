import { motion } from 'framer-motion'

interface PageTransitionProps {
    children: React.ReactNode
}

const pageVariants = {
    initial: {
        opacity: 0,
        y: 20,
        scale: 0.98
    },
    in: {
        opacity: 1,
        y: 0,
        scale: 1
    },
    out: {
        opacity: 0,
        y: -20,
        scale: 1.02
    }
}

function PageTransition(props: PageTransitionProps) {
    const {children} = props
    return (
        <motion.div
            initial="initial"
            animate="in"
            exit="out"
            variants={pageVariants}
            transition={{ duration: 0.2 }}
        >
            {children}
        </motion.div>
    )
}

export default PageTransition
