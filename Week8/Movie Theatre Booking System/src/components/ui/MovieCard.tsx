import React, { useState, useCallback } from 'react'
import type { Movie } from '../../types'
import { movieSelectors, userSelectors, useUserStore } from '../../stores'
import { formatVoteAverage, getImageUrl } from '../../utils/movie'
import { LoadingSpinner } from './LoadingSpinner'

// MovieCard props interface
interface MovieCardProps {
  movie: Movie
  onClick?: (movie: Movie) => void
  onFavoriteToggle?: (movie: Movie) => void
  showFavorite?: boolean
  imageSize?: 'w185' | 'w300' | 'w342' | 'w500'
  className?: string
  lazy?: boolean
}

// MovieCard component with React.memo for performance optimization
export const MovieCard = React.memo<MovieCardProps>(({
  movie,
  onClick,
  onFavoriteToggle,
  showFavorite = true,
  imageSize = 'w342',
  className = '',
  lazy = true
}) => {
  const [imageLoading, setImageLoading] = useState(true)
  const [imageError, setImageError] = useState(false)
  
  // Get user preferences and favorites
  const showRatings = userSelectors.useUIPreferences().showMovieRatings
  const { addRecentlyViewed } = useUserStore()
  
  // Check if movie is in favorites (using a selector would be more complex here)
  const favoriteMovies = movieSelectors.useFavoriteMovies()
  const isFavorite = favoriteMovies.some(fav => fav.id === movie.id)
  
  // Handle movie click
  const handleMovieClick = useCallback(() => {
    if (onClick) {
      onClick(movie)
      addRecentlyViewed(movie.id)
    }
  }, [onClick, movie, addRecentlyViewed])
  
  // Handle favorite toggle
  const handleFavoriteClick = useCallback((e: React.MouseEvent) => {
    e.stopPropagation() // Prevent triggering movie click
    if (onFavoriteToggle) {
      onFavoriteToggle(movie)
    }
  }, [onFavoriteToggle, movie])
  
  // Handle image load
  const handleImageLoad = useCallback(() => {
    setImageLoading(false)
  }, [])
  
  // Handle image error
  const handleImageError = useCallback(() => {
    setImageLoading(false)
    setImageError(true)
  }, [])
  
  // Get movie image URL
  const imageUrl = getImageUrl(movie.poster_path, imageSize)
  
  // Card classes
  const cardClasses = [
    'bg-white rounded-lg shadow-md overflow-hidden transition-all duration-200 hover:shadow-lg hover:scale-105 cursor-pointer',
    className
  ].filter(Boolean).join(' ')
  
  return (
    <div className={cardClasses} onClick={handleMovieClick}>
      {/* Movie poster */}
      <div className="relative aspect-2/3 bg-gray-200">
        {/* Loading state */}
        {imageLoading && !imageError && (
          <div className="absolute inset-0 flex items-center justify-center">
            <LoadingSpinner size="md" variant="primary" />
          </div>
        )}
        
        {/* Image or fallback */}
        {!imageError && imageUrl ? (
          <img
            src={imageUrl}
            alt={movie.title}
            className="w-full h-full object-cover"
            loading={lazy ? 'lazy' : 'eager'}
            onLoad={handleImageLoad}
            onError={handleImageError}
          />
        ) : (
          <div className="absolute inset-0 flex items-center justify-center bg-gray-100">
            <div className="text-center text-gray-500">
              <svg
                className="mx-auto h-12 w-12 mb-2"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1}
                  d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                />
              </svg>
              <p className="text-xs">No Image</p>
            </div>
          </div>
        )}
        
        {/* Favorite button */}
        {showFavorite && (
          <button
            className="absolute top-2 right-2 p-1 rounded-full bg-black bg-opacity-50 text-white hover:bg-opacity-75 transition-colors"
            onClick={handleFavoriteClick}
            aria-label={isFavorite ? 'Remove from favorites' : 'Add to favorites'}
          >
            <svg
              className="h-5 w-5"
              fill={isFavorite ? 'currentColor' : 'none'}
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
              />
            </svg>
          </button>
        )}
        
        {/* Rating badge */}
        {showRatings && movie.vote_average > 0 && (
          <div className="absolute bottom-2 left-2 px-2 py-1 bg-black bg-opacity-75 text-white text-xs rounded-full">
            ⭐ {formatVoteAverage(movie.vote_average)}
          </div>
        )}
      </div>
      
      {/* Movie info */}
      <div className="p-4">
        <h3 className="font-semibold text-gray-900 text-sm line-clamp-2 mb-2 min-h-10">
          {movie.title}
        </h3>
        
        <div className="flex items-center justify-between text-xs text-gray-500">
          <span>{movie.release_date ? new Date(movie.release_date).getFullYear() : 'TBA'}</span>
          {showRatings && (
            <span className="flex items-center">
              <svg className="w-3 h-3 mr-1 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
              </svg>
              {formatVoteAverage(movie.vote_average)}
            </span>
          )}
        </div>
        
        {/* Overview preview */}
        {movie.overview && (
          <p className="text-xs text-gray-600 mt-2 line-clamp-2">
            {movie.overview}
          </p>
        )}
      </div>
    </div>
  )
})

MovieCard.displayName = 'MovieCard'

// Skeleton version for loading states
export const MovieCardSkeleton = React.memo(() => (
  <div className="bg-white rounded-lg shadow-md overflow-hidden">
    <div className="aspect-2/3 bg-gray-200 animate-pulse" />
    <div className="p-4 space-y-2">
      <div className="h-4 bg-gray-200 rounded animate-pulse" />
      <div className="h-4 bg-gray-200 rounded w-3/4 animate-pulse" />
      <div className="flex justify-between">
        <div className="h-3 bg-gray-200 rounded w-12 animate-pulse" />
        <div className="h-3 bg-gray-200 rounded w-16 animate-pulse" />
      </div>
    </div>
  </div>
))

MovieCardSkeleton.displayName = 'MovieCardSkeleton'