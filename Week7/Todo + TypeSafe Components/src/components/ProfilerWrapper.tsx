import React, { Profiler, useState, useCallback } from 'react';
import type { ReactNode } from 'react';
import type { ProfilerData, ProfilerStats } from '../utils/profilerUtils';

/**
 * Enhanced React Profiler wrapper with detailed analytics
 */

export interface ProfilerWrapperProps {
  id: string;
  children: ReactNode;
  onProfiler?: (data: ProfilerData) => void;
  threshold?: number; // ms - warn if render takes longer
  trackRenderCause?: boolean;
  logToConsole?: boolean;
  disabled?: boolean;
}

/**
 * React Profiler wrapper with enhanced analytics and debugging
 */
export const ProfilerWrapper: React.FC<ProfilerWrapperProps> = ({
  id,
  children,
  onProfiler,
  threshold = 16, // 60fps threshold
  trackRenderCause = true,
  logToConsole = false,
  disabled = false,
}) => {
  const [, setStats] = useState<ProfilerStats>({
    totalRenders: 0,
    totalTime: 0,
    averageTime: 0,
    slowestRender: 0,
    fastestRender: Infinity,
    mountTime: 0,
    updateTimes: [],
    renderCauses: [],
    timestamp: Date.now(),
  });

  // Capture stack trace for render cause tracking
  const captureRenderCause = useCallback(() => {
    if (!trackRenderCause) return '';

    const stack = new Error().stack || '';
    const lines = stack.split('\n');

    // Find the first line that's not from React internals
    const relevantLine =
      lines.find(
        line =>
          !line.includes('react-dom') &&
          !line.includes('scheduler') &&
          !line.includes('ProfilerWrapper') &&
          line.includes('at ')
      ) || 'Unknown cause';

    return relevantLine.trim();
  }, [trackRenderCause]);

  const handleProfiler = useCallback(
    (
      id: string,
      phase: 'mount' | 'update' | 'nested-update',
      actualDuration: number,
      baseDuration: number,
      startTime: number,
      commitTime: number
    ) => {
      const profilerData: ProfilerData = {
        id,
        phase: phase === 'nested-update' ? 'update' : phase,
        actualDuration,
        baseDuration,
        startTime,
        commitTime,
        interactions: new Set(), // Empty set for now
      };

      // Track render cause
      const renderCause = captureRenderCause();

      // Update statistics
      setStats(prevStats => {
        const newUpdateTimes =
          phase === 'update' ? [...prevStats.updateTimes, actualDuration] : prevStats.updateTimes;

        const newRenderCauses =
          renderCause && !prevStats.renderCauses.includes(renderCause)
            ? [...prevStats.renderCauses, renderCause]
            : prevStats.renderCauses;

        const totalRenders = prevStats.totalRenders + 1;
        const totalTime = prevStats.totalTime + actualDuration;

        return {
          totalRenders,
          totalTime,
          averageTime: totalTime / totalRenders,
          slowestRender: Math.max(prevStats.slowestRender, actualDuration),
          fastestRender: Math.min(prevStats.fastestRender, actualDuration),
          mountTime: phase === 'mount' ? actualDuration : prevStats.mountTime,
          updateTimes: newUpdateTimes,
          renderCauses: newRenderCauses,
          timestamp: Date.now(),
        };
      });

      // Console logging
      if (logToConsole) {
        const warning = actualDuration > threshold ? ' ⚠️ SLOW RENDER' : '';
        console.log(
          `🔍 Profiler [${id}] ${phase}:`,
          `${actualDuration.toFixed(2)}ms${warning}`,
          renderCause ? `\nCause: ${renderCause}` : ''
        );
      }

      // Threshold warning
      if (actualDuration > threshold) {
        console.warn(
          `🐌 Slow render detected in ${id}:`,
          `${actualDuration.toFixed(2)}ms (threshold: ${threshold}ms)`,
          '\nConsider optimizing this component.',
          renderCause ? `\nCause: ${renderCause}` : ''
        );
      }

      // Custom callback
      onProfiler?.(profilerData);
    },
    [onProfiler, threshold, logToConsole, captureRenderCause]
  );

  // Don't wrap with Profiler if disabled
  if (disabled) {
    return <>{children}</>;
  }

  return (
    <Profiler id={id} onRender={handleProfiler}>
      {children}
    </Profiler>
  );
};
