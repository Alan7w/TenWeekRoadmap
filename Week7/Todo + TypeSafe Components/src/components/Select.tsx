// Generic Select Component
import React, { forwardRef, useMemo } from 'react';
import { SelectProvider } from '../contexts/SelectContext';
import { useSelect } from '../hooks/useSelect';
import type { SelectProps, SelectContextValue } from '../types';

// Main Select Component
export const Select = forwardRef<HTMLDivElement, SelectProps<unknown>>(function Select<T>(
  {
    options,
    value,
    defaultValue,
    onValueChange,
    placeholder = 'Select an option...',
    disabled = false,
    clearable = false,
    searchable = false,
    multiple = false,
    loading = false,
    error,
    size = 'md',
    variant = 'default',
    position = 'bottom',
    maxHeight = 200,
    renderOption,
    renderValue,
    filterFn,
    className = '',
    children,
    'data-testid': testId,
    'aria-label': ariaLabel,
    'aria-labelledby': ariaLabelledBy,
    ...props
  }: SelectProps<T>,
  ref: React.Ref<HTMLDivElement>
) {
  const selectHook = useSelect({
    options,
    value,
    defaultValue,
    onValueChange,
    searchable,
    clearable,
    disabled,
    filterFn,
  });

  const contextValue: SelectContextValue<T> = useMemo(
    () => ({
      state: selectHook.state,
      handlers: selectHook.handlers,
      props: {
        options,
        value: value ?? null,
        defaultValue: defaultValue ?? null,
        onValueChange,
        placeholder,
        disabled,
        clearable,
        searchable,
        multiple,
        loading,
        error,
        size,
        variant,
        position,
        maxHeight,
        renderOption,
        renderValue,
        filterFn,
        className,
        children,
        'data-testid': testId,
        'aria-label': ariaLabel,
        'aria-labelledby': ariaLabelledBy,
      },
      refs: selectHook.refs,
    }),
    [
      selectHook.state,
      selectHook.handlers,
      selectHook.refs,
      options,
      value,
      defaultValue,
      onValueChange,
      placeholder,
      disabled,
      clearable,
      searchable,
      multiple,
      loading,
      error,
      size,
      variant,
      position,
      maxHeight,
      renderOption,
      renderValue,
      filterFn,
      className,
      children,
      testId,
      ariaLabel,
      ariaLabelledBy,
    ]
  );

  const containerClasses = useMemo(() => {
    const classes = ['relative', 'w-full'];

    if (className) classes.push(className);
    if (disabled) classes.push('opacity-50', 'cursor-not-allowed');

    return classes.join(' ');
  }, [className, disabled]);

  return (
    <SelectProvider value={contextValue}>
      <div ref={ref} className={containerClasses} data-testid={testId} {...props}>
        {children}
      </div>
    </SelectProvider>
  );
}) as <T>(props: SelectProps<T> & { ref?: React.Ref<HTMLDivElement> }) => React.ReactElement;

// Simple Select Component
export const SimpleSelect = forwardRef<HTMLDivElement, SelectProps<unknown>>(function SimpleSelect<
  T,
>(props: SelectProps<T>, ref: React.Ref<HTMLDivElement>) {
  const {
    placeholder = 'Select an option...',
    size = 'md',
    variant = 'default',
    error,
    loading,
  } = props;

  return (
    <Select {...props} ref={ref}>
      <SelectTrigger
        size={size}
        variant={variant}
        {...(error && { error })}
        {...(loading && { loading })}
      >
        <SelectValue placeholder={placeholder} />
      </SelectTrigger>
      <SelectContent>
        <SelectList />
      </SelectContent>
    </Select>
  );
}) as <T>(props: SelectProps<T> & { ref?: React.Ref<HTMLDivElement> }) => React.ReactElement;

// Select Value Display
export function SelectValue({
  placeholder = 'Select...',
  className = '',
}: {
  placeholder?: string;
  className?: string;
}) {
  const { state, props } = useSelectContext();
  const { renderValue } = props;

  const displayValue = useMemo(() => {
    if (state.selectedOption) {
      if (renderValue) {
        return renderValue(state.selectedOption);
      }
      return state.selectedOption.label;
    }
    return placeholder;
  }, [state.selectedOption, renderValue, placeholder]);

  const valueClasses = useMemo(() => {
    const classes = ['truncate'];

    if (!state.selectedOption) {
      classes.push('text-gray-500');
    }

    if (className) classes.push(className);

    return classes.join(' ');
  }, [state.selectedOption, className]);

  return <span className={valueClasses}>{displayValue}</span>;
}

// Select Options List
export function SelectList({ className = '' }: { className?: string }) {
  const { state } = useSelectContext();

  const listClasses = useMemo(() => {
    const classes = ['py-1'];
    if (className) classes.push(className);
    return classes.join(' ');
  }, [className]);

  if (state.filteredOptions.length === 0) {
    return (
      <div className='px-3 py-2 text-sm text-gray-500 text-center'>
        {state.searchTerm ? 'No options found' : 'No options available'}
      </div>
    );
  }

  return (
    <div className={listClasses}>
      {state.filteredOptions.map((option, index) => (
        <SelectItem
          key={`${option.value}-${index}`}
          value={option.value}
          disabled={option.disabled ?? false}
        >
          {option.label}
        </SelectItem>
      ))}
    </div>
  );
}

import { useSelectContext } from '../hooks/useSelectContext';

// Select Trigger Button
function SelectTrigger({
  children,
  size,
  variant,
  error,
  loading,
  className = '',
}: {
  children: React.ReactNode;
  size?: 'sm' | 'md' | 'lg';
  variant?: 'default' | 'outline' | 'ghost';
  error?: string;
  loading?: boolean;
  className?: string;
}) {
  const { state, handlers, refs } = useSelectContext();

  const triggerClasses = useMemo(() => {
    const classes = [
      'flex',
      'items-center',
      'justify-between',
      'w-full',
      'px-3',
      'py-2',
      'text-left',
      'bg-white',
      'border',
      'rounded-md',
      'cursor-pointer',
      'focus:outline-none',
      'focus:ring-2',
      'focus:ring-blue-500',
      'transition-colors',
      'duration-200',
    ];

    if (size === 'sm') classes.push('text-sm', 'py-1.5');
    if (size === 'lg') classes.push('text-lg', 'py-3');

    if (variant === 'outline') classes.push('border-gray-300', 'hover:border-gray-400');
    if (variant === 'ghost') classes.push('border-transparent', 'hover:bg-gray-100');

    if (error) classes.push('border-red-500');
    if (state.isOpen) classes.push('ring-2', 'ring-blue-500');

    if (className) classes.push(className);

    return classes.join(' ');
  }, [size, variant, error, state.isOpen, className]);

  return (
    <button
      ref={refs.triggerRef}
      type='button'
      className={triggerClasses}
      onClick={handlers.onToggle}
      onKeyDown={handlers.onKeyDown}
      disabled={loading}
      aria-expanded={state.isOpen}
      aria-haspopup='listbox'
    >
      {children}
      <ChevronDownIcon
        className={`ml-2 h-4 w-4 transition-transform ${state.isOpen ? 'rotate-180' : ''}`}
      />
    </button>
  );
}

function SelectContent({
  children,
  className = '',
}: {
  children: React.ReactNode;
  className?: string;
}) {
  const { state, refs } = useSelectContext();

  const contentClasses = useMemo(() => {
    const classes = [
      'absolute',
      'z-50',
      'w-full',
      'mt-1',
      'bg-white',
      'border',
      'border-gray-300',
      'rounded-md',
      'shadow-lg',
      'max-h-60',
      'overflow-auto',
    ];

    if (className) classes.push(className);

    return classes.join(' ');
  }, [className]);

  if (!state.isOpen) return null;

  return (
    <div ref={refs.contentRef} className={contentClasses}>
      {children}
    </div>
  );
}

function SelectItem<T>({
  children,
  value,
  disabled = false,
  className = '',
}: {
  children: React.ReactNode;
  value: T;
  disabled?: boolean;
  className?: string;
}) {
  const { state, handlers } = useSelectContext<T>();

  const isSelected = state.selectedValue === value;
  const isHighlighted =
    state.filteredOptions.findIndex(opt => opt.value === value) === state.highlightedIndex;

  const itemClasses = useMemo(() => {
    const classes = ['px-3', 'py-2', 'cursor-pointer', 'text-sm', 'transition-colors'];

    if (disabled) {
      classes.push('opacity-50', 'cursor-not-allowed', 'text-gray-400');
    } else {
      if (isSelected) classes.push('bg-blue-100', 'text-blue-900');
      else if (isHighlighted) classes.push('bg-gray-100');
      else classes.push('hover:bg-gray-50');
    }

    if (className) classes.push(className);

    return classes.join(' ');
  }, [disabled, isSelected, isHighlighted, className]);

  const handleClick = () => {
    if (!disabled) {
      const option = state.filteredOptions.find(opt => opt.value === value);
      if (option) {
        handlers.onSelect(option);
      }
    }
  };

  return (
    <div className={itemClasses} onClick={handleClick} role='option' aria-selected={isSelected}>
      {children}
      {isSelected && <CheckIcon className='ml-auto h-4 w-4' />}
    </div>
  );
}

function ChevronDownIcon({ className }: { className?: string }) {
  return (
    <svg className={className} fill='none' stroke='currentColor' viewBox='0 0 24 24'>
      <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M19 9l-7 7-7-7' />
    </svg>
  );
}

function CheckIcon({ className }: { className?: string }) {
  return (
    <svg className={className} fill='none' stroke='currentColor' viewBox='0 0 24 24'>
      <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M5 13l4 4L19 7' />
    </svg>
  );
}

export { SelectTrigger, SelectContent, SelectItem };
export default Select;
