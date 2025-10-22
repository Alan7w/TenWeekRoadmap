import { create } from 'zustand'
import { devtools, persist } from 'zustand/middleware'

// Theme options
export type Theme = 'light' | 'dark' | 'system'

// Language options
export type Language = 'en' | 'es' | 'fr' | 'de'

// User preferences interface
interface UserPreferences {
  // Display preferences
  theme: Theme
  language: Language
  
  // Movie preferences
  preferredGenres: number[]
  preferredTheatres: string[]
  
  // Booking preferences
  defaultSeatType: 'standard' | 'premium' | 'vip'
  autoSelectBestSeats: boolean
  reminderNotifications: boolean
  
  // UI preferences
  showMovieRatings: boolean
  showMovieTrailers: boolean
  compactView: boolean
  
  // Accessibility
  highContrast: boolean
  reducedMotion: boolean
  largeText: boolean
}

// User data interface
interface UserData {
  // User identification (for local storage)
  userId: string | null
  
  // Personal information
  firstName: string
  lastName: string
  email: string
  phone: string
  
  // Preferences
  preferences: UserPreferences
  
  // Session data
  lastVisit: Date | null
  visitCount: number
  
  // Recently viewed
  recentlyViewedMovies: number[]
  recentBookings: string[]
}

// Combined user store state
interface UserState extends UserData {
  // UI state
  isAuthenticated: boolean
  
  // Actions - User Data
  setUserInfo: (info: Partial<Pick<UserData, 'firstName' | 'lastName' | 'email' | 'phone'>>) => void
  setUserId: (id: string) => void
  clearUserData: () => void
  
  // Actions - Preferences
  setTheme: (theme: Theme) => void
  setLanguage: (language: Language) => void
  setPreferredGenres: (genres: number[]) => void
  addPreferredGenre: (genreId: number) => void
  removePreferredGenre: (genreId: number) => void
  setPreferredTheatres: (theatres: string[]) => void
  addPreferredTheatre: (theatreId: string) => void
  removePreferredTheatre: (theatreId: string) => void
  updatePreferences: (preferences: Partial<UserPreferences>) => void
  
  // Actions - Session
  recordVisit: () => void
  addRecentlyViewed: (movieId: number) => void
  addRecentBooking: (bookingId: string) => void
  clearRecentlyViewed: () => void
  
  // Actions - Accessibility
  toggleHighContrast: () => void
  toggleReducedMotion: () => void
  toggleLargeText: () => void
  
  // Computed getters
  getFullName: () => string
  hasCompleteProfile: () => boolean
  getRecentMovies: () => number[]
}

// Default preferences
const defaultPreferences: UserPreferences = {
  theme: 'system',
  language: 'en',
  preferredGenres: [],
  preferredTheatres: [],
  defaultSeatType: 'standard',
  autoSelectBestSeats: false,
  reminderNotifications: true,
  showMovieRatings: true,
  showMovieTrailers: true,
  compactView: false,
  highContrast: false,
  reducedMotion: false,
  largeText: false,
}

// Initial user state
const initialUserState: UserData = {
  userId: null,
  firstName: '',
  lastName: '',
  email: '',
  phone: '',
  preferences: defaultPreferences,
  lastVisit: null,
  visitCount: 0,
  recentlyViewedMovies: [],
  recentBookings: [],
}

// Create user store with persistence
export const useUserStore = create<UserState>()(
  devtools(
    persist(
      (set, get) => ({
        ...initialUserState,
        isAuthenticated: false,
        
        // User data actions
        setUserInfo: (info) => {
          set((state) => ({
            ...state,
            ...info,
            isAuthenticated: !!(info.email || state.email),
          }), false, 'setUserInfo')
        },
        
        setUserId: (id) => {
          set({ userId: id, isAuthenticated: true }, false, 'setUserId')
        },
        
        clearUserData: () => {
          set({
            ...initialUserState,
            isAuthenticated: false,
            preferences: get().preferences, // Keep preferences
          }, false, 'clearUserData')
        },
        
        // Preference actions
        setTheme: (theme) => {
          set((state) => ({
            preferences: { ...state.preferences, theme }
          }), false, 'setTheme')
        },
        
        setLanguage: (language) => {
          set((state) => ({
            preferences: { ...state.preferences, language }
          }), false, 'setLanguage')
        },
        
        setPreferredGenres: (genres) => {
          set((state) => ({
            preferences: { ...state.preferences, preferredGenres: genres }
          }), false, 'setPreferredGenres')
        },
        
        addPreferredGenre: (genreId) => {
          set((state) => {
            const genres = state.preferences.preferredGenres
            if (!genres.includes(genreId)) {
              return {
                preferences: {
                  ...state.preferences,
                  preferredGenres: [...genres, genreId]
                }
              }
            }
            return state
          }, false, 'addPreferredGenre')
        },
        
        removePreferredGenre: (genreId) => {
          set((state) => ({
            preferences: {
              ...state.preferences,
              preferredGenres: state.preferences.preferredGenres.filter(id => id !== genreId)
            }
          }), false, 'removePreferredGenre')
        },
        
        setPreferredTheatres: (theatres) => {
          set((state) => ({
            preferences: { ...state.preferences, preferredTheatres: theatres }
          }), false, 'setPreferredTheatres')
        },
        
        addPreferredTheatre: (theatreId) => {
          set((state) => {
            const theatres = state.preferences.preferredTheatres
            if (!theatres.includes(theatreId)) {
              return {
                preferences: {
                  ...state.preferences,
                  preferredTheatres: [...theatres, theatreId]
                }
              }
            }
            return state
          }, false, 'addPreferredTheatre')
        },
        
        removePreferredTheatre: (theatreId) => {
          set((state) => ({
            preferences: {
              ...state.preferences,
              preferredTheatres: state.preferences.preferredTheatres.filter(id => id !== theatreId)
            }
          }), false, 'removePreferredTheatre')
        },
        
        updatePreferences: (preferences) => {
          set((state) => ({
            preferences: { ...state.preferences, ...preferences }
          }), false, 'updatePreferences')
        },
        
        // Session actions
        recordVisit: () => {
          set((state) => ({
            lastVisit: new Date(),
            visitCount: state.visitCount + 1,
          }), false, 'recordVisit')
        },
        
        addRecentlyViewed: (movieId) => {
          set((state) => {
            const recent = state.recentlyViewedMovies.filter(id => id !== movieId)
            return {
              recentlyViewedMovies: [movieId, ...recent].slice(0, 20) // Keep last 20
            }
          }, false, 'addRecentlyViewed')
        },
        
        addRecentBooking: (bookingId) => {
          set((state) => {
            const recent = state.recentBookings.filter(id => id !== bookingId)
            return {
              recentBookings: [bookingId, ...recent].slice(0, 10) // Keep last 10
            }
          }, false, 'addRecentBooking')
        },
        
        clearRecentlyViewed: () => {
          set({ recentlyViewedMovies: [] }, false, 'clearRecentlyViewed')
        },
        
        // Accessibility actions
        toggleHighContrast: () => {
          set((state) => ({
            preferences: {
              ...state.preferences,
              highContrast: !state.preferences.highContrast
            }
          }), false, 'toggleHighContrast')
        },
        
        toggleReducedMotion: () => {
          set((state) => ({
            preferences: {
              ...state.preferences,
              reducedMotion: !state.preferences.reducedMotion
            }
          }), false, 'toggleReducedMotion')
        },
        
        toggleLargeText: () => {
          set((state) => ({
            preferences: {
              ...state.preferences,
              largeText: !state.preferences.largeText
            }
          }), false, 'toggleLargeText')
        },
        
        // Computed getters
        getFullName: () => {
          const { firstName, lastName } = get()
          return `${firstName} ${lastName}`.trim()
        },
        
        hasCompleteProfile: () => {
          const { firstName, lastName, email, phone } = get()
          return !!(firstName && lastName && email && phone)
        },
        
        getRecentMovies: () => {
          return get().recentlyViewedMovies.slice(0, 10)
        },
      }),
      {
        name: 'user-store',
        // Persist all user data
        partialize: (state) => ({
          userId: state.userId,
          firstName: state.firstName,
          lastName: state.lastName,
          email: state.email,
          phone: state.phone,
          preferences: state.preferences,
          lastVisit: state.lastVisit,
          visitCount: state.visitCount,
          recentlyViewedMovies: state.recentlyViewedMovies,
          recentBookings: state.recentBookings,
          isAuthenticated: state.isAuthenticated,
        }),
      }
    ),
    {
      name: 'user-store',
    }
  )
)

// Selectors for optimized component subscriptions
export const userSelectors = {
  // User data selectors
  useUserInfo: () => useUserStore((state) => ({
    firstName: state.firstName,
    lastName: state.lastName,
    email: state.email,
    phone: state.phone,
    fullName: state.getFullName(),
  })),
  
  useIsAuthenticated: () => useUserStore((state) => state.isAuthenticated),
  useUserId: () => useUserStore((state) => state.userId),
  
  // Preferences selectors
  useTheme: () => useUserStore((state) => state.preferences.theme),
  useLanguage: () => useUserStore((state) => state.preferences.language),
  usePreferredGenres: () => useUserStore((state) => state.preferences.preferredGenres),
  usePreferredTheatres: () => useUserStore((state) => state.preferences.preferredTheatres),
  
  // UI preferences
  useUIPreferences: () => useUserStore((state) => ({
    compactView: state.preferences.compactView,
    showMovieRatings: state.preferences.showMovieRatings,
    showMovieTrailers: state.preferences.showMovieTrailers,
  })),
  
  // Accessibility selectors
  useAccessibilitySettings: () => useUserStore((state) => ({
    highContrast: state.preferences.highContrast,
    reducedMotion: state.preferences.reducedMotion,
    largeText: state.preferences.largeText,
  })),
  
  // Session selectors
  useSessionInfo: () => useUserStore((state) => ({
    lastVisit: state.lastVisit,
    visitCount: state.visitCount,
  })),
  
  useRecentlyViewed: () => useUserStore((state) => state.recentlyViewedMovies),
  useRecentBookings: () => useUserStore((state) => state.recentBookings),
  
  // Combined selectors
  useUserProfile: () => useUserStore((state) => ({
    info: {
      firstName: state.firstName,
      lastName: state.lastName,
      email: state.email,
      phone: state.phone,
      fullName: state.getFullName(),
    },
    isComplete: state.hasCompleteProfile(),
    isAuthenticated: state.isAuthenticated,
  })),
  
  useUserPreferences: () => useUserStore((state) => state.preferences),
}