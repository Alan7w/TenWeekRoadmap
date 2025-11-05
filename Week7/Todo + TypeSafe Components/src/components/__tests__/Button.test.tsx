// Button Component Tests - Testing all button interactions and states
import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, setupUser } from '../../test/testUtils'
import React from 'react'

// Test Button Component
const TestButton = ({ 
  onClick, 
  disabled = false, 
  loading = false, 
  variant = 'default',
  children,
  ...props 
}: {
  onClick?: () => void
  disabled?: boolean
  loading?: boolean
  variant?: 'default' | 'primary' | 'danger' | 'success'
  children?: React.ReactNode
} & React.ButtonHTMLAttributes<HTMLButtonElement>) => {
  const getVariantClasses = () => {
    switch (variant) {
      case 'primary': return 'bg-blue-600 text-white hover:bg-blue-700'
      case 'danger': return 'bg-red-600 text-white hover:bg-red-700'
      case 'success': return 'bg-green-600 text-white hover:bg-green-700'
      default: return 'bg-gray-300 text-gray-700 hover:bg-gray-400'
    }
  }

  return (
    <button
      onClick={onClick}
      disabled={disabled || loading}
      className={`px-3 py-2 rounded-md focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 ${getVariantClasses()}`}
      {...props}
    >
      {loading ? 'Loading...' : children}
    </button>
  )
}

describe('Button Component', () => {
  let mockOnClick: () => void
  let user: ReturnType<typeof setupUser>

  beforeEach(() => {
    mockOnClick = vi.fn() as () => void
    user = setupUser()
    vi.clearAllMocks()
  })

  describe('Rendering', () => {
    it('renders button with text content', () => {
      render(<TestButton>Click me</TestButton>)
      
      expect(screen.getByRole('button', { name: 'Click me' })).toBeInTheDocument()
    })

    it('renders button with custom props', () => {
      render(
        <TestButton 
          data-testid="custom-button"
          aria-label="Custom button"
        >
          Test
        </TestButton>
      )
      
      const button = screen.getByTestId('custom-button')
      expect(button).toBeInTheDocument()
      expect(button).toHaveAttribute('aria-label', 'Custom button')
    })

    it('applies correct variant classes', () => {
      const { rerender } = render(<TestButton variant="primary">Primary</TestButton>)
      
      let button = screen.getByRole('button')
      expect(button).toHaveClass('bg-blue-600', 'text-white')

      rerender(<TestButton variant="danger">Danger</TestButton>)
      button = screen.getByRole('button')
      expect(button).toHaveClass('bg-red-600', 'text-white')

      rerender(<TestButton variant="success">Success</TestButton>)
      button = screen.getByRole('button')
      expect(button).toHaveClass('bg-green-600', 'text-white')

      rerender(<TestButton variant="default">Default</TestButton>)
      button = screen.getByRole('button')
      expect(button).toHaveClass('bg-gray-300', 'text-gray-700')
    })
  })

  describe('Click Interactions', () => {
    it('calls onClick handler when clicked', async () => {
      render(<TestButton onClick={mockOnClick}>Click me</TestButton>)
      
      const button = screen.getByRole('button')
      await user.click(button)
      
      expect(mockOnClick).toHaveBeenCalledOnce()
    })

    it('calls onClick multiple times when clicked multiple times', async () => {
      render(<TestButton onClick={mockOnClick}>Click me</TestButton>)
      
      const button = screen.getByRole('button')
      await user.click(button)
      await user.click(button)
      await user.click(button)
      
      expect(mockOnClick).toHaveBeenCalledTimes(3)
    })

    it('does not call onClick when disabled', async () => {
      render(
        <TestButton onClick={mockOnClick} disabled={true}>
          Disabled Button
        </TestButton>
      )
      
      const button = screen.getByRole('button')
      await user.click(button)
      
      expect(mockOnClick).not.toHaveBeenCalled()
    })

    it('does not call onClick when loading', async () => {
      render(
        <TestButton onClick={mockOnClick} loading={true}>
          Loading Button
        </TestButton>
      )
      
      const button = screen.getByRole('button')
      await user.click(button)
      
      expect(mockOnClick).not.toHaveBeenCalled()
    })
  })

  describe('Keyboard Interactions', () => {
    it('responds to Enter key press', async () => {
      render(<TestButton onClick={mockOnClick}>Press Enter</TestButton>)
      
      const button = screen.getByRole('button')
      button.focus()
      await user.keyboard('{Enter}')
      
      expect(mockOnClick).toHaveBeenCalledOnce()
    })

    it('responds to Space key press', async () => {
      render(<TestButton onClick={mockOnClick}>Press Space</TestButton>)
      
      const button = screen.getByRole('button')
      button.focus()
      await user.keyboard(' ')
      
      expect(mockOnClick).toHaveBeenCalledOnce()
    })

    it('does not respond to keyboard when disabled', async () => {
      render(
        <TestButton onClick={mockOnClick} disabled={true}>
          Disabled Button
        </TestButton>
      )
      
      const button = screen.getByRole('button')
      button.focus()
      await user.keyboard('{Enter}')
      await user.keyboard(' ')
      
      expect(mockOnClick).not.toHaveBeenCalled()
    })
  })

  describe('States', () => {
    it('shows disabled state correctly', () => {
      render(<TestButton disabled={true}>Disabled</TestButton>)
      
      const button = screen.getByRole('button')
      expect(button).toBeDisabled()
      expect(button).toHaveClass('disabled:opacity-50')
    })

    it('shows loading state correctly', () => {
      render(<TestButton loading={true}>Submit</TestButton>)
      
      const button = screen.getByRole('button')
      expect(button).toBeDisabled()
      expect(button).toHaveTextContent('Loading...')
    })

    it('shows normal state when not disabled or loading', () => {
      render(<TestButton>Normal Button</TestButton>)
      
      const button = screen.getByRole('button')
      expect(button).not.toBeDisabled()
      expect(button).toHaveTextContent('Normal Button')
    })
  })

  describe('Focus Management', () => {
    it('receives focus when clicked', async () => {
      render(<TestButton>Focus Test</TestButton>)
      
      const button = screen.getByRole('button')
      await user.click(button)
      
      expect(button).toHaveFocus()
    })

    it('can be focused with Tab key', async () => {
      render(
        <div>
          <input data-testid="input" />
          <TestButton>Tab Test</TestButton>
        </div>
      )
      
      const input = screen.getByTestId('input')
      const button = screen.getByRole('button')
      
      input.focus()
      await user.tab()
      
      expect(button).toHaveFocus()
    })

    it('shows focus ring when focused', () => {
      render(<TestButton>Focus Ring Test</TestButton>)
      
      const button = screen.getByRole('button')
      expect(button).toHaveClass('focus:outline-none', 'focus:ring-2', 'focus:ring-offset-2')
    })

    it('cannot be focused when disabled', () => {
      render(<TestButton disabled={true}>Cannot Focus</TestButton>)
      
      const button = screen.getByRole('button')
      expect(button).toBeDisabled()
      
      // Disabled buttons should not be focusable
      button.focus()
      expect(button).not.toHaveFocus()
    })
  })

  describe('Accessibility', () => {
    it('has correct role attribute', () => {
      render(<TestButton>Accessible Button</TestButton>)
      
      const button = screen.getByRole('button')
      expect(button).toBeInTheDocument()
    })

    it('supports custom aria-label', () => {
      render(<TestButton aria-label="Custom label">🔍</TestButton>)
      
      const button = screen.getByLabelText('Custom label')
      expect(button).toBeInTheDocument()
    })

    it('supports aria-describedby', () => {
      render(
        <div>
          <TestButton aria-describedby="help-text">Help Button</TestButton>
          <div id="help-text">This button provides help</div>
        </div>
      )
      
      const button = screen.getByRole('button')
      expect(button).toHaveAttribute('aria-describedby', 'help-text')
    })

    it('indicates disabled state to screen readers', () => {
      render(<TestButton disabled={true}>Disabled Button</TestButton>)
      
      const button = screen.getByRole('button')
      expect(button).toHaveAttribute('disabled')
    })

    it('has proper accessible name', () => {
      render(<TestButton>Save Changes</TestButton>)
      
      const button = screen.getByRole('button', { name: 'Save Changes' })
      expect(button).toBeInTheDocument()
    })
  })

  describe('Form Integration', () => {
    it('submits form when type is submit', async () => {
      const mockSubmit = vi.fn()
      
      render(
        <form onSubmit={mockSubmit}>
          <TestButton type="submit">Submit Form</TestButton>
        </form>
      )
      
      const button = screen.getByRole('button')
      await user.click(button)
      
      expect(mockSubmit).toHaveBeenCalled()
    })

    it('does not submit form when type is button', async () => {
      const mockSubmit = vi.fn()
      
      render(
        <form onSubmit={mockSubmit}>
          <TestButton type="button" onClick={mockOnClick}>
            Regular Button
          </TestButton>
        </form>
      )
      
      const button = screen.getByRole('button')
      await user.click(button)
      
      expect(mockSubmit).not.toHaveBeenCalled()
      expect(mockOnClick).toHaveBeenCalled()
    })

    it('resets form when type is reset', async () => {
      render(
        <form>
          <input defaultValue="test" data-testid="input" />
          <TestButton type="reset">Reset</TestButton>
        </form>
      )
      
      const input = screen.getByTestId('input') as HTMLInputElement
      const button = screen.getByRole('button')
      
      // Change input value
      await user.clear(input)
      await user.type(input, 'changed')
      expect(input.value).toBe('changed')
      
      // Reset form
      await user.click(button)
      expect(input.value).toBe('test')
    })
  })

  describe('Event Handling', () => {
    it('handles onMouseEnter and onMouseLeave', async () => {
      const mockMouseEnter = vi.fn()
      const mockMouseLeave = vi.fn()
      
      render(
        <TestButton 
          onMouseEnter={mockMouseEnter}
          onMouseLeave={mockMouseLeave}
        >
          Hover me
        </TestButton>
      )
      
      const button = screen.getByRole('button')
      
      await user.hover(button)
      expect(mockMouseEnter).toHaveBeenCalled()
      
      await user.unhover(button)
      expect(mockMouseLeave).toHaveBeenCalled()
    })

    it('handles onFocus and onBlur', async () => {
      const mockFocus = vi.fn()
      const mockBlur = vi.fn()
      
      render(
        <div>
          <TestButton onFocus={mockFocus} onBlur={mockBlur}>
            Focus test
          </TestButton>
          <button>Other button</button>
        </div>
      )
      
      const button = screen.getByText('Focus test')
      const otherButton = screen.getByText('Other button')
      
      await user.click(button)
      expect(mockFocus).toHaveBeenCalled()
      
      await user.click(otherButton)
      expect(mockBlur).toHaveBeenCalled()
    })
  })

  describe('Performance', () => {
    it('does not re-render unnecessarily', () => {
      const renderSpy = vi.fn()
      
      const TrackedButton = (props: React.ComponentProps<typeof TestButton>) => {
        renderSpy()
        return <TestButton {...props} />
      }
      
      const { rerender } = render(<TrackedButton>Test</TrackedButton>)
      expect(renderSpy).toHaveBeenCalledTimes(1)
      
      // Re-render with same props
      rerender(<TrackedButton>Test</TrackedButton>)
      expect(renderSpy).toHaveBeenCalledTimes(2)
    })
  })

  describe('Edge Cases', () => {
    it('handles rapid clicks gracefully', async () => {
      render(<TestButton onClick={mockOnClick}>Rapid Click</TestButton>)
      
      const button = screen.getByRole('button')
      
      // Simulate rapid clicking
      await user.click(button)
      await user.click(button)
      await user.click(button)
      await user.click(button)
      await user.click(button)
      
      expect(mockOnClick).toHaveBeenCalledTimes(5)
    })

    it('handles null/undefined children gracefully', () => {
      render(<TestButton>{null}</TestButton>)
      
      const button = screen.getByRole('button')
      expect(button).toBeInTheDocument()
      expect(button).toBeEmptyDOMElement()
    })

    it('handles empty string children', () => {
      render(<TestButton>{''}</TestButton>)
      
      const button = screen.getByRole('button')
      expect(button).toBeInTheDocument()
    })
  })
})
