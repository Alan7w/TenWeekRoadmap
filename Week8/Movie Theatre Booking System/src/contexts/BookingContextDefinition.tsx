import { createContext } from 'react';
import type { BookingState, BookingAction } from './BookingContext';

// Context definition only
export const BookingContext = createContext<{
  state: BookingState;
  dispatch: React.Dispatch<BookingAction>;
} | null>(null);