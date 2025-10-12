// Select Hook Implementation
import { useState, useCallback, useMemo, useRef, useEffect } from 'react';
import type {
  SelectOption,
  SelectState,
  SelectHandlers,
} from '../types';

export interface UseSelectOptions<T> {
  options: SelectOption<T>[];
  value?: T | null | undefined;
  defaultValue?: T | null | undefined;
  onValueChange?: ((value: T | null) => void) | undefined;
  searchable?: boolean;
  clearable?: boolean;
  disabled?: boolean;
  filterFn?: ((option: SelectOption<T>, searchTerm: string) => boolean) | undefined;
}

export interface UseSelectReturn<T> {
  state: SelectState<T>;
  handlers: SelectHandlers<T>;
  refs: {
    triggerRef: React.RefObject<HTMLButtonElement | null>;
    contentRef: React.RefObject<HTMLDivElement | null>;
    searchRef: React.RefObject<HTMLInputElement | null>;
  };
}

// Default Filter Function
const defaultFilterFn = <T>(option: SelectOption<T>, searchTerm: string): boolean => {
  const term = searchTerm.toLowerCase().trim();
  if (!term) return true;
  
  return (
    option.label.toLowerCase().includes(term) ||
    (option.description?.toLowerCase().includes(term) ?? false)
  );
};

// Main Select Hook
export function useSelect<T>({
  options,
  value,
  defaultValue,
  onValueChange,
  searchable = false,
  clearable = false,
  disabled = false,
  filterFn = defaultFilterFn,
}: UseSelectOptions<T>): UseSelectReturn<T> {
  
  const triggerRef = useRef<HTMLButtonElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const searchRef = useRef<HTMLInputElement>(null);

  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [highlightedIndex, setHighlightedIndex] = useState(-1);

  const [internalValue, setInternalValue] = useState<T | null>(defaultValue ?? null);
  const currentValue = value !== undefined ? value : internalValue;

  const selectedOption = useMemo(() => {
    if (currentValue === null) return null;
    return options.find(option => option.value === currentValue) || null;
  }, [options, currentValue]);

  const filteredOptions = useMemo(() => {
    if (!searchable || !searchTerm.trim()) {
      return options.filter(option => !option.disabled);
    }
    return options.filter(option => 
      !option.disabled && filterFn(option, searchTerm)
    );
  }, [options, searchTerm, searchable, filterFn]);

  useEffect(() => {
    setHighlightedIndex(-1);
  }, [filteredOptions]);

  useEffect(() => {
    if (isOpen && searchable && searchRef.current) {
      searchRef.current.focus();
    }
  }, [isOpen, searchable]);

  useEffect(() => {
    if (!isOpen) return;

    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as Element;
      
      if (
        !triggerRef.current?.contains(target) &&
        !contentRef.current?.contains(target)
      ) {
        setIsOpen(false);
        setSearchTerm('');
        setHighlightedIndex(-1);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isOpen]);

  // Event Handlers
  const handleOpen = useCallback(() => {
    if (disabled) return;
    setIsOpen(true);
    setSearchTerm('');
    setHighlightedIndex(-1);
  }, [disabled]);

  const handleClose = useCallback(() => {
    setIsOpen(false);
    setSearchTerm('');
    setHighlightedIndex(-1);
    triggerRef.current?.focus();
  }, []);

  const handleToggle = useCallback(() => {
    if (disabled) return;
    if (isOpen) {
      handleClose();
    } else {
      handleOpen();
    }
  }, [disabled, isOpen, handleClose, handleOpen]);

  const handleSelect = useCallback((option: SelectOption<T>) => {
    const newValue = option.value;
    
    if (value === undefined) {
      setInternalValue(newValue);
    }
    
    onValueChange?.(newValue);
    
    handleClose();
  }, [value, onValueChange, handleClose]);

  const handleClear = useCallback(() => {
    if (!clearable || disabled) return;
    
    if (value === undefined) {
      setInternalValue(null);
    }
    
    onValueChange?.(null);
    
    handleClose();
  }, [clearable, disabled, value, onValueChange, handleClose]);

  const handleSearchChange = useCallback((term: string) => {
    setSearchTerm(term);
    setHighlightedIndex(-1);
  }, []);

  const handleHighlight = useCallback((index: number) => {
    if (index >= 0 && index < filteredOptions.length) {
      setHighlightedIndex(index);
    }
  }, [filteredOptions.length]);

  const handleKeyDown = useCallback((event: React.KeyboardEvent) => {
    if (disabled) return;

    switch (event.key) {
      case 'Enter':
        event.preventDefault();
        if (!isOpen) {
          handleOpen();
        } else if (highlightedIndex >= 0) {
          const option = filteredOptions[highlightedIndex];
          if (option && !option.disabled) {
            handleSelect(option);
          }
        }
        break;

      case 'Escape':
        event.preventDefault();
        if (isOpen) {
          handleClose();
        }
        break;

      case 'ArrowDown':
        event.preventDefault();
        if (!isOpen) {
          handleOpen();
        } else {
          const nextIndex = highlightedIndex < filteredOptions.length - 1 
            ? highlightedIndex + 1 
            : 0;
          handleHighlight(nextIndex);
        }
        break;

      case 'ArrowUp':
        event.preventDefault();
        if (isOpen) {
          const prevIndex = highlightedIndex > 0 
            ? highlightedIndex - 1 
            : filteredOptions.length - 1;
          handleHighlight(prevIndex);
        }
        break;

      case 'Home':
        if (isOpen) {
          event.preventDefault();
          handleHighlight(0);
        }
        break;

      case 'End':
        if (isOpen) {
          event.preventDefault();
          handleHighlight(filteredOptions.length - 1);
        }
        break;

      case 'Tab':
        if (isOpen) {
          handleClose();
        }
        break;

      case 'Backspace':
        if (clearable && currentValue !== null && !searchable) {
          event.preventDefault();
          handleClear();
        }
        break;

      default:
        if (!searchable && !isOpen && event.key.length === 1) {
          const matchingOption = filteredOptions.find(option =>
            option.label.toLowerCase().startsWith(event.key.toLowerCase())
          );
          if (matchingOption) {
            handleSelect(matchingOption);
          }
        }
        break;
    }
  }, [
    disabled,
    isOpen,
    highlightedIndex,
    filteredOptions,
    handleOpen,
    handleClose,
    handleSelect,
    handleHighlight,
    clearable,
    currentValue,
    searchable,
    handleClear,
  ]);

  const state: SelectState<T> = useMemo(() => ({
    isOpen,
    selectedValue: currentValue,
    selectedOption,
    highlightedIndex,
    searchTerm,
    filteredOptions,
  }), [isOpen, currentValue, selectedOption, highlightedIndex, searchTerm, filteredOptions]);

  const handlers: SelectHandlers<T> = useMemo(() => ({
    onOpen: handleOpen,
    onClose: handleClose,
    onToggle: handleToggle,
    onSelect: handleSelect,
    onSearchChange: handleSearchChange,
    onKeyDown: handleKeyDown,
    onHighlight: handleHighlight,
  }), [handleOpen, handleClose, handleToggle, handleSelect, handleSearchChange, handleKeyDown, handleHighlight]);

  return {
    state,
    handlers,
    refs: {
      triggerRef,
      contentRef,
      searchRef,
    },
  };
}

export function useSelectOptions<T>(
  items: T[],
  getLabel: (item: T) => string,
  getValue?: (item: T) => T,
  getDisabled?: (item: T) => boolean,
  getIcon?: (item: T) => React.ReactNode,
  getDescription?: (item: T) => string,
): SelectOption<T>[] {
  return useMemo(() =>
    items.map(item => {
      const option: SelectOption<T> = {
        value: getValue ? getValue(item) : item,
        label: getLabel(item),
        disabled: getDisabled?.(item) ?? false,
      };
      
      const icon = getIcon?.(item);
      const description = getDescription?.(item);
      
      if (icon) option.icon = icon;
      if (description) option.description = description;
      
      return option;
    }),
    [items, getLabel, getValue, getDisabled, getIcon, getDescription]
  );
}