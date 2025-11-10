// Main Application Component with Error Boundaries
import { useState } from 'react';
import EnhancedUserProfile from './components/EnhancedUserProfile';
import EnhancedTodoListSimple from './components/EnhancedTodoListSimple';
import { ErrorProvider } from './components/ErrorProvider';
import { DataErrorBoundary, NetworkErrorBoundary } from './components/ErrorRecovery';
import type { TodoItem, UserProfile, UserPreferences } from './types';
import type { ErrorReport } from './contexts/ErrorContext';
import './App.css';

function App() {
  // App State Management
  const [activeTab, setActiveTab] = useState<'profile' | 'todos'>('profile');
  const [todos, setTodos] = useState<TodoItem[]>([]);

  // User Profile Data
  const [user, setUser] = useState<UserProfile>({
    id: '1',
    name: 'John Doe',
    email: 'john.doe@example.com',
    bio: 'A passionate developer learning TypeScript',
    avatarUrl: 'https://via.placeholder.com/150',
    role: 'user',
    status: 'active',
    preferences: {
      language: 'en',
      notifications: true,
    },
    createdAt: new Date('2024-01-01').toISOString(),
    updatedAt: new Date().toISOString(),
    lastLoginAt: new Date().toISOString(),
  });

  // Todo CRUD Operations
  const addTodo = (text: string, priority: 'low' | 'medium' | 'high' = 'medium') => {
    const newTodo: TodoItem = {
      id: crypto.randomUUID(),
      title: text,
      description: '',
      status: 'not-started',
      priority,
      category: 'personal',
      tags: [],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      dueDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(), // 1 week from now
    };
    setTodos((prev) => [...prev, newTodo]);
  };

  // Error handling
  const handleGlobalError = (errorReport: ErrorReport) => {
    console.log('Global error reported:', errorReport);
    // In a real app, you might send this to analytics
  };

  // Render
  return (
    <ErrorProvider
      onError={handleGlobalError}
      reportingEndpoint={import.meta.env?.VITE_ERROR_REPORTING_ENDPOINT}
      maxRetries={3}
      autoRetryDelay={1000}
    >
      <DataErrorBoundary>
        <div className='min-h-screen bg-gray-100'>
          <div className='container mx-auto px-4 py-8'>
            <header className='text-center mb-8'>
              <h1 className='text-4xl font-bold text-gray-800 mb-2'>
                Week 7: TypeScript Components with Error Boundaries
              </h1>
              <p className='text-lg text-gray-600'>
                Enhanced UserProfile (Week 2) and TodoList (Week 3) with TypeScript fundamentals and
                error handling
              </p>
            </header>

            <div className='flex justify-center mb-8'>
              <div className='flex bg-white rounded-lg shadow-md p-1'>
                <button
                  onClick={() => setActiveTab('profile')}
                  className={`px-6 py-3 rounded-md font-medium transition-colors cursor-pointer ${
                    activeTab === 'profile'
                      ? 'bg-blue-600 text-white'
                      : 'text-gray-600 hover:text-blue-600'
                  }`}
                >
                  Enhanced UserProfile
                </button>
                <button
                  onClick={() => setActiveTab('todos')}
                  className={`px-6 py-3 rounded-md font-medium transition-colors cursor-pointer ${
                    activeTab === 'todos'
                      ? 'bg-blue-600 text-white'
                      : 'text-gray-600 hover:text-blue-600'
                  }`}
                >
                  Enhanced TodoList
                </button>
              </div>
            </div>

            <main>
              <div className='bg-white rounded-lg shadow-lg overflow-hidden'>
                {activeTab === 'profile' && (
                  <DataErrorBoundary>
                    <div className='p-6'>
                      <h2 className='text-2xl font-bold text-gray-800 mb-4'>
                        Enhanced User Profile with TypeScript
                      </h2>
                      <EnhancedUserProfile
                        user={user}
                        onUpdateUser={async (updates) => {
                          setUser((prev) => ({ ...prev, ...updates }));
                          console.log('User updated:', updates);
                        }}
                        onUpdatePreferences={async (prefs: Partial<UserPreferences>) => {
                          setUser((prev) => ({ ...prev, preferences: { ...prev.preferences, ...prefs } }));
                          console.log('Preferences updated:', prefs);
                        }}
                        onUpdateAvatar={async (avatarUrl: string) => {
                          setUser((prev) => ({ ...prev, avatarUrl }));
                          console.log('Avatar updated:', avatarUrl);
                        }}
                      />
                    </div>
                  </DataErrorBoundary>
                )}

                {activeTab === 'todos' && (
                  <div className='p-6'>
                    <h2 className='text-2xl font-bold text-gray-800 mb-4'>
                      Enhanced Todo List with TypeScript
                    </h2>
                    <button
                      onClick={() => addTodo('Sample todo task')}
                      className='mb-4 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700'
                    >
                      Add Sample Todo
                    </button>

                    <NetworkErrorBoundary>
                      <DataErrorBoundary>
                        <EnhancedTodoListSimple 
                          initialTodos={todos} 
                          onTodoChange={setTodos}
                          showStats={true}
                        />
                      </DataErrorBoundary>
                    </NetworkErrorBoundary>
                  </div>
                )}
              </div>
            </main>
          </div>
        </div>
      </DataErrorBoundary>
    </ErrorProvider>
  );
}

export default App;
