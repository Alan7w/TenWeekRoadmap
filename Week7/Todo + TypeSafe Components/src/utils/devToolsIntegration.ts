/**
 * React DevTools integration utilities for performance analysis
 */

export interface DevToolsProfileData {
  componentName: string;
  renderCount: number;
  totalTime: number;
  averageTime: number;
  lastRenderTime: number;
  isSlowComponent: boolean;
}

export interface RerenderInfo {
  componentName: string;
  reason: string;
  propsChanges: string[];
  stateChanges: string[];
  contextChanges: string[];
  timestamp: number;
}

// Type definitions for React DevTools
interface DevToolsHook {
  onCommitFiberRoot?: (id: number, root: FiberRoot, priorityLevel?: number) => void;
}

interface FiberRoot {
  current: FiberNode;
}

interface FiberNode {
  elementType?: ComponentFunction;
  actualDuration?: number;
  child?: FiberNode | null;
  sibling?: FiberNode | null;
}

interface ComponentFunction {
  displayName?: string;
  name?: string;
  (...args: unknown[]): unknown;
}

interface WindowWithDevTools extends Window {
  __REACT_DEVTOOLS_GLOBAL_HOOK__?: DevToolsHook;
}

/**
 * DevTools performance monitor
 */
export class DevToolsMonitor {
  private isDevToolsAvailable: boolean;
  private componentData: Map<string, DevToolsProfileData> = new Map();

  constructor() {
    this.isDevToolsAvailable = this.checkDevToolsAvailability();
    this.setupDevToolsIntegration();
  }

  private checkDevToolsAvailability(): boolean {
    // Check if React DevTools is available
    return (
      typeof window !== 'undefined' &&
      (window as WindowWithDevTools).__REACT_DEVTOOLS_GLOBAL_HOOK__ !== undefined
    );
  }

  private setupDevToolsIntegration() {
    if (!this.isDevToolsAvailable) {
      console.warn('React DevTools not detected. Some features may be limited.');
      return;
    }

    try {
      // Hook into React DevTools if available
      const devToolsHook = (window as WindowWithDevTools).__REACT_DEVTOOLS_GLOBAL_HOOK__;

      if (devToolsHook && devToolsHook.onCommitFiberRoot) {
        const originalOnCommit = devToolsHook.onCommitFiberRoot;

        devToolsHook.onCommitFiberRoot = (id: number, root: FiberRoot, priorityLevel?: number) => {
          this.captureCommitData(root);
          return originalOnCommit.call(devToolsHook, id, root, priorityLevel);
        };
      }
    } catch (error) {
      console.warn('Failed to hook into React DevTools:', error);
    }
  }

  private captureCommitData(root: FiberRoot) {
    // Extract performance data from React Fiber tree
    try {
      this.traverseFiberTree(root.current);
    } catch (error) {
      console.warn('Error capturing commit data:', error);
    }
  }

  private traverseFiberTree(fiber: FiberNode | null) {
    if (!fiber) return;

    // Extract component information
    if (fiber.elementType && typeof fiber.elementType === 'function') {
      const componentName = fiber.elementType.displayName || fiber.elementType.name || 'Anonymous';
      this.updateComponentData(componentName, fiber);
    }

    // Traverse children
    let child = fiber.child;
    while (child) {
      this.traverseFiberTree(child);
      child = child.sibling;
    }
  }

  private updateComponentData(componentName: string, fiber: FiberNode) {
    const existing = this.componentData.get(componentName) || {
      componentName,
      renderCount: 0,
      totalTime: 0,
      averageTime: 0,
      lastRenderTime: 0,
      isSlowComponent: false,
    };

    const renderTime = fiber.actualDuration || 0;

    const updated: DevToolsProfileData = {
      ...existing,
      renderCount: existing.renderCount + 1,
      totalTime: existing.totalTime + renderTime,
      lastRenderTime: renderTime,
      averageTime: (existing.totalTime + renderTime) / (existing.renderCount + 1),
      isSlowComponent: renderTime > 16, // Slower than 16ms (60fps)
    };

    this.componentData.set(componentName, updated);
  }

  /**
   * Get performance data for all components
   */
  getComponentsPerformanceData(): DevToolsProfileData[] {
    return Array.from(this.componentData.values()).sort((a, b) => b.totalTime - a.totalTime);
  }

  /**
   * Get slow components (render time > threshold)
   */
  getSlowComponents(threshold = 16): DevToolsProfileData[] {
    return this.getComponentsPerformanceData().filter(
      component => component.averageTime > threshold
    );
  }

  /**
   * Get most frequently rendering components
   */
  getMostActiveComponents(limit = 10): DevToolsProfileData[] {
    return this.getComponentsPerformanceData()
      .sort((a, b) => b.renderCount - a.renderCount)
      .slice(0, limit);
  }

  /**
   * Reset all collected data
   */
  reset() {
    this.componentData.clear();
  }

  /**
   * Get DevTools availability status
   */
  isDevToolsDetected(): boolean {
    return this.isDevToolsAvailable;
  }

  /**
   * Generate performance summary
   */
  generatePerformanceSummary() {
    const components = this.getComponentsPerformanceData();
    const slowComponents = this.getSlowComponents();
    const totalRenders = components.reduce((sum, comp) => sum + comp.renderCount, 0);
    const totalTime = components.reduce((sum, comp) => sum + comp.totalTime, 0);

    return {
      totalComponents: components.length,
      totalRenders,
      totalRenderTime: totalTime,
      averageRenderTime: totalTime / totalRenders || 0,
      slowComponentsCount: slowComponents.length,
      slowComponents: slowComponents.slice(0, 5), // Top 5 slow components
      mostActiveComponents: this.getMostActiveComponents(5),
      performanceScore: this.calculatePerformanceScore(components),
    };
  }

  private calculatePerformanceScore(components: DevToolsProfileData[]): number {
    if (components.length === 0) return 100;

    const slowComponentsRatio =
      components.filter(c => c.isSlowComponent).length / components.length;
    const averageRenderTime =
      components.reduce((sum, c) => sum + c.averageTime, 0) / components.length;

    let score = 100;

    // Deduct points for slow components
    score -= slowComponentsRatio * 40;

    // Deduct points for high average render time
    if (averageRenderTime > 16) {
      score -= Math.min(30, (averageRenderTime - 16) * 2);
    }

    // Deduct points for excessive re-renders
    const excessiveRerenders = components.filter(c => c.renderCount > 50).length;
    score -= (excessiveRerenders / components.length) * 20;

    return Math.max(0, Math.round(score));
  }
}

/**
 * Component wrapper to detect unnecessary re-renders
 */
export class RerenderDetector {
  private static instances: Map<string, RerenderDetector> = new Map();
  private componentName: string;
  private lastProps: Record<string, unknown> = {};
  private lastState: Record<string, unknown> = {};
  private renderCount = 0;
  private callbacks: Array<(info: RerenderInfo) => void> = [];

  constructor(componentName: string) {
    this.componentName = componentName;
    RerenderDetector.instances.set(componentName, this);
  }

  static getInstance(componentName: string): RerenderDetector {
    if (!RerenderDetector.instances.has(componentName)) {
      new RerenderDetector(componentName);
    }
    return RerenderDetector.instances.get(componentName)!;
  }

  detectRerender(currentProps: Record<string, unknown>, currentState?: Record<string, unknown>) {
    this.renderCount++;

    if (this.renderCount === 1) {
      // First render
      this.lastProps = currentProps;
      this.lastState = currentState || {};
      return;
    }

    const propsChanges = this.detectChanges(this.lastProps, currentProps, 'props');
    const stateChanges = currentState
      ? this.detectChanges(this.lastState, currentState, 'state')
      : [];

    if (propsChanges.length === 0 && stateChanges.length === 0) {
      // Unnecessary re-render detected
      const rerenderInfo: RerenderInfo = {
        componentName: this.componentName,
        reason: 'Unnecessary re-render - no props or state changes detected',
        propsChanges: [],
        stateChanges: [],
        contextChanges: [], // Would need additional tracking
        timestamp: Date.now(),
      };

      this.notifyCallbacks(rerenderInfo);
      console.warn(`🔄 Unnecessary re-render detected in ${this.componentName}`);
    } else {
      // Necessary re-render
      const rerenderInfo: RerenderInfo = {
        componentName: this.componentName,
        reason: 'Props or state changed',
        propsChanges,
        stateChanges,
        contextChanges: [],
        timestamp: Date.now(),
      };

      this.notifyCallbacks(rerenderInfo);
    }

    this.lastProps = currentProps;
    this.lastState = currentState || {};
  }

  private detectChanges(
    oldObj: Record<string, unknown>,
    newObj: Record<string, unknown>,
    type: 'props' | 'state'
  ): string[] {
    const changes: string[] = [];

    if (!oldObj || !newObj) return changes;

    // Check for added or changed properties
    for (const key in newObj) {
      if (oldObj[key] !== newObj[key]) {
        changes.push(
          `${type}.${key}: ${JSON.stringify(oldObj[key])} → ${JSON.stringify(newObj[key])}`
        );
      }
    }

    // Check for removed properties
    for (const key in oldObj) {
      if (!(key in newObj)) {
        changes.push(`${type}.${key}: removed`);
      }
    }

    return changes;
  }

  onRerender(callback: (info: RerenderInfo) => void) {
    this.callbacks.push(callback);
  }

  private notifyCallbacks(info: RerenderInfo) {
    this.callbacks.forEach(callback => {
      try {
        callback(info);
      } catch (error) {
        console.error('Error in rerender callback:', error);
      }
    });
  }

  static getAllDetectors(): Map<string, RerenderDetector> {
    return RerenderDetector.instances;
  }

  static clearAll() {
    RerenderDetector.instances.clear();
  }
}

// Global DevTools monitor instance
export const globalDevToolsMonitor = new DevToolsMonitor();

/**
 * Performance alerts system
 */
export class PerformanceAlerts {
  private static alerts: Array<{
    type: 'warning' | 'error';
    message: string;
    component: string;
    timestamp: number;
  }> = [];

  static addAlert(type: 'warning' | 'error', message: string, component: string) {
    this.alerts.push({
      type,
      message,
      component,
      timestamp: Date.now(),
    });

    // Keep only last 100 alerts
    if (this.alerts.length > 100) {
      this.alerts = this.alerts.slice(-100);
    }

    // Log to console
    if (type === 'error') {
      console.error(`🚨 Performance Error [${component}]: ${message}`);
    } else {
      console.warn(`⚠️ Performance Warning [${component}]: ${message}`);
    }
  }

  static getAlerts() {
    return [...this.alerts];
  }

  static clearAlerts() {
    this.alerts = [];
  }

  static getAlertsForComponent(componentName: string) {
    return this.alerts.filter(alert => alert.component === componentName);
  }
}

/**
 * Hook for detecting re-renders in functional components
 */
export const createRerenderDetectorHook = (componentName: string) => {
  return (props: Record<string, unknown>, state?: Record<string, unknown>) => {
    const detector = RerenderDetector.getInstance(componentName);
    detector.detectRerender(props, state);
  };
};
