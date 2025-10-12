// Main Application Component
import { useState } from 'react';
import EnhancedUserProfile from './components/EnhancedUserProfile';
import EnhancedTodoListSimple from './components/EnhancedTodoListSimple';
import type { TodoItem, UserProfile, UserPreferences } from './types';
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
      notifications: true
    },
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  });

  // Event Handlers
  const handleUpdateUser = async (updates: Partial<UserProfile>) => {
    await new Promise(resolve => setTimeout(resolve, 500));
    setUser(prev => ({ ...prev, ...updates }));
  };

  const handleUpdateAvatar = async (newAvatar: string) => {
    await new Promise(resolve => setTimeout(resolve, 500));
    setUser(prev => ({ ...prev, avatar: newAvatar }));
  };

  const handleUpdatePreferences = async (newPreferences: Partial<UserPreferences>) => {
    await new Promise(resolve => setTimeout(resolve, 500));
    setUser(prev => ({ ...prev, preferences: { ...prev.preferences, ...newPreferences } }));
  };

  // Render
  return (
    <div className="min-h-screen bg-gray-100">
      <div className="container mx-auto px-4 py-8">
        <header className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-800 mb-2">
            Week 7: TypeScript Components
          </h1>
          <p className="text-lg text-gray-600">
            Enhanced UserProfile (Week 2) and TodoList (Week 3) with TypeScript fundamentals
          </p>
        </header>


        <div className="flex justify-center mb-8">
          <div className="flex bg-white rounded-lg shadow-md p-1">
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


        <div className="max-w-6xl mx-auto">
          {activeTab === 'profile' && (
            <div>
              <EnhancedUserProfile 
                user={user}
                onUpdateUser={handleUpdateUser}
                onUpdateAvatar={handleUpdateAvatar}
                onUpdatePreferences={handleUpdatePreferences}
              />
            </div>
          )}

          {activeTab === 'todos' && (
            <div>
              <EnhancedTodoListSimple
                initialTodos={todos}
                onTodoChange={setTodos}
                maxTodos={50}
                showStats={true}
              />
            </div>
          )}

        </div>
      </div>
    </div>
  );
}

export default App;