// Base Types
export type ID = string | number;
export type Timestamp = string;

// User Role System
export const USER_ROLES = {
  ADMIN: 'admin',
  USER: 'user',
  GUEST: 'guest'
} as const;


export type UserRole = typeof USER_ROLES[keyof typeof USER_ROLES];

// User Permissions
export const USER_PERMISSIONS = {
  READ: 1,
  WRITE: 2,
  DELETE: 4,
  ADMIN: 8
} as const;

export type UserPermissionLevel = typeof USER_PERMISSIONS[keyof typeof USER_PERMISSIONS];

// Role Configuration
export const ROLE_CONFIG = {
  [USER_ROLES.ADMIN]: {
    permissions: USER_PERMISSIONS.READ | USER_PERMISSIONS.WRITE | USER_PERMISSIONS.DELETE | USER_PERMISSIONS.ADMIN,
    label: 'Administrator',
    description: 'Full system access',
    color: '#dc2626'
  },
  [USER_ROLES.USER]: {
    permissions: USER_PERMISSIONS.READ | USER_PERMISSIONS.WRITE,
    label: 'User',
    description: 'Standard user access',
    color: '#2563eb'
  },
  [USER_ROLES.GUEST]: {
    permissions: USER_PERMISSIONS.READ,
    label: 'Guest',
    description: 'Read-only access',
    color: '#6b7280'
  }
} as const;

export type RoleConfig = typeof ROLE_CONFIG[UserRole];

// Todo Status System
export const TODO_STATUS_CONFIGS = {
  'not-started': {
    label: 'Not Started',
    color: '#6b7280',
    icon: '⚪',
    sortOrder: 1,
    allowedTransitions: ['in-progress', 'cancelled']
  },
  'in-progress': {
    label: 'In Progress',
    color: '#2563eb',
    icon: '🔵',
    sortOrder: 2,
    allowedTransitions: ['completed', 'blocked', 'cancelled']
  },
  'completed': {
    label: 'Completed',
    color: '#059669',
    icon: '✅',
    sortOrder: 3,
    allowedTransitions: ['archived']
  },
  'blocked': {
    label: 'Blocked',
    color: '#dc2626',
    icon: '🔴',
    sortOrder: 4,
    allowedTransitions: ['in-progress', 'cancelled']
  },
  'cancelled': {
    label: 'Cancelled',
    color: '#9333ea',
    icon: '❌',
    sortOrder: 5,
    allowedTransitions: ['not-started']
  },
  'archived': {
    label: 'Archived',
    color: '#4b5563',
    icon: '📦',
    sortOrder: 6,
    allowedTransitions: []
  }
} as const;


export type TodoStatusLiteral = keyof typeof TODO_STATUS_CONFIGS;
export type StatusConfig = typeof TODO_STATUS_CONFIGS[TodoStatusLiteral];


export type UserStatus = 'active' | 'inactive' | 'pending' | 'banned';

// User Interfaces
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


export type UpdateUserInput = Partial<Pick<UserProfile, 'name' | 'email' | 'bio' | 'avatarUrl' | 'preferences'>>;


export type TodoStatus = TodoStatusLiteral;

// Type Guards & Utilities
export function isValidUserRole(role: string): role is UserRole {
  return Object.values(USER_ROLES).includes(role as UserRole);
}


export function isValidTodoStatus(status: string): status is TodoStatus {
  return status in TODO_STATUS_CONFIGS;
}


export function hasPermission(role: UserRole, permission: UserPermissionLevel): boolean {
  const roleConfig = ROLE_CONFIG[role];
  return (roleConfig.permissions & permission) === permission;
}


export function canTransitionStatus(from: TodoStatus, to: TodoStatus): boolean {
  const fromConfig = TODO_STATUS_CONFIGS[from];
  return (fromConfig.allowedTransitions as readonly TodoStatus[]).includes(to);
}


export function getAvailableTransitions(currentStatus: TodoStatus): readonly TodoStatus[] {
  return TODO_STATUS_CONFIGS[currentStatus].allowedTransitions;
}


export function isHigherRole(role1: UserRole, role2: UserRole): boolean {
  const roleOrder = [USER_ROLES.GUEST, USER_ROLES.USER, USER_ROLES.ADMIN];
  return roleOrder.indexOf(role1) > roleOrder.indexOf(role2);
}

// Select Options
export const userRoleOptions: SelectOption<UserRole>[] = Object.entries(ROLE_CONFIG).map(([role, config]) => ({
  value: role as UserRole,
  label: config.label,
  description: config.description
}));

export const todoStatusOptions: SelectOption<TodoStatus>[] = Object.entries(TODO_STATUS_CONFIGS).map(([status, config]) => ({
  value: status as TodoStatus,
  label: `${config.icon} ${config.label}`,
  description: `${config.allowedTransitions.length} transitions available`
}));

// Todo Types
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

export type UpdateTodoInput = Partial<Omit<TodoItem, 'id' | 'createdAt' | 'updatedAt'>>;

export interface BaseComponentProps {
  className?: string | undefined;
  children?: React.ReactNode | undefined;
  'data-testid'?: string | undefined;
}

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

export interface LoadingState {
  isLoading: boolean;
  error?: string;
}

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

export interface EnhancedUserProfileProps extends BaseComponentProps {
  user: UserProfile;
  onUpdateUser: (updates: UpdateUserInput) => Promise<void>;
  onUpdateAvatar: (avatarUrl: string) => Promise<void>;
  onUpdatePreferences: (preferences: Partial<UserPreferences>) => Promise<void>;
  readonly?: boolean;
  showPreferences?: boolean;
}

export interface EnhancedTodoItemProps extends BaseComponentProps {
  todo: TodoItem;
  onUpdate: (updates: UpdateTodoInput) => Promise<void>;
  onDelete: () => Promise<void>;
  onToggleStatus: (status: TodoStatus) => Promise<void>;
  readonly?: boolean;
  showDetails?: boolean;
}

// Select Component Types
export interface SelectOption<T = unknown> {
  value: T;
  label: string;
  disabled?: boolean;
  icon?: React.ReactNode;
  description?: string;
  group?: string;
}

export interface SelectState<T> {
  isOpen: boolean;
  selectedValue: T | null;
  selectedOption: SelectOption<T> | null;
  highlightedIndex: number;
  searchTerm: string;
  filteredOptions: SelectOption<T>[];
}

export interface SelectHandlers<T> {
  onOpen: () => void;
  onClose: () => void;
  onToggle: () => void;
  onSelect: (option: SelectOption<T>) => void;
  onSearchChange: (term: string) => void;
  onKeyDown: (event: React.KeyboardEvent) => void;
  onHighlight: (index: number) => void;
}

export interface SelectProps<T> extends BaseComponentProps {
  options: SelectOption<T>[];
  value?: T | null;
  defaultValue?: T | null;
  onValueChange?: ((value: T | null) => void) | undefined;
  placeholder?: string | undefined;
  disabled?: boolean | undefined;
  clearable?: boolean | undefined;
  searchable?: boolean | undefined;
  multiple?: boolean | undefined;
  loading?: boolean | undefined;
  error?: string | undefined;
  size?: 'sm' | 'md' | 'lg' | undefined;
  variant?: 'default' | 'outline' | 'ghost' | undefined;
  position?: 'bottom' | 'top' | 'auto' | undefined;
  maxHeight?: number | undefined;
  renderOption?: ((option: SelectOption<T>) => React.ReactNode) | undefined;
  renderValue?: ((option: SelectOption<T> | null) => React.ReactNode) | undefined;
  filterFn?: ((option: SelectOption<T>, searchTerm: string) => boolean) | undefined;
  'aria-label'?: string | undefined;
  'aria-labelledby'?: string | undefined;
}

export interface MultiSelectProps<T> extends Omit<SelectProps<T>, 'value' | 'defaultValue' | 'onValueChange' | 'multiple'> {
  value?: T[];
  defaultValue?: T[];
  onValueChange?: (values: T[]) => void;
  multiple: true;
  maxSelections?: number;
}

export interface SelectContextValue<T> {
  state: SelectState<T>;
  handlers: SelectHandlers<T>;
  props: SelectProps<T>;
  refs: {
    triggerRef: React.RefObject<HTMLButtonElement | null>;
    contentRef: React.RefObject<HTMLDivElement | null>;
    searchRef: React.RefObject<HTMLInputElement | null>;
  };
}

export interface SelectTriggerProps extends BaseComponentProps {
  asChild?: boolean;
  disabled?: boolean;
}

export interface SelectContentProps extends BaseComponentProps {
  position?: 'bottom' | 'top' | 'auto';
  align?: 'start' | 'center' | 'end';
  sideOffset?: number;
  alignOffset?: number;
  avoidCollisions?: boolean;
}

export interface SelectItemProps<T> extends BaseComponentProps {
  value: T;
  disabled?: boolean;
  textValue?: string;
}

export interface SelectLabelProps extends BaseComponentProps {
  asChild?: boolean;
}

export interface SelectSeparatorProps extends BaseComponentProps {
  asChild?: boolean;
}

export interface SelectGroupProps extends BaseComponentProps {
  asChild?: boolean;
}

export type SelectValue<T> = T | null;
export type MultiSelectValue<T> = T[];
export type SelectSize = 'sm' | 'md' | 'lg';
export type SelectVariant = 'default' | 'outline' | 'ghost';
export type SelectPosition = 'bottom' | 'top' | 'auto';

export interface PriorityOption extends SelectOption<TodoPriority> {
  value: TodoPriority;
  color?: string;
  badgeVariant?: string;
}

export interface CategoryOption extends SelectOption<TodoCategory> {
  value: TodoCategory;
  color?: string;
  icon?: React.ReactNode;
}

export interface StatusOption extends SelectOption<TodoStatus> {
  value: TodoStatus;
  color?: string;
  badgeVariant?: string;
}