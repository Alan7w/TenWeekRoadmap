import React, { useState, useMemo, useCallback } from 'react';
import type {
  TodoItem,
  TodoStatus,
  TodoPriority,
  TodoCategory,
  LoadingState
} from '../types';
import EnhancedTodoItem from './EnhancedTodoItem';

// Simple filter interface
interface SimpleFilter {
  status?: TodoStatus | '';
  priority?: TodoPriority | '';
  category?: TodoCategory | '';
  search: string;
}

// Props interface
interface EnhancedTodoListProps {
  initialTodos?: TodoItem[];
  onTodoChange?: (todos: TodoItem[]) => void;
  maxTodos?: number;
  showStats?: boolean;
}

const EnhancedTodoList: React.FC<EnhancedTodoListProps> = ({
  initialTodos = [],
  onTodoChange,
  maxTodos = 100,
  showStats = true
}) => {
  // State management
  const [todos, setTodos] = useState<TodoItem[]>(initialTodos);
  const [loading, setLoading] = useState<LoadingState>({ isLoading: false });

  // Form state for new todos (simplified)
  const [newTodoTitle, setNewTodoTitle] = useState('');
  const [newTodoDescription, setNewTodoDescription] = useState('');
  const [newTodoPriority, setNewTodoPriority] = useState<TodoPriority>('medium');
  const [newTodoCategory, setNewTodoCategory] = useState<TodoCategory>('other');
  const [newTodoDueDate, setNewTodoDueDate] = useState('');

  // Filter state
  const [filters, setFilters] = useState<SimpleFilter>({
    status: '',
    priority: '',
    category: '',
    search: ''
  });

  // Form validation
  const [formError, setFormError] = useState('');

  // Notify parent of changes
  React.useEffect(() => {
    onTodoChange?.(todos);
  }, [todos, onTodoChange]);

  // Filtered todos
  const filteredTodos = useMemo(() => {
    return todos.filter(todo => {
      if (filters.status && todo.status !== filters.status) return false;
      if (filters.priority && todo.priority !== filters.priority) return false;
      if (filters.category && todo.category !== filters.category) return false;
      if (filters.search) {
        const searchLower = filters.search.toLowerCase();
        return todo.title.toLowerCase().includes(searchLower) ||
               (todo.description && todo.description.toLowerCase().includes(searchLower));
      }
      return true;
    });
  }, [todos, filters]);

  // Statistics
  const stats = useMemo(() => {
    const total = todos.length;
    const completed = todos.filter(todo => todo.status === 'completed').length;
    const pending = todos.filter(todo => todo.status === 'pending').length;
    const inProgress = todos.filter(todo => todo.status === 'in_progress').length;
    const overdue = todos.filter(todo => 
      todo.dueDate && new Date(todo.dueDate) < new Date() && todo.status !== 'completed'
    ).length;

    return { total, completed, pending, inProgress, overdue };
  }, [todos]);

  // Add new todo
  const handleAddTodo = useCallback(async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!newTodoTitle.trim()) {
      setFormError('Title is required');
      return;
    }

    if (todos.length >= maxTodos) {
      setFormError(`Maximum ${maxTodos} todos allowed`);
      return;
    }

    setLoading({ isLoading: true });
    setFormError('');

    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 300));

      const newTodo: TodoItem = {
        id: crypto.randomUUID(),
        title: newTodoTitle.trim(),
        description: newTodoDescription.trim(),
        status: 'pending',
        priority: newTodoPriority,
        category: newTodoCategory,
        tags: [],
        ...(newTodoDueDate && { dueDate: newTodoDueDate }),
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };

      setTodos(prev => [...prev, newTodo]);

      // Reset form
      setNewTodoTitle('');
      setNewTodoDescription('');
      setNewTodoPriority('medium');
      setNewTodoCategory('other');
      setNewTodoDueDate('');
    } catch {
      setFormError('Failed to add todo. Please try again.');
    } finally {
      setLoading({ isLoading: false });
    }
  }, [newTodoTitle, newTodoDescription, newTodoPriority, newTodoCategory, newTodoDueDate, todos.length, maxTodos]);

  // Update todo
  const handleUpdateTodo = useCallback(async (
    todoId: string, 
    updates: Partial<Omit<TodoItem, 'id' | 'createdAt' | 'updatedAt'>>
  ) => {
    setTodos(prev => prev.map(todo =>
      todo.id === todoId
        ? { ...todo, ...updates, updatedAt: new Date().toISOString() }
        : todo
    ));
  }, []);

  // Delete todo
  const handleDeleteTodo = useCallback(async (todoId: string) => {
    setTodos(prev => prev.filter(todo => todo.id !== todoId));
  }, []);

  // Toggle completion (removed - replaced with onToggleStatus in component)

  // Clear completed todos
  const handleClearCompleted = useCallback(() => {
    setTodos(prev => prev.filter(todo => todo.status !== 'completed'));
  }, []);

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white rounded-lg shadow-lg">
      <h2 className="text-2xl font-bold text-gray-800 mb-6">Enhanced Todo List</h2>

      {/* Statistics */}
      {showStats && (
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-6">
          <div className="bg-blue-50 p-3 rounded-lg text-center">
            <div className="text-2xl font-bold text-blue-600">{stats.total}</div>
            <div className="text-sm text-blue-800">Total</div>
          </div>
          <div className="bg-green-50 p-3 rounded-lg text-center">
            <div className="text-2xl font-bold text-green-600">{stats.completed}</div>
            <div className="text-sm text-green-800">Completed</div>
          </div>
          <div className="bg-yellow-50 p-3 rounded-lg text-center">
            <div className="text-2xl font-bold text-yellow-600">{stats.pending}</div>
            <div className="text-sm text-yellow-800">Pending</div>
          </div>
          <div className="bg-purple-50 p-3 rounded-lg text-center">
            <div className="text-2xl font-bold text-purple-600">{stats.inProgress}</div>
            <div className="text-sm text-purple-800">In Progress</div>
          </div>
          <div className="bg-red-50 p-3 rounded-lg text-center">
            <div className="text-2xl font-bold text-red-600">{stats.overdue}</div>
            <div className="text-sm text-red-800">Overdue</div>
          </div>
        </div>
      )}

      {/* Add Todo Form */}
      <form onSubmit={handleAddTodo} className="mb-8 p-4 bg-gray-50 rounded-lg">
        <h3 className="text-lg font-semibold mb-4 text-gray-800">Add New Todo</h3>
        
        {formError && (
          <div className="mb-4 p-2 bg-red-100 border border-red-400 text-red-700 rounded">
            {formError}
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-4">
          <div>
            <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-1">
              Title *
            </label>
            <input
              type="text"
              id="title"
              value={newTodoTitle}
              onChange={(e) => setNewTodoTitle(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Enter todo title"
              required
            />
          </div>

          <div>
            <label htmlFor="priority" className="block text-sm font-medium text-gray-700 mb-1">
              Priority
            </label>
            <select
              id="priority"
              value={newTodoPriority}
              onChange={(e) => setNewTodoPriority(e.target.value as TodoPriority)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="low">Low</option>
              <option value="medium">Medium</option>
              <option value="high">High</option>
              <option value="critical">Critical</option>
            </select>
          </div>

          <div>
            <label htmlFor="category" className="block text-sm font-medium text-gray-700 mb-1">
              Category
            </label>
            <select
              id="category"
              value={newTodoCategory}
              onChange={(e) => setNewTodoCategory(e.target.value as TodoCategory)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="work">Work</option>
              <option value="personal">Personal</option>
              <option value="shopping">Shopping</option>
              <option value="health">Health</option>
              <option value="other">Other</option>
            </select>
          </div>

          <div>
            <label htmlFor="dueDate" className="block text-sm font-medium text-gray-700 mb-1">
              Due Date
            </label>
            <input
              type="datetime-local"
              id="dueDate"
              value={newTodoDueDate}
              onChange={(e) => setNewTodoDueDate(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div className="md:col-span-2">
            <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">
              Description
            </label>
            <textarea
              id="description"
              rows={2}
              value={newTodoDescription}
              onChange={(e) => setNewTodoDescription(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Enter description (optional)"
            />
          </div>
        </div>

        <div className="flex flex-wrap gap-2">
          <button
            type="submit"
            disabled={loading.isLoading}
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
          >
            {loading.isLoading ? 'Adding...' : 'Add Todo'}
          </button>
          
          {stats.completed > 0 && (
            <button
              type="button"
              onClick={handleClearCompleted}
              className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 cursor-pointer"
            >
              Clear Completed ({stats.completed})
            </button>
          )}
        </div>
      </form>

      {/* Filters */}
      <div className="mb-6 p-4 bg-gray-50 rounded-lg">
        <h3 className="text-lg font-semibold mb-4 text-gray-800">Filter Todos</h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <div>
            <label htmlFor="searchFilter" className="block text-sm font-medium text-gray-700 mb-1">
              Search
            </label>
            <input
              type="text"
              id="searchFilter"
              value={filters.search}
              onChange={(e) => setFilters(prev => ({ ...prev, search: e.target.value }))}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Search todos..."
            />
          </div>

          <div>
            <label htmlFor="statusFilter" className="block text-sm font-medium text-gray-700 mb-1">
              Status
            </label>
            <select
              id="statusFilter"
              value={filters.status}
              onChange={(e) => setFilters(prev => ({ ...prev, status: e.target.value as TodoStatus | '' }))}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">All Statuses</option>
              <option value="pending">Pending</option>
              <option value="in_progress">In Progress</option>
              <option value="completed">Completed</option>
            </select>
          </div>

          <div>
            <label htmlFor="priorityFilter" className="block text-sm font-medium text-gray-700 mb-1">
              Priority
            </label>
            <select
              id="priorityFilter"
              value={filters.priority}
              onChange={(e) => setFilters(prev => ({ ...prev, priority: e.target.value as TodoPriority | '' }))}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">All Priorities</option>
              <option value="low">Low</option>
              <option value="medium">Medium</option>
              <option value="high">High</option>
              <option value="critical">Critical</option>
            </select>
          </div>

          <div>
            <label htmlFor="categoryFilter" className="block text-sm font-medium text-gray-700 mb-1">
              Category
            </label>
            <select
              id="categoryFilter"
              value={filters.category}
              onChange={(e) => setFilters(prev => ({ ...prev, category: e.target.value as TodoCategory | '' }))}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">All Categories</option>
              <option value="work">Work</option>
              <option value="personal">Personal</option>
              <option value="shopping">Shopping</option>
              <option value="health">Health</option>
              <option value="other">Other</option>
            </select>
          </div>
        </div>

        <div className="mt-4">
          <button
            type="button"
            onClick={() => setFilters({ status: '', priority: '', category: '', search: '' })}
            className="px-4 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-gray-500 cursor-pointer"
          >
            Clear Filters
          </button>
        </div>
      </div>

      {/* Todo List */}
      <div className="space-y-4">
        {filteredTodos.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            {todos.length === 0 
              ? "No todos yet. Add your first todo above!" 
              : "No todos match your current filters."}
          </div>
        ) : (
          <>
            <div className="flex justify-between items-center">
              <h3 className="text-lg font-semibold text-gray-800">
                Todos ({filteredTodos.length}/{todos.length})
              </h3>
            </div>
            
            {filteredTodos.map((todo) => (
              <EnhancedTodoItem
                key={todo.id}
                todo={todo}
                onUpdate={(updates) => handleUpdateTodo(String(todo.id), updates)}
                onDelete={() => handleDeleteTodo(String(todo.id))}
                onToggleStatus={async (status) => {
                  setTodos(prev => prev.map(t => 
                    t.id === todo.id ? { ...t, status, updatedAt: new Date().toISOString() } : t
                  ));
                }}
              />
            ))}
          </>
        )}
      </div>
    </div>
  );
};

export default EnhancedTodoList;