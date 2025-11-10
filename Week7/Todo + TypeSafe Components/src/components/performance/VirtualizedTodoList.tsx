import React, { useState, useMemo, useCallback, useRef, useEffect } from 'react';
import type { TodoItem, UpdateTodoInput, TodoStatus } from '../../types';
import { EnhancedTodoItem } from '../EnhancedTodoItem';
import * as usePerformanceMonitoring from '../../hooks/usePerformanceMonitoring';

/**
 * Virtual scrolling configuration interface
 */
export interface VirtualScrollConfig {
  itemHeight: number;
  containerHeight: number;
  overscan?: number; // Number of items to render outside visible area
  bufferSize?: number; // Additional items to keep in memory
}

/**
 * Virtual scrolling result interface
 */
interface VirtualizationResult {
  totalHeight: number;
  startIndex: number;
  endIndex: number;
  visibleRange: number[];
  offsetY: number;
}

/**
 * Simple virtualization hook
 */
function useVirtualization(config: {
  totalItems: number;
  itemHeight: number;
  containerHeight: number;
  scrollTop: number;
  overscan?: number;
  bufferSize?: number;
}): VirtualizationResult {
  const { totalItems, itemHeight, containerHeight, scrollTop, overscan = 5 } = config;

  return useMemo(() => {
    // Calculate total content height
    const totalHeight = totalItems * itemHeight;

    // Calculate visible viewport
    const startIndex = Math.floor(scrollTop / itemHeight);
    const endIndex = Math.min(
      totalItems - 1,
      Math.floor((scrollTop + containerHeight) / itemHeight)
    );

    // Apply overscan to reduce flickering during scroll
    const overscanStartIndex = Math.max(0, startIndex - overscan);
    const overscanEndIndex = Math.min(totalItems - 1, endIndex + overscan);

    // Generate visible range array
    const visibleRange: number[] = [];
    for (let i = overscanStartIndex; i <= overscanEndIndex; i++) {
      visibleRange.push(i);
    }

    // Calculate offset for positioning
    const offsetY = overscanStartIndex * itemHeight;

    return {
      totalHeight,
      startIndex: overscanStartIndex,
      endIndex: overscanEndIndex,
      visibleRange,
      offsetY,
    };
  }, [totalItems, itemHeight, containerHeight, scrollTop, overscan]);
}

/**
 * Props for VirtualizedTodoList component
 */
interface VirtualizedTodoListProps {
  todos: TodoItem[];
  onUpdate: (id: string, updates: UpdateTodoInput) => Promise<void>;
  onDelete: (id: string) => Promise<void>;
  onToggleStatus: (id: string, status: TodoStatus) => Promise<void>;
  config: VirtualScrollConfig;
  className?: string;
  filterStatus?: 'all' | 'active' | 'completed';
  sortBy?: 'date' | 'title' | 'priority';
}

/**
 * High-performance virtualized todo list component
 * Only renders items visible in the viewport for optimal performance
 */
export const VirtualizedTodoList: React.FC<VirtualizedTodoListProps> = React.memo(
  ({
    todos,
    onUpdate,
    onDelete,
    onToggleStatus,
    config,
    className = '',
    filterStatus = 'all',
    sortBy = 'date',
  }) => {
    const containerRef = useRef<HTMLDivElement>(null);
    const [scrollTop, setScrollTop] = useState(0);

    // Performance monitoring
    const renderMetrics = usePerformanceMonitoring.useRenderTracking('VirtualizedTodoList');
    const memoryMetrics = usePerformanceMonitoring.useMemoryTracking();

    // Filter and sort todos
    const processedTodos = useMemo(() => {
      let filtered = todos;

      // Apply filter
      switch (filterStatus) {
        case 'active':
          filtered = todos.filter(todo => todo.status !== 'completed');
          break;
        case 'completed':
          filtered = todos.filter(todo => todo.status === 'completed');
          break;
        default:
          filtered = todos;
      }

      // Apply sorting
      return filtered.sort((a, b) => {
        switch (sortBy) {
          case 'title':
            return a.title.localeCompare(b.title);
          case 'priority': {
            const priorityOrder = { critical: 4, high: 3, medium: 2, low: 1 };
            const aPriority = priorityOrder[a.priority] || 0;
            const bPriority = priorityOrder[b.priority] || 0;
            return bPriority - aPriority;
          }
          case 'date':
          default:
            return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
        }
      });
    }, [todos, filterStatus, sortBy]);

    // Virtual scrolling calculations
    const virtualization = useVirtualization({
      totalItems: processedTodos.length,
      itemHeight: config.itemHeight,
      containerHeight: config.containerHeight,
      scrollTop,
      overscan: config.overscan || 5,
      bufferSize: config.bufferSize || 10,
    });

    // Handle scroll events
    const handleScroll = useCallback((event: React.UIEvent<HTMLDivElement>) => {
      const scrollTop = event.currentTarget.scrollTop;
      setScrollTop(scrollTop);
    }, []);

    // Memoized stable callbacks to prevent unnecessary re-renders
    const createStableOnUpdate = useCallback(
      (id: string) => (updates: UpdateTodoInput) => onUpdate(id, updates),
      [onUpdate]
    );
    const createStableOnDelete = useCallback((id: string) => () => onDelete(id), [onDelete]);
    const createStableOnToggleStatus = useCallback(
      (id: string) => (status: TodoStatus) => onToggleStatus(id, status),
      [onToggleStatus]
    );

    // Virtual items to render
    const virtualItems = useMemo(() => {
      return virtualization.visibleRange
        .map((index: number) => {
          const todo = processedTodos[index];
          if (!todo) return null;

          return {
            index,
            todo,
            style: {
              position: 'absolute' as const,
              top: index * config.itemHeight,
              left: 0,
              right: 0,
              height: config.itemHeight,
              transform: `translateY(${virtualization.offsetY}px)`,
            },
          };
        })
        .filter(Boolean) as Array<{
        index: number;
        todo: TodoItem;
        style: React.CSSProperties;
      }>;
    }, [virtualization.visibleRange, virtualization.offsetY, processedTodos, config.itemHeight]);

    // Performance debugging in development
    useEffect(() => {
      const isDevelopment =
        typeof window !== 'undefined' && window.location?.hostname === 'localhost';
      if (isDevelopment) {
        console.log('VirtualizedTodoList Performance Stats:', {
          totalItems: processedTodos.length,
          visibleItems: virtualization.visibleRange.length,
          renderCount: renderMetrics.renderCount,
          lastRenderTime: renderMetrics.lastRenderTime,
          memoryUsage: memoryMetrics
            ? `${(memoryMetrics.usedJSHeapSize / 1024 / 1024).toFixed(2)}MB`
            : 'N/A',
        });
      }
    }, [processedTodos.length, virtualization.visibleRange.length, renderMetrics, memoryMetrics]);

    const isDevelopment =
      typeof window !== 'undefined' && window.location?.hostname === 'localhost';

    return (
      <div className={`virtualized-todo-list ${className}`}>
        {/* Performance metrics display (development only) */}
        {isDevelopment && (
          <div
            className='performance-stats'
            style={{
              position: 'fixed',
              top: 10,
              right: 10,
              background: 'rgba(0,0,0,0.8)',
              color: 'white',
              padding: '8px',
              borderRadius: '4px',
              fontSize: '12px',
              zIndex: 1000,
            }}
          >
            <div>Total: {processedTodos.length} items</div>
            <div>Visible: {virtualization.visibleRange.length} items</div>
            <div>Renders: {renderMetrics.renderCount}</div>
            <div>Last render: {renderMetrics.lastRenderTime.toFixed(2)}ms</div>
            {memoryMetrics && (
              <div>Memory: {(memoryMetrics.usedJSHeapSize / 1024 / 1024).toFixed(2)}MB</div>
            )}
          </div>
        )}

        {/* Scroll container */}
        <div
          ref={containerRef}
          className='virtual-scroll-container'
          style={{
            height: config.containerHeight,
            overflow: 'auto',
            position: 'relative',
          }}
          onScroll={handleScroll}
        >
          {/* Virtual content container */}
          <div
            className='virtual-content'
            style={{
              height: virtualization.totalHeight,
              position: 'relative',
            }}
          >
            {/* Rendered visible items */}
            {virtualItems.map(item => (
              <div key={`todo-${item.todo.id}`} style={item.style} className='virtual-item'>
                <EnhancedTodoItem
                  todo={item.todo}
                  onUpdate={createStableOnUpdate(item.todo.id as string)}
                  onDelete={createStableOnDelete(item.todo.id as string)}
                  onToggleStatus={createStableOnToggleStatus(item.todo.id as string)}
                />
              </div>
            ))}
          </div>

          {/* Loading indicator for large lists */}
          {processedTodos.length === 0 && (
            <div
              className='empty-state'
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                height: '100%',
                color: '#666',
                fontSize: '16px',
              }}
            >
              No todos to display
            </div>
          )}
        </div>

        {/* List statistics */}
        <div
          className='list-stats'
          style={{
            padding: '8px',
            borderTop: '1px solid #eee',
            fontSize: '14px',
            color: '#666',
          }}
        >
          Showing {virtualization.visibleRange.length} of {processedTodos.length} items
          {config.overscan && ` (overscan: ${config.overscan})`}
        </div>
      </div>
    );
  }
);

VirtualizedTodoList.displayName = 'VirtualizedTodoList';

export default VirtualizedTodoList;
