// Enhanced Todo Item Component
import React, { useState, useCallback, useMemo } from 'react';
import type {
  EnhancedTodoItemProps,
  TodoStatus,
  TodoPriority,
  TodoCategory,
  UpdateTodoInput,
  LoadingState,
} from '../types';
import { getAvailableTransitions } from '../types';

// Utility Functions
const getPriorityColor = (priority: TodoPriority): string => {
  switch (priority) {
    case 'critical':
      return 'text-red-600 bg-red-50 border-red-200';
    case 'high':
      return 'text-orange-600 bg-orange-50 border-orange-200';
    case 'medium':
      return 'text-yellow-600 bg-yellow-50 border-yellow-200';
    case 'low':
      return 'text-green-600 bg-green-50 border-green-200';
    default:
      return 'text-gray-600 bg-gray-50 border-gray-200';
  }
};

const getStatusColor = (status: TodoStatus): string => {
  switch (status) {
    case 'completed':
      return 'text-green-600 bg-green-50';
    case 'in-progress':
      return 'text-blue-600 bg-blue-50';
    case 'cancelled':
      return 'text-purple-600 bg-purple-50';
    case 'not-started':
      return 'text-gray-600 bg-gray-50';
    case 'blocked':
      return 'text-red-600 bg-red-50';
    case 'archived':
      return 'text-gray-500 bg-gray-100';
    default:
      return 'text-gray-600 bg-gray-50';
  }
};

const getNextStatus = (currentStatus: TodoStatus): TodoStatus => {
  const availableTransitions = getAvailableTransitions(currentStatus);

  if (availableTransitions.length > 0) {
    return availableTransitions[0] as TodoStatus;
  }

  switch (currentStatus) {
    case 'not-started':
      return 'in-progress';
    case 'in-progress':
      return 'completed';
    case 'completed':
      return 'archived';
    case 'blocked':
      return 'in-progress';
    case 'cancelled':
      return 'not-started';
    case 'archived':
      return 'not-started';
    default:
      return 'not-started';
  }
};

// Main Component
export const EnhancedTodoItem: React.FC<EnhancedTodoItemProps> = ({
  todo,
  onUpdate,
  onDelete,
  onToggleStatus,
  readonly = false,
  showDetails = false,
  className = '',
  'data-testid': testId,
  children,
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [showConfirmDelete, setShowConfirmDelete] = useState(false);
  const [loadingState, setLoadingState] = useState<LoadingState>({ isLoading: false });

  const [editForm, setEditForm] = useState({
    title: todo.title,
    description: todo.description || '',
    priority: todo.priority,
    category: todo.category,
    dueDate: todo.dueDate || '',
  });

  const handleToggleStatus = useCallback(async () => {
    const nextStatus = getNextStatus(todo.status);
    setLoadingState({ isLoading: true });

    try {
      await onToggleStatus(nextStatus);
      setLoadingState({ isLoading: false });
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to update status';
      setLoadingState({ isLoading: false, error: errorMessage });
    }
  }, [todo.status, onToggleStatus]);

  const handleSaveEdit = useCallback(async () => {
    if (!editForm.title.trim()) {
      setLoadingState({ isLoading: false, error: 'Title is required' });
      return;
    }

    setLoadingState({ isLoading: true });

    try {
      const updates: UpdateTodoInput = {
        title: editForm.title.trim(),
        ...(editForm.description ? { description: editForm.description } : {}),
        priority: editForm.priority,
        category: editForm.category,
        ...(editForm.dueDate ? { dueDate: editForm.dueDate } : {}),
      };

      await onUpdate(updates);
      setIsEditing(false);
      setLoadingState({ isLoading: false });
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to update todo';
      setLoadingState({ isLoading: false, error: errorMessage });
    }
  }, [editForm, onUpdate]);

  const handleCancelEdit = useCallback(() => {
    setEditForm({
      title: todo.title,
      description: todo.description || '',
      priority: todo.priority,
      category: todo.category,
      dueDate: todo.dueDate || '',
    });
    setIsEditing(false);
    setLoadingState({ isLoading: false });
  }, [todo]);

  const handleDelete = useCallback(async () => {
    setLoadingState({ isLoading: true });

    try {
      await onDelete();
      setLoadingState({ isLoading: false });
      setShowConfirmDelete(false);
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to delete todo';
      setLoadingState({ isLoading: false, error: errorMessage });
    }
  }, [onDelete]);

  const isCompleted = useMemo(() => todo.status === 'completed', [todo.status]);
  const isOverdue = useMemo(() => {
    if (!todo.dueDate || isCompleted) return false;
    return new Date(todo.dueDate) < new Date();
  }, [todo.dueDate, isCompleted]);

  const formattedDueDate = useMemo(() => {
    if (!todo.dueDate) return null;
    const date = new Date(todo.dueDate);
    const now = new Date();
    const diffTime = date.getTime() - now.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays < 0) {
      return `Overdue by ${Math.abs(diffDays)} day${Math.abs(diffDays) !== 1 ? 's' : ''}`;
    } else if (diffDays === 0) {
      return 'Due today';
    } else if (diffDays === 1) {
      return 'Due tomorrow';
    } else if (diffDays <= 7) {
      return `Due in ${diffDays} days`;
    } else {
      return date.toLocaleDateString();
    }
  }, [todo.dueDate]);

  const renderEditForm = (): React.ReactElement => (
    <div className='space-y-3'>
      {/* Title Input */}
      <div>
        <input
          type='text'
          value={editForm.title}
          onChange={e => setEditForm(prev => ({ ...prev, title: e.target.value }))}
          className='w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500'
          placeholder='Todo title...'
          disabled={loadingState.isLoading}
        />
      </div>

      {/* Description Input */}
      <div>
        <textarea
          value={editForm.description}
          onChange={e => setEditForm(prev => ({ ...prev, description: e.target.value }))}
          className='w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500'
          placeholder='Description (optional)...'
          rows={2}
          disabled={loadingState.isLoading}
        />
      </div>

      {/* Priority and Category */}
      <div className='grid grid-cols-2 gap-3'>
        <select
          value={editForm.priority}
          onChange={e =>
            setEditForm(prev => ({ ...prev, priority: e.target.value as TodoPriority }))
          }
          className='px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500'
          disabled={loadingState.isLoading}
        >
          <option value='low'>Low Priority</option>
          <option value='medium'>Medium Priority</option>
          <option value='high'>High Priority</option>
          <option value='critical'>Critical Priority</option>
        </select>

        <select
          value={editForm.category}
          onChange={e =>
            setEditForm(prev => ({ ...prev, category: e.target.value as TodoCategory }))
          }
          className='px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500'
          disabled={loadingState.isLoading}
        >
          <option value='work'>Work</option>
          <option value='personal'>Personal</option>
          <option value='shopping'>Shopping</option>
          <option value='health'>Health</option>
          <option value='other'>Other</option>
        </select>
      </div>

      {/* Due Date */}
      <div>
        <input
          type='datetime-local'
          value={editForm.dueDate ? new Date(editForm.dueDate).toISOString().slice(0, 16) : ''}
          onChange={e =>
            setEditForm(prev => ({
              ...prev,
              dueDate: e.target.value ? new Date(e.target.value).toISOString() : '',
            }))
          }
          className='w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500'
          disabled={loadingState.isLoading}
        />
      </div>

      {/* Action Buttons */}
      <div className='flex space-x-2'>
        <button
          onClick={handleSaveEdit}
          disabled={loadingState.isLoading || !editForm.title.trim()}
          className='flex-1 px-3 py-1 bg-blue-600 text-white text-sm rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50'
        >
          {loadingState.isLoading ? 'Saving...' : 'Save'}
        </button>
        <button
          onClick={handleCancelEdit}
          disabled={loadingState.isLoading}
          className='px-3 py-1 bg-gray-300 text-gray-700 text-sm rounded-md hover:bg-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-500'
        >
          Cancel
        </button>
      </div>
    </div>
  );

  const renderDisplayView = (): React.ReactElement => (
    <div className='space-y-2'>
      {/* Title and Status */}
      <div className='flex items-center justify-between'>
        <h3
          className={`text-lg font-medium ${isCompleted ? 'line-through text-gray-500' : 'text-gray-900'}`}
        >
          {todo.title}
        </h3>
        <div className='flex items-center space-x-2'>
          <span
            className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(todo.status)}`}
          >
            {todo.status.replace('_', ' ').toUpperCase()}
          </span>
          <span
            className={`px-2 py-1 text-xs border rounded-full ${getPriorityColor(todo.priority)}`}
          >
            {todo.priority.toUpperCase()}
          </span>
        </div>
      </div>

      {/* Description */}
      {todo.description && (
        <p className={`text-sm ${isCompleted ? 'text-gray-400' : 'text-gray-600'}`}>
          {todo.description}
        </p>
      )}

      {/* Details */}
      {showDetails && (
        <div className='text-xs text-gray-500 space-y-1'>
          <div>
            Category: <span className='capitalize'>{todo.category}</span>
          </div>
          {todo.tags.length > 0 && (
            <div className='flex flex-wrap gap-1'>
              {todo.tags.map((tag, index) => (
                <span key={index} className='px-1 py-0.5 bg-gray-100 rounded text-xs'>
                  #{tag}
                </span>
              ))}
            </div>
          )}
          <div>Created: {new Date(todo.createdAt).toLocaleDateString()}</div>
          {todo.updatedAt !== todo.createdAt && (
            <div>Updated: {new Date(todo.updatedAt).toLocaleDateString()}</div>
          )}
        </div>
      )}

      {/* Due Date */}
      {formattedDueDate && (
        <div className={`text-sm ${isOverdue ? 'text-red-600 font-medium' : 'text-gray-500'}`}>
          📅 {formattedDueDate}
        </div>
      )}

      {/* Action Buttons */}
      {!readonly && (
        <div className='flex space-x-2 pt-2'>
          <button
            onClick={handleToggleStatus}
            disabled={loadingState.isLoading}
            className={`px-3 py-1 text-sm rounded-md focus:outline-none focus:ring-2 ${
              isCompleted
                ? 'bg-yellow-100 text-yellow-800 hover:bg-yellow-200 focus:ring-yellow-500'
                : 'bg-green-100 text-green-800 hover:bg-green-200 focus:ring-green-500'
            } disabled:opacity-50`}
          >
            {loadingState.isLoading ? '...' : isCompleted ? 'Reopen' : 'Complete'}
          </button>

          <button
            onClick={() => setIsEditing(true)}
            disabled={loadingState.isLoading}
            className='px-3 py-1 text-sm bg-blue-100 text-blue-800 rounded-md hover:bg-blue-200 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50'
          >
            Edit
          </button>

          <button
            onClick={() => setShowConfirmDelete(true)}
            disabled={loadingState.isLoading}
            className='px-3 py-1 text-sm bg-red-100 text-red-800 rounded-md hover:bg-red-200 focus:outline-none focus:ring-2 focus:ring-red-500 disabled:opacity-50'
          >
            Delete
          </button>
        </div>
      )}
    </div>
  );

  const renderDeleteConfirmation = (): React.ReactElement => (
    <div className='space-y-3'>
      <div className='text-center'>
        <p className='text-gray-900 font-medium'>Delete Todo</p>
        <p className='text-sm text-gray-600 mt-1'>
          Are you sure you want to delete "{todo.title}"? This action cannot be undone.
        </p>
      </div>

      <div className='flex space-x-2'>
        <button
          onClick={handleDelete}
          disabled={loadingState.isLoading}
          className='flex-1 px-3 py-1 bg-red-600 text-white text-sm rounded-md hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 disabled:opacity-50'
        >
          {loadingState.isLoading ? 'Deleting...' : 'Delete'}
        </button>
        <button
          onClick={() => setShowConfirmDelete(false)}
          disabled={loadingState.isLoading}
          className='px-3 py-1 bg-gray-300 text-gray-700 text-sm rounded-md hover:bg-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-500'
        >
          Cancel
        </button>
      </div>
    </div>
  );

  return (
    <div
      className={`p-4 border rounded-lg bg-white shadow-sm hover:shadow-md transition-shadow border-gray-200 ${className}`}
      data-testid={testId}
    >
      {/* Error Display */}
      {loadingState.error && (
        <div className='mb-3 p-2 bg-red-50 border border-red-200 rounded-md'>
          <p className='text-sm text-red-600'>{loadingState.error}</p>
        </div>
      )}

      {/* Content */}
      {showConfirmDelete
        ? renderDeleteConfirmation()
        : isEditing
          ? renderEditForm()
          : renderDisplayView()}

      {children}
    </div>
  );
};

export default EnhancedTodoItem;
