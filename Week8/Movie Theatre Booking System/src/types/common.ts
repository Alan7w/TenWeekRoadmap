// API related types

export interface ApiError {
  message: string
  status?: number
  code?: string
}

export interface ApiResponse<T> {
  data: T
  success: boolean
  error?: ApiError
}

// Common UI Types
export interface LoadingState {
  isLoading: boolean
  error: string | null
}

// Future expansion types - currently unused but prepared for feature development
// Uncomment when implementing search/filtering functionality
// export interface SearchFilters {
//   query: string
//   genre: string
//   year: string
//   sortBy: 'popularity' | 'release_date' | 'vote_average' | 'title'
//   sortOrder: 'asc' | 'desc'
// }

// export interface PaginationInfo {
//   currentPage: number
//   totalPages: number
//   totalResults: number
//   resultsPerPage: number
// }

// Form Validation Types
export interface ValidationError {
  field: string
  message: string
}

export interface FormState<T> {
  data: T
  errors: ValidationError[]
  isValid: boolean
  isDirty: boolean
}

// Utility Types
export type Optional<T, K extends keyof T> = Omit<T, K> & Partial<Pick<T, K>>
export type RequiredFields<T, K extends keyof T> = T & Required<Pick<T, K>>