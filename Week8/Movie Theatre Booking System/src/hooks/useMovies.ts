import { useQuery, useInfiniteQuery } from '@tanstack/react-query'
import { MovieService } from '../services/movieService'
import type { MoviesResponse } from '../types'

// Query Keys
export const MOVIE_QUERY_KEYS = {
  all: ['movies'] as const,
  lists: () => [...MOVIE_QUERY_KEYS.all, 'list'] as const,
  list: (filters: string) => [...MOVIE_QUERY_KEYS.lists(), filters] as const,
  details: () => [...MOVIE_QUERY_KEYS.all, 'detail'] as const,
  detail: (id: number) => [...MOVIE_QUERY_KEYS.details(), id] as const,
  videos: (id: number) => [...MOVIE_QUERY_KEYS.detail(id), 'videos'] as const,
  credits: (id: number) => [...MOVIE_QUERY_KEYS.detail(id), 'credits'] as const,
  search: (query: string) => [...MOVIE_QUERY_KEYS.all, 'search', query] as const,
}

// Hook for popular movies
export const usePopularMovies = (page: number = 1, enabled: boolean = true) => {
  return useQuery({
    queryKey: MOVIE_QUERY_KEYS.list(`popular-${page}`),
    queryFn: () => MovieService.getPopularMovies(page),
    enabled,
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes
  })
}

// Hook for top rated movies
export const useTopRatedMovies = (page: number = 1, enabled: boolean = true) => {
  return useQuery({
    queryKey: MOVIE_QUERY_KEYS.list(`top-rated-${page}`),
    queryFn: () => MovieService.getTopRatedMovies(page),
    enabled,
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
  })
}

// Hook for now playing movies
export const useNowPlayingMovies = (page: number = 1, enabled: boolean = true) => {
  return useQuery({
    queryKey: MOVIE_QUERY_KEYS.list(`now-playing-${page}`),
    queryFn: () => MovieService.getNowPlayingMovies(page),
    enabled,
    staleTime: 2 * 60 * 1000, // 2 minutes (more fresh for current movies)
    gcTime: 5 * 60 * 1000,
  })
}

// Hook for upcoming movies
export const useUpcomingMovies = (page: number = 1, enabled: boolean = true) => {
  return useQuery({
    queryKey: MOVIE_QUERY_KEYS.list(`upcoming-${page}`),
    queryFn: () => MovieService.getUpcomingMovies(page),
    enabled,
    staleTime: 30 * 60 * 1000, // 30 minutes (upcoming movies change less frequently)
    gcTime: 60 * 60 * 1000,
  })
}

// Hook for movie details
export const useMovieDetails = (movieId: number, enabled: boolean = true) => {
  return useQuery({
    queryKey: MOVIE_QUERY_KEYS.detail(movieId),
    queryFn: () => MovieService.getMovieDetails(movieId),
    enabled: enabled && !!movieId,
    staleTime: 10 * 60 * 1000, // 10 minutes
    gcTime: 30 * 60 * 1000,
  })
}

// Hook for movie videos
export const useMovieVideos = (movieId: number, enabled: boolean = true) => {
  return useQuery({
    queryKey: MOVIE_QUERY_KEYS.videos(movieId),
    queryFn: () => MovieService.getMovieVideos(movieId),
    enabled: enabled && !!movieId,
    staleTime: 60 * 60 * 1000, // 1 hour (videos don't change often)
    gcTime: 2 * 60 * 60 * 1000,
  })
}

// Hook for movie search
export const useMovieSearch = (query: string, page: number = 1, enabled: boolean = true) => {
  return useQuery({
    queryKey: MOVIE_QUERY_KEYS.search(`${query}-${page}`),
    queryFn: () => MovieService.searchMovies(query, page),
    enabled: enabled && query.length >= 2, // Only search with 2+ characters
    staleTime: 2 * 60 * 1000, // 2 minutes
    gcTime: 5 * 60 * 1000,
  })
}

// Hook for infinite scroll movie loading
export const useInfiniteMovies = (
  type: 'popular' | 'top_rated' | 'now_playing' | 'upcoming' = 'popular',
  enabled: boolean = true
) => {
  const getMoviesByType = (type: string, page: number): Promise<MoviesResponse> => {
    switch (type) {
      case 'popular':
        return MovieService.getPopularMovies(page)
      case 'top_rated':
        return MovieService.getTopRatedMovies(page)
      case 'now_playing':
        return MovieService.getNowPlayingMovies(page)
      case 'upcoming':
        return MovieService.getUpcomingMovies(page)
      default:
        return MovieService.getPopularMovies(page)
    }
  }

  return useInfiniteQuery({
    queryKey: MOVIE_QUERY_KEYS.list(`infinite-${type}`),
    queryFn: ({ pageParam = 1 }) => getMoviesByType(type, pageParam),
    enabled,
    initialPageParam: 1,
    getNextPageParam: (lastPage) => {
      if (lastPage.page < lastPage.total_pages) {
        return lastPage.page + 1
      }
      return undefined
    },
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
  })
}

// Hook for genres
export const useGenres = (enabled: boolean = true) => {
  return useQuery({
    queryKey: ['genres'],
    queryFn: MovieService.getGenres,
    enabled,
    staleTime: 60 * 60 * 1000, // 1 hour (genres rarely change)
    gcTime: 24 * 60 * 60 * 1000, // 24 hours
  })
}

// Hook for movie discovery with filters
export const useDiscoverMovies = (
  filters: {
    page?: number
    genre?: string
    year?: number
    sortBy?: string
    rating?: number
  } = {},
  enabled: boolean = true
) => {
  const filterKey = JSON.stringify(filters)
  
  return useQuery({
    queryKey: MOVIE_QUERY_KEYS.list(`discover-${filterKey}`),
    queryFn: () => MovieService.discoverMovies(filters),
    enabled,
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
  })
}

// Hook for similar movies
export const useSimilarMovies = (movieId: number, enabled: boolean = true) => {
  return useQuery({
    queryKey: [...MOVIE_QUERY_KEYS.detail(movieId), 'similar'],
    queryFn: () => MovieService.getSimilarMovies(movieId),
    enabled: enabled && !!movieId,
    staleTime: 15 * 60 * 1000, // 15 minutes
    gcTime: 30 * 60 * 1000,
  })
}

// Hook for movie recommendations
export const useMovieRecommendations = (movieId: number, enabled: boolean = true) => {
  return useQuery({
    queryKey: [...MOVIE_QUERY_KEYS.detail(movieId), 'recommendations'],
    queryFn: () => MovieService.getMovieRecommendations(movieId),
    enabled: enabled && !!movieId,
    staleTime: 15 * 60 * 1000, // 15 minutes
    gcTime: 30 * 60 * 1000,
  })
}

// Hook for popular movies with 100 results (fetches 5 pages of 20 each)
export const usePopularMovies100 = (page: number = 1, enabled: boolean = true) => {
  return useQuery({
    queryKey: MOVIE_QUERY_KEYS.list(`popular-100-${page}`),
    queryFn: async () => {
      // Calculate which TMDB pages we need (each page has 20 movies, we want 100)
      const startPage = (page - 1) * 5 + 1;
      const endPage = startPage + 4;
      
      // Fetch 5 consecutive pages from TMDB
      const promises = [];
      for (let i = startPage; i <= endPage; i++) {
        promises.push(MovieService.getPopularMovies(i));
      }
      
      const responses = await Promise.all(promises);
      
      // Combine all results
      const allMovies = responses.flatMap(response => response.results);
      
      // Return in the same format as TMDB response
      return {
        page: page,
        results: allMovies,
        total_pages: Math.ceil(responses[0].total_pages / 5), // Adjusted total pages
        total_results: responses[0].total_results
      };
    },
    enabled,
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes
  })
}

// Hook for discover movies with 100 results
export const useDiscoverMovies100 = (
  filters: {
    page?: number
    genre?: string
    year?: number
    sortBy?: string
    rating?: number
  } = {},
  enabled: boolean = true
) => {
  const filterKey = JSON.stringify(filters)
  
  return useQuery({
    queryKey: MOVIE_QUERY_KEYS.list(`discover-100-${filterKey}`),
    queryFn: async () => {
      // Calculate which TMDB pages we need (each page has 20 movies, we want 100)
      const startPage = ((filters.page || 1) - 1) * 5 + 1;
      const endPage = startPage + 4;
      
      // Fetch 5 consecutive pages from TMDB
      const promises = [];
      for (let i = startPage; i <= endPage; i++) {
        promises.push(MovieService.discoverMovies({ ...filters, page: i }));
      }
      
      const responses = await Promise.all(promises);
      
      // Combine all results
      const allMovies = responses.flatMap(response => response.results);
      
      // Return in the same format as TMDB response
      return {
        page: filters.page || 1,
        results: allMovies,
        total_pages: Math.ceil(responses[0].total_pages / 5), // Adjusted total pages
        total_results: responses[0].total_results
      };
    },
    enabled,
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
  })
}