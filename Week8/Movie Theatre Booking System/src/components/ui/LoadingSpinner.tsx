import React from 'react'

// Spinner size types
type SpinnerSize = 'xs' | 'sm' | 'md' | 'lg' | 'xl'
type SpinnerVariant = 'default' | 'primary' | 'white'

// Loading spinner props
interface LoadingSpinnerProps {
  size?: SpinnerSize
  variant?: SpinnerVariant
  className?: string
  label?: string
  center?: boolean
}

// Loading spinner component with React.memo
export const LoadingSpinner = React.memo<LoadingSpinnerProps>(({
  size = 'md',
  variant = 'default',
  className = '',
  label = 'Loading...',
  center = false
}) => {
  // Size styles
  const sizeStyles: Record<SpinnerSize, string> = {
    xs: 'h-3 w-3',
    sm: 'h-4 w-4',
    md: 'h-6 w-6',
    lg: 'h-8 w-8',
    xl: 'h-12 w-12'
  }
  
  // Variant styles
  const variantStyles: Record<SpinnerVariant, string> = {
    default: 'text-gray-600',
    primary: 'text-blue-600',
    white: 'text-white'
  }
  
  // Container styles
  const containerClasses = [
    center ? 'flex items-center justify-center' : 'inline-flex items-center',
    className
  ].filter(Boolean).join(' ')
  
  // Spinner classes
  const spinnerClasses = [
    'animate-spin',
    sizeStyles[size],
    variantStyles[variant]
  ].join(' ')
  
  return (
    <div className={containerClasses} role="status" aria-label={label}>
      <svg
        className={spinnerClasses}
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 24 24"
      >
        <circle
          className="opacity-25"
          cx="12"
          cy="12"
          r="10"
          stroke="currentColor"
          strokeWidth="4"
        />
        <path
          className="opacity-75"
          fill="currentColor"
          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
        />
      </svg>
      <span className="sr-only">{label}</span>
    </div>
  )
})

LoadingSpinner.displayName = 'LoadingSpinner'

// Full page loading component
interface FullPageLoadingProps {
  message?: string
  size?: SpinnerSize
}

export const FullPageLoading = React.memo<FullPageLoadingProps>(({
  message = 'Loading...',
  size = 'lg'
}) => (
  <div className="fixed inset-0 bg-white bg-opacity-80 flex items-center justify-center z-50">
    <div className="text-center">
      <LoadingSpinner size={size} variant="primary" center />
      <p className="mt-4 text-gray-600 text-lg">{message}</p>
    </div>
  </div>
))

FullPageLoading.displayName = 'FullPageLoading'

// Inline loading component for buttons or small areas
interface InlineLoadingProps {
  size?: SpinnerSize
  text?: string
  variant?: SpinnerVariant
}

export const InlineLoading = React.memo<InlineLoadingProps>(({
  size = 'sm',
  text = 'Loading...',
  variant = 'default'
}) => (
  <div className="inline-flex items-center space-x-2">
    <LoadingSpinner size={size} variant={variant} />
    {text && <span className="text-sm text-gray-600">{text}</span>}
  </div>
))

InlineLoading.displayName = 'InlineLoading'

// Skeleton loading component for content placeholders
interface SkeletonProps {
  width?: string | number
  height?: string | number
  className?: string
  rounded?: boolean
}

export const Skeleton = React.memo<SkeletonProps>(({
  width = '100%',
  height = '1rem',
  className = '',
  rounded = false
}) => {
  const styles = {
    width: typeof width === 'number' ? `${width}px` : width,
    height: typeof height === 'number' ? `${height}px` : height
  }
  
  const skeletonClasses = [
    'animate-pulse bg-gray-200',
    rounded ? 'rounded-full' : 'rounded',
    className
  ].filter(Boolean).join(' ')
  
  return <div className={skeletonClasses} style={styles} />
})

Skeleton.displayName = 'Skeleton'

// Skeleton text component for multiple lines
interface SkeletonTextProps {
  lines?: number
  className?: string
}

export const SkeletonText = React.memo<SkeletonTextProps>(({
  lines = 3,
  className = ''
}) => (
  <div className={`space-y-2 ${className}`}>
    {Array.from({ length: lines }).map((_, index) => (
      <Skeleton
        key={index}
        height="1rem"
        width={index === lines - 1 ? '75%' : '100%'}
      />
    ))}
  </div>
))

SkeletonText.displayName = 'SkeletonText'