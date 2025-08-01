import type { MouseEventHandler } from "react";

interface ButtonProps {
    children: React.ReactNode
    onClick: MouseEventHandler<HTMLButtonElement>
    variant: "primary" | "secondary"
    disabled?: boolean
    className?: string
    style?: React.CSSProperties
}

const buttonStyleMap = {
  primary: {
    background: '#007bff',
    color: 'white',
    padding: '0.5rem 1rem',
    borderRadius: '0.25rem',
    border: 'none',
    cursor: 'pointer',
  },
  secondary: {
    background: 'transparent',
    color: '#007bff',
    padding: '0.5rem 1rem',
    borderRadius: '0.25rem',
    border: '1px solid #007bff',
    cursor: 'pointer',
  }
}

function Button (props: ButtonProps) {
    const {children, onClick, variant, disabled=false, className='', style} = props

    const baseStyle = buttonStyleMap[variant]
    let disabledButtonStyle = {}
    if (disabled) {
        disabledButtonStyle = {opacity: 0.5, cursor: 'not-allowed'}
    }
    const combinedStyle = { ...baseStyle, ...style, ...disabledButtonStyle }

    return (
        <div >
            <button className={className} 
                    style={combinedStyle}
                    onClick={disabled ? undefined : onClick}
                    disabled={disabled}
            >
                {children}
            </button>
        </div>
    )
}

export default Button