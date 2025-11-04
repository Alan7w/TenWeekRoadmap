import { apiClient, apiCall, buildEndpoint } from './api'
import type { 
  MovieDetails, 
  MoviesResponse, 
  MovieVideosResponse, 
} from '../types'
import { TMDB_API } from '../constants'

/**
 * Movie Service - handles all movie-related API calls
 */
export class MovieService {
  /**
   * Get popular movies
   */
  static async getPopularMovies(page: number = 1): Promise<MoviesResponse> {
    return apiCall(() =>
      apiClient.get<MoviesResponse>(TMDB_API.ENDPOINTS.POPULAR_MOVIES, {
        params: { 
          page,
          per_page: 20 // TMDB maximum is typically 20
        }
      })
    )
  }

  /**
   * Get top rated movies
   */
  static async getTopRatedMovies(page: number = 1): Promise<MoviesResponse> {
    return apiCall(() =>
      apiClient.get<MoviesResponse>(TMDB_API.ENDPOINTS.TOP_RATED_MOVIES, {
        params: { page }
      })
    )
  }

  /**
   * Get movie details by ID
   */
  static async getMovieDetails(movieId: number): Promise<MovieDetails> {
    const endpoint = buildEndpoint(TMDB_API.ENDPOINTS.MOVIE_DETAILS, { id: movieId })
    return apiCall(() =>
      apiClient.get<MovieDetails>(endpoint)
    )
  }

  /**
   * Get movie videos (trailers, teasers, etc.)
   */
  static async getMovieVideos(movieId: number): Promise<MovieVideosResponse> {
    const endpoint = buildEndpoint(TMDB_API.ENDPOINTS.MOVIE_VIDEOS, { id: movieId })
    return apiCall(() =>
      apiClient.get<MovieVideosResponse>(endpoint)
    )
  }

  /**
   * Search movies by query
   */
  static async searchMovies(query: string, page: number = 1): Promise<MoviesResponse> {
    return apiCall(() =>
      apiClient.get<MoviesResponse>(TMDB_API.ENDPOINTS.SEARCH_MOVIES, {
        params: { 
          query: encodeURIComponent(query),
          page 
        }
      })
    )
  }

  /**
   * Get movie genres
   */
  static async getGenres(): Promise<{ genres: Array<{ id: number; name: string }> }> {
    return apiCall(() =>
      apiClient.get<{ genres: Array<{ id: number; name: string }> }>(TMDB_API.ENDPOINTS.GENRES)
    )
  }

  /**
   * Discover movies with filters
   */
  static async discoverMovies(filters: {
    page?: number
    genre?: string
    year?: number
    sortBy?: string
    rating?: number
  } = {}): Promise<MoviesResponse> {
    const params: Record<string, string | number> = {
      page: filters.page || 1,
      per_page: 20, // TMDB maximum per page
    }

    if (filters.genre) {
      params.with_genres = filters.genre
    }

    if (filters.year) {
      params.primary_release_year = filters.year
    }

    if (filters.sortBy) {
      params.sort_by = filters.sortBy
    }

    if (filters.rating) {
      params['vote_average.gte'] = filters.rating
    }

    return apiCall(() =>
      apiClient.get<MoviesResponse>('/discover/movie', { params })
    )
  }
}

// Export individual functions for easier importing
export const {
  getPopularMovies,
  getTopRatedMovies,
  getMovieDetails,
  getMovieVideos,
  searchMovies,
  getGenres,
  discoverMovies,
} = MovieService