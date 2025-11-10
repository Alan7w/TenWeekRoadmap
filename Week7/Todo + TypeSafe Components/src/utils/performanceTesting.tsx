import React from 'react';
import { render, fireEvent, act } from '@testing-library/react';
import '@testing-library/jest-dom';
import userEvent from '@testing-library/user-event';

/**
 * Performance testing utilities for React components
 */

// Performance metrics collection
export interface PerformanceTestMetrics {
  renderTime: number;
  memoryUsage: number;
  componentCount: number;
  rerenderCount: number;
  domNodeCount: number;
  firstRenderTime: number;
  updateTime: number;
}

// Performance testing configuration
export interface PerformanceTestConfig {
  iterations?: number;
  timeout?: number;
  threshold?: {
    renderTime?: number;
    memoryUsage?: number;
    rerenderCount?: number;
  };
  warmup?: number;
}

/**
 * Performance test runner
 */
export class PerformanceTestRunner {
  private metrics: PerformanceTestMetrics[] = [];
  private config: Required<PerformanceTestConfig>;

  constructor(config: PerformanceTestConfig = {}) {
    this.config = {
      iterations: config.iterations || 10,
      timeout: config.timeout || 5000,
      threshold: {
        renderTime: config.threshold?.renderTime || 16, // 60fps
        memoryUsage: config.threshold?.memoryUsage || 50 * 1024 * 1024, // 50MB
        rerenderCount: config.threshold?.rerenderCount || 5,
        ...config.threshold,
      },
      warmup: config.warmup || 3,
    };
  }

  /**
   * Run performance test for a component
   */
  async runComponentTest<P extends Record<string, unknown>>(
    Component: React.ComponentType<P>,
    props: P,
    testActions?: (container: HTMLElement) => Promise<void>
  ): Promise<PerformanceTestMetrics> {
    let renderCount = 0;
    let totalRenderTime = 0;
    let maxMemoryUsage = 0;
    let domNodeCount = 0;

    // Warmup runs
    for (let i = 0; i < this.config.warmup; i++) {
      const { unmount } = render(<Component {...props} />);
      unmount();
    }

    // Actual test runs
    for (let iteration = 0; iteration < this.config.iterations; iteration++) {
      const startTime = performance.now();
      const startMemory = this.getMemoryUsage();

      const { container, unmount } = render(<Component {...props} />);

      const firstRenderTime = performance.now() - startTime;
      renderCount++;

      // Execute test actions if provided
      if (testActions) {
        const actionStartTime = performance.now();
        await act(async () => {
          await testActions(container);
        });
        totalRenderTime += performance.now() - actionStartTime;
      }

      // Measure DOM complexity
      domNodeCount = Math.max(domNodeCount, container.querySelectorAll('*').length);

      // Measure memory usage
      const currentMemory = this.getMemoryUsage();
      maxMemoryUsage = Math.max(maxMemoryUsage, currentMemory - startMemory);

      unmount();

      totalRenderTime += firstRenderTime;
    }

    const metrics: PerformanceTestMetrics = {
      renderTime: totalRenderTime / this.config.iterations,
      memoryUsage: maxMemoryUsage,
      componentCount: 1,
      rerenderCount: renderCount,
      domNodeCount,
      firstRenderTime: totalRenderTime / this.config.iterations,
      updateTime: 0,
    };

    this.metrics.push(metrics);
    return metrics;
  }

  /**
   * Test memory leaks by mounting/unmounting repeatedly
   */
  async testMemoryLeaks<P extends Record<string, unknown>>(
    Component: React.ComponentType<P>,
    props: P,
    cycles: number = 100
  ): Promise<{ hasLeak: boolean; memoryGrowth: number; details: number[] }> {
    const memorySnapshots: number[] = [];

    // Force garbage collection if available (Chrome DevTools)
    const windowWithGC = window as unknown as { gc?: () => void };
    if (windowWithGC.gc) {
      windowWithGC.gc();
    }

    const initialMemory = this.getMemoryUsage();
    memorySnapshots.push(initialMemory);

    for (let i = 0; i < cycles; i++) {
      const { unmount } = render(<Component {...props} />);

      // Trigger some interactions to create potential leaks
      fireEvent.click(document.body);

      unmount();

      // Take memory snapshot every 10 cycles
      if (i % 10 === 0) {
        // Allow time for cleanup
        await new Promise(resolve => setTimeout(resolve, 10));

        if (windowWithGC.gc) {
          windowWithGC.gc();
        }

        memorySnapshots.push(this.getMemoryUsage());
      }
    }

    const finalMemory = this.getMemoryUsage();
    const memoryGrowth = finalMemory - initialMemory;

    // Consider it a leak if memory grew by more than 5MB
    const hasLeak = memoryGrowth > 5 * 1024 * 1024;

    return {
      hasLeak,
      memoryGrowth,
      details: memorySnapshots,
    };
  }

  /**
   * Test component rerender performance
   */
  async testRerenderPerformance<P extends Record<string, unknown>>(
    Component: React.ComponentType<P>,
    initialProps: P,
    propUpdates: Partial<P>[],
    updateInterval: number = 16
  ): Promise<{
    averageUpdateTime: number;
    maxUpdateTime: number;
    totalUpdates: number;
    droppedFrames: number;
  }> {
    let totalUpdateTime = 0;
    let maxUpdateTime = 0;
    let droppedFrames = 0;

    const { rerender } = render(<Component {...initialProps} />);

    for (const update of propUpdates) {
      const startTime = performance.now();

      await act(async () => {
        rerender(<Component {...initialProps} {...update} />);
      });

      const updateTime = performance.now() - startTime;
      totalUpdateTime += updateTime;
      maxUpdateTime = Math.max(maxUpdateTime, updateTime);

      // Count dropped frames (updates taking longer than target interval)
      if (updateTime > updateInterval) {
        droppedFrames++;
      }

      // Wait for next frame
      await new Promise(resolve => requestAnimationFrame(resolve));
    }

    return {
      averageUpdateTime: totalUpdateTime / propUpdates.length,
      maxUpdateTime,
      totalUpdates: propUpdates.length,
      droppedFrames,
    };
  }

  /**
   * Test component with large datasets
   */
  async testScalability<P extends Record<string, unknown>>(
    Component: React.ComponentType<P>,
    generateProps: (size: number) => P,
    sizes: number[] = [100, 500, 1000, 5000]
  ): Promise<Array<{ size: number; metrics: PerformanceTestMetrics }>> {
    const results: Array<{ size: number; metrics: PerformanceTestMetrics }> = [];

    for (const size of sizes) {
      const props = generateProps(size);
      const metrics = await this.runComponentTest(
        Component as React.ComponentType<Record<string, unknown>>,
        props
      );
      results.push({ size, metrics });
    }

    return results;
  }

  /**
   * Get current memory usage
   */
  private getMemoryUsage(): number {
    if (typeof window !== 'undefined' && 'performance' in window) {
      const performanceWithMemory = performance as unknown as {
        memory?: { usedJSHeapSize: number };
      };
      return performanceWithMemory.memory ? performanceWithMemory.memory.usedJSHeapSize : 0;
    }
    return 0;
  }

  /**
   * Generate performance report
   */
  generateReport(): string {
    if (this.metrics.length === 0) {
      return 'No performance metrics collected';
    }

    const avgMetrics = this.calculateAverageMetrics();
    const thresholds = this.config.threshold;

    let report = '🚀 Performance Test Report\\n';
    report += '='.repeat(40) + '\\n\\n';

    report += `📊 Test Configuration:\\n`;
    report += `  Iterations: ${this.config.iterations}\\n`;
    report += `  Warmup cycles: ${this.config.warmup}\\n`;
    report += `  Timeout: ${this.config.timeout}ms\\n\\n`;

    report += `⏱️ Timing Metrics:\\n`;
    report += `  Average render time: ${avgMetrics.renderTime.toFixed(2)}ms`;
    report +=
      avgMetrics.renderTime > (thresholds.renderTime || Infinity)
        ? ' ❌ (exceeds threshold)'
        : ' ✅';
    report += `\\n  First render time: ${avgMetrics.firstRenderTime.toFixed(2)}ms\\n`;
    report += `  Update time: ${avgMetrics.updateTime.toFixed(2)}ms\\n\\n`;

    report += `💾 Memory Metrics:\\n`;
    report += `  Memory usage: ${(avgMetrics.memoryUsage / 1024 / 1024).toFixed(2)}MB`;
    report +=
      avgMetrics.memoryUsage > (thresholds.memoryUsage || Infinity)
        ? ' ❌ (exceeds threshold)'
        : ' ✅';
    report += `\\n  DOM nodes: ${avgMetrics.domNodeCount}\\n\\n`;

    report += `🔄 Render Metrics:\\n`;
    report += `  Rerender count: ${avgMetrics.rerenderCount}`;
    report +=
      avgMetrics.rerenderCount > (thresholds.rerenderCount || Infinity)
        ? ' ❌ (exceeds threshold)'
        : ' ✅';
    report += `\\n\\n`;

    // Performance score (0-100)
    const score = this.calculatePerformanceScore(avgMetrics);
    report += `🏆 Performance Score: ${score}/100\\n`;

    if (score >= 90) report += '🌟 Excellent performance!';
    else if (score >= 70) report += '👍 Good performance';
    else if (score >= 50) report += '⚠️ Fair performance - consider optimizations';
    else report += '🚨 Poor performance - optimization required';

    return report;
  }

  /**
   * Calculate average metrics from all test runs
   */
  private calculateAverageMetrics(): PerformanceTestMetrics {
    const count = this.metrics.length;
    return {
      renderTime: this.metrics.reduce((sum, m) => sum + m.renderTime, 0) / count,
      memoryUsage: this.metrics.reduce((sum, m) => sum + m.memoryUsage, 0) / count,
      componentCount: this.metrics.reduce((sum, m) => sum + m.componentCount, 0) / count,
      rerenderCount: this.metrics.reduce((sum, m) => sum + m.rerenderCount, 0) / count,
      domNodeCount: this.metrics.reduce((sum, m) => sum + m.domNodeCount, 0) / count,
      firstRenderTime: this.metrics.reduce((sum, m) => sum + m.firstRenderTime, 0) / count,
      updateTime: this.metrics.reduce((sum, m) => sum + m.updateTime, 0) / count,
    };
  }

  /**
   * Calculate performance score (0-100)
   */
  private calculatePerformanceScore(metrics: PerformanceTestMetrics): number {
    const thresholds = this.config.threshold;
    let score = 100;

    // Deduct points for poor performance
    if (thresholds.renderTime && metrics.renderTime > thresholds.renderTime) {
      score -= Math.min(30, (metrics.renderTime / thresholds.renderTime - 1) * 50);
    }

    if (thresholds.memoryUsage && metrics.memoryUsage > thresholds.memoryUsage) {
      score -= Math.min(25, (metrics.memoryUsage / thresholds.memoryUsage - 1) * 40);
    }

    if (thresholds.rerenderCount && metrics.rerenderCount > thresholds.rerenderCount) {
      score -= Math.min(20, (metrics.rerenderCount / thresholds.rerenderCount - 1) * 30);
    }

    // DOM complexity penalty
    if (metrics.domNodeCount > 1000) {
      score -= Math.min(15, (metrics.domNodeCount / 1000 - 1) * 20);
    }

    return Math.max(0, Math.round(score));
  }

  /**
   * Clear collected metrics
   */
  clearMetrics(): void {
    this.metrics = [];
  }
}

/**
 * Utility functions for performance testing
 */
export const performanceTestUtils = {
  /**
   * Create mock data for testing
   */
  createMockTodos: (count: number) => {
    return Array.from({ length: count }, (_, i) => ({
      id: `todo-${i}`,
      title: `Todo item ${i}`,
      description: `Description for todo ${i}`,
      status: i % 3 === 0 ? 'completed' : i % 3 === 1 ? 'in-progress' : 'not-started',
      priority: ['low', 'medium', 'high', 'critical'][i % 4],
      category: ['work', 'personal', 'shopping', 'health'][i % 4],
      tags: [`tag-${i % 5}`, `tag-${(i + 1) % 5}`],
      createdAt: new Date(Date.now() - i * 1000).toISOString(),
      updatedAt: new Date(Date.now() - i * 500).toISOString(),
    }));
  },

  /**
   * Simulate user interactions
   */
  simulateUserInteractions: async (container: HTMLElement) => {
    const buttons = container.querySelectorAll('button');
    const inputs = container.querySelectorAll('input');

    // Click some buttons
    for (let i = 0; i < Math.min(5, buttons.length); i++) {
      const button = buttons[i];
      if (button) {
        await userEvent.click(button);
        await new Promise(resolve => setTimeout(resolve, 10));
      }
    }

    // Type in inputs
    for (let i = 0; i < Math.min(3, inputs.length); i++) {
      const input = inputs[i];
      if (input) {
        await userEvent.type(input, 'test input');
        await new Promise(resolve => setTimeout(resolve, 10));
      }
    }
  },

  /**
   * Stress test with rapid updates
   */
  createStressTestProps: (baseProps: Record<string, unknown>, updateCount: number) => {
    return Array.from({ length: updateCount }, (_, i) => ({
      ...baseProps,
      key: i,
      timestamp: Date.now() + i,
    }));
  },

  /**
   * Measure component bundle size impact
   */
  measureBundleSize: (componentName: string) => {
    if (typeof window !== 'undefined' && 'performance' in window) {
      const entries = performance.getEntriesByType('resource');
      const jsEntries = entries.filter(
        entry => entry.name.includes('.js') && entry.name.includes(componentName.toLowerCase())
      );

      return jsEntries.reduce(
        (total, entry) => total + (entry as PerformanceResourceTiming).transferSize,
        0
      );
    }
    return 0;
  },
};

/**
 * Jest matcher for performance assertions
 */
export const performanceMatchers = {
  toRenderWithin(received: PerformanceTestMetrics, expected: number) {
    const pass = received.renderTime <= expected;
    return {
      pass,
      message: () =>
        `Expected render time ${received.renderTime.toFixed(2)}ms to be ${pass ? 'greater than' : 'within'} ${expected}ms`,
    };
  },

  toUseMemoryWithin(received: PerformanceTestMetrics, expected: number) {
    const pass = received.memoryUsage <= expected;
    return {
      pass,
      message: () =>
        `Expected memory usage ${(received.memoryUsage / 1024 / 1024).toFixed(2)}MB to be ${pass ? 'greater than' : 'within'} ${(expected / 1024 / 1024).toFixed(2)}MB`,
    };
  },

  toHaveNoMemoryLeaks(received: { hasLeak: boolean; memoryGrowth: number }) {
    const pass = !received.hasLeak;
    return {
      pass,
      message: () =>
        `Expected no memory leaks, but memory grew by ${(received.memoryGrowth / 1024 / 1024).toFixed(2)}MB`,
    };
  },
};

// Export default test runner instance
export const defaultPerformanceRunner = new PerformanceTestRunner();
