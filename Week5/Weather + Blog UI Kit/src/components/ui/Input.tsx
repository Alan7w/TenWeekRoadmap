interface InputProps {
    id: string
    value?: string
    className?: string
    label?: string | React.ReactNode
    type?: string
    placeholder?: string
    required?: boolean
    ref?: React.Ref<HTMLInputElement>
    onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void
}

function Input (props: InputProps) {
    const {id, className, label, type = "text", placeholder, required, ref, onChange, value} = props
    const baseClass = "w-full px-3 py-2 border rounded-lg transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500"

    return (
        <div className="w-full">
            <label htmlFor={id} className="block text-md font-medium text-aquamarine-700 mb-1">{label}</label>
            <input 
                id={id}
                value={value}
                className={`${baseClass} ${className}`}
                type={type}  
                placeholder={placeholder} 
                required={required} 
                ref={ref} 
                onChange={onChange}
            />
        </div>
    )
}

export default Input