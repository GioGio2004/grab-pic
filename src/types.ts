// Enhanced type definitions for the GrabPic library

// Interface defining optional parameters for the grabPic function
export interface GrabPicOptions {
  count?: number // Optional: Number of images to fetch (1-30), defaults to 5
  orientation?: "landscape" | "portrait" | "squarish" // Optional: Filter images by orientation
  size?: "raw" | "full" | "regular" | "small" | "thumb" // Optional: Image size/quality, defaults to "regular"
}

// Standardized API response interface for the enhanced grabPic function
export interface GrabPicResponse {
  success: boolean // Indicates if the operation was successful
  data?: string[] // Array of image URLs (only present on success)
  error?: string // Detailed error message (only present on failure)
  statusCode: number // HTTP status code (200 for success, 4xx/5xx for errors)
  message?: string // Brief status message
}

// Interface representing a single photo object from Unsplash API response
export interface UnsplashPhoto {
  id: string // Unique identifier for the photo on Unsplash
  urls: { // Object containing different sized versions of the same image
    raw: string // Raw/original image URL (highest quality, unprocessed)
    full: string // Full-size image URL (processed, optimized)
    regular: string // Regular-size image URL (1080px wide, good for most uses)
    small: string // Small-size image URL (400px wide, good for thumbnails)
    thumb: string // Thumbnail image URL (200px wide, smallest size)
  }
  alt_description: string | null // Alternative text description for accessibility (can be null)
  description: string | null // Detailed description of the photo (can be null)
}

// Interface representing the complete response structure from Unsplash search API
export interface UnsplashResponse {
  results: UnsplashPhoto[] // Array of photo objects matching the search query
  total: number // Total number of photos available for this search (not just current page)
  total_pages: number // Total number of pages available for pagination
}

// Error types for better error handling
export type GrabPicErrorType = 
  | 'VALIDATION_ERROR' // Input validation failed
  | 'CONFIGURATION_ERROR' // Missing or invalid configuration
  | 'AUTHENTICATION_ERROR' // Invalid API credentials
  | 'RATE_LIMIT_ERROR' // API rate limit exceeded
  | 'NETWORK_ERROR' // Network connectivity issues
  | 'API_ERROR' // Unsplash API returned an error
  | 'NO_RESULTS_ERROR' // No images found for the query
  | 'PARSING_ERROR' // Failed to parse API response
  | 'UNKNOWN_ERROR' // Unexpected error occurred

// Extended error interface for detailed error information
export interface GrabPicError {
  type: GrabPicErrorType
  message: string
  statusCode: number
  details?: any // Additional error details for debugging
}