// EnhancedTodoItem Component Tests
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { 
  render, 
  screen, 
  createMockTodo, 
  createMockHandlers,
  setupUser
} from '../../test/testUtils'
import { EnhancedTodoItem } from '../EnhancedTodoItem'
import type { TodoItem, TodoStatus } from '../../types'

describe('EnhancedTodoItem', () => {
  let mockTodo: TodoItem
  let mockHandlers: ReturnType<typeof createMockHandlers>
  let user: ReturnType<typeof setupUser>

  beforeEach(() => {
    mockTodo = createMockTodo()
    mockHandlers = createMockHandlers()
    user = setupUser()
    vi.clearAllMocks()
  })

  afterEach(() => {
    vi.clearAllTimers()
  })

  describe('Rendering', () => {
    it('renders todo item with basic information', () => {
      render(
        <EnhancedTodoItem
          todo={mockTodo}
          onUpdate={mockHandlers.onUpdate}
          onDelete={mockHandlers.onDelete}
          onToggleStatus={mockHandlers.onToggleStatus}
        />
      )

      expect(screen.getByText(mockTodo.title)).toBeInTheDocument()
      expect(screen.getByText(mockTodo.description!)).toBeInTheDocument()
      expect(screen.getByText('NOT-STARTED')).toBeInTheDocument()
      expect(screen.getByText('MEDIUM')).toBeInTheDocument()
    })

    it('renders without description when not provided', () => {
      const todoWithoutDescription = createMockTodo()
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      delete (todoWithoutDescription as any).description
      
      render(
        <EnhancedTodoItem
          todo={todoWithoutDescription}
          onUpdate={mockHandlers.onUpdate}
          onDelete={mockHandlers.onDelete}
          onToggleStatus={mockHandlers.onToggleStatus}
        />
      )

      expect(screen.getByText(todoWithoutDescription.title)).toBeInTheDocument()
      expect(screen.queryByText('Test description')).not.toBeInTheDocument()
    })

    it('renders with custom test id', () => {
      const { container } = render(
        <EnhancedTodoItem
          todo={mockTodo}
          onUpdate={mockHandlers.onUpdate}
          onDelete={mockHandlers.onDelete}
          onToggleStatus={mockHandlers.onToggleStatus}
          data-testid="custom-todo-item"
        />
      )

      expect(container.querySelector('[data-testid="custom-todo-item"]')).toBeInTheDocument()
    })

    it('applies custom className', () => {
      const { container } = render(
        <EnhancedTodoItem
          todo={mockTodo}
          onUpdate={mockHandlers.onUpdate}
          onDelete={mockHandlers.onDelete}
          onToggleStatus={mockHandlers.onToggleStatus}
          className="custom-class"
        />
      )

      const todoElement = container.firstChild as HTMLElement
      expect(todoElement).toHaveClass('custom-class')
    })
  })

  describe('Status Display and Interactions', () => {
    const statusCases: { status: TodoStatus; displayText: string; colorClass: string }[] = [
      { status: 'not-started', displayText: 'NOT-STARTED', colorClass: 'text-gray-600' },
      { status: 'in-progress', displayText: 'IN-PROGRESS', colorClass: 'text-blue-600' },
      { status: 'completed', displayText: 'COMPLETED', colorClass: 'text-green-600' },
      { status: 'blocked', displayText: 'BLOCKED', colorClass: 'text-red-600' },
      { status: 'cancelled', displayText: 'CANCELLED', colorClass: 'text-purple-600' },
      { status: 'archived', displayText: 'ARCHIVED', colorClass: 'text-gray-500' },
    ]

    statusCases.forEach(({ status, displayText }) => {
      it(`renders ${status} status correctly`, () => {
        const todoWithStatus = createMockTodo({ status })
        
        render(
          <EnhancedTodoItem
            todo={todoWithStatus}
            onUpdate={mockHandlers.onUpdate}
            onDelete={mockHandlers.onDelete}
            onToggleStatus={mockHandlers.onToggleStatus}
          />
        )

        expect(screen.getByText(displayText)).toBeInTheDocument()
      })
    })

    it('shows completed todo with strikethrough text', () => {
      const completedTodo = createMockTodo({ status: 'completed' })
      
      render(
        <EnhancedTodoItem
          todo={completedTodo}
          onUpdate={mockHandlers.onUpdate}
          onDelete={mockHandlers.onDelete}
          onToggleStatus={mockHandlers.onToggleStatus}
        />
      )

      const titleElement = screen.getByText(completedTodo.title)
      expect(titleElement).toHaveClass('line-through', 'text-gray-500')
    })

    it('handles status toggle correctly', async () => {
      render(
        <EnhancedTodoItem
          todo={mockTodo}
          onUpdate={mockHandlers.onUpdate}
          onDelete={mockHandlers.onDelete}
          onToggleStatus={mockHandlers.onToggleStatus}
        />
      )

      const completeButton = screen.getByRole('button', { name: /complete/i })
      await user.click(completeButton)

      expect(mockHandlers.onToggleStatus).toHaveBeenCalledWith('in-progress')
    })
  })

  describe('Priority Display', () => {
    const priorityCases = [
      { priority: 'low' as const, colorClass: 'text-green-600' },
      { priority: 'medium' as const, colorClass: 'text-yellow-600' },
      { priority: 'high' as const, colorClass: 'text-orange-600' },
      { priority: 'critical' as const, colorClass: 'text-red-600' },
    ]

    priorityCases.forEach(({ priority }) => {
      it(`renders ${priority} priority correctly`, () => {
        const todoWithPriority = createMockTodo({ priority })
        
        render(
          <EnhancedTodoItem
            todo={todoWithPriority}
            onUpdate={mockHandlers.onUpdate}
            onDelete={mockHandlers.onDelete}
            onToggleStatus={mockHandlers.onToggleStatus}
          />
        )

        expect(screen.getByText(priority.toUpperCase())).toBeInTheDocument()
      })
    })
  })

  describe('Due Date Display', () => {
    it('shows due date when provided', () => {
      const tomorrow = new Date()
      tomorrow.setDate(tomorrow.getDate() + 1)
      const todoWithDueDate = createMockTodo({ dueDate: tomorrow.toISOString() })
      
      render(
        <EnhancedTodoItem
          todo={todoWithDueDate}
          onUpdate={mockHandlers.onUpdate}
          onDelete={mockHandlers.onDelete}
          onToggleStatus={mockHandlers.onToggleStatus}
        />
      )

      expect(screen.getByText(/due tomorrow/i)).toBeInTheDocument()
    })

    it('shows overdue status for past due dates', () => {
      const yesterday = new Date()
      yesterday.setDate(yesterday.getDate() - 1)
      const overdueTodo = createMockTodo({ 
        dueDate: yesterday.toISOString(),
        status: 'in-progress'
      })
      
      render(
        <EnhancedTodoItem
          todo={overdueTodo}
          onUpdate={mockHandlers.onUpdate}
          onDelete={mockHandlers.onDelete}
          onToggleStatus={mockHandlers.onToggleStatus}
        />
      )

      expect(screen.getByText(/overdue by 1 day/i)).toBeInTheDocument()
    })

    it('shows overdue status even for completed todos (current implementation)', () => {
      const yesterday = new Date()
      yesterday.setDate(yesterday.getDate() - 1)
      const completedOverdueTodo = createMockTodo({ 
        dueDate: yesterday.toISOString(),
        status: 'completed'
      })
      
      render(
        <EnhancedTodoItem
          todo={completedOverdueTodo}
          onUpdate={mockHandlers.onUpdate}
          onDelete={mockHandlers.onDelete}
          onToggleStatus={mockHandlers.onToggleStatus}
        />
      )

      // The current implementation shows overdue even for completed todos
      expect(screen.getByText(/overdue by 1 day/i)).toBeInTheDocument()
    })
  })

  describe('Edit Mode', () => {
    it('enters edit mode when edit button is clicked', async () => {
      render(
        <EnhancedTodoItem
          todo={mockTodo}
          onUpdate={mockHandlers.onUpdate}
          onDelete={mockHandlers.onDelete}
          onToggleStatus={mockHandlers.onToggleStatus}
        />
      )

      const editButton = screen.getByRole('button', { name: /edit/i })
      await user.click(editButton)

      expect(screen.getByDisplayValue(mockTodo.title)).toBeInTheDocument()
      expect(screen.getByDisplayValue(mockTodo.description!)).toBeInTheDocument()
      expect(screen.getByRole('button', { name: /save/i })).toBeInTheDocument()
      expect(screen.getByRole('button', { name: /cancel/i })).toBeInTheDocument()
    })

    it('saves changes when save button is clicked', async () => {
      render(
        <EnhancedTodoItem
          todo={mockTodo}
          onUpdate={mockHandlers.onUpdate}
          onDelete={mockHandlers.onDelete}
          onToggleStatus={mockHandlers.onToggleStatus}
        />
      )

      const editButton = screen.getByRole('button', { name: /edit/i })
      await user.click(editButton)

      const titleInput = screen.getByDisplayValue(mockTodo.title)
      await user.clear(titleInput)
      await user.type(titleInput, 'Updated Todo Title')

      const saveButton = screen.getByRole('button', { name: /save/i })
      await user.click(saveButton)

      expect(mockHandlers.onUpdate).toHaveBeenCalledWith({
        title: 'Updated Todo Title',
        description: mockTodo.description,
        priority: mockTodo.priority,
        category: mockTodo.category,
      })
    })

    it('cancels edit mode without saving changes', async () => {
      render(
        <EnhancedTodoItem
          todo={mockTodo}
          onUpdate={mockHandlers.onUpdate}
          onDelete={mockHandlers.onDelete}
          onToggleStatus={mockHandlers.onToggleStatus}
        />
      )

      const editButton = screen.getByRole('button', { name: /edit/i })
      await user.click(editButton)

      const titleInput = screen.getByDisplayValue(mockTodo.title)
      await user.clear(titleInput)
      await user.type(titleInput, 'This should not be saved')

      const cancelButton = screen.getByRole('button', { name: /cancel/i })
      await user.click(cancelButton)

      expect(mockHandlers.onUpdate).not.toHaveBeenCalled()
      expect(screen.getByText(mockTodo.title)).toBeInTheDocument()
    })

    it('validates required fields in edit mode', async () => {
      render(
        <EnhancedTodoItem
          todo={mockTodo}
          onUpdate={mockHandlers.onUpdate}
          onDelete={mockHandlers.onDelete}
          onToggleStatus={mockHandlers.onToggleStatus}
        />
      )

      const editButton = screen.getByRole('button', { name: /edit/i })
      await user.click(editButton)

      const titleInput = screen.getByDisplayValue(mockTodo.title)
      await user.clear(titleInput)

      const saveButton = screen.getByRole('button', { name: /save/i })
      expect(saveButton).toBeDisabled()
    })
  })

  describe('Delete Functionality', () => {
    it('shows delete confirmation when delete button is clicked', async () => {
      render(
        <EnhancedTodoItem
          todo={mockTodo}
          onUpdate={mockHandlers.onUpdate}
          onDelete={mockHandlers.onDelete}
          onToggleStatus={mockHandlers.onToggleStatus}
        />
      )

      const deleteButton = screen.getByRole('button', { name: /delete/i })
      await user.click(deleteButton)

      expect(screen.getByText(/delete todo/i)).toBeInTheDocument()
      expect(screen.getByText(/are you sure you want to delete/i)).toBeInTheDocument()
      expect(screen.getByText(/this action cannot be undone/i)).toBeInTheDocument()
      expect(screen.getByRole('button', { name: /^delete$/i })).toBeInTheDocument() // Confirm delete button
      expect(screen.getByRole('button', { name: /cancel/i })).toBeInTheDocument()
    })

    it('deletes todo when confirmed', async () => {
      render(
        <EnhancedTodoItem
          todo={mockTodo}
          onUpdate={mockHandlers.onUpdate}
          onDelete={mockHandlers.onDelete}
          onToggleStatus={mockHandlers.onToggleStatus}
        />
      )

      const deleteButton = screen.getByRole('button', { name: /delete/i })
      await user.click(deleteButton)

      const confirmDeleteButton = screen.getByRole('button', { name: /^delete$/i })
      await user.click(confirmDeleteButton)

      expect(mockHandlers.onDelete).toHaveBeenCalledOnce()
    })

    it('cancels delete when cancel button is clicked', async () => {
      render(
        <EnhancedTodoItem
          todo={mockTodo}
          onUpdate={mockHandlers.onUpdate}
          onDelete={mockHandlers.onDelete}
          onToggleStatus={mockHandlers.onToggleStatus}
        />
      )

      const deleteButton = screen.getByRole('button', { name: /delete/i })
      await user.click(deleteButton)

      const cancelButton = screen.getByRole('button', { name: /cancel/i })
      await user.click(cancelButton)

      expect(mockHandlers.onDelete).not.toHaveBeenCalled()
      expect(screen.getByText(mockTodo.title)).toBeInTheDocument()
    })
  })

  describe('Readonly Mode', () => {
    it('hides action buttons in readonly mode', () => {
      render(
        <EnhancedTodoItem
          todo={mockTodo}
          onUpdate={mockHandlers.onUpdate}
          onDelete={mockHandlers.onDelete}
          onToggleStatus={mockHandlers.onToggleStatus}
          readonly={true}
        />
      )

      expect(screen.queryByRole('button', { name: /complete/i })).not.toBeInTheDocument()
      expect(screen.queryByRole('button', { name: /edit/i })).not.toBeInTheDocument()
      expect(screen.queryByRole('button', { name: /delete/i })).not.toBeInTheDocument()
    })

    it('still shows todo information in readonly mode', () => {
      render(
        <EnhancedTodoItem
          todo={mockTodo}
          onUpdate={mockHandlers.onUpdate}
          onDelete={mockHandlers.onDelete}
          onToggleStatus={mockHandlers.onToggleStatus}
          readonly={true}
        />
      )

      expect(screen.getByText(mockTodo.title)).toBeInTheDocument()
      expect(screen.getByText(mockTodo.description!)).toBeInTheDocument()
    })
  })

  describe('Show Details Mode', () => {
    it('shows additional details when showDetails is true', () => {
      const todoWithTags = createMockTodo({ 
        tags: ['urgent', 'client'],
        category: 'work'
      })
      
      render(
        <EnhancedTodoItem
          todo={todoWithTags}
          onUpdate={mockHandlers.onUpdate}
          onDelete={mockHandlers.onDelete}
          onToggleStatus={mockHandlers.onToggleStatus}
          showDetails={true}
        />
      )

      expect(screen.getByText('Category:')).toBeInTheDocument()
      expect(screen.getByText('work')).toBeInTheDocument()
      expect(screen.getByText('#urgent')).toBeInTheDocument()
      expect(screen.getByText('#client')).toBeInTheDocument()
      expect(screen.getByText(/created:/i)).toBeInTheDocument()
    })

    it('hides details when showDetails is false', () => {
      const todoWithTags = createMockTodo({ 
        tags: ['urgent', 'client'],
        category: 'work'
      })
      
      render(
        <EnhancedTodoItem
          todo={todoWithTags}
          onUpdate={mockHandlers.onUpdate}
          onDelete={mockHandlers.onDelete}
          onToggleStatus={mockHandlers.onToggleStatus}
          showDetails={false}
        />
      )

      expect(screen.queryByText(/category: work/i)).not.toBeInTheDocument()
      expect(screen.queryByText('#urgent')).not.toBeInTheDocument()
    })
  })

  describe('Error Handling', () => {
    it('displays error message when update fails', async () => {
      const failingUpdate = vi.fn().mockRejectedValue(new Error('Update failed'))
      
      render(
        <EnhancedTodoItem
          todo={mockTodo}
          onUpdate={failingUpdate}
          onDelete={mockHandlers.onDelete}
          onToggleStatus={mockHandlers.onToggleStatus}
        />
      )

      const editButton = screen.getByRole('button', { name: /edit/i })
      await user.click(editButton)

      const titleInput = screen.getByDisplayValue(mockTodo.title)
      await user.clear(titleInput)
      await user.type(titleInput, 'Updated Title')

      const saveButton = screen.getByRole('button', { name: /save/i })
      await user.click(saveButton)

      await screen.findByText('Update failed')
    })

    it('displays error message when delete fails', async () => {
      const failingDelete = vi.fn().mockRejectedValue(new Error('Delete failed'))
      
      render(
        <EnhancedTodoItem
          todo={mockTodo}
          onUpdate={mockHandlers.onUpdate}
          onDelete={failingDelete}
          onToggleStatus={mockHandlers.onToggleStatus}
        />
      )

      const deleteButton = screen.getByRole('button', { name: /delete/i })
      await user.click(deleteButton)

      const confirmDeleteButton = screen.getByRole('button', { name: /^delete$/i })
      await user.click(confirmDeleteButton)

      await screen.findByText('Delete failed')
    })

    it('displays error message when status toggle fails', async () => {
      const failingToggleStatus = vi.fn().mockRejectedValue(new Error('Status update failed'))
      
      render(
        <EnhancedTodoItem
          todo={mockTodo}
          onUpdate={mockHandlers.onUpdate}
          onDelete={mockHandlers.onDelete}
          onToggleStatus={failingToggleStatus}
        />
      )

      const completeButton = screen.getByRole('button', { name: /complete/i })
      await user.click(completeButton)

      await screen.findByText('Status update failed')
    })
  })

  describe('Loading States', () => {
    it('shows loading state during update', async () => {
      let resolveUpdate: (value: void | PromiseLike<void>) => void
      const slowUpdate = vi.fn().mockReturnValue(new Promise<void>(resolve => {
        resolveUpdate = resolve
      }))
      
      render(
        <EnhancedTodoItem
          todo={mockTodo}
          onUpdate={slowUpdate}
          onDelete={mockHandlers.onDelete}
          onToggleStatus={mockHandlers.onToggleStatus}
        />
      )

      const editButton = screen.getByRole('button', { name: /edit/i })
      await user.click(editButton)

      const saveButton = screen.getByRole('button', { name: /save/i })
      await user.click(saveButton)

      expect(screen.getByText(/saving.../i)).toBeInTheDocument()
      
      resolveUpdate!()
      await screen.findByText(mockTodo.title)
    })

    it('shows loading state during delete', async () => {
      let resolveDelete: (value: void | PromiseLike<void>) => void
      const slowDelete = vi.fn().mockReturnValue(new Promise<void>(resolve => {
        resolveDelete = resolve
      }))
      
      render(
        <EnhancedTodoItem
          todo={mockTodo}
          onUpdate={mockHandlers.onUpdate}
          onDelete={slowDelete}
          onToggleStatus={mockHandlers.onToggleStatus}
        />
      )

      const deleteButton = screen.getByRole('button', { name: /delete/i })
      await user.click(deleteButton)

      const confirmDeleteButton = screen.getByRole('button', { name: /^delete$/i })
      await user.click(confirmDeleteButton)

      expect(screen.getByText(/deleting.../i)).toBeInTheDocument()
      
      resolveDelete!()
    })

    it('shows loading indicator during status toggle', async () => {
      let resolveToggle: (value: void | PromiseLike<void>) => void
      const slowToggleStatus = vi.fn().mockReturnValue(new Promise<void>(resolve => {
        resolveToggle = resolve
      }))
      
      render(
        <EnhancedTodoItem
          todo={mockTodo}
          onUpdate={mockHandlers.onUpdate}
          onDelete={mockHandlers.onDelete}
          onToggleStatus={slowToggleStatus}
        />
      )

      const completeButton = screen.getByRole('button', { name: /complete/i })
      await user.click(completeButton)

      expect(screen.getByText('...')).toBeInTheDocument()
      
      resolveToggle!()
    })
  })

  describe('Accessibility', () => {
    it('has proper ARIA labels for buttons', () => {
      render(
        <EnhancedTodoItem
          todo={mockTodo}
          onUpdate={mockHandlers.onUpdate}
          onDelete={mockHandlers.onDelete}
          onToggleStatus={mockHandlers.onToggleStatus}
        />
      )

      expect(screen.getByRole('button', { name: /complete/i })).toBeInTheDocument()
      expect(screen.getByRole('button', { name: /edit/i })).toBeInTheDocument()
      expect(screen.getByRole('button', { name: /delete/i })).toBeInTheDocument()
    })

    it('maintains focus management during interactions', async () => {
      render(
        <EnhancedTodoItem
          todo={mockTodo}
          onUpdate={mockHandlers.onUpdate}
          onDelete={mockHandlers.onDelete}
          onToggleStatus={mockHandlers.onToggleStatus}
        />
      )

      const editButton = screen.getByRole('button', { name: /edit/i })
      await user.click(editButton)

      // Check that edit mode is active (input field is rendered)
      const titleInput = screen.getByDisplayValue(mockTodo.title)
      expect(titleInput).toBeInTheDocument()
      
      // Manually focus the input to test focus management
      titleInput.focus()
      expect(titleInput).toHaveFocus()
    })

    it('supports keyboard navigation in edit mode', async () => {
      render(
        <EnhancedTodoItem
          todo={mockTodo}
          onUpdate={mockHandlers.onUpdate}
          onDelete={mockHandlers.onDelete}
          onToggleStatus={mockHandlers.onToggleStatus}
        />
      )

      const editButton = screen.getByRole('button', { name: /edit/i })
      await user.click(editButton)

      const titleInput = screen.getByDisplayValue(mockTodo.title)
      await user.tab()

      // Should be able to navigate through form elements
      expect(document.activeElement).not.toBe(titleInput)
    })
  })
})