import React, { useState, useEffect, memo, useCallback, useMemo } from 'react';
import { ProfilerWrapper } from './ProfilerWrapper';
import {
  useRerenderDetector,
  useWhyDidYouUpdate,
  useRenderTracker,
  useExpensiveRenderDetector,
  useLifecycleTracker,
  usePropChangeTracker,
} from '../hooks/useRerenderDetection';

/**
 * Demo components showing common performance issues and solutions
 */

// ❌ BAD: Component that re-renders unnecessarily
const BadComponent: React.FC<{ data: string[] }> = ({ data }) => {
  const [, forceUpdate] = useState({});

  // BAD: Creates new object on every render
  const config = {
    showCount: true,
    prefix: 'Item: ',
  };

  // BAD: Function created on every render
  const handleClick = () => {
    console.log('Clicked');
  };

  // BAD: Expensive calculation on every render
  const expensiveValue = data.map(item => item.toUpperCase()).join(', ');

  useRerenderDetector('BadComponent', { data, config });
  useWhyDidYouUpdate('BadComponent', { data, config });
  useExpensiveRenderDetector('BadComponent');

  return (
    <ProfilerWrapper id='BadComponent' logToConsole>
      <div
        style={{ padding: '16px', border: '2px solid #ff6b6b', borderRadius: '8px', margin: '8px' }}
      >
        <h3>❌ Bad Component (Causes unnecessary re-renders)</h3>
        <p>Expensive value: {expensiveValue}</p>
        <button onClick={handleClick}>Click me</button>
        <button onClick={() => forceUpdate({})}>Force Re-render</button>
        <div>Config: {JSON.stringify(config)}</div>
      </div>
    </ProfilerWrapper>
  );
};

// ✅ GOOD: Optimized component
const GoodComponent = memo<{ data: string[] }>(({ data }) => {
  const [, forceUpdate] = useState({});

  // GOOD: Stable reference using useMemo
  const config = useMemo(
    () => ({
      showCount: true,
      prefix: 'Item: ',
    }),
    []
  );

  // GOOD: Stable function reference using useCallback
  const handleClick = useCallback(() => {
    console.log('Clicked');
  }, []);

  // GOOD: Expensive calculation only when data changes
  const expensiveValue = useMemo(() => data.map(item => item.toUpperCase()).join(', '), [data]);

  useRerenderDetector('GoodComponent', { data, config });
  useWhyDidYouUpdate('GoodComponent', { data, config });
  useExpensiveRenderDetector('GoodComponent');

  return (
    <ProfilerWrapper id='GoodComponent' logToConsole>
      <div
        style={{ padding: '16px', border: '2px solid #51cf66', borderRadius: '8px', margin: '8px' }}
      >
        <h3>✅ Good Component (Optimized)</h3>
        <p>Expensive value: {expensiveValue}</p>
        <button onClick={handleClick}>Click me</button>
        <button onClick={() => forceUpdate({})}>Force Re-render</button>
        <div>Config: {JSON.stringify(config)}</div>
      </div>
    </ProfilerWrapper>
  );
});

GoodComponent.displayName = 'GoodComponent';

// Component that demonstrates heavy rendering
const HeavyComponent: React.FC<{ items: number; shouldOptimize: boolean }> = ({
  items,
  shouldOptimize,
}) => {
  useExpensiveRenderDetector('HeavyComponent', 50);
  useRenderTracker('HeavyComponent');

  // Simulate expensive rendering
  const renderItems = () => {
    const result = [];
    for (let i = 0; i < items; i++) {
      // Simulate expensive operation
      if (!shouldOptimize) {
        // BAD: Do expensive work on every render
        const expensiveValue = Array.from({ length: 1000 }, (_, j) => i * j).reduce(
          (a, b) => a + b,
          0
        );
        result.push(
          <div key={i} style={{ padding: '4px', background: '#f0f0f0', margin: '2px' }}>
            Item {i} - Expensive: {expensiveValue}
          </div>
        );
      } else {
        // GOOD: Simple rendering
        result.push(
          <div key={i} style={{ padding: '4px', background: '#f0f0f0', margin: '2px' }}>
            Item {i}
          </div>
        );
      }
    }
    return result;
  };

  return (
    <ProfilerWrapper id='HeavyComponent' threshold={50}>
      <div
        style={{
          padding: '16px',
          border: `2px solid ${shouldOptimize ? '#51cf66' : '#ff6b6b'}`,
          borderRadius: '8px',
          margin: '8px',
          maxHeight: '200px',
          overflowY: 'auto',
        }}
      >
        <h3>
          {shouldOptimize ? '✅' : '❌'} Heavy Component ({items} items)
        </h3>
        {renderItems()}
      </div>
    </ProfilerWrapper>
  );
};

// Component with lifecycle tracking
const LifecycleComponent: React.FC<{ id: string }> = ({ id }) => {
  const lifecycle = useLifecycleTracker(`LifecycleComponent-${id}`);
  const [count, setCount] = useState(0);

  usePropChangeTracker(`LifecycleComponent-${id}`, { id, count });

  useEffect(() => {
    const interval = setInterval(() => {
      setCount(c => c + 1);
    }, 2000);

    return () => clearInterval(interval);
  }, []);

  return (
    <ProfilerWrapper id={`LifecycleComponent-${id}`}>
      <div
        style={{ padding: '16px', border: '1px solid #339af0', borderRadius: '8px', margin: '8px' }}
      >
        <h4>🔄 Lifecycle Component {id}</h4>
        <p>Count: {count}</p>
        <p>Mounted at: {new Date(lifecycle.mountTime).toLocaleTimeString()}</p>
        <p>Lifespan: {Math.round(lifecycle.getLifespan() / 1000)}s</p>
        {lifecycle.isUnmounting && <p style={{ color: 'red' }}>Unmounting...</p>}
      </div>
    </ProfilerWrapper>
  );
};

// Main demo component
export const ProfilingDemo: React.FC = () => {
  const [sampleData, setSampleData] = useState(['apple', 'banana', 'cherry']);
  const [heavyItems, setHeavyItems] = useState(100);
  const [optimizeHeavy, setOptimizeHeavy] = useState(false);
  const [lifecycleComponents, setLifecycleComponents] = useState<string[]>(['comp1']);

  const addData = useCallback(() => {
    setSampleData(prev => [...prev, `item-${prev.length}`]);
  }, []);

  const addLifecycleComponent = useCallback(() => {
    setLifecycleComponents(prev => [...prev, `comp${prev.length + 1}`]);
  }, []);

  const removeLifecycleComponent = useCallback(() => {
    setLifecycleComponents(prev => prev.slice(0, -1));
  }, []);

  return (
    <ProfilerWrapper id='ProfilingDemo' threshold={100}>
      <div style={{ padding: '20px', fontFamily: 'Arial, sans-serif' }}>
        <h1>🔍 React Profiler & DevTools Demo</h1>
        <p>
          This demo shows various performance patterns and how to detect them with React Profiler
          and DevTools.
        </p>

        {/* Controls */}
        <div
          style={{
            background: '#f8f9fa',
            padding: '16px',
            borderRadius: '8px',
            marginBottom: '20px',
            display: 'flex',
            flexWrap: 'wrap',
            gap: '12px',
          }}
        >
          <button
            onClick={addData}
            style={{ padding: '8px 16px', borderRadius: '4px', border: '1px solid #ccc' }}
          >
            Add Data Item
          </button>

          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <label>Heavy Items:</label>
            <input
              type='range'
              min='50'
              max='500'
              value={heavyItems}
              onChange={e => setHeavyItems(Number(e.target.value))}
            />
            <span>{heavyItems}</span>
          </div>

          <label style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <input
              type='checkbox'
              checked={optimizeHeavy}
              onChange={e => setOptimizeHeavy(e.target.checked)}
            />
            Optimize Heavy Component
          </label>

          <button
            onClick={addLifecycleComponent}
            style={{ padding: '8px 16px', borderRadius: '4px', border: '1px solid #ccc' }}
          >
            Add Lifecycle Component
          </button>

          <button
            onClick={removeLifecycleComponent}
            disabled={lifecycleComponents.length === 0}
            style={{
              padding: '8px 16px',
              borderRadius: '4px',
              border: '1px solid #ccc',
              opacity: lifecycleComponents.length === 0 ? 0.5 : 1,
            }}
          >
            Remove Lifecycle Component
          </button>
        </div>

        {/* Performance Comparison */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: '1fr 1fr',
            gap: '16px',
            marginBottom: '20px',
          }}
        >
          <BadComponent data={sampleData} />
          <GoodComponent data={sampleData} />
        </div>

        {/* Heavy Component Demo */}
        <HeavyComponent items={heavyItems} shouldOptimize={optimizeHeavy} />

        {/* Lifecycle Components */}
        <div style={{ marginTop: '20px' }}>
          <h2>Lifecycle Tracking</h2>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
            {lifecycleComponents.map(id => (
              <LifecycleComponent key={id} id={id} />
            ))}
          </div>
        </div>

        {/* Instructions */}
        <div
          style={{
            background: '#e3f2fd',
            padding: '16px',
            borderRadius: '8px',
            marginTop: '20px',
          }}
        >
          <h3>📋 How to Use This Demo</h3>
          <ol style={{ marginLeft: '20px' }}>
            <li>Open your browser's Developer Tools (F12)</li>
            <li>Go to the React Developer Tools "Profiler" tab</li>
            <li>Click "Start profiling" (record button)</li>
            <li>Interact with the components above (add data, toggle optimization, etc.)</li>
            <li>Stop profiling and analyze the flame graph</li>
            <li>Check the console for rerender detection logs</li>
            <li>Use the Performance Dashboard (top-right corner) for real-time metrics</li>
          </ol>

          <h4>🔍 What to Look For:</h4>
          <ul style={{ marginLeft: '20px' }}>
            <li>
              <strong>Bad Component:</strong> Should show unnecessary re-renders and longer render
              times
            </li>
            <li>
              <strong>Good Component:</strong> Should only re-render when props actually change
            </li>
            <li>
              <strong>Heavy Component:</strong> Compare render times with optimization on/off
            </li>
            <li>
              <strong>Console Logs:</strong> Watch for "why-did-you-update" and rerender detection
              messages
            </li>
          </ul>
        </div>
      </div>
    </ProfilerWrapper>
  );
};
