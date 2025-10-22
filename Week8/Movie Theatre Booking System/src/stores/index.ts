// Export all stores
export { useMovieStore, movieSelectors } from './movieStore'
export { useBookingStore, bookingSelectors } from './bookingStore'
export { useUserStore, userSelectors, type Theme, type Language } from './userStore'

// Import stores for utility functions
import { useMovieStore } from './movieStore'
import { useBookingStore } from './bookingStore'
import { useUserStore } from './userStore'

// Combined store hook for convenience (use sparingly for performance)
export const useAppStore = () => ({
  movie: useMovieStore(),
  booking: useBookingStore(),
  user: useUserStore(),
})

// Store reset utility for testing or logout
export const resetAllStores = () => {
  useMovieStore.getState().resetMovieState()
  useBookingStore.getState().resetBookingFlow()
  useUserStore.getState().clearUserData()
}