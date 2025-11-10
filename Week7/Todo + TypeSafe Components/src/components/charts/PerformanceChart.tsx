import React from 'react';
import type { TodoItem } from '../../types';

interface PerformanceChartProps {
  todos: TodoItem[];
}

/**
 * Mock performance chart component for lazy loading demo
 */
const PerformanceChart: React.FC<PerformanceChartProps> = ({ todos }) => {
  const statusCounts = todos.reduce(
    (acc, todo) => {
      acc[todo.status] = (acc[todo.status] || 0) + 1;
      return acc;
    },
    {} as Record<string, number>
  );

  const priorityCounts = todos.reduce(
    (acc, todo) => {
      acc[todo.priority] = (acc[todo.priority] || 0) + 1;
      return acc;
    },
    {} as Record<string, number>
  );

  return (
    <div className='p-4 bg-gradient-to-br from-blue-50 to-purple-50 rounded-lg'>
      <h4 className='text-lg font-semibold mb-4 text-gray-800'>📊 Todo Analytics Dashboard</h4>

      <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
        {/* Status Distribution */}
        <div className='bg-white p-4 rounded-lg shadow-sm'>
          <h5 className='font-medium text-gray-700 mb-3'>Status Distribution</h5>
          <div className='space-y-2'>
            {Object.entries(statusCounts).map(([status, count]) => (
              <div key={status} className='flex justify-between items-center'>
                <span className='text-sm text-gray-600 capitalize'>{status.replace('-', ' ')}</span>
                <div className='flex items-center gap-2'>
                  <div
                    className='h-2 bg-blue-500 rounded'
                    style={{ width: `${(count / todos.length) * 100}px` }}
                  />
                  <span className='text-sm font-medium text-gray-800'>{count}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Priority Distribution */}
        <div className='bg-white p-4 rounded-lg shadow-sm'>
          <h5 className='font-medium text-gray-700 mb-3'>Priority Distribution</h5>
          <div className='space-y-2'>
            {Object.entries(priorityCounts).map(([priority, count]) => {
              const colors = {
                critical: 'bg-red-500',
                high: 'bg-orange-500',
                medium: 'bg-yellow-500',
                low: 'bg-green-500',
              };
              return (
                <div key={priority} className='flex justify-between items-center'>
                  <span className='text-sm text-gray-600 capitalize'>{priority}</span>
                  <div className='flex items-center gap-2'>
                    <div
                      className={`h-2 rounded ${colors[priority as keyof typeof colors] || 'bg-gray-500'}`}
                      style={{ width: `${(count / todos.length) * 100}px` }}
                    />
                    <span className='text-sm font-medium text-gray-800'>{count}</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Performance Metrics */}
      <div className='mt-4 bg-white p-4 rounded-lg shadow-sm'>
        <h5 className='font-medium text-gray-700 mb-3'>Performance Metrics</h5>
        <div className='grid grid-cols-2 md:grid-cols-4 gap-4 text-center'>
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
          <div>
            <div className='text-2xl font-bold text-orange-600'>
              {todos.filter(t => t.status === 'in-progress').length}
            </div>
            <div className='text-xs text-gray-500'>In Progress</div>
          </div>
          <div>
            <div className='text-2xl font-bold text-purple-600'>
              {Math.round(
                (todos.filter(t => t.status === 'completed').length / todos.length) * 100
              ) || 0}
              %
            </div>
            <div className='text-xs text-gray-500'>Completion Rate</div>
          </div>
        </div>
      </div>

      <div className='mt-4 text-center text-sm text-gray-500'>
        📈 This component was loaded lazily for better performance
      </div>
    </div>
  );
};

export default PerformanceChart;
