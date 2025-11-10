import React, { useMemo, useCallback, memo } from 'react';
import type { TodoItem, ID, TodoStatus } from '../types';
import { EnhancedTodoItem } from './EnhancedTodoItem';
import { useDeepMemo, useStableReference } from '../hooks/useMemoization';

export interface OptimizedTodoListProps {
  todos: TodoItem[];
  onToggle: (id: ID, status: TodoStatus) => Promise<void>;
  onDelete: (id: ID) => Promise<void>;
  onEdit: (id: ID, updates: Partial<TodoItem>) => Promise<void>;
  filter?: 'all' | 'active' | 'completed';
  searchTerm?: string;
  sortBy?: 'created' | 'priority' | 'dueDate' | 'title';
  sortOrder?: 'asc' | 'desc';
}

// Memoized filtering logic
const filterTodos = (todos: TodoItem[], filter: string, searchTerm: string): TodoItem[] => {
  let filtered = todos;

  // Apply status filter
  if (filter === 'active') {
    filtered = filtered.filter(todo => todo.status !== 'completed');
  } else if (filter === 'completed') {
    filtered = filtered.filter(todo => todo.status === 'completed');
  }

  // Apply search filter
  if (searchTerm.trim()) {
    const term = searchTerm.toLowerCase();
    filtered = filtered.filter(
      todo =>
        todo.title.toLowerCase().includes(term) ||
        todo.description?.toLowerCase().includes(term) ||
        todo.category?.toLowerCase().includes(term)
    );
  }

  return filtered;
};

// Memoized sorting logic
const sortTodos = (todos: TodoItem[], sortBy: string, sortOrder: string): TodoItem[] => {
  return [...todos].sort((a, b) => {
    let comparison = 0;

    switch (sortBy) {
      case 'created':
        comparison = new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
        break;
      case 'priority': {
        const priorityOrder = { low: 1, medium: 2, high: 3, critical: 4 };
        const aPriority = a.priority || 'medium';
        const bPriority = b.priority || 'medium';
        comparison =
          (priorityOrder[aPriority as keyof typeof priorityOrder] || 2) -
          (priorityOrder[bPriority as keyof typeof priorityOrder] || 2);
        break;
      }
      case 'dueDate':
        if (!a.dueDate && !b.dueDate) comparison = 0;
        else if (!a.dueDate) comparison = 1;
        else if (!b.dueDate) comparison = -1;
        else comparison = new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime();
        break;
      case 'title':
        comparison = a.title.localeCompare(b.title);
        break;
      default:
        comparison = 0;
    }

    return sortOrder === 'desc' ? -comparison : comparison;
  });
};

// Individual todo item component with strict memoization
interface MemoizedTodoItemProps {
  todo: TodoItem;
  onToggle: (id: ID, status: TodoStatus) => Promise<void>;
  onDelete: (id: ID) => Promise<void>;
  onEdit: (id: ID, updates: Partial<TodoItem>) => Promise<void>;
}

const MemoizedTodoItem = memo<MemoizedTodoItemProps>(
  ({ todo, onToggle, onDelete, onEdit }) => {
    // Stable callbacks for each todo item
    const handleToggleStatus = useCallback(
      async (status: TodoStatus) => {
        await onToggle(todo.id, status);
      },
      [onToggle, todo.id]
    );

    const handleDelete = useCallback(async () => {
      await onDelete(todo.id);
    }, [onDelete, todo.id]);

    const handleUpdate = useCallback(
      async (updates: Partial<TodoItem>) => {
        await onEdit(todo.id, updates);
      },
      [onEdit, todo.id]
    );

    return (
      <EnhancedTodoItem
        todo={todo}
        onToggleStatus={handleToggleStatus}
        onDelete={handleDelete}
        onUpdate={handleUpdate}
      />
    );
  },
  (prevProps: MemoizedTodoItemProps, nextProps: MemoizedTodoItemProps) => {
    // Custom comparison for better performance
    return (
      prevProps.todo.id === nextProps.todo.id &&
      prevProps.todo.title === nextProps.todo.title &&
      prevProps.todo.status === nextProps.todo.status &&
      prevProps.todo.priority === nextProps.todo.priority &&
      prevProps.todo.dueDate === nextProps.todo.dueDate &&
      prevProps.todo.description === nextProps.todo.description &&
      prevProps.todo.category === nextProps.todo.category &&
      prevProps.todo.tags?.join(',') === nextProps.todo.tags?.join(',') &&
      prevProps.onToggle === nextProps.onToggle &&
      prevProps.onDelete === nextProps.onDelete &&
      prevProps.onEdit === nextProps.onEdit
    );
  }
);

MemoizedTodoItem.displayName = 'MemoizedTodoItem';

// Main optimized todo list component
const OptimizedTodoList: React.FC<OptimizedTodoListProps> = memo<OptimizedTodoListProps>(
  ({
    todos,
    onToggle,
    onDelete,
    onEdit,
    filter = 'all',
    searchTerm = '',
    sortBy = 'created',
    sortOrder = 'desc',
  }) => {
    // Stabilize props to prevent unnecessary re-renders
    const stableTodos = useStableReference(todos);
    const stableFilter = filter;
    const stableSearchTerm = searchTerm.trim();
    const stableSortBy = sortBy;
    const stableSortOrder = sortOrder;

    // Memoize expensive filtering and sorting operations
    const filteredTodos = useDeepMemo(
      () => filterTodos(stableTodos, stableFilter, stableSearchTerm),
      [stableTodos, stableFilter, stableSearchTerm]
    );

    const sortedTodos = useDeepMemo(
      () => sortTodos(filteredTodos, stableSortBy, stableSortOrder),
      [filteredTodos, stableSortBy, stableSortOrder]
    );

    // Memoize handlers to prevent child re-renders
    const stableOnToggle = useCallback(
      async (id: ID, status: TodoStatus) => {
        await onToggle(id, status);
      },
      [onToggle]
    );

    const stableOnDelete = useCallback(
      async (id: ID) => {
        await onDelete(id);
      },
      [onDelete]
    );

    const stableOnEdit = useCallback(
      async (id: ID, updates: Partial<TodoItem>) => {
        await onEdit(id, updates);
      },
      [onEdit]
    );

    // Calculate statistics
    const stats = useMemo(() => {
      const total = sortedTodos.length;
      const completed = sortedTodos.filter(todo => todo.status === 'completed').length;
      const active = total - completed;
      const overdue = sortedTodos.filter(todo => {
        if (!todo.dueDate || todo.status === 'completed') return false;
        return new Date(todo.dueDate) < new Date();
      }).length;

      return { total, completed, active, overdue };
    }, [sortedTodos]);

    // Empty state
    if (sortedTodos.length === 0) {
      return (
        <div className='text-center py-12'>
          <div className='text-gray-400 text-lg mb-2'>
            {stableSearchTerm ? 'No todos match your search' : 'No todos yet'}
          </div>
          {stableSearchTerm && (
            <div className='text-sm text-gray-500'>Try adjusting your search terms or filters</div>
          )}
        </div>
      );
    }

    return (
      <div className='space-y-4'>
        {/* Stats summary */}
        {stats.total > 0 && (
          <div className='bg-gray-50 rounded-lg p-4 mb-6'>
            <div className='grid grid-cols-2 md:grid-cols-4 gap-4 text-center'>
              <div>
                <div className='text-2xl font-bold text-blue-600'>{stats.total}</div>
                <div className='text-sm text-gray-600'>Total</div>
              </div>
              <div>
                <div className='text-2xl font-bold text-green-600'>{stats.completed}</div>
                <div className='text-sm text-gray-600'>Completed</div>
              </div>
              <div>
                <div className='text-2xl font-bold text-orange-600'>{stats.active}</div>
                <div className='text-sm text-gray-600'>Active</div>
              </div>
              <div>
                <div className='text-2xl font-bold text-red-600'>{stats.overdue}</div>
                <div className='text-sm text-gray-600'>Overdue</div>
              </div>
            </div>
          </div>
        )}

        {/* Todo list */}
        <div className='space-y-3'>
          {sortedTodos.map(todo => (
            <MemoizedTodoItem
              key={todo.id}
              todo={todo}
              onToggle={stableOnToggle}
              onDelete={stableOnDelete}
              onEdit={stableOnEdit}
            />
          ))}
        </div>
      </div>
    );
  }
);

OptimizedTodoList.displayName = 'OptimizedTodoList';

export default OptimizedTodoList;
