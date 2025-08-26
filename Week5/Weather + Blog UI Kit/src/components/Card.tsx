interface CardProps {
    children: React.ReactNode
    variant?: 'outlined' | 'filled' | 'elevated'
    className?: string
}

function Card(props: CardProps) {
    const { children, variant = 'outlined', className = "" } = props

    const baseClasses = "rounded-xl p-6 transition-all duration-300"
    
    const variantClasses = {
        outlined: "border-2 border-sample-200 bg-white/90 backdrop-blur-sm hover:border-sample-400 hover:shadow-lg",
        filled: "bg-sample-100 border border-sample-200 hover:bg-sample-200",
        elevated: "bg-white shadow-lg hover:shadow-xl border border-sample-100"
    }

    const blogCardClasses = "h-80 w-full flex flex-col"

    return (
        <div className={`${baseClasses} ${variantClasses[variant]} ${blogCardClasses} ${className}`}>
            <div className="flex-1 flex flex-col justify-between">
                {children}
            </div>
        </div>
    )
}

export default Card