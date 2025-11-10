import { useMemo, useCallback, useRef, useState, useEffect } from 'react';
import type { DependencyList } from 'react';

/**
 * Advanced memoization utilities for performance optimization
 */

// Deep comparison function for complex objects
export function deepEqual<T>(a: T, b: T): boolean {
  if (a === b) return true;

  if (a === null || b === null) return false;
  if (typeof a !== typeof b) return false;

  if (typeof a !== 'object') return a === b;

  if (Array.isArray(a) !== Array.isArray(b)) return false;

  if (Array.isArray(a)) {
    const arrA = a as unknown[];
    const arrB = b as unknown[];
    if (arrA.length !== arrB.length) return false;
    return arrA.every((item, index) => deepEqual(item, arrB[index]));
  }

  const keysA = Object.keys(a as Record<string, unknown>);
  const keysB = Object.keys(b as Record<string, unknown>);
  if (keysA.length !== keysB.length) return false;

  return keysA.every(
    key =>
      keysB.includes(key) &&
      deepEqual((a as Record<string, unknown>)[key], (b as Record<string, unknown>)[key])
  );
}

/**
 * Enhanced useMemo with deep comparison for complex dependencies
 */
export function useDeepMemo<T>(factory: () => T, deps: DependencyList): T {
  const ref = useRef<{ deps: DependencyList; value: T } | null>(null);

  if (!ref.current || !deepEqual(deps, ref.current.deps)) {
    ref.current = {
      deps,
      value: factory(),
    };
  }

  return ref.current.value;
}

/**
 * Enhanced useCallback with deep comparison for complex dependencies
 */
export function useDeepCallback<T extends (...args: unknown[]) => unknown>(
  callback: T,
  deps: DependencyList
): T {
  const ref = useRef<{ deps: DependencyList; callback: T } | null>(null);

  if (!ref.current || !deepEqual(deps, ref.current.deps)) {
    ref.current = {
      deps,
      callback,
    };
  }

  return ref.current.callback;
}

/**
 * Memoization hook with cache invalidation
 */
export function useMemoWithInvalidation<T>(
  factory: () => T,
  deps: DependencyList,
  invalidateAfter?: number // milliseconds
): [T, () => void] {
  const cacheRef = useRef<{
    deps: DependencyList;
    value: T;
    timestamp: number;
  } | null>(null);

  const invalidate = useCallback(() => {
    cacheRef.current = null;
  }, []);

  const shouldInvalidate = useMemo(() => {
    if (!cacheRef.current) return true;
    if (!deepEqual(deps, cacheRef.current.deps)) return true;
    if (invalidateAfter && Date.now() - cacheRef.current.timestamp > invalidateAfter) {
      return true;
    }
    return false;
  }, [deps, invalidateAfter]);

  if (shouldInvalidate) {
    cacheRef.current = {
      deps,
      value: factory(),
      timestamp: Date.now(),
    };
  }

  return [cacheRef.current!.value, invalidate];
}

/**
 * Stable reference hook - ensures object/array references don't change unnecessarily
 */
export function useStableReference<T extends object>(value: T): T {
  const ref = useRef<T>(value);

  if (!deepEqual(ref.current, value)) {
    ref.current = value;
  }

  return ref.current;
}

/**
 * Function memoization decorator for heavy computations
 */
export function memoize<TArgs extends unknown[], TReturn>(
  fn: (...args: TArgs) => TReturn,
  keySelector?: (...args: TArgs) => string
): (...args: TArgs) => TReturn {
  const cache = new Map<string, TReturn>();

  return (...args: TArgs): TReturn => {
    const key = keySelector ? keySelector(...args) : JSON.stringify(args);

    if (cache.has(key)) {
      return cache.get(key)!;
    }

    const result = fn(...args);
    cache.set(key, result);
    return result;
  };
}

/**
 * Debounced memoization for rapid updates
 * Note: This has relaxed dependency checking for complex use cases
 */
export function useDebouncedMemo<T>(
  factory: () => T,
  deps: DependencyList,
  delay: number = 300
): T {
  const [value, setValue] = useState<T>(() => factory());
  const timeoutRef = useRef<number | null>(null);
  const depsRef = useRef(deps);

  // Update deps ref when they change
  if (!deepEqual(depsRef.current, deps)) {
    depsRef.current = deps;
  }

  useEffect(() => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }

    timeoutRef.current = window.setTimeout(() => {
      setValue(factory());
    }, delay);

    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [depsRef.current, delay]);

  return value;
}

// Export types
export type MemoizedFunction<T extends (...args: unknown[]) => unknown> = T & {
  cache: Map<string, ReturnType<T>>;
  clearCache: () => void;
};
