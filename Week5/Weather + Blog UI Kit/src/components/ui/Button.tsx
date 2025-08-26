interface ButtonProps {
    className?: string
    children: React.ReactNode
    variant?: "primary" | "secondary" | "outlined"
    type?: "button" | "submit" | "reset"
    disabled?: boolean
    onClick?: () => void
    size?: "small" | "medium" | "large"
}

function Button (props: ButtonProps) {
    const {
        className = "", 
        children, 
        variant = "primary",
        type = "button", 
        disabled = false, 
        onClick, 
        size = "medium"
    } = props

    const baseClass = "font-medium rounded-lg transition-all duration-200 cursor-pointer focus:outline-none focus:ring-4 disabled:opacity-50 disabled:cursor-not-allowed"

    const variantClasses = {
        primary: "bg-sample-600 text-white hover:bg-sample-700 focus:ring-sample-300",
        outlined: "border-2 border-sample-600 text-sample-600 hover:bg-sample-50 focus:ring-sample-300",
        secondary: "bg-sample-100 text-sample-800 hover:bg-sample-200 focus:ring-sample-300"
    }
    
    const sizeClasses = {
        small: "px-3 py-1.5 text-sm",
        medium: "px-4 py-2 text-base",
        large: "px-6 py-3 text-lg"
    }

    return (
        <button
            className={`${baseClass} ${variantClasses[variant]} ${sizeClasses[size]} ${className}`}
            type={type}
            disabled={disabled}
            onClick={onClick}
        >
            {children}
        </button>
    )
}

export default Button