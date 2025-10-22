import React, { forwardRef } from 'react'

// Input variant types
type InputVariant = 'default' | 'error' | 'success'
type InputSize = 'sm' | 'md' | 'lg'

// Input props interface - exclude size to avoid conflicts
interface InputProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'size'> {
  variant?: InputVariant
  inputSize?: InputSize
  label?: string
  error?: string
  helperText?: string
  leftIcon?: React.ReactNode
  rightIcon?: React.ReactNode
  fullWidth?: boolean
}

// Input component with forwardRef for form libraries
export const Input = React.memo(forwardRef<HTMLInputElement, InputProps>(({
  variant = 'default',
  inputSize = 'md',
  label,
  error,
  helperText,
  leftIcon,
  rightIcon,
  fullWidth = false,
  className = '',
  id,
  ...props
}, ref) => {
  // Generate unique ID if not provided
  const inputId = id || `input-${Math.random().toString(36).substr(2, 9)}`
  
  // Base input styles
  const baseStyles = 'block w-full border rounded-md shadow-sm focus:outline-none focus:ring-1 transition-colors'
  
  // Variant styles
  const variantStyles: Record<InputVariant, string> = {
    default: 'border-gray-300 focus:border-blue-500 focus:ring-blue-500',
    error: 'border-red-300 focus:border-red-500 focus:ring-red-500',
    success: 'border-green-300 focus:border-green-500 focus:ring-green-500'
  }
  
  // Size styles
  const sizeStyles: Record<InputSize, string> = {
    sm: 'px-3 py-1.5 text-sm',
    md: 'px-3 py-2 text-sm',
    lg: 'px-4 py-3 text-base'
  }
  
  // Icon padding styles
  const iconPadding = {
    left: leftIcon ? (inputSize === 'lg' ? 'pl-10' : 'pl-9') : '',
    right: rightIcon ? (inputSize === 'lg' ? 'pr-10' : 'pr-9') : ''
  }
  
  // Combine input styles
  const inputClasses = [
    baseStyles,
    variantStyles[error ? 'error' : variant],
    sizeStyles[inputSize],
    iconPadding.left,
    iconPadding.right,
    className
  ].filter(Boolean).join(' ')
  
  return (
    <div className={fullWidth ? 'w-full' : ''}>
      {/* Label */}
      {label && (
        <label
          htmlFor={inputId}
          className="block text-sm font-medium text-gray-700 mb-1"
        >
          {label}
        </label>
      )}
      
      {/* Input container */}
      <div className="relative">
        {/* Left icon */}
        {leftIcon && (
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <span className="text-gray-400">
              {leftIcon}
            </span>
          </div>
        )}
        
        {/* Input field */}
        <input
          ref={ref}
          id={inputId}
          className={inputClasses}
          {...props}
        />
        
        {/* Right icon */}
        {rightIcon && (
          <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
            <span className="text-gray-400">
              {rightIcon}
            </span>
          </div>
        )}
      </div>
      
      {/* Error message */}
      {error && (
        <p className="mt-1 text-sm text-red-600">
          {error}
        </p>
      )}
      
      {/* Helper text */}
      {helperText && !error && (
        <p className="mt-1 text-sm text-gray-500">
          {helperText}
        </p>
      )}
    </div>
  )
}))

Input.displayName = 'Input'