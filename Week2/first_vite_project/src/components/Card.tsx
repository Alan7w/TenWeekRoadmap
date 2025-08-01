
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
    padding: '1rem',
    borderRadius: '0.5rem',
  },
  outlined: {
    border: '1px solid #ddd',
    background: 'darkgrey',
    padding: '1rem',
    borderRadius: '0.5rem',
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