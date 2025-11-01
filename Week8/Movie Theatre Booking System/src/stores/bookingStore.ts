import { create } from 'zustand'
import { devtools, persist } from 'zustand/middleware'
import type { Booking, Seat, Showtime, CustomerInfo } from '../types'

// Booking store state interface
interface BookingState {
  // Current booking flow data
  selectedMovie: { id: number; title: string; poster_path: string | null } | null
  selectedShowtime: Showtime | null
  selectedSeats: Seat[]
  customerInfo: CustomerInfo | null
  
  // Booking process state
  currentStep: 'movie' | 'showtime' | 'seats' | 'info' | 'payment' | 'confirmation'
  bookingId: string | null
  
  // UI state
  isLoading: boolean
  error: string | null
  
  // Booking history
  bookingHistory: Booking[]
  
  // Theatre data
  showtimes: Showtime[]
  
  // Seat management
  seatHoldTimer: number | null
  seatHoldExpiry: Date | null
  
  // Actions - Booking Flow
  selectMovie: (movie: { id: number; title: string; poster_path: string | null }) => void
  selectShowtime: (showtime: Showtime) => void
  selectSeat: (seat: Seat) => void
  deselectSeat: (seatId: string) => void
  clearSelectedSeats: () => void
  setCustomerInfo: (info: CustomerInfo) => void
  
  // Actions - Step Management
  setCurrentStep: (step: BookingState['currentStep']) => void
  nextStep: () => void
  previousStep: () => void
  resetBookingFlow: () => void
  
  // Actions - Data Management
  setShowtimes: (showtimes: Showtime[]) => void
  addBooking: (booking: Booking) => void
  
  // Actions - UI State
  setLoading: (loading: boolean) => void
  setError: (error: string | null) => void
  clearError: () => void
  
  // Actions - Seat Hold Management
  startSeatHold: () => void
  clearSeatHold: () => void
  extendSeatHold: () => void
  
  // Computed values
  getTotalPrice: () => number
  getSelectedSeatCount: () => number
  canProceedToNextStep: () => boolean
  isBookingComplete: () => boolean
}

// Step order for navigation
const STEP_ORDER: BookingState['currentStep'][] = [
  'movie',
  'showtime', 
  'seats',
  'info',
  'payment',
  'confirmation'
]

// Initial state
const initialBookingState = {
  selectedMovie: null,
  selectedTheatre: null,
  selectedShowtime: null,
  selectedSeats: [],
  customerInfo: null,
  currentStep: 'movie' as const,
  bookingId: null,
  isLoading: false,
  error: null,
  bookingHistory: [],
  theatres: [],
  showtimes: [],
  seatHoldTimer: null,
  seatHoldExpiry: null,
}

// Create booking store with persistence
export const useBookingStore = create<BookingState>()(
  devtools(
    persist(
      (set, get) => ({
        ...initialBookingState,
        
        // Booking flow actions
        selectMovie: (movie) => {
          set({ 
            selectedMovie: movie,
            selectedShowtime: null,
            selectedSeats: [],
            currentStep: 'showtime'
          }, false, 'selectMovie')
        },
       
        selectShowtime: (showtime) => {
          set({ 
            selectedShowtime: showtime,
            selectedSeats: [],
            currentStep: 'seats'
          }, false, 'selectShowtime')
          
          // Start seat hold timer when showtime is selected
          get().startSeatHold()
        },
        
        selectSeat: (seat) => {
          const { selectedSeats } = get()
          const isAlreadySelected = selectedSeats.some(s => s.id === seat.id)
          
          if (!isAlreadySelected && seat.status === 'available') {
            set({
              selectedSeats: [...selectedSeats, { ...seat, status: 'selected' }]
            }, false, 'selectSeat')
            
            // Extend hold timer when seats are selected
            get().extendSeatHold()
          }
        },
        
        deselectSeat: (seatId) => {
          set((state) => ({
            selectedSeats: state.selectedSeats.filter(seat => seat.id !== seatId)
          }), false, 'deselectSeat')
        },
        
        clearSelectedSeats: () => {
          set({ selectedSeats: [] }, false, 'clearSelectedSeats')
          get().clearSeatHold()
        },
        
        setCustomerInfo: (info) => {
          set({ customerInfo: info }, false, 'setCustomerInfo')
        },
        
        // Step management
        setCurrentStep: (step) => {
          set({ currentStep: step }, false, 'setCurrentStep')
        },
        
        nextStep: () => {
          const { currentStep } = get()
          const currentIndex = STEP_ORDER.indexOf(currentStep)
          if (currentIndex < STEP_ORDER.length - 1) {
            set({ currentStep: STEP_ORDER[currentIndex + 1] }, false, 'nextStep')
          }
        },
        
        previousStep: () => {
          const { currentStep } = get()
          const currentIndex = STEP_ORDER.indexOf(currentStep)
          if (currentIndex > 0) {
            set({ currentStep: STEP_ORDER[currentIndex - 1] }, false, 'previousStep')
          }
        },
        
        resetBookingFlow: () => {
          const { clearSeatHold } = get()
          clearSeatHold()
          set({
            ...initialBookingState,
            bookingHistory: get().bookingHistory, // Preserve history
          }, false, 'resetBookingFlow')
        },
        
        setShowtimes: (showtimes) => {
          set({ showtimes }, false, 'setShowtimes')
        },
        
        addBooking: (booking) => {
          set((state) => ({
            bookingHistory: [booking, ...state.bookingHistory],
            bookingId: booking.id,
            currentStep: 'confirmation'
          }), false, 'addBooking')
        },
        
        // UI state management
        setLoading: (loading) => {
          set({ isLoading: loading }, false, 'setLoading')
        },
        
        setError: (error) => {
          set({ error }, false, 'setError')
        },
        
        clearError: () => {
          set({ error: null }, false, 'clearError')
        },
        
        // Seat hold management
        startSeatHold: () => {
          const { clearSeatHold } = get()
          clearSeatHold() // Clear existing timer
          
          const expiry = new Date(Date.now() + 15 * 60 * 1000) // 15 minutes
          const timer = window.setTimeout(() => {
            get().clearSelectedSeats()
          }, 15 * 60 * 1000)
          
          set({
            seatHoldTimer: timer,
            seatHoldExpiry: expiry
          }, false, 'startSeatHold')
        },
        
        clearSeatHold: () => {
          const { seatHoldTimer } = get()
          if (seatHoldTimer) {
            clearTimeout(seatHoldTimer)
          }
          set({
            seatHoldTimer: null,
            seatHoldExpiry: null
          }, false, 'clearSeatHold')
        },
        
        extendSeatHold: () => {
          // Restart the timer to extend the hold
          get().startSeatHold()
        },
        
        // Computed values
        getTotalPrice: () => {
          const { selectedSeats } = get()
          return selectedSeats.reduce((total, seat) => total + seat.price, 0)
        },
        
        getSelectedSeatCount: () => {
          return get().selectedSeats.length
        },
        
        canProceedToNextStep: () => {
          const state = get()
          
          switch (state.currentStep) {
            case 'movie':
              return !!state.selectedMovie
            case 'showtime':
              return !!state.selectedShowtime
            case 'seats':
              return state.selectedSeats.length > 0
            case 'info':
              return !!state.customerInfo
            case 'payment':
              return true // Assuming payment validation happens elsewhere
            case 'confirmation':
              return false // Final step
            default:
              return false
          }
        },
        
        isBookingComplete: () => {
          const state = get()
          return !!(
            state.selectedMovie &&
            state.selectedShowtime &&
            state.selectedSeats.length > 0 &&
            state.customerInfo &&
            state.bookingId
          )
        },
      }),
      {
        name: 'booking-store',
        // Only persist specific parts of the state
        partialize: (state) => ({
          bookingHistory: state.bookingHistory,
          customerInfo: state.customerInfo,
        }),
      }
    ),
    {
      name: 'booking-store',
    }
  )
)

// Selectors for optimized component subscriptions
export const bookingSelectors = {
  // Current booking selectors
  useSelectedMovie: () => useBookingStore((state) => state.selectedMovie),
  useSelectedShowtime: () => useBookingStore((state) => state.selectedShowtime),
  useSelectedSeats: () => useBookingStore((state) => state.selectedSeats),
  useCustomerInfo: () => useBookingStore((state) => state.customerInfo),
  
  // Booking flow selectors
  useCurrentStep: () => useBookingStore((state) => state.currentStep),
  useBookingProgress: () => useBookingStore((state) => {
    const currentIndex = STEP_ORDER.indexOf(state.currentStep)
    return {
      currentStep: state.currentStep,
      stepIndex: currentIndex,
      totalSteps: STEP_ORDER.length,
      progress: ((currentIndex + 1) / STEP_ORDER.length) * 100,
    }
  }),
  
  // Data selectors
  useShowtimes: () => useBookingStore((state) => state.showtimes),
  useBookingHistory: () => useBookingStore((state) => state.bookingHistory),
  
  // UI state selectors
  useBookingLoading: () => useBookingStore((state) => state.isLoading),
  useBookingError: () => useBookingStore((state) => state.error),
  
  // Computed selectors
  useTotalPrice: () => useBookingStore((state) => state.getTotalPrice()),
  useSelectedSeatCount: () => useBookingStore((state) => state.getSelectedSeatCount()),
  useCanProceed: () => useBookingStore((state) => state.canProceedToNextStep()),
  
  // Seat hold selectors
  useSeatHoldExpiry: () => useBookingStore((state) => state.seatHoldExpiry),
  useSeatHoldTimer: () => useBookingStore((state) => ({
    expiry: state.seatHoldExpiry,
    isActive: !!state.seatHoldTimer,
  })),
  
  // Combined selectors for common use cases
  useBookingSummary: () => useBookingStore((state) => ({
    movie: state.selectedMovie,
    showtime: state.selectedShowtime,
    seats: state.selectedSeats,
    totalPrice: state.getTotalPrice(),
    seatCount: state.getSelectedSeatCount(),
  })),
  
  useBookingValidation: () => useBookingStore((state) => ({
    hasMovie: !!state.selectedMovie,
    hasShowtime: !!state.selectedShowtime,
    hasSeats: state.selectedSeats.length > 0,
    hasCustomerInfo: !!state.customerInfo,
    canProceed: state.canProceedToNextStep(),
    isComplete: state.isBookingComplete(),
  })),
}