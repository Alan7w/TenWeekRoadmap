import axios, { AxiosError } from 'axios'
import type { AxiosInstance, AxiosResponse } from 'axios'
import type { ApiError } from '../types'
import { TMDB_API } from '../constants'

/**
 * Create axios instance with TMDB configuration
 */
const createApiClient = (): AxiosInstance => {
  const client = axios.create({
    baseURL: TMDB_API.BASE_URL,
    timeout: 10000,
    headers: {
      'Authorization': `Bearer ${TMDB_API.API_KEY}`,
      'Content-Type': 'application/json',
    },
  })

  // Request interceptor
  client.interceptors.request.use(
    (config) => {
      // Log API calls in development
      if (import.meta.env.VITE_DEV_MODE === 'true') {
        console.log(`🚀 API Request: ${config.method?.toUpperCase()} ${config.url}`)
      }
      return config
    },
    (error) => {
      return Promise.reject(error)
    }
  )

  // Response interceptor
  client.interceptors.response.use(
    (response: AxiosResponse) => {
      // Log successful responses in development
      if (import.meta.env.VITE_DEV_MODE === 'true') {
        console.log(`✅ API Response: ${response.status} ${response.config.url}`)
      }
      return response
    },
    (error: AxiosError) => {
      // Transform axios error to our ApiError format
      const apiError: ApiError = {
        message: 'An unexpected error occurred',
        status: error.response?.status,
        code: error.code,
      }

      if (error.response) {
        // Server responded with error status
        const data = error.response.data as Record<string, unknown>
        apiError.message = (data?.status_message as string) || (data?.message as string) || `HTTP ${error.response.status}`
        apiError.status = error.response.status
      } else if (error.request) {
        // Network error
        apiError.message = 'Network error. Please check your connection.'
        apiError.code = 'NETWORK_ERROR'
      } else {
        // Something else happened
        apiError.message = error.message || 'Request failed'
      }

      // Log errors in development
      if (import.meta.env.VITE_DEV_MODE === 'true') {
        console.error('❌ API Error:', apiError)
      }

      return Promise.reject(apiError)
    }
  )

  return client
}

// Create the API client instance
export const apiClient = createApiClient()

/**
 * Generic API call wrapper with error handling
 */
export const apiCall = async <T>(
  request: () => Promise<AxiosResponse<T>>
): Promise<T> => {
  const response = await request()
  return response.data
}

/**
 * Check if API key is configured
 */
export const isApiKeyConfigured = (): boolean => {
  return !!TMDB_API.API_KEY && TMDB_API.API_KEY.length > 0
}

/**
 * Build endpoint URL with parameters
 */
export const buildEndpoint = (endpoint: string, params: Record<string, string | number> = {}): string => {
  let url = endpoint
  
  // Replace path parameters (e.g., {id})
  Object.entries(params).forEach(([key, value]) => {
    url = url.replace(`{${key}}`, String(value))
  })
  
  return url
}