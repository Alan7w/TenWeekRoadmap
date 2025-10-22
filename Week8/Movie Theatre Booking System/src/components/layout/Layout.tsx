import React from 'react'

// Container component for consistent page width and padding
interface ContainerProps {
  children: React.ReactNode
  className?: string
  maxWidth?: 'sm' | 'md' | 'lg' | 'xl' | '2xl' | 'full'
}

export const Container = React.memo<ContainerProps>(({
  children,
  className = '',
  maxWidth = 'full'
}) => {
  const maxWidthClasses = {
    sm: 'max-w-screen-sm',
    md: 'max-w-screen-md',
    lg: 'max-w-screen-lg',
    xl: 'max-w-screen-xl',
    '2xl': 'max-w-screen-2xl',
    full: 'max-w-7xl'
  }
  
  return (
    <div className={`mx-auto px-4 sm:px-6 lg:px-8 ${maxWidthClasses[maxWidth]} ${className}`}>
      {children}
    </div>
  )
})

Container.displayName = 'Container'

// Grid component for responsive layouts
interface GridProps {
  children: React.ReactNode
  cols?: 1 | 2 | 3 | 4 | 5 | 6
  gap?: 2 | 3 | 4 | 6 | 8
  className?: string
}

export const Grid = React.memo<GridProps>(({
  children,
  cols = 4,
  gap = 6,
  className = ''
}) => {
  const colClasses = {
    1: 'grid-cols-1',
    2: 'grid-cols-1 md:grid-cols-2',
    3: 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3',
    4: 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4',
    5: 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5',
    6: 'grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6'
  }
  
  const gapClasses = {
    2: 'gap-2',
    3: 'gap-3',
    4: 'gap-4',
    6: 'gap-6',
    8: 'gap-8'
  }
  
  return (
    <div className={`grid ${colClasses[cols]} ${gapClasses[gap]} ${className}`}>
      {children}
    </div>
  )
})

Grid.displayName = 'Grid'

// Stack component for vertical layouts
interface StackProps {
  children: React.ReactNode
  spacing?: 1 | 2 | 3 | 4 | 6 | 8
  className?: string
  align?: 'start' | 'center' | 'end' | 'stretch'
}

export const Stack = React.memo<StackProps>(({
  children,
  spacing = 4,
  className = '',
  align = 'stretch'
}) => {
  const spacingClasses = {
    1: 'space-y-1',
    2: 'space-y-2',
    3: 'space-y-3',
    4: 'space-y-4',
    6: 'space-y-6',
    8: 'space-y-8'
  }
  
  const alignClasses = {
    start: 'items-start',
    center: 'items-center',
    end: 'items-end',
    stretch: 'items-stretch'
  }
  
  return (
    <div className={`flex flex-col ${spacingClasses[spacing]} ${alignClasses[align]} ${className}`}>
      {children}
    </div>
  )
})

Stack.displayName = 'Stack'

// Section component for page sections
interface SectionProps {
  children: React.ReactNode
  className?: string
  background?: 'white' | 'gray' | 'transparent'
  padding?: 'sm' | 'md' | 'lg' | 'xl'
}

export const Section = React.memo<SectionProps>(({
  children,
  className = '',
  background = 'transparent',
  padding = 'lg'
}) => {
  const bgClasses = {
    white: 'bg-white',
    gray: 'bg-gray-50',
    transparent: 'bg-transparent'
  }
  
  const paddingClasses = {
    sm: 'py-4',
    md: 'py-6',
    lg: 'py-8',
    xl: 'py-12'
  }
  
  return (
    <section className={`${bgClasses[background]} ${paddingClasses[padding]} ${className}`}>
      {children}
    </section>
  )
})

Section.displayName = 'Section'

// Card component for content containers
interface CardProps {
  children: React.ReactNode
  className?: string
  padding?: 'sm' | 'md' | 'lg'
  shadow?: 'sm' | 'md' | 'lg' | 'none'
  hover?: boolean
}

export const Card = React.memo<CardProps>(({
  children,
  className = '',
  padding = 'md',
  shadow = 'md',
  hover = false
}) => {
  const paddingClasses = {
    sm: 'p-4',
    md: 'p-6',
    lg: 'p-8'
  }
  
  const shadowClasses = {
    none: '',
    sm: 'shadow-sm',
    md: 'shadow-md',
    lg: 'shadow-lg'
  }
  
  const hoverClass = hover ? 'transition-shadow hover:shadow-lg' : ''
  
  return (
    <div className={`bg-white rounded-lg ${paddingClasses[padding]} ${shadowClasses[shadow]} ${hoverClass} ${className}`}>
      {children}
    </div>
  )
})

Card.displayName = 'Card'