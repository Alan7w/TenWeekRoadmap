/**
 * Profiler utilities and classes
 */

export interface ProfilerData {
  id: string;
  phase: 'mount' | 'update';
  actualDuration: number;
  baseDuration: number;
  startTime: number;
  commitTime: number;
  interactions: Set<unknown>;
}

export interface ProfilerStats {
  totalRenders: number;
  totalTime: number;
  averageTime: number;
  slowestRender: number;
  fastestRender: number;
  mountTime: number;
  updateTimes: number[];
  renderCauses: string[];
  timestamp: number;
}

/**
 * Profiler for measuring specific operations
 */
export class OperationProfiler {
  private measurements: Map<string, number[]> = new Map();
  private startTimes: Map<string, number> = new Map();

  start(operationId: string): void {
    this.startTimes.set(operationId, performance.now());
  }

  end(operationId: string): number {
    const startTime = this.startTimes.get(operationId);
    if (!startTime) {
      console.warn(`No start time found for operation: ${operationId}`);
      return 0;
    }

    const duration = performance.now() - startTime;

    const measurements = this.measurements.get(operationId) || [];
    measurements.push(duration);
    this.measurements.set(operationId, measurements);

    this.startTimes.delete(operationId);

    return duration;
  }

  getStats(operationId: string) {
    const measurements = this.measurements.get(operationId) || [];

    if (measurements.length === 0) {
      return null;
    }

    const total = measurements.reduce((sum, time) => sum + time, 0);
    const avg = total / measurements.length;
    const min = Math.min(...measurements);
    const max = Math.max(...measurements);

    return {
      count: measurements.length,
      total,
      average: avg,
      min,
      max,
      measurements: [...measurements],
    };
  }

  getAllStats() {
    const stats: Record<string, ReturnType<typeof this.getStats>> = {};

    for (const operationId of this.measurements.keys()) {
      stats[operationId] = this.getStats(operationId);
    }

    return stats;
  }

  clear(operationId?: string) {
    if (operationId) {
      this.measurements.delete(operationId);
      this.startTimes.delete(operationId);
    } else {
      this.measurements.clear();
      this.startTimes.clear();
    }
  }
}

// Global operation profiler instance
export const globalProfiler = new OperationProfiler();
