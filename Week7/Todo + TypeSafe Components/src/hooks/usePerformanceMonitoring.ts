import { useRef, useEffect, useState, useCallback } from 'react';

/**
 * Performance monitoring utilities for React components
 */

// Performance metrics interface
export interface PerformanceMetrics {
  renderCount: number;
  renderTime: number;
  averageRenderTime: number;
  lastRenderTime: number;
  totalRenderTime: number;
  componentName?: string | undefined;
}

// Memory usage tracking
export interface MemoryMetrics {
  usedJSHeapSize: number;
  totalJSHeapSize: number;
  jsHeapSizeLimit: number;
  timestamp: number;
}

/**
 * Hook to track component render performance
 */
export function useRenderTracking(componentName?: string): PerformanceMetrics {
  const renderCountRef = useRef(0);
  const renderTimesRef = useRef<number[]>([]);
  const startTimeRef = useRef<number>(0);
  const [metrics, setMetrics] = useState<PerformanceMetrics>({
    renderCount: 0,
    renderTime: 0,
    averageRenderTime: 0,
    lastRenderTime: 0,
    totalRenderTime: 0,
    componentName,
  });

  // Track render start
  useEffect(() => {
    startTimeRef.current = performance.now();
  });

  // Track render end and update metrics
  useEffect(() => {
    const endTime = performance.now();
    const renderTime = endTime - startTimeRef.current;

    renderCountRef.current += 1;
    renderTimesRef.current.push(renderTime);

    // Keep only last 100 render times for memory efficiency
    if (renderTimesRef.current.length > 100) {
      renderTimesRef.current.shift();
    }

    const totalRenderTime = renderTimesRef.current.reduce((sum, time) => sum + time, 0);
    const averageRenderTime = totalRenderTime / renderTimesRef.current.length;

    setMetrics({
      renderCount: renderCountRef.current,
      renderTime,
      averageRenderTime,
      lastRenderTime: renderTime,
      totalRenderTime,
      componentName,
    });
  }, [componentName]);

  return metrics;
}

/**
 * Hook to track memory usage
 */
export function useMemoryTracking(interval: number = 5000): MemoryMetrics | null {
  const [memoryMetrics, setMemoryMetrics] = useState<MemoryMetrics | null>(null);

  useEffect(() => {
    // Type-safe check for memory API
    const hasMemoryAPI = 'memory' in performance;
    if (!hasMemoryAPI) {
      return; // Memory API not available
    }

    const updateMemoryMetrics = () => {
      try {
        const memory = (
          performance as unknown as {
            memory: {
              usedJSHeapSize: number;
              totalJSHeapSize: number;
              jsHeapSizeLimit: number;
            };
          }
        ).memory;

        setMemoryMetrics({
          usedJSHeapSize: memory.usedJSHeapSize,
          totalJSHeapSize: memory.totalJSHeapSize,
          jsHeapSizeLimit: memory.jsHeapSizeLimit,
          timestamp: Date.now(),
        });
      } catch {
        // Silently ignore if memory API is not available
        console.warn('Memory tracking not available');
      }
    };

    updateMemoryMetrics();
    const intervalId = setInterval(updateMemoryMetrics, interval);

    return () => clearInterval(intervalId);
  }, [interval]);

  return memoryMetrics;
}

/**
 * Hook to detect slow renders
 */
export function useSlowRenderDetection(
  threshold: number = 16, // 16ms = 60fps
  onSlowRender?: (renderTime: number, componentName?: string) => void
) {
  const startTimeRef = useRef<number>(0);
  const componentNameRef = useRef<string | undefined>(undefined);

  useEffect(() => {
    startTimeRef.current = performance.now();
  });

  useEffect(() => {
    const endTime = performance.now();
    const renderTime = endTime - startTimeRef.current;

    if (renderTime > threshold) {
      // Development-only logging
      if (typeof window !== 'undefined' && window.location?.hostname === 'localhost') {
        console.warn(
          `Slow render detected: ${renderTime.toFixed(2)}ms` +
            (componentNameRef.current ? ` in ${componentNameRef.current}` : '')
        );
      }

      onSlowRender?.(renderTime, componentNameRef.current);
    }
  });

  return (componentName: string) => {
    componentNameRef.current = componentName;
  };
}

/**
 * Hook to track component lifecycle events
 */
export interface LifecycleMetrics {
  mountTime: number;
  unmountTime: number | null;
  updateCount: number;
  totalLifetime: number | null;
}

export function useLifecycleTracking(componentName?: string): LifecycleMetrics {
  const [metrics, setMetrics] = useState<LifecycleMetrics>({
    mountTime: Date.now(),
    unmountTime: null,
    updateCount: 0,
    totalLifetime: null,
  });

  const updateCountRef = useRef(0);
  const mountTimeRef = useRef(Date.now());

  useEffect(() => {
    updateCountRef.current += 1;

    setMetrics(prev => ({
      ...prev,
      updateCount: updateCountRef.current,
    }));
  }, []);

  useEffect(() => {
    const mountTime = mountTimeRef.current;

    return () => {
      const unmountTime = Date.now();
      const totalLifetime = unmountTime - mountTime;

      // Development-only logging
      if (typeof window !== 'undefined' && window.location?.hostname === 'localhost') {
        console.log(
          `Component ${componentName || 'Unknown'} lifecycle:`,
          `Mounted for ${totalLifetime}ms`,
          `Updated ${updateCountRef.current} times`
        );
      }

      setMetrics(prev => ({
        ...prev,
        unmountTime,
        totalLifetime,
      }));
    };
  }, [componentName]);

  return metrics;
}

/**
 * Simple execution timer hook
 */
export function useExecutionTimer(): [(fn: () => void, label?: string) => void, number | null] {
  const [lastExecutionTime, setLastExecutionTime] = useState<number | null>(null);

  const measureExecution = useCallback((fn: () => void, label?: string) => {
    const startTime = performance.now();
    fn();
    const endTime = performance.now();
    const executionTime = endTime - startTime;

    setLastExecutionTime(executionTime);

    // Development-only logging
    if (label && typeof window !== 'undefined' && window.location?.hostname === 'localhost') {
      console.log(`${label} execution time: ${executionTime.toFixed(2)}ms`);
    }
  }, []);

  return [measureExecution, lastExecutionTime];
}
