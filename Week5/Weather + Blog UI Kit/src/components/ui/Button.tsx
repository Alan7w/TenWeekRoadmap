import { motion } from "framer-motion"

interface ButtonProps {
    children: React.ReactNode
    variant?: "primary" | "secondary" | "outlined"
    size?: "small" | "medium" | "large"
    disabled?: boolean
    onClick?: () => void
    className?: string
    type?: "button" | "submit" | "reset"
    icon?: React.ReactNode
    loading?: boolean
}

function Button (props: ButtonProps) {
    const {
        children, 
        variant = "primary",
        size = "medium",
        disabled = false,
        onClick,
        className = "",
        type = "button",
        icon,
        loading = false
    } = props

    const baseClass = "font-medium cursor-pointer rounded-lg focus:outline-none focus:ring-4 disabled:opacity-50 disabled:cursor-not-allowed relative overflow-hidden"

    const variantClasses = {
        primary: "bg-sample-600 text-white hover:bg-sample-700 focus:ring-sample-300",
        secondary: "bg-sample-200 text-sample-900 hover:bg-sample-300 focus:ring-sample-300",
        outlined: "border-2 border-sample-600 text-sample-600 hover:bg-sample-50 focus:ring-sample-300"
    }
    
    const sizeClasses = {
        small: "px-3 py-1.5 text-sm",
        medium: "px-4 py-2 text-base",
        large: "px-6 py-3 text-lg"
    }

    return (
        <motion.button
            className={`${baseClass} ${variantClasses[variant]} ${sizeClasses[size]} ${className}`}
            type={type}
            disabled={disabled || loading}
            onClick={onClick}
            whileHover={disabled ? {} : { 
                scale: 1.02,
                y: -2,
                transition: { duration: 0.2 }
            }}
            whileTap={disabled ? {} : { 
                scale: 0.98,
                y: 0,
                transition: { duration: 0.1 }
            }}
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.3 }}
        >
            {/* Ripple effect background */}
            <motion.div
                className="absolute inset-0 bg-white/20 rounded-lg"
                initial={{ scale: 0, opacity: 0 }}
                whileHover={disabled ? {} : {
                    scale: 1,
                    opacity: [0, 0.3, 0],
                    transition: { duration: 0.6 }
                }}
            />
            
            {/* Button content */}
            <motion.div 
                className="relative z-10 flex items-center justify-center gap-2"
                initial={{ y: 0 }}
                whileHover={disabled ? {} : { y: -1 }}
                transition={{ duration: 0.2 }}
            >
                {loading && (
                    <motion.div
                        animate={{ rotate: 360 }}
                        transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                        className="w-4 h-4 border-2 border-current border-t-transparent rounded-full"
                    />
                )}
                {!loading && icon && (
                    <motion.span
                        initial={{ scale: 1 }}
                        whileHover={{ scale: 1.1 }}
                        transition={{ duration: 0.2 }}
                    >
                        {icon}
                    </motion.span>
                )}
                <span>{loading ? 'Loading...' : children}</span>
            </motion.div>
            
            {/* Shine effect */}
            <motion.div
                className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent -skew-x-12"
                initial={{ x: '-100%' }}
                whileHover={disabled ? {} : {
                    x: '200%',
                    transition: { duration: 0.8 }
                }}
            />
        </motion.button>
    )
}

export default Button