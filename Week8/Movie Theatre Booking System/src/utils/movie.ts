import { TMDB_API, IMAGE_SIZES } from '../constants'

/**
 * Generate TMDB image URL with proper size
 */
export const getImageUrl = (
  path: string | null,
  size: keyof typeof IMAGE_SIZES.POSTER | keyof typeof IMAGE_SIZES.BACKDROP = 'w500',
  type: 'poster' | 'backdrop' | 'profile' = 'poster'
): string => {
  if (!path) {
    return getPlaceholderImage(type)
  }

  const imageSize = type === 'poster' 
    ? IMAGE_SIZES.POSTER[size as keyof typeof IMAGE_SIZES.POSTER]
    : type === 'backdrop'
    ? IMAGE_SIZES.BACKDROP[size as keyof typeof IMAGE_SIZES.BACKDROP]
    : IMAGE_SIZES.PROFILE[size as keyof typeof IMAGE_SIZES.PROFILE]

  return `${TMDB_API.IMAGE_BASE_URL}/${imageSize}${path}`
}

/**
 * Get placeholder image for missing posters/backdrops
 */
export const getPlaceholderImage = (type: 'poster' | 'backdrop' | 'profile' = 'poster'): string => {
  const placeholders = {
    poster: '/placeholder-poster.jpg',
    backdrop: '/placeholder-backdrop.jpg',
    profile: '/placeholder-profile.jpg'
  }
  return placeholders[type]
}

/**
 * Format movie runtime from minutes to hours and minutes
 */
export const formatRuntime = (runtime: number | null): string => {
  if (!runtime) return 'Runtime unknown'
  
  const hours = Math.floor(runtime / 60)
  const minutes = runtime % 60
  
  if (hours === 0) return `${minutes}m`
  if (minutes === 0) return `${hours}h`
  
  return `${hours}h ${minutes}m`
}

/**
 * Format date to readable format
 */
export const formatDate = (dateString: string): string => {
  try {
    const date = new Date(dateString)
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    })
  } catch {
    return 'Date unknown'
  }
}

/**
 * Format date for display in booking
 */
export const formatShowDate = (dateString: string): string => {
  try {
    const date = new Date(dateString)
    const today = new Date()
    const tomorrow = new Date(today)
    tomorrow.setDate(tomorrow.getDate() + 1)
    
    if (date.toDateString() === today.toDateString()) {
      return 'Today'
    } else if (date.toDateString() === tomorrow.toDateString()) {
      return 'Tomorrow'
    } else {
      return date.toLocaleDateString('en-US', {
        weekday: 'short',
        month: 'short',
        day: 'numeric'
      })
    }
  } catch {
    return dateString
  }
}

/**
 * Format currency values
 */
export const formatCurrency = (amount: number, currency: string = 'USD'): string => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: currency,
  }).format(amount)
}

/**
 * Format movie vote average
 */
export const formatVoteAverage = (voteAverage: number): string => {
  return (voteAverage / 10 * 100).toFixed(0) + '%'
}

/**
 * Get rating color based on vote average
 */
export const getRatingColor = (voteAverage: number): string => {
  const percentage = voteAverage * 10
  if (percentage >= 70) return '#4ade80' // green
  if (percentage >= 50) return '#fbbf24' // yellow
  return '#f87171' // red
}

/**
 * Truncate text to specified length
 */
export const truncateText = (text: string, maxLength: number): string => {
  if (text.length <= maxLength) return text
  return text.substring(0, maxLength).trim() + '...'
}

/**
 * Generate movie slug from title
 */
export const generateMovieSlug = (title: string, id: number): string => {
  const slug = title
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
  return `${slug}-${id}`
}

/**
 * Parse movie slug to get ID
 */
export const parseMovieSlug = (slug: string): number | null => {
  const match = slug.match(/-(\d+)$/)
  return match ? parseInt(match[1], 10) : null
}