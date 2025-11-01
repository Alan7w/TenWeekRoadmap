// Export all stores
export { useMovieStore, movieSelectors } from './movieStore'
export { useBookingStore, bookingSelectors } from './bookingStore'

// Import stores for utility functions
import { useMovieStore } from './movieStore'
import { useBookingStore } from './bookingStore'

// Combined store hook for convenience (use sparingly for performance)
export const useAppStore = () => ({
  movie: useMovieStore(),
  booking: useBookingStore(),
})

// Store reset utility for testing or logout
export const resetAllStores = () => {
  useMovieStore.getState().resetMovieState()
  useBookingStore.getState().resetBookingFlow()
}