import React, { useState, useEffect, useMemo } from 'react';
import { ProfilerWrapper } from './ProfilerWrapper';
import {
  globalDevToolsMonitor,
  type DevToolsProfileData,
  PerformanceAlerts,
} from '../utils/devToolsIntegration';
import { globalProfiler } from '../utils/profilerUtils';

/**
 * Performance Dashboard Component
 */
export const PerformanceDashboard: React.FC = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [performanceData, setPerformanceData] = useState<DevToolsProfileData[]>([]);
  const [alerts, setAlerts] = useState<ReturnType<typeof PerformanceAlerts.getAlerts>>([]);
  const [activeTab, setActiveTab] = useState<'overview' | 'components' | 'alerts' | 'operations'>(
    'overview'
  );

  // Update performance data periodically
  useEffect(() => {
    const interval = setInterval(() => {
      setPerformanceData(globalDevToolsMonitor.getComponentsPerformanceData());
      setAlerts(PerformanceAlerts.getAlerts());
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  const summary = useMemo(() => {
    return globalDevToolsMonitor.generatePerformanceSummary();
  }, []);

  const operationStats = useMemo(() => {
    return globalProfiler.getAllStats();
  }, []);

  if (!isVisible) {
    return (
      <div
        style={{
          position: 'fixed',
          top: '20px',
          right: '20px',
          zIndex: 10000,
          background: '#007acc',
          color: 'white',
          padding: '8px 12px',
          borderRadius: '4px',
          cursor: 'pointer',
          fontSize: '12px',
          fontFamily: 'monospace',
        }}
        onClick={() => setIsVisible(true)}
      >
        📊 Performance Dashboard
      </div>
    );
  }

  return (
    <ProfilerWrapper id='PerformanceDashboard' threshold={32}>
      <div
        style={{
          position: 'fixed',
          top: '20px',
          right: '20px',
          width: '600px',
          maxHeight: '80vh',
          background: 'white',
          border: '1px solid #ddd',
          borderRadius: '8px',
          boxShadow: '0 4px 20px rgba(0,0,0,0.15)',
          zIndex: 10000,
          fontFamily: 'Arial, sans-serif',
          fontSize: '14px',
          overflow: 'hidden',
        }}
      >
        {/* Header */}
        <div
          style={{
            background: '#f8f9fa',
            padding: '12px 16px',
            borderBottom: '1px solid #eee',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
          }}
        >
          <h3 style={{ margin: 0, fontSize: '16px' }}>🚀 Performance Dashboard</h3>
          <button
            onClick={() => setIsVisible(false)}
            style={{
              background: 'none',
              border: 'none',
              fontSize: '18px',
              cursor: 'pointer',
              padding: '0',
              color: '#666',
            }}
          >
            ✕
          </button>
        </div>

        {/* Tabs */}
        <div
          style={{
            background: '#f8f9fa',
            padding: '0 16px',
            borderBottom: '1px solid #eee',
            display: 'flex',
            gap: '0',
          }}
        >
          {(['overview', 'components', 'alerts', 'operations'] as const).map(tab => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              style={{
                background: activeTab === tab ? 'white' : 'transparent',
                border: 'none',
                padding: '8px 12px',
                cursor: 'pointer',
                borderBottom: activeTab === tab ? 'none' : '1px solid #eee',
                textTransform: 'capitalize',
              }}
            >
              {tab}
            </button>
          ))}
        </div>

        {/* Content */}
        <div
          style={{
            padding: '16px',
            maxHeight: '60vh',
            overflowY: 'auto',
          }}
        >
          {activeTab === 'overview' && <OverviewTab summary={summary} />}
          {activeTab === 'components' && <ComponentsTab components={performanceData} />}
          {activeTab === 'alerts' && <AlertsTab alerts={alerts} />}
          {activeTab === 'operations' && <OperationsTab operations={operationStats} />}
        </div>
      </div>
    </ProfilerWrapper>
  );
};

const OverviewTab: React.FC<{
  summary: ReturnType<typeof globalDevToolsMonitor.generatePerformanceSummary>;
}> = ({ summary }) => (
  <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
    {/* Performance Score */}
    <div
      style={{
        background:
          summary.performanceScore >= 80
            ? '#d4edda'
            : summary.performanceScore >= 60
              ? '#fff3cd'
              : '#f8d7da',
        border: `1px solid ${summary.performanceScore >= 80 ? '#c3e6cb' : summary.performanceScore >= 60 ? '#ffeaa7' : '#f5c6cb'}`,
        borderRadius: '4px',
        padding: '12px',
        textAlign: 'center',
      }}
    >
      <div style={{ fontSize: '24px', fontWeight: 'bold', marginBottom: '4px' }}>
        {summary.performanceScore}/100
      </div>
      <div style={{ fontSize: '12px', color: '#666' }}>Performance Score</div>
    </div>

    {/* Key Metrics */}
    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
      <MetricCard title='Total Components' value={summary.totalComponents.toString()} icon='🧩' />
      <MetricCard title='Total Renders' value={summary.totalRenders.toString()} icon='🔄' />
      <MetricCard
        title='Avg Render Time'
        value={`${summary.averageRenderTime.toFixed(2)}ms`}
        icon='⏱️'
        warning={summary.averageRenderTime > 16}
      />
      <MetricCard
        title='Slow Components'
        value={summary.slowComponentsCount.toString()}
        icon='🐌'
        warning={summary.slowComponentsCount > 0}
      />
    </div>

    {/* Top Slow Components */}
    {summary.slowComponents.length > 0 && (
      <div>
        <h4 style={{ margin: '0 0 8px 0', fontSize: '14px' }}>⚠️ Slowest Components</h4>
        {summary.slowComponents.map(component => (
          <div
            key={component.componentName}
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              padding: '4px 8px',
              background: '#fff3cd',
              marginBottom: '4px',
              borderRadius: '4px',
              fontSize: '12px',
            }}
          >
            <span>{component.componentName}</span>
            <span>{component.averageTime.toFixed(2)}ms avg</span>
          </div>
        ))}
      </div>
    )}
  </div>
);

const ComponentsTab: React.FC<{ components: DevToolsProfileData[] }> = ({ components }) => (
  <div>
    <div style={{ marginBottom: '12px', fontSize: '12px', color: '#666' }}>
      Showing {components.length} components sorted by total render time
    </div>

    {components.length === 0 ? (
      <div style={{ textAlign: 'center', color: '#666', padding: '20px' }}>
        No component data available
      </div>
    ) : (
      <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
        {components.slice(0, 20).map(component => (
          <div
            key={component.componentName}
            style={{
              padding: '8px',
              border: '1px solid #eee',
              borderRadius: '4px',
              background: component.isSlowComponent ? '#fff3cd' : 'white',
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{ fontWeight: 'bold' }}>{component.componentName}</span>
              {component.isSlowComponent && <span style={{ color: '#856404' }}>🐌</span>}
            </div>
            <div style={{ fontSize: '12px', color: '#666', marginTop: '4px' }}>
              Renders: {component.renderCount} | Avg: {component.averageTime.toFixed(2)}ms | Total:{' '}
              {component.totalTime.toFixed(2)}ms
            </div>
          </div>
        ))}
      </div>
    )}
  </div>
);

const AlertsTab: React.FC<{ alerts: ReturnType<typeof PerformanceAlerts.getAlerts> }> = ({
  alerts,
}) => (
  <div>
    <div
      style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: '12px',
      }}
    >
      <span style={{ fontSize: '12px', color: '#666' }}>{alerts.length} alerts</span>
      <button
        onClick={() => PerformanceAlerts.clearAlerts()}
        style={{
          background: '#dc3545',
          color: 'white',
          border: 'none',
          padding: '4px 8px',
          borderRadius: '4px',
          fontSize: '11px',
          cursor: 'pointer',
        }}
      >
        Clear All
      </button>
    </div>

    {alerts.length === 0 ? (
      <div style={{ textAlign: 'center', color: '#666', padding: '20px' }}>
        ✅ No performance alerts
      </div>
    ) : (
      <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
        {alerts
          .slice()
          .reverse()
          .slice(0, 20)
          .map((alert, index) => (
            <div
              key={index}
              style={{
                padding: '8px',
                border: `1px solid ${alert.type === 'error' ? '#f5c6cb' : '#ffeaa7'}`,
                borderRadius: '4px',
                background: alert.type === 'error' ? '#f8d7da' : '#fff3cd',
              }}
            >
              <div
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'flex-start',
                }}
              >
                <div>
                  <div style={{ fontWeight: 'bold', marginBottom: '4px' }}>
                    {alert.type === 'error' ? '🚨' : '⚠️'} {alert.component}
                  </div>
                  <div style={{ fontSize: '12px' }}>{alert.message}</div>
                </div>
                <div style={{ fontSize: '11px', color: '#666' }}>
                  {new Date(alert.timestamp).toLocaleTimeString()}
                </div>
              </div>
            </div>
          ))}
      </div>
    )}
  </div>
);

const OperationsTab: React.FC<{ operations: ReturnType<typeof globalProfiler.getAllStats> }> = ({
  operations,
}) => {
  const operationEntries = Object.entries(operations).filter(([, stats]) => stats !== null);

  return (
    <div>
      <div style={{ marginBottom: '12px', fontSize: '12px', color: '#666' }}>
        {operationEntries.length} tracked operations
      </div>

      {operationEntries.length === 0 ? (
        <div style={{ textAlign: 'center', color: '#666', padding: '20px' }}>
          No operation data available
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
          {operationEntries.map(([operationId, stats]) => (
            <div
              key={operationId}
              style={{
                padding: '8px',
                border: '1px solid #eee',
                borderRadius: '4px',
                background: 'white',
              }}
            >
              <div style={{ fontWeight: 'bold', marginBottom: '4px' }}>{operationId}</div>
              <div style={{ fontSize: '12px', color: '#666' }}>
                Count: {stats?.count} | Avg: {stats?.average.toFixed(2)}ms | Min:{' '}
                {stats?.min.toFixed(2)}ms | Max: {stats?.max.toFixed(2)}ms
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

const MetricCard: React.FC<{
  title: string;
  value: string;
  icon: string;
  warning?: boolean;
}> = ({ title, value, icon, warning = false }) => (
  <div
    style={{
      padding: '12px',
      border: '1px solid #eee',
      borderRadius: '4px',
      background: warning ? '#fff3cd' : 'white',
      textAlign: 'center',
    }}
  >
    <div style={{ fontSize: '18px', marginBottom: '4px' }}>{icon}</div>
    <div style={{ fontWeight: 'bold', fontSize: '16px', marginBottom: '2px' }}>{value}</div>
    <div style={{ fontSize: '11px', color: '#666' }}>{title}</div>
  </div>
);
