import { create } from 'zustand'
import { devtools } from 'zustand/middleware'
import type { Movie, MovieDetails } from '../types'

// Movie store state interface
interface MovieState {
  // Current movie data
  popularMovies: Movie[]
  searchResults: Movie[]
  currentMovie: MovieDetails | null
  favoriteMovies: Movie[]
  
  // Loading states
  isLoadingPopular: boolean
  isLoadingSearch: boolean
  isLoadingDetails: boolean
  
  // Error states
  popularError: string | null
  searchError: string | null
  detailsError: string | null
  
  // Search state
  searchQuery: string
  currentPage: number
  totalPages: number
  
  // Actions
  setPopularMovies: (movies: Movie[]) => void
  setSearchResults: (movies: Movie[], page: number, totalPages: number) => void
  setCurrentMovie: (movie: MovieDetails | null) => void
  addToFavorites: (movie: Movie) => void
  removeFromFavorites: (movieId: number) => void
  toggleFavorite: (movie: Movie) => void
  
  // Loading actions
  setPopularLoading: (loading: boolean) => void
  setSearchLoading: (loading: boolean) => void
  setDetailsLoading: (loading: boolean) => void
  
  // Error actions
  setPopularError: (error: string | null) => void
  setSearchError: (error: string | null) => void
  setDetailsError: (error: string | null) => void
  
  // Search actions
  setSearchQuery: (query: string) => void
  clearSearch: () => void
  
  // Utility actions
  clearCurrentMovie: () => void
  resetMovieState: () => void
}

// Initial state
const initialMovieState = {
  popularMovies: [],
  searchResults: [],
  currentMovie: null,
  favoriteMovies: [],
  isLoadingPopular: false,
  isLoadingSearch: false,
  isLoadingDetails: false,
  popularError: null,
  searchError: null,
  detailsError: null,
  searchQuery: '',
  currentPage: 1,
  totalPages: 1,
}

// Create movie store with Zustand
export const useMovieStore = create<MovieState>()(
  devtools(
    (set, get) => ({
      ...initialMovieState,
      
      // Movie data actions
      setPopularMovies: (movies) =>
        set({ popularMovies: movies }, false, 'setPopularMovies'),
      
      setSearchResults: (movies, page, totalPages) =>
        set(
          { 
            searchResults: movies, 
            currentPage: page, 
            totalPages 
          },
          false,
          'setSearchResults'
        ),
      
      setCurrentMovie: (movie) =>
        set({ currentMovie: movie }, false, 'setCurrentMovie'),
      
      addToFavorites: (movie) =>
        set(
          (state) => ({
            favoriteMovies: [...state.favoriteMovies, movie],
          }),
          false,
          'addToFavorites'
        ),
      
      removeFromFavorites: (movieId) =>
        set(
          (state) => ({
            favoriteMovies: state.favoriteMovies.filter((m) => m.id !== movieId),
          }),
          false,
          'removeFromFavorites'
        ),
      
      toggleFavorite: (movie) => {
        const { favoriteMovies } = get()
        const isAlreadyFavorite = favoriteMovies.some((m) => m.id === movie.id)
        
        if (isAlreadyFavorite) {
          get().removeFromFavorites(movie.id)
        } else {
          get().addToFavorites(movie)
        }
      },
      
      // Loading state actions
      setPopularLoading: (loading) =>
        set({ isLoadingPopular: loading }, false, 'setPopularLoading'),
      
      setSearchLoading: (loading) =>
        set({ isLoadingSearch: loading }, false, 'setSearchLoading'),
      
      setDetailsLoading: (loading) =>
        set({ isLoadingDetails: loading }, false, 'setDetailsLoading'),
      
      // Error state actions
      setPopularError: (error) =>
        set({ popularError: error }, false, 'setPopularError'),
      
      setSearchError: (error) =>
        set({ searchError: error }, false, 'setSearchError'),
      
      setDetailsError: (error) =>
        set({ detailsError: error }, false, 'setDetailsError'),
      
      // Search actions
      setSearchQuery: (query) =>
        set({ searchQuery: query }, false, 'setSearchQuery'),
      
      clearSearch: () =>
        set(
          { 
            searchResults: [], 
            searchQuery: '', 
            currentPage: 1, 
            totalPages: 1,
            searchError: null 
          },
          false,
          'clearSearch'
        ),
      
      // Utility actions
      clearCurrentMovie: () =>
        set({ currentMovie: null, detailsError: null }, false, 'clearCurrentMovie'),
      
      resetMovieState: () =>
        set(initialMovieState, false, 'resetMovieState'),
    }),
    {
      name: 'movie-store', // Name for devtools
    }
  )
)

// Selectors for optimized component subscriptions
export const movieSelectors = {
  // Popular movies selectors
  usePopularMovies: () => useMovieStore((state) => state.popularMovies),
  usePopularLoading: () => useMovieStore((state) => state.isLoadingPopular),
  usePopularError: () => useMovieStore((state) => state.popularError),
  
  // Search selectors
  useSearchResults: () => useMovieStore((state) => state.searchResults),
  useSearchLoading: () => useMovieStore((state) => state.isLoadingSearch),
  useSearchError: () => useMovieStore((state) => state.searchError),
  useSearchQuery: () => useMovieStore((state) => state.searchQuery),
  useSearchPagination: () => useMovieStore((state) => ({
    currentPage: state.currentPage,
    totalPages: state.totalPages,
  })),
  
  // Current movie selectors
  useCurrentMovie: () => useMovieStore((state) => state.currentMovie),
  useDetailsLoading: () => useMovieStore((state) => state.isLoadingDetails),
  useDetailsError: () => useMovieStore((state) => state.detailsError),
  
  // Favorites selectors
  useFavoriteMovies: () => useMovieStore((state) => state.favoriteMovies),
  useIsFavorite: (movieId: number) => 
    useMovieStore((state) => state.favoriteMovies.some((m) => m.id === movieId)),
  
  // Combined selectors for common use cases
  useMovieListState: () => useMovieStore((state) => ({
    movies: state.popularMovies,
    isLoading: state.isLoadingPopular,
    error: state.popularError,
  })),
  
  useSearchState: () => useMovieStore((state) => ({
    results: state.searchResults,
    query: state.searchQuery,
    isLoading: state.isLoadingSearch,
    error: state.searchError,
    currentPage: state.currentPage,
    totalPages: state.totalPages,
  })),
}