// Enhanced Todo List Component
import React, { useState, useMemo, useCallback } from 'react';
import type {
  TodoItem,
  TodoStatus,
  TodoPriority,
  TodoCategory,
  LoadingState,
  SelectOption
} from '../types';
import { 
  todoStatusOptions
} from '../types';
import EnhancedTodoItem from './EnhancedTodoItem';
import { SimpleSelect } from './Select';

// Interface Definitions
interface SimpleFilter {
  status?: TodoStatus | '';
  priority?: TodoPriority | '';
  category?: TodoCategory | '';
  search: string;
}


interface EnhancedTodoListProps {
  initialTodos?: TodoItem[];
  onTodoChange?: (todos: TodoItem[]) => void;
  maxTodos?: number;
  showStats?: boolean;
}

// Select Options
const priorityOptions: SelectOption<TodoPriority>[] = [
  { value: 'low', label: 'Low' },
  { value: 'medium', label: 'Medium' },
  { value: 'high', label: 'High' },
  { value: 'critical', label: 'Critical' }
];

const categoryOptions: SelectOption<TodoCategory>[] = [
  { value: 'work', label: 'Work' },
  { value: 'personal', label: 'Personal' },
  { value: 'shopping', label: 'Shopping' },
  { value: 'health', label: 'Health' },
  { value: 'other', label: 'Other' }
];


const statusOptions: SelectOption<TodoStatus>[] = todoStatusOptions;


const priorityFilterOptions: SelectOption<TodoPriority | ''>[] = [
  { value: '', label: 'All Priorities' },
  ...priorityOptions
];

const categoryFilterOptions: SelectOption<TodoCategory | ''>[] = [
  { value: '', label: 'All Categories' },
  ...categoryOptions
];

const statusFilterOptions: SelectOption<TodoStatus | ''>[] = [
  { value: '', label: 'All Statuses' },
  ...statusOptions
];

// Main Component
const EnhancedTodoList: React.FC<EnhancedTodoListProps> = ({
  initialTodos = [],
  onTodoChange,
  maxTodos = 100,
  showStats = true
}) => {

  const [todos, setTodos] = useState<TodoItem[]>(initialTodos);
  const [loading, setLoading] = useState<LoadingState>({ isLoading: false });


  const [newTodoTitle, setNewTodoTitle] = useState('');
  const [newTodoDescription, setNewTodoDescription] = useState('');
  const [newTodoPriority, setNewTodoPriority] = useState<TodoPriority>('medium');
  const [newTodoCategory, setNewTodoCategory] = useState<TodoCategory>('other');
  const [newTodoDueDate, setNewTodoDueDate] = useState('');


  const [filters, setFilters] = useState<SimpleFilter>({
    status: '',
    priority: '',
    category: '',
    search: ''
  });


  const [formError, setFormError] = useState('');


  React.useEffect(() => {
    onTodoChange?.(todos);
  }, [todos, onTodoChange]);


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


  const stats = useMemo(() => {
    const total = todos.length;
    const completed = todos.filter(todo => todo.status === 'completed').length;
    const notStarted = todos.filter(todo => todo.status === 'not-started').length;
    const inProgress = todos.filter(todo => todo.status === 'in-progress').length;
    const blocked = todos.filter(todo => todo.status === 'blocked').length;
    const overdue = todos.filter(todo => 
      todo.dueDate && new Date(todo.dueDate) < new Date() && todo.status !== 'completed'
    ).length;

    return { total, completed, notStarted, inProgress, blocked, overdue };
  }, [todos]);


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

      await new Promise(resolve => setTimeout(resolve, 300));

      const newTodo: TodoItem = {
        id: crypto.randomUUID(),
        title: newTodoTitle.trim(),
        description: newTodoDescription.trim(),
        status: 'not-started',
        priority: newTodoPriority,
        category: newTodoCategory,
        tags: [],
        ...(newTodoDueDate && { dueDate: newTodoDueDate }),
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };

      setTodos(prev => [...prev, newTodo]);


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
          <div className="bg-gray-50 p-3 rounded-lg text-center">
            <div className="text-2xl font-bold text-gray-600">{stats.notStarted}</div>
            <div className="text-sm text-gray-800">Not Started</div>
          </div>
          <div className="bg-red-50 p-3 rounded-lg text-center">
            <div className="text-2xl font-bold text-red-600">{stats.blocked}</div>
            <div className="text-sm text-red-800">Blocked</div>
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
            <SimpleSelect<TodoPriority>
              options={priorityOptions}
              value={newTodoPriority}
              onValueChange={(value) => setNewTodoPriority(value || 'medium')}
              placeholder="Select priority"
              data-testid="priority-select"
            />
          </div>

          <div>
            <label htmlFor="category" className="block text-sm font-medium text-gray-700 mb-1">
              Category
            </label>
            <SimpleSelect<TodoCategory>
              options={categoryOptions}
              value={newTodoCategory}
              onValueChange={(value) => setNewTodoCategory(value || 'other')}
              placeholder="Select category"
              data-testid="category-select"
            />
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
            <SimpleSelect<TodoStatus | ''>
              options={statusFilterOptions}
              value={filters.status ?? ''}
              onValueChange={(value) => setFilters(prev => ({ ...prev, status: value || '' }))}
              placeholder="All Statuses"
              data-testid="status-filter-select"
            />
          </div>

          <div>
            <label htmlFor="priorityFilter" className="block text-sm font-medium text-gray-700 mb-1">
              Priority
            </label>
            <SimpleSelect<TodoPriority | ''>
              options={priorityFilterOptions}
              value={filters.priority ?? ''}
              onValueChange={(value) => setFilters(prev => ({ ...prev, priority: value || '' }))}
              placeholder="All Priorities"
              data-testid="priority-filter-select"
            />
          </div>

          <div>
            <label htmlFor="categoryFilter" className="block text-sm font-medium text-gray-700 mb-1">
              Category
            </label>
            <SimpleSelect<TodoCategory | ''>
              options={categoryFilterOptions}
              value={filters.category ?? ''}
              onValueChange={(value) => setFilters(prev => ({ ...prev, category: value || '' }))}
              placeholder="All Categories"
              data-testid="category-filter-select"
            />
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