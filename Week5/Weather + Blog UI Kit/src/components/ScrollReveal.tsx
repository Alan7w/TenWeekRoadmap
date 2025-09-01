import { motion } from "framer-motion"
import {useScrollAnimation} from '../hooks/useScrollAnimation'

interface ScrollRevealProps {
    children: React.ReactNode
    direction?: "up" | "down" | "left" | "right"
    delay?: number
    duration?: number
    className?: string
}

function ScrollReveal (props: ScrollRevealProps) {
    const {children, direction = "up", delay = 0, duration = 0.6, className = ""} = props
    const {ref, isInView} = useScrollAnimation({threshold: 0.2})

    const directions = {
        up: {y: 50, x: 0},
        down: {y: -50, x: 0},
        left: {x: 50, y: 0},
        right: {x: -50, y: 0}
    }

    const startPosition = directions[direction]

    return (
        <motion.div
            ref={ref}
            className={className}
            initial={{
                opacity: 0, 
                ...startPosition,
                scale: 0.95
            }}
            animate={isInView ? {
                opacity: 1, 
                x: 0,
                y: 0, 
                scale: 1
            } : {}}
            transition={{
                delay, 
                duration,
                ease: [0.25, 0.25, 0.25, 0.75]
            }}
        >
            {children}
        </motion.div>
    )
}

export default ScrollReveal