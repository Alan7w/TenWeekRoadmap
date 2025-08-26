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
        primary: "bg-blue-600 text-white hover:bg-blue-700 focus:ring-blue-300",
        outlined: "border-2 border-blue-600 text-blue-600 hover:bg-blue-50 focus:ring-blue-300",
        secondary: "bg-slate-200 text-slate-900 hover:bg-slate-300 focus:ring-slate-300"
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