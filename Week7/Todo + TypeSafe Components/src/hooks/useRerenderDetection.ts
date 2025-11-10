import { useRef, useEffect, useState, useCallback } from 'react';
import { RerenderDetector, type RerenderInfo } from '../utils/devToolsIntegration';

/**
 * Hook to detect and track re-renders in functional components
 */
export function useRerenderDetector(componentName: string, props: Record<string, unknown>) {
  const detector = useRef<RerenderDetector | null>(null);
  const [rerenderInfo, setRerenderInfo] = useState<RerenderInfo[]>([]);

  // Initialize detector on first render
  if (!detector.current) {
    detector.current = RerenderDetector.getInstance(componentName);

    // Subscribe to rerender events
    detector.current.onRerender(info => {
      setRerenderInfo(prev => [...prev.slice(-19), info]); // Keep last 20 rerenders
    });
  }

  // Track re-render on every render
  useEffect(() => {
    detector.current?.detectRerender(props);
  });

  const clearHistory = useCallback(() => {
    setRerenderInfo([]);
  }, []);

  return {
    rerenderHistory: rerenderInfo,
    clearHistory,
    totalRerenders: rerenderInfo.length,
    unnecessaryRerenders: rerenderInfo.filter(info => info.reason.includes('Unnecessary')).length,
  };
}

/**
 * Hook to track why a component re-rendered
 */
export function useWhyDidYouUpdate(name: string, props: Record<string, unknown>) {
  const previous = useRef<Record<string, unknown> | undefined>(undefined);

  useEffect(() => {
    if (previous.current) {
      const allKeys = Object.keys({ ...previous.current, ...props });
      const changedProps: Record<string, { from: unknown; to: unknown }> = {};

      allKeys.forEach(key => {
        if (previous.current![key] !== props[key]) {
          changedProps[key] = {
            from: previous.current![key],
            to: props[key],
          };
        }
      });

      if (Object.keys(changedProps).length) {
        console.log('[why-did-you-update]', name, changedProps);
      }
    }

    previous.current = props;
  });
}

/**
 * Hook to track render count and timing
 */
export function useRenderTracker(componentName: string) {
  const renderCount = useRef(0);
  const renderTimes = useRef<number[]>([]);
  const lastRender = useRef<number>(0);

  useEffect(() => {
    const now = performance.now();
    renderCount.current += 1;

    if (lastRender.current > 0) {
      const timeSinceLastRender = now - lastRender.current;
      renderTimes.current.push(timeSinceLastRender);

      // Keep only last 50 render times
      if (renderTimes.current.length > 50) {
        renderTimes.current = renderTimes.current.slice(-50);
      }
    }

    lastRender.current = now;
  });

  const getStats = useCallback(() => {
    const times = renderTimes.current;
    if (times.length === 0) return null;

    const total = times.reduce((sum, time) => sum + time, 0);
    const average = total / times.length;
    const min = Math.min(...times);
    const max = Math.max(...times);

    return {
      componentName,
      renderCount: renderCount.current,
      averageTimeBetweenRenders: average,
      minTimeBetweenRenders: min,
      maxTimeBetweenRenders: max,
      recentRenderTimes: [...times],
    };
  }, [componentName]);

  return {
    renderCount: renderCount.current,
    getStats,
  };
}

/**
 * Hook to detect expensive renders
 */
export function useExpensiveRenderDetector(componentName: string, threshold = 16) {
  const renderStart = useRef<number>(0);
  const expensiveRenders = useRef<Array<{ timestamp: number; duration: number }>>([]);

  // Mark render start
  renderStart.current = performance.now();

  useEffect(() => {
    // Measure render duration
    const renderDuration = performance.now() - renderStart.current;

    if (renderDuration > threshold) {
      expensiveRenders.current.push({
        timestamp: Date.now(),
        duration: renderDuration,
      });

      // Keep only last 20 expensive renders
      if (expensiveRenders.current.length > 20) {
        expensiveRenders.current = expensiveRenders.current.slice(-20);
      }

      console.warn(
        `🐌 Expensive render detected in ${componentName}: ${renderDuration.toFixed(2)}ms`
      );
    }
  });

  return {
    expensiveRenders: expensiveRenders.current,
    hasExpensiveRenders: expensiveRenders.current.length > 0,
    averageExpensiveRenderTime:
      expensiveRenders.current.length > 0
        ? expensiveRenders.current.reduce((sum, render) => sum + render.duration, 0) /
          expensiveRenders.current.length
        : 0,
  };
}

/**
 * Hook to track component mount/unmount lifecycle
 */
export function useLifecycleTracker(componentName: string) {
  const mountTime = useRef<number>(Date.now());
  const [isUnmounting, setIsUnmounting] = useState(false);

  useEffect(() => {
    const currentMountTime = mountTime.current;
    console.log(
      `📱 ${componentName} mounted at ${new Date(currentMountTime).toLocaleTimeString()}`
    );

    return () => {
      setIsUnmounting(true);
      const unmountTime = Date.now();
      const lifespan = unmountTime - currentMountTime;
      console.log(
        `🗑️ ${componentName} unmounted after ${lifespan}ms (${(lifespan / 1000).toFixed(1)}s)`
      );
    };
  }, [componentName]);

  return {
    mountTime: mountTime.current,
    isUnmounting,
    getLifespan: () => Date.now() - mountTime.current,
  };
}

/**
 * Hook to track prop changes over time
 */
export function usePropChangeTracker<T extends Record<string, unknown>>(
  componentName: string,
  props: T
) {
  const propHistory = useRef<Array<{ timestamp: number; props: T }>>([]);
  const previousProps = useRef<T | undefined>(undefined);

  useEffect(() => {
    // Add current props to history
    propHistory.current.push({
      timestamp: Date.now(),
      props: { ...props },
    });

    // Keep only last 10 prop states
    if (propHistory.current.length > 10) {
      propHistory.current = propHistory.current.slice(-10);
    }

    // Log prop changes
    if (previousProps.current) {
      const changes: string[] = [];

      for (const key in props) {
        if (previousProps.current[key] !== props[key]) {
          changes.push(
            `${key}: ${JSON.stringify(previousProps.current[key])} → ${JSON.stringify(props[key])}`
          );
        }
      }

      if (changes.length > 0) {
        console.log(`🔄 ${componentName} props changed:`, changes);
      }
    }

    previousProps.current = { ...props };
  });

  return {
    propHistory: propHistory.current,
    getCurrentProps: () => ({ ...props }),
    getPropChanges: (steps = 1) => {
      const history = propHistory.current;
      if (history.length < steps + 1) return [];

      const current = history[history.length - 1]?.props;
      const previous = history[history.length - 1 - steps]?.props;

      if (!current || !previous) return [];

      const changes: Array<{
        key: string;
        from: unknown;
        to: unknown;
      }> = [];

      for (const key in current) {
        if (previous[key] !== current[key]) {
          changes.push({
            key,
            from: previous[key],
            to: current[key],
          });
        }
      }

      return changes;
    },
  };
}
