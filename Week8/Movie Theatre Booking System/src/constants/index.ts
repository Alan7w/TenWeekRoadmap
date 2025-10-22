// API Configuration
export const TMDB_API = {
  BASE_URL: 'https://api.themoviedb.org/3',
  IMAGE_BASE_URL: 'https://image.tmdb.org/t/p',
  API_KEY: import.meta.env.VITE_TMDB_API_KEY || '', // You'll need to set this in .env
  ENDPOINTS: {
    POPULAR_MOVIES: '/movie/popular',
    TOP_RATED_MOVIES: '/movie/top_rated',
    NOW_PLAYING: '/movie/now_playing',
    UPCOMING: '/movie/upcoming',
    SEARCH_MOVIES: '/search/movie',
    MOVIE_DETAILS: '/movie',
    MOVIE_VIDEOS: '/movie/{id}/videos',
    MOVIE_CREDITS: '/movie/{id}/credits',
    GENRES: '/genre/movie/list',
  }
} as const

// Image Sizes
export const IMAGE_SIZES = {
  POSTER: {
    w92: 'w92',
    w154: 'w154',
    w185: 'w185',
    w342: 'w342',
    w500: 'w500',
    w780: 'w780',
    original: 'original'
  },
  BACKDROP: {
    w300: 'w300',
    w780: 'w780',
    w1280: 'w1280',
    original: 'original'
  },
  PROFILE: {
    w45: 'w45',
    w185: 'w185',
    h632: 'h632',
    original: 'original'
  }
} as const

// Application Routes
export const ROUTES = {
  HOME: '/',
  MOVIES: '/movies',
  MOVIE_DETAILS: '/movie/:id',
  BOOKING: '/booking/:movieId',
  SEAT_SELECTION: '/booking/:movieId/seats',
  PAYMENT: '/booking/:movieId/payment',
  CONFIRMATION: '/booking/:movieId/confirmation',
  SEARCH: '/search',
} as const

// Theatre Configuration
export const THEATRE_CONFIG = {
  ROWS: ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J'],
  SEATS_PER_ROW: 12,
  SEAT_TYPES: {
    STANDARD: { name: 'Standard', price: 12 },
    PREMIUM: { name: 'Premium', price: 18 },
    VIP: { name: 'VIP', price: 25 }
  },
  SHOWTIMES: ['10:00', '13:30', '17:00', '20:30', '23:00']
} as const

// Booking Configuration
export const BOOKING_CONFIG = {
  MAX_SEATS_PER_BOOKING: 8,
  SEAT_HOLD_TIME: 10 * 60 * 1000, // 10 minutes in milliseconds
  PAYMENT_TIMEOUT: 5 * 60 * 1000, // 5 minutes in milliseconds
} as const

// UI Constants
export const UI_CONFIG = {
  DEBOUNCE_DELAY: 300,
  PAGINATION_SIZE: 20,
  MOBILE_BREAKPOINT: 768,
  TABLET_BREAKPOINT: 1024,
  MAX_POSTER_WIDTH: 500,
  DEFAULT_POSTER_WIDTH: 342,
} as const

// Local Storage Keys
export const STORAGE_KEYS = {
  BOOKING_STATE: 'movie_booking_state',
  USER_PREFERENCES: 'user_preferences',
  SELECTED_SEATS: 'selected_seats',
  CUSTOMER_INFO: 'customer_info',
  APP_THEME: 'app_theme',
} as const

// Error Messages
export const ERROR_MESSAGES = {
  NETWORK_ERROR: 'Network error. Please check your connection.',
  API_ERROR: 'Unable to fetch data. Please try again later.',
  NO_RESULTS: 'No results found for your search.',
  BOOKING_ERROR: 'Unable to complete booking. Please try again.',
  VALIDATION_ERROR: 'Please check the form for errors.',
  SEAT_UNAVAILABLE: 'Selected seat is no longer available.',
  MAX_SEATS_EXCEEDED: `You can select maximum ${BOOKING_CONFIG.MAX_SEATS_PER_BOOKING} seats.`,
  SESSION_EXPIRED: 'Your session has expired. Please start again.',
} as const

// Success Messages
export const SUCCESS_MESSAGES = {
  BOOKING_CONFIRMED: 'Booking confirmed successfully!',
  PAYMENT_PROCESSED: 'Payment processed successfully.',
  SEATS_SELECTED: 'Seats selected successfully.',
} as const