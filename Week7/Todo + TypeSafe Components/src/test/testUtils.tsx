// Test utilities for React Testing Library
import type { ReactElement } from 'react';
import { render } from '@testing-library/react';
import type { RenderOptions } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { vi, expect } from 'vitest';
import type { TodoItem, TodoStatus, TodoPriority, TodoCategory } from '../types';

// Custom render function that includes providers
const customRender = (ui: ReactElement, options?: Omit<RenderOptions, 'wrapper'>) =>
  render(ui, { ...options });

// Mock todo item factory
export const createMockTodo = (overrides: Partial<TodoItem> = {}): TodoItem => ({
  id: 'todo-1',
  title: 'Test Todo',
  description: 'Test description',
  status: 'not-started' as TodoStatus,
  priority: 'medium' as TodoPriority,
  category: 'work' as TodoCategory,
  tags: [],
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
  ...overrides,
});

// Mock functions factory
export const createMockHandlers = () => ({
  onUpdate: vi.fn().mockResolvedValue(undefined),
  onDelete: vi.fn().mockResolvedValue(undefined),
  onToggleStatus: vi.fn().mockResolvedValue(undefined),
});

// Common test data
export const todoStatuses: TodoStatus[] = [
  'not-started',
  'in-progress',
  'completed',
  'blocked',
  'cancelled',
  'archived',
];

export const todoPriorities: TodoPriority[] = ['low', 'medium', 'high', 'critical'];

export const todoCategories: TodoCategory[] = ['work', 'personal', 'shopping', 'health', 'other'];

// User event setup
export const setupUser = () => userEvent.setup();

// Delay utility for async testing
export const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

// Custom queries and matchers
export const queries = {
  getByTestId: (testId: string) => `[data-testid="${testId}"]`,
  getByRole: (role: string, options?: { name?: string }) =>
    options?.name ? `[role="${role}"][name="${options.name}"]` : `[role="${role}"]`,
};

// Assertion helpers
export const expectToBeVisible = (element: HTMLElement) => {
  expect(element).toBeInTheDocument();
  expect(element).toBeVisible();
};

export const expectToHaveAccessibleName = (element: HTMLElement, name: string) => {
  expect(element).toHaveAccessibleName(name);
};

export const expectToHaveAriaLabel = (element: HTMLElement, label: string) => {
  expect(element).toHaveAttribute('aria-label', label);
};

// Form interaction helpers
export const fillForm = async (
  user: ReturnType<typeof userEvent.setup>,
  inputs: Record<string, string>
) => {
  for (const [testId, value] of Object.entries(inputs)) {
    const input = document.querySelector(`[data-testid="${testId}"]`) as HTMLInputElement;
    if (input) {
      await user.clear(input);
      await user.type(input, value);
    }
  }
};

export const submitForm = async (user: ReturnType<typeof userEvent.setup>, formTestId: string) => {
  const form = document.querySelector(`[data-testid="${formTestId}"]`) as HTMLFormElement;
  if (form) {
    await user.click(form.querySelector('button[type="submit"]') as HTMLButtonElement);
  }
};

// Re-export everything from testing-library
// eslint-disable-next-line react-refresh/only-export-components
export * from '@testing-library/react';
export { default as userEvent } from '@testing-library/user-event';
export { render as defaultRender };
export { customRender as render };

// Export vi for mocking
export { vi } from 'vitest';
