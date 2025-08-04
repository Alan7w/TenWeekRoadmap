
interface CardProps {
    children: React.ReactNode
    header?: React.ReactNode
    footer?: React.ReactNode
    variant: 'elevated' | 'outlined'
    className?: string
    style?: React.CSSProperties
}

const cardStyleMap = {
  elevated: {
    boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
    background: 'darkgrey',
    padding: '1.5rem',
    borderRadius: '0.75rem',
    display: 'flex',
    flexDirection: 'column' as const,
    gap: '1rem',
    height: 'fit-content'
  },
  outlined: {
    border: '1px solid #ddd',
    background: 'darkgrey',
    padding: '1.5rem',
    borderRadius: '0.75rem',
    display: 'flex',
    flexDirection: 'column' as const,
    gap: '1rem',
    height: 'fit-content'
  },
}

function Card (props: CardProps) {
    const {children, header, footer, variant, className="", style} = props

    const baseStyle = cardStyleMap[variant]
    const combinedStyle = {...style, ...baseStyle}

    return (
        <div style={combinedStyle} className={className}>
            {header}
            {children}
            {footer}
        </div>
    )
}

export default Card