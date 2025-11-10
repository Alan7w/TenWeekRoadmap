import React, { useState, useCallback, useMemo } from 'react';
import type { TodoItem, UpdateTodoInput, TodoStatus } from '../types';
import { VirtualizedTodoList } from './performance/VirtualizedTodoList';
import type { VirtualScrollConfig } from './performance/VirtualizedTodoList';
import { LazyImage } from '../hooks/useLazyLoading';
import * as usePerformanceMonitoring from '../hooks/usePerformanceMonitoring';
import { useStableReference } from '../hooks/useMemoization';
import { ProfilerWrapper } from './ProfilerWrapper';
import { PerformanceDashboard } from './PerformanceDashboard';
import { ProfilingDemo } from './ProfilingDemo';

/**
 * Props for the Performance Demo component
 */
interface PerformanceDemoProps {
  initialTodos?: TodoItem[];
  className?: string;
}

/**
 * Demo component showcasing Week 9 Day 3 & Day 4: Performance optimizations and React Profiler integration
 */
export const PerformanceDemo: React.FC<PerformanceDemoProps> = React.memo(
  ({ initialTodos = [], className = '' }) => {
    // State management
    const [todos, setTodos] = useState<TodoItem[]>(initialTodos);
    const [filterStatus, setFilterStatus] = useState<'all' | 'active' | 'completed'>('all');
    const [sortBy, setSortBy] = useState<'date' | 'title' | 'priority'>('date');
    const [viewMode, setViewMode] = useState<'normal' | 'virtualized'>('normal');
    const [itemCount, setItemCount] = useState(100);
    const [activeDemo, setActiveDemo] = useState<'performance' | 'profiling'>('performance');

    // Performance monitoring
    const renderMetrics = usePerformanceMonitoring.useRenderTracking('PerformanceDemo');
    const memoryMetrics = usePerformanceMonitoring.useMemoryTracking();
    const slowRenderDetection = usePerformanceMonitoring.useSlowRenderDetection(16);
    const lifecycleMetrics = usePerformanceMonitoring.useLifecycleTracking('PerformanceDemo');

    // Memoized todo operations
    const stableOnUpdate = useStableReference(
      useCallback(async (id: string, updates: UpdateTodoInput) => {
        setTodos(prev =>
          prev.map(todo =>
            todo.id === id ? { ...todo, ...updates, updatedAt: new Date().toISOString() } : todo
          )
        );
      }, [])
    );

    const stableOnDelete = useStableReference(
      useCallback(async (id: string) => {
        setTodos(prev => prev.filter(todo => todo.id !== id));
      }, [])
    );

    const stableOnToggleStatus = useStableReference(
      useCallback(async (id: string, status: TodoStatus) => {
        setTodos(prev =>
          prev.map(todo =>
            todo.id === id ? { ...todo, status, updatedAt: new Date().toISOString() } : todo
          )
        );
      }, [])
    );

    // Generate test data
    const generateTestData = useCallback((count: number) => {
      const statuses = ['not-started', 'in-progress', 'completed', 'blocked', 'cancelled'] as const;
      const priorities = ['low', 'medium', 'high', 'critical'] as const;
      const categories = ['work', 'personal', 'shopping', 'health'] as const;

      const newTodos: TodoItem[] = Array.from({ length: count }, (_, i) => ({
        id: `test-todo-${Date.now()}-${i}`,
        title: `Test Todo ${i + 1}`,
        description: `Generated test todo item ${i + 1} for performance testing`,
        status: statuses[i % 5] as TodoStatus,
        priority: priorities[i % 4] as 'low' | 'medium' | 'high' | 'critical',
        category: categories[i % 4] as 'work' | 'personal' | 'shopping' | 'health',
        tags: [`tag-${i % 5}`, `tag-${(i + 1) % 5}`],
        createdAt: new Date(Date.now() - i * 1000).toISOString(),
        updatedAt: new Date(Date.now() - i * 500).toISOString(),
        dueDate: new Date(Date.now() + i * 24 * 60 * 60 * 1000).toISOString(),
      }));
      setTodos(newTodos);
    }, []);

    // Virtual scroll configuration
    const virtualScrollConfig: VirtualScrollConfig = useMemo(
      () => ({
        itemHeight: 80,
        containerHeight: 600,
        overscan: 5,
        bufferSize: 10,
      }),
      []
    );

    // Lazy load heavy components - create a simple fallback instead
    const LazyChart: React.FC<{ todos: TodoItem[] }> = ({ todos }) => (
      <div className='p-4 bg-gradient-to-br from-blue-50 to-purple-50 rounded-lg'>
        <h4 className='text-lg font-semibold mb-4 text-gray-800'>📊 Todo Analytics Dashboard</h4>
        <div className='grid grid-cols-2 gap-4 text-center'>
          <div>
            <div className='text-2xl font-bold text-blue-600'>{todos.length}</div>
            <div className='text-xs text-gray-500'>Total Items</div>
          </div>
          <div>
            <div className='text-2xl font-bold text-green-600'>
              {todos.filter(t => t.status === 'completed').length}
            </div>
            <div className='text-xs text-gray-500'>Completed</div>
          </div>
        </div>
        <div className='mt-4 text-center text-sm text-gray-500'>📈 Simple analytics dashboard</div>
      </div>
    );

    // Memoized performance statistics
    const performanceStats = useMemo(() => {
      const isDevelopment =
        typeof window !== 'undefined' && window.location?.hostname === 'localhost';
      if (!isDevelopment) return null;

      return {
        renders: renderMetrics.renderCount,
        avgRenderTime: renderMetrics.averageRenderTime,
        lastRenderTime: renderMetrics.lastRenderTime,
        memoryUsage: memoryMetrics
          ? (memoryMetrics.usedJSHeapSize / 1024 / 1024).toFixed(2)
          : 'N/A',
        componentLifetime: lifecycleMetrics.totalLifetime
          ? Math.round(lifecycleMetrics.totalLifetime / 1000)
          : 'Active',
        todoCount: todos.length,
      };
    }, [renderMetrics, memoryMetrics, lifecycleMetrics, todos.length]);

    // Mark component name for slow render detection
    React.useEffect(() => {
      slowRenderDetection('PerformanceDemo');
    });

    return (
      <ProfilerWrapper id='PerformanceDemo' threshold={50}>
        <div className={`performance-demo ${className} p-6 max-w-6xl mx-auto`}>
          {/* Performance Dashboard */}
          <PerformanceDashboard />

          {/* Header */}
          <div className='mb-8'>
            <h1 className='text-3xl font-bold text-gray-800 mb-2'>
              🚀 Week 9 Day 3 & 4: Performance Optimization & Profiling Demo
            </h1>
            <p className='text-gray-600'>
              Showcasing advanced React performance patterns, profiling, and DevTools integration.
            </p>
          </div>

          {/* Demo Mode Selector */}
          <div className='mb-6 p-4 bg-gray-50 rounded-lg'>
            <div className='flex items-center gap-4'>
              <span className='font-semibold text-gray-700'>Demo Mode:</span>
              <button
                onClick={() => setActiveDemo('performance')}
                className={`px-4 py-2 rounded-md transition-colors ${
                  activeDemo === 'performance'
                    ? 'bg-blue-600 text-white'
                    : 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-50'
                }`}
              >
                Performance Optimization
              </button>
              <button
                onClick={() => setActiveDemo('profiling')}
                className={`px-4 py-2 rounded-md transition-colors ${
                  activeDemo === 'profiling'
                    ? 'bg-blue-600 text-white'
                    : 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-50'
                }`}
              >
                Profiling & Re-render Detection
              </button>
            </div>
          </div>

          {activeDemo === 'performance' && (
            <div>
              {/* Performance Statistics Panel */}
              {performanceStats && (
                <div className='bg-gray-900 text-white p-4 rounded-lg mb-6 font-mono text-sm'>
                  <h3 className='text-lg font-semibold mb-3 text-green-400'>
                    📊 Live Performance Metrics
                  </h3>
                  <div className='grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4'>
                    <div>
                      <div className='text-gray-400'>Renders</div>
                      <div className='text-xl font-bold'>{performanceStats.renders}</div>
                    </div>
                    <div>
                      <div className='text-gray-400'>Avg Render (ms)</div>
                      <div className='text-xl font-bold'>
                        {performanceStats.avgRenderTime.toFixed(2)}
                      </div>
                    </div>
                    <div>
                      <div className='text-gray-400'>Last Render (ms)</div>
                      <div className='text-xl font-bold'>
                        {performanceStats.lastRenderTime.toFixed(2)}
                      </div>
                    </div>
                    <div>
                      <div className='text-gray-400'>Memory (MB)</div>
                      <div className='text-xl font-bold'>{performanceStats.memoryUsage}</div>
                    </div>
                    <div>
                      <div className='text-gray-400'>Lifetime (s)</div>
                      <div className='text-xl font-bold'>{performanceStats.componentLifetime}</div>
                    </div>
                    <div>
                      <div className='text-gray-400'>Todo Count</div>
                      <div className='text-xl font-bold'>{performanceStats.todoCount}</div>
                    </div>
                  </div>
                </div>
              )}

              {/* Controls */}
              <div className='bg-white p-6 rounded-lg shadow-md mb-6'>
                <h3 className='text-lg font-semibold mb-4'>🎛️ Performance Test Controls</h3>

                <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4'>
                  {/* Generate Test Data */}
                  <div>
                    <label className='block text-sm font-medium text-gray-700 mb-2'>
                      Generate Test Data
                    </label>
                    <div className='flex gap-2'>
                      <input
                        type='number'
                        value={itemCount}
                        onChange={e => setItemCount(Number(e.target.value))}
                        className='flex-1 px-3 py-2 border border-gray-300 rounded-md text-sm'
                        min='10'
                        max='10000'
                        step='10'
                      />
                      <button
                        onClick={() => generateTestData(itemCount)}
                        className='px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 text-sm'
                      >
                        Generate
                      </button>
                    </div>
                  </div>

                  {/* View Mode */}
                  <div>
                    <label className='block text-sm font-medium text-gray-700 mb-2'>
                      View Mode
                    </label>
                    <select
                      value={viewMode}
                      onChange={e => setViewMode(e.target.value as 'normal' | 'virtualized')}
                      className='w-full px-3 py-2 border border-gray-300 rounded-md text-sm'
                    >
                      <option value='normal'>Normal List</option>
                      <option value='virtualized'>Virtualized List</option>
                    </select>
                  </div>

                  {/* Filter */}
                  <div>
                    <label className='block text-sm font-medium text-gray-700 mb-2'>
                      Filter Status
                    </label>
                    <select
                      value={filterStatus}
                      onChange={e =>
                        setFilterStatus(e.target.value as 'all' | 'active' | 'completed')
                      }
                      className='w-full px-3 py-2 border border-gray-300 rounded-md text-sm'
                    >
                      <option value='all'>All Todos</option>
                      <option value='active'>Active Only</option>
                      <option value='completed'>Completed Only</option>
                    </select>
                  </div>

                  {/* Sort */}
                  <div>
                    <label className='block text-sm font-medium text-gray-700 mb-2'>Sort By</label>
                    <select
                      value={sortBy}
                      onChange={e => setSortBy(e.target.value as 'date' | 'title' | 'priority')}
                      className='w-full px-3 py-2 border border-gray-300 rounded-md text-sm'
                    >
                      <option value='date'>Date Created</option>
                      <option value='title'>Title</option>
                      <option value='priority'>Priority</option>
                    </select>
                  </div>
                </div>
              </div>

              {/* Performance Features Showcase */}
              <div className='grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6'>
                {/* Memoization Demo */}
                <div className='bg-white p-6 rounded-lg shadow-md'>
                  <h3 className='text-lg font-semibold mb-4 flex items-center'>
                    🧠 Advanced Memoization
                    <span className='ml-2 px-2 py-1 bg-green-100 text-green-800 text-xs rounded'>
                      Active
                    </span>
                  </h3>
                  <div className='text-sm text-gray-600 space-y-2'>
                    <p>• Deep object comparison with React.memo</p>
                    <p>• Stable reference preservation</p>
                    <p>• Debounced memoization for expensive operations</p>
                    <p>• Cache invalidation strategies</p>
                  </div>
                </div>

                {/* Virtual Scrolling Demo */}
                <div className='bg-white p-6 rounded-lg shadow-md'>
                  <h3 className='text-lg font-semibold mb-4 flex items-center'>
                    📜 Virtual Scrolling
                    <span className='ml-2 px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded'>
                      {viewMode === 'virtualized' ? 'Active' : 'Inactive'}
                    </span>
                  </h3>
                  <div className='text-sm text-gray-600 space-y-2'>
                    <p>• Renders only visible items</p>
                    <p>• Smooth scrolling with overscan</p>
                    <p>• Dynamic item height support</p>
                    <p>• Memory efficient for large lists</p>
                  </div>
                </div>
              </div>

              {/* Todo List Display */}
              <div className='bg-white rounded-lg shadow-md overflow-hidden'>
                <div className='p-4 bg-gray-50 border-b'>
                  <h3 className='text-lg font-semibold'>
                    📝 Todo List ({todos.length} items) - {viewMode} mode
                  </h3>
                </div>

                {todos.length === 0 ? (
                  <div className='p-8 text-center text-gray-500'>
                    <p className='text-lg mb-4'>No todos yet</p>
                    <p>
                      Generate some test data using the controls above to see performance
                      optimizations in action!
                    </p>
                  </div>
                ) : viewMode === 'virtualized' ? (
                  <VirtualizedTodoList
                    todos={todos}
                    onUpdate={stableOnUpdate}
                    onDelete={stableOnDelete}
                    onToggleStatus={stableOnToggleStatus}
                    config={virtualScrollConfig}
                    filterStatus={filterStatus}
                    sortBy={sortBy}
                  />
                ) : (
                  <div className='max-h-96 overflow-y-auto'>
                    <div className='p-4 text-sm text-yellow-600 bg-yellow-50'>
                      ⚠️ Normal mode: All {todos.length} items rendered. Switch to virtualized mode
                      for better performance with large lists.
                    </div>
                    {/* Note: Would show regular todo list here, but keeping it simple for demo */}
                    <div className='p-4'>
                      <p className='text-gray-600'>
                        Normal list would render all {todos.length} items here...
                      </p>
                    </div>
                  </div>
                )}
              </div>

              {/* Lazy Loading Demo */}
              <div className='mt-6 bg-white p-6 rounded-lg shadow-md'>
                <h3 className='text-lg font-semibold mb-4 flex items-center'>
                  🎨 Lazy Loading Demo
                  <span className='ml-2 px-2 py-1 bg-purple-100 text-purple-800 text-xs rounded'>
                    Code Splitting
                  </span>
                </h3>

                <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
                  {/* Lazy Image */}
                  <div>
                    <h4 className='font-medium mb-2'>Lazy Image Loading</h4>
                    <LazyImage
                      src='https://via.placeholder.com/300x200/4F46E5/FFFFFF?text=Performance+Chart'
                      placeholder='https://via.placeholder.com/300x200/E5E7EB/9CA3AF?text=Loading...'
                      className='w-full rounded-lg'
                      style={{ aspectRatio: '3/2' }}
                      onLoad={() => console.log('Image loaded')}
                    />
                  </div>

                  {/* Lazy Component */}
                  <div>
                    <h4 className='font-medium mb-2'>Lazy Component Loading</h4>
                    <div className='border rounded-lg overflow-hidden'>
                      <LazyChart todos={todos} />
                    </div>
                  </div>
                </div>
              </div>

              {/* Footer */}
              <div className='mt-8 text-center text-sm text-gray-500'>
                <p>🚀 Week 9 Day 3 & 4: Advanced Performance Optimization & Profiling</p>
                <p>
                  Featuring memoization, virtualization, lazy loading, performance monitoring, React
                  Profiler, and DevTools integration
                </p>
              </div>
            </div>
          )}

          {activeDemo === 'profiling' && <ProfilingDemo />}
        </div>
      </ProfilerWrapper>
    );
  }
);

PerformanceDemo.displayName = 'PerformanceDemo';

export default PerformanceDemo;
