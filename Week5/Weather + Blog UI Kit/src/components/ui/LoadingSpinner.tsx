import { motion } from "framer-motion"

interface LoadingSpinnerProps {
    size?: "small" | "medium" | "large"
    color?: string
    text?: string
}

function LoadingSpinner (props: LoadingSpinnerProps) {
    const { size = "medium", color = "black", text } = props

    const sizeClasses = {
        small: "w-4 h-4",
        medium: "w-8 h-8",
        large: "w-12 h-12"
    }

    const dotSizes = {
        small: "w-1 h-1",
        medium: "w-2 h-2",
        large: "w-3 h-3"
    }

    return (
        <div className="flex flex-col items-center gap-4">
            {/* pulsing dots */}
            <div className="flex space-x-2">
                {[0, 1, 2].map((index) => (
                    <motion.div
                        key={index}
                        className={`${dotSizes[size]} bg-sample-900 rounded-full`}
                        animate={{
                            scale: [1, 1.3, 1],
                            opacity: [0.6, 1, 0.6]
                        }}
                        transition={{
                            duration: 0.8,
                            repeat: Infinity,
                            delay: index * 0.2
                        }}
                    />
                ))}
            </div>

            {/* spinning circle */}
            <motion.div
                className={`${sizeClasses[size]} border-3 border-sample-200 border-t-sample-600 rounded-full`}
                animate={{ rotate: 360 }}
                transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
            />

            {/* loading text */}
            {text && (
                <motion.p
                    className={`${color} text-sm font-medium`}
                    animate={{ opacity: [0.5, 1, 0.5] }}
                    transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
                >
                    {text}
                </motion.p>
            )}
        </div>
    )
}

export default LoadingSpinner