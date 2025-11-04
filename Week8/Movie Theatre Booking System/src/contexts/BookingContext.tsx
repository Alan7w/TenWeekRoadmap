import { useReducer } from 'react';
import type { ReactNode } from 'react';
import type { MovieDetails } from '../types';
import { BookingContext } from './BookingContextDefinition';

// Re-export the context
export { BookingContext };

// Booking state types
export interface BookingState {
  selectedMovie: MovieDetails | null;
  selectedDate: string;
  selectedShowtime: string;
  selectedSeats: string[];
  customerInfo: {
    name: string;
    email: string;
    phone: string;
  } | null;
  currentStep: 'movie' | 'datetime' | 'seats' | 'info' | 'payment' | 'confirmation';
}

// Action types
export type BookingAction =
  | { type: 'SELECT_MOVIE'; payload: MovieDetails }
  | { type: 'SELECT_DATE'; payload: string }
  | { type: 'SELECT_SHOWTIME'; payload: string }
  | { type: 'SELECT_SEAT'; payload: string }
  | { type: 'DESELECT_SEAT'; payload: string }
  | { type: 'CLEAR_SEATS' }
  | { type: 'SET_CUSTOMER_INFO'; payload: BookingState['customerInfo'] }
  | { type: 'SET_STEP'; payload: BookingState['currentStep'] }
  | { type: 'RESET_BOOKING' };

// Initial state
const initialState: BookingState = {
  selectedMovie: null,
  selectedDate: '',
  selectedShowtime: '',
  selectedSeats: [],
  customerInfo: null,
  currentStep: 'movie',
};

// Reducer
function bookingReducer(state: BookingState, action: BookingAction): BookingState {
  switch (action.type) {
    case 'SELECT_MOVIE':
      return { ...state, selectedMovie: action.payload, currentStep: 'datetime' };
    
    case 'SELECT_DATE':
      return { ...state, selectedDate: action.payload, selectedShowtime: '' };
    
    case 'SELECT_SHOWTIME':
      return { ...state, selectedShowtime: action.payload, currentStep: 'seats' };
    
    case 'SELECT_SEAT':
      return {
        ...state,
        selectedSeats: [...state.selectedSeats, action.payload],
      };
    
    case 'DESELECT_SEAT':
      return {
        ...state,
        selectedSeats: state.selectedSeats.filter(seat => seat !== action.payload),
      };
    
    case 'CLEAR_SEATS':
      return { ...state, selectedSeats: [] };
    
    case 'SET_CUSTOMER_INFO':
      return { ...state, customerInfo: action.payload, currentStep: 'payment' };
    
    case 'SET_STEP':
      return { ...state, currentStep: action.payload };
    
    case 'RESET_BOOKING':
      return initialState;
    
    default:
      return state;
  }
}

// Provider component
export function BookingProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(bookingReducer, initialState);

  return (
    <BookingContext.Provider value={{ state, dispatch }}>
      {children}
    </BookingContext.Provider>
  );
}

