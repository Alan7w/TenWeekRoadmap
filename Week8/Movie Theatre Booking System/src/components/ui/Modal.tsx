import React, { useEffect, useCallback } from 'react'
import { createPortal } from 'react-dom'

// Modal props interface
interface ModalProps {
  isOpen: boolean
  onClose: () => void
  title?: string
  size?: 'sm' | 'md' | 'lg' | 'xl' | 'full'
  closeOnOverlayClick?: boolean
  closeOnEscape?: boolean
  showCloseButton?: boolean
  children: React.ReactNode
  className?: string
}

// Modal component with React.memo for performance
export const Modal = React.memo<ModalProps>(({
  isOpen,
  onClose,
  title,
  size = 'md',
  closeOnOverlayClick = true,
  closeOnEscape = true,
  showCloseButton = true,
  children,
  className = ''
}) => {
  // Handle escape key press
  const handleEscape = useCallback((event: KeyboardEvent) => {
    if (event.key === 'Escape' && closeOnEscape) {
      onClose()
    }
  }, [onClose, closeOnEscape])
  
  // Handle overlay click
  const handleOverlayClick = useCallback((event: React.MouseEvent) => {
    if (event.target === event.currentTarget && closeOnOverlayClick) {
      onClose()
    }
  }, [onClose, closeOnOverlayClick])
  
  // Add/remove event listeners
  useEffect(() => {
    if (isOpen) {
      document.addEventListener('keydown', handleEscape)
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = 'unset'
    }
    
    return () => {
      document.removeEventListener('keydown', handleEscape)
      document.body.style.overflow = 'unset'
    }
  }, [isOpen, handleEscape])
  
  // Size styles
  const sizeStyles = {
    sm: 'max-w-md',
    md: 'max-w-lg',
    lg: 'max-w-2xl',
    xl: 'max-w-4xl',
    full: 'max-w-full mx-4'
  }
  
  if (!isOpen) return null
  
  const modalContent = (
    <div 
      className="fixed inset-0 z-50 overflow-y-auto"
      aria-labelledby="modal-title"
      role="dialog"
      aria-modal="true"
    >
      {/* Overlay */}
      <div 
        className="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0"
        onClick={handleOverlayClick}
      >
        {/* Background overlay */}
        <div 
          className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity"
          aria-hidden="true"
        />
        
        {/* Center modal on larger screens */}
        <span 
          className="hidden sm:inline-block sm:align-middle sm:h-screen" 
          aria-hidden="true"
        >
          &#8203;
        </span>
        
        {/* Modal panel */}
        <div className={`
          inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all 
          sm:my-8 sm:align-middle sm:w-full ${sizeStyles[size]} ${className}
        `}>
          {/* Header */}
          {(title || showCloseButton) && (
            <div className="px-6 py-4 border-b border-gray-200 flex items-center justify-between">
              {title && (
                <h3 className="text-lg font-medium text-gray-900" id="modal-title">
                  {title}
                </h3>
              )}
              
              {showCloseButton && (
                <button
                  type="button"
                  className="ml-4 text-gray-400 hover:text-gray-600 focus:outline-none focus:text-gray-600 transition-colors"
                  onClick={onClose}
                  aria-label="Close modal"
                >
                  <svg 
                    className="h-6 w-6" 
                    fill="none" 
                    viewBox="0 0 24 24" 
                    stroke="currentColor"
                  >
                    <path 
                      strokeLinecap="round" 
                      strokeLinejoin="round" 
                      strokeWidth={2} 
                      d="M6 18L18 6M6 6l12 12" 
                    />
                  </svg>
                </button>
              )}
            </div>
          )}
          
          {/* Content */}
          <div className="px-6 py-4">
            {children}
          </div>
        </div>
      </div>
    </div>
  )
  
  // Render modal in portal
  return createPortal(modalContent, document.body)
})

Modal.displayName = 'Modal'

// Modal Header component for custom headers
export const ModalHeader = React.memo<{ children: React.ReactNode; className?: string }>(({
  children,
  className = ''
}) => (
  <div className={`px-6 py-4 border-b border-gray-200 ${className}`}>
    {children}
  </div>
))

ModalHeader.displayName = 'ModalHeader'

// Modal Body component for content
export const ModalBody = React.memo<{ children: React.ReactNode; className?: string }>(({
  children,
  className = ''
}) => (
  <div className={`px-6 py-4 ${className}`}>
    {children}
  </div>
))

ModalBody.displayName = 'ModalBody'

// Modal Footer component for actions
export const ModalFooter = React.memo<{ children: React.ReactNode; className?: string }>(({
  children,
  className = ''
}) => (
  <div className={`px-6 py-4 border-t border-gray-200 flex justify-end space-x-2 ${className}`}>
    {children}
  </div>
))

ModalFooter.displayName = 'ModalFooter'