import { useContext } from 'react';
import { BookingContext } from '../contexts/BookingContext';
import type { BookingState } from '../contexts/BookingContext';
import type { MovieDetails } from '../types';

// Custom hook to use booking context
export function useBooking() {
  const context = useContext(BookingContext);
  if (!context) {
    throw new Error('useBooking must be used within a BookingProvider');
  }
  return context;
}

// Helper functions for booking actions
export const bookingActions = {
  selectMovie: (movie: MovieDetails) => ({ type: 'SELECT_MOVIE' as const, payload: movie }),
  selectDate: (date: string) => ({ type: 'SELECT_DATE' as const, payload: date }),
  selectShowtime: (showtime: string) => ({ type: 'SELECT_SHOWTIME' as const, payload: showtime }),
  selectSeat: (seat: string) => ({ type: 'SELECT_SEAT' as const, payload: seat }),
  deselectSeat: (seat: string) => ({ type: 'DESELECT_SEAT' as const, payload: seat }),
  clearSeats: () => ({ type: 'CLEAR_SEATS' as const }),
  setCustomerInfo: (info: BookingState['customerInfo']) => ({ type: 'SET_CUSTOMER_INFO' as const, payload: info }),
  setStep: (step: BookingState['currentStep']) => ({ type: 'SET_STEP' as const, payload: step }),
  resetBooking: () => ({ type: 'RESET_BOOKING' as const }),
};