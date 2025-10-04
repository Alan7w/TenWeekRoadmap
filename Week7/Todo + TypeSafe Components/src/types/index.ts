// TypeScript types for Week 7 enhanced components
export type ID = string | number;
export type Timestamp = string; // ISO string format
export type UserRole = 'admin' | 'user' | 'guest';
export type UserStatus = 'active' | 'inactive' | 'pending' | 'banned';

export interface UserPreferences {
  notifications: boolean;
  language: string;
  timezone?: string;
}

export interface UserProfile {
  id: ID;
  name: string;
  email: string;
  bio?: string;
  avatarUrl?: string;
  role: UserRole;
  status: UserStatus;
  preferences: UserPreferences;
  createdAt: Timestamp;
  updatedAt: Timestamp;
  lastLoginAt?: Timestamp;
}

// Utility types for User
export type UpdateUserInput = Partial<Pick<UserProfile, 'name' | 'email' | 'bio' | 'avatarUrl' | 'preferences'>>;
export type TodoStatus = 'pending' | 'in_progress' | 'completed' | 'cancelled';
export type TodoPriority = 'low' | 'medium' | 'high' | 'critical';
export type TodoCategory = 'work' | 'personal' | 'shopping' | 'health' | 'other';

export interface TodoItem {
  id: ID;
  title: string;
  description?: string;
  status: TodoStatus;
  priority: TodoPriority;
  category: TodoCategory;
  tags: string[];
  dueDate?: Timestamp;
  completedAt?: Timestamp;
  createdAt: Timestamp;
  updatedAt: Timestamp;
  assignedTo?: ID; // User ID
}

// Utility types for Todo
export type UpdateTodoInput = Partial<Omit<TodoItem, 'id' | 'createdAt' | 'updatedAt'>>;

// Generic component props
export interface BaseComponentProps {
  className?: string;
  children?: React.ReactNode;
  'data-testid'?: string;
}

// Form-related types
export interface FormFieldProps extends BaseComponentProps {
  label: string;
  error?: string;
  required?: boolean;
  disabled?: boolean;
}

export interface ValidationResult {
  isValid: boolean;
  errors: Record<string, string>;
}

// Event handler types
export interface LoadingState {
  isLoading: boolean;
  error?: string;
}

// Additional interfaces for TodoList functionality
export interface TodoFilter {
  status?: TodoStatus;
  priority?: TodoPriority;
  category?: TodoCategory;
  search: string;
}

export type SortOption = 'createdAt' | 'title' | 'priority' | 'dueDate' | 'status';

export function isValidEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

export function isValidUrl(url: string): boolean {
  try {
    new URL(url);
    return true;
  } catch {
    return false;
  }
}

// Enhanced UserProfile props
export interface EnhancedUserProfileProps extends BaseComponentProps {
  user: UserProfile;
  onUpdateUser: (updates: UpdateUserInput) => Promise<void>;
  onUpdateAvatar: (avatarUrl: string) => Promise<void>;
  onUpdatePreferences: (preferences: Partial<UserPreferences>) => Promise<void>;
  readonly?: boolean;
  showPreferences?: boolean;
}

// Enhanced TodoItem props
export interface EnhancedTodoItemProps extends BaseComponentProps {
  todo: TodoItem;
  onUpdate: (updates: UpdateTodoInput) => Promise<void>;
  onDelete: () => Promise<void>;
  onToggleStatus: (status: TodoStatus) => Promise<void>;
  readonly?: boolean;
  showDetails?: boolean;
}