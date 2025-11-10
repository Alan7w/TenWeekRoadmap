import { useMemo } from 'react';

/**
 * Virtualization configuration interface
 */
export interface VirtualizationConfig {
  totalItems: number;
  itemHeight: number;
  containerHeight: number;
  scrollTop: number;
  overscan?: number;
  bufferSize?: number;
}

/**
 * Virtual scrolling result interface
 */
export interface VirtualizationResult {
  totalHeight: number;
  startIndex: number;
  endIndex: number;
  visibleRange: number[];
  offsetY: number;
}

/**
 * Custom hook for virtual scrolling calculations
 * Optimizes rendering by only calculating visible items
 */
export function useVirtualization(config: VirtualizationConfig): VirtualizationResult {
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
 * Advanced virtualization hook with dynamic item heights
 * For more complex scenarios where items have variable heights
 */
export interface DynamicVirtualizationConfig {
  totalItems: number;
  estimatedItemHeight: number;
  containerHeight: number;
  scrollTop: number;
  getItemHeight?: (index: number) => number;
  overscan?: number;
}

export interface DynamicVirtualizationResult {
  totalHeight: number;
  startIndex: number;
  endIndex: number;
  visibleItems: Array<{
    index: number;
    offsetTop: number;
    height: number;
  }>;
}

export function useDynamicVirtualization(
  config: DynamicVirtualizationConfig
): DynamicVirtualizationResult {
  const {
    totalItems,
    estimatedItemHeight,
    containerHeight,
    scrollTop,
    getItemHeight,
    overscan = 5,
  } = config;

  return useMemo(() => {
    const itemHeights: number[] = [];
    const itemOffsets: number[] = [];
    let totalHeight = 0;

    // Calculate positions for all items
    for (let i = 0; i < totalItems; i++) {
      const height = getItemHeight ? getItemHeight(i) : estimatedItemHeight;
      itemHeights[i] = height;
      itemOffsets[i] = totalHeight;
      totalHeight += height;
    }

    // Binary search to find start index
    let startIndex = 0;
    let endIndex = totalItems - 1;
    while (startIndex <= endIndex) {
      const middleIndex = Math.floor((startIndex + endIndex) / 2);
      const middleOffset = itemOffsets[middleIndex];

      if (middleOffset !== undefined && middleOffset < scrollTop) {
        startIndex = middleIndex + 1;
      } else {
        endIndex = middleIndex - 1;
      }
    }

    startIndex = Math.max(0, endIndex);

    // Find end index
    const viewportBottom = scrollTop + containerHeight;
    endIndex = startIndex;
    while (endIndex < totalItems && (itemOffsets[endIndex] ?? 0) < viewportBottom) {
      endIndex++;
    }

    // Apply overscan
    const overscanStartIndex = Math.max(0, startIndex - overscan);
    const overscanEndIndex = Math.min(totalItems - 1, endIndex + overscan);

    // Generate visible items
    const visibleItems = [];
    for (let i = overscanStartIndex; i <= overscanEndIndex; i++) {
      visibleItems.push({
        index: i,
        offsetTop: itemOffsets[i] ?? 0,
        height: itemHeights[i] ?? estimatedItemHeight,
      });
    }

    return {
      totalHeight,
      startIndex: overscanStartIndex,
      endIndex: overscanEndIndex,
      visibleItems,
    };
  }, [totalItems, estimatedItemHeight, containerHeight, scrollTop, getItemHeight, overscan]);
}

/**
 * Hook for horizontal virtualization
 */
export interface HorizontalVirtualizationConfig {
  totalItems: number;
  itemWidth: number;
  containerWidth: number;
  scrollLeft: number;
  overscan?: number;
}

export function useHorizontalVirtualization(
  config: HorizontalVirtualizationConfig
): VirtualizationResult {
  const { totalItems, itemWidth, containerWidth, scrollLeft, overscan = 5 } = config;

  return useMemo(() => {
    const totalWidth = totalItems * itemWidth;

    const startIndex = Math.floor(scrollLeft / itemWidth);
    const endIndex = Math.min(
      totalItems - 1,
      Math.floor((scrollLeft + containerWidth) / itemWidth)
    );

    const overscanStartIndex = Math.max(0, startIndex - overscan);
    const overscanEndIndex = Math.min(totalItems - 1, endIndex + overscan);

    const visibleRange: number[] = [];
    for (let i = overscanStartIndex; i <= overscanEndIndex; i++) {
      visibleRange.push(i);
    }

    const offsetX = overscanStartIndex * itemWidth;

    return {
      totalHeight: totalWidth, // Using totalHeight property for consistency
      startIndex: overscanStartIndex,
      endIndex: overscanEndIndex,
      visibleRange,
      offsetY: offsetX, // Using offsetY property for consistency
    };
  }, [totalItems, itemWidth, containerWidth, scrollLeft, overscan]);
}
