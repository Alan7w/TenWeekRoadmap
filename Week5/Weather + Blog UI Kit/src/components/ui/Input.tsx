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
    onKeyDown?: (e: React.KeyboardEvent<HTMLInputElement>) => void
    onFocus?: (e: React.FocusEvent<HTMLInputElement>) => void
    onBlur?: (e: React.FocusEvent<HTMLInputElement>) => void
}

function Input (props: InputProps) {
    const {id, className, label, type = "text", placeholder, required, ref, onChange, value, onKeyDown, onFocus, onBlur} = props
    const baseClass = "w-full px-3 py-2 border rounded-lg transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500"

    return (
        <div className="w-full">
            <label htmlFor={id} className="block font-medium text-700 mb-1">{label}</label>
            <input 
                id={id}
                value={value}
                className={`${baseClass} ${className}`}
                type={type}  
                placeholder={placeholder} 
                required={required} 
                ref={ref} 
                onChange={onChange}
                onKeyDown={onKeyDown}
                onFocus={onFocus}
                onBlur={onBlur}
            />
        </div>
    )
}

export default Input