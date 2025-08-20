interface CardProps {
    children: React.ReactNode
    header?: React.ReactNode
    footer?: React.ReactNode
    variant: 'outlined'
    className?: string
    style?: React.CSSProperties
}

const cardStyleMap = {
  outlined: {
    margin: '15px',
    border: '1px solid #ddd',
    background: 'rgba(0, 0, 0, 0.3)',
    padding: '1.5rem',
    borderRadius: '0.75rem',
    gap: '1rem',
    height: 'fit-content',
  }
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