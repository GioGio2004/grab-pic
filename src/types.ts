// Enhanced type definitions for the GrabPic library with validation and response handling

// Interface defining optional parameters for the grabPic function
export interface GrabPicOptions {
  count?: number // Optional: Number of images to fetch (1-30), defaults to 5
  orientation?: "landscape" | "portrait" | "squarish" // Optional: Filter images by orientation
  size?: "raw" | "full" | "regular" | "small" | "thumb" // Optional: Image size/quality, defaults to "regular"
}

// Interface representing a single photo object from Unsplash API response
export interface UnsplashPhoto {
  id: string // Unique identifier for the photo on Unsplash
  urls: {
    // Object containing different sized versions of the same image
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

// Enhanced response interface for the library with success/error handling
export interface GrabPicResponse {
  success: boolean // Indicates if the operation was successful
  data?: string[] // Array of image URLs (only present on success)
  error?: string // Error message (only present on failure)
  statusCode?: number // HTTP status code for better error handling
  meta?: {
    // Additional metadata about the response
    query: string // The search query that was used
    count: number // Number of images requested
    actualCount: number // Actual number of images returned
    orientation?: string // Orientation filter applied
    size: string // Image size used
  }
}

// Enum for common error types to provide better error categorization
export enum GrabPicErrorType {
  INVALID_ACCESS_KEY = "INVALID_ACCESS_KEY",
  MISSING_QUERY = "MISSING_QUERY",
  MISSING_ACCESS_KEY = "MISSING_ACCESS_KEY",
  INVALID_COUNT = "INVALID_COUNT",
  RATE_LIMIT_EXCEEDED = "RATE_LIMIT_EXCEEDED",
  NO_RESULTS_FOUND = "NO_RESULTS_FOUND",
  NETWORK_ERROR = "NETWORK_ERROR",
  API_ERROR = "API_ERROR",
  UNKNOWN_ERROR = "UNKNOWN_ERROR",
}

// Custom error class for better error handling
export class GrabPicError extends Error {
  public readonly type: GrabPicErrorType // Type of error for categorization
  public readonly statusCode: number // HTTP status code associated with the error
  public readonly originalError?: Error // Original error if this wraps another error

  constructor(message: string, type: GrabPicErrorType, statusCode = 500, originalError?: Error) {
    super(message) // Call parent Error constructor
    this.name = "GrabPicError" // Set error name
    this.type = type // Set error type
    this.statusCode = statusCode // Set status code
    this.originalError = originalError // Store original error if provided

    // Maintain proper stack trace (only available in V8)
    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, GrabPicError)
    }
  }
}
