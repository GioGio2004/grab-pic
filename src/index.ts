// Enhanced GrabPic library with built-in validation and error handling
import { GrabPicOptions, UnsplashPhoto, UnsplashResponse } from './types'

// Standardized API response interface
export interface GrabPicResponse {
  success: boolean
  data?: string[]
  error?: string
  statusCode: number
  message?: string
}

export class GrabPictureResult {
  private urls: string[]

  constructor(urls: string[]) {
    this.urls = urls
  }

  one(): string {
    return this.urls[0] || ""
  }

  two(): string {
    return this.urls[1] || ""
  }

  three(): string {
    return this.urls[2] || ""
  }

  four(): string {
    return this.urls[3] || ""
  }

  five(): string {
    return this.urls[4] || ""
  }

  all(): string[] {
    return [...this.urls]
  }

  random(): string {
    if (this.urls.length === 0) return ""
    const randomIndex = Math.floor(Math.random() * this.urls.length)
    return this.urls[randomIndex]
  }
}

// Enhanced grabPic function that returns standardized response
export async function grabPic(
  query: string,
  options: GrabPicOptions = {}
): Promise<GrabPicResponse> {
  const { count = 5, orientation, size = "regular" } = options

  // Input validation
  if (!query || typeof query !== 'string' || query.trim().length === 0) {
    return {
      success: false,
      error: 'Query parameter is required and must be a non-empty string',
      statusCode: 400,
      message: 'Invalid query parameter'
    }
  }

  // Access key validation - check environment variables
  const accessKey = process.env.UNSPLASH_ACCESS_KEY || process.env.NEXT_PUBLIC_UNSPLASH_ACCESS_KEY
  
  if (!accessKey) {
    return {
      success: false,
      error: 'Unsplash access key not configured. Please set UNSPLASH_ACCESS_KEY or NEXT_PUBLIC_UNSPLASH_ACCESS_KEY environment variable',
      statusCode: 500,
      message: 'Configuration error'
    }
  }

  // Count validation
  if (typeof count !== 'number' || count < 1 || count > 30) {
    return {
      success: false,
      error: 'Count must be a number between 1 and 30',
      statusCode: 400,
      message: 'Invalid count parameter'
    }
  }

  // Orientation validation
  if (orientation && !['landscape', 'portrait', 'squarish'].includes(orientation)) {
    return {
      success: false,
      error: 'Orientation must be one of: landscape, portrait, squarish',
      statusCode: 400,
      message: 'Invalid orientation parameter'
    }
  }

  // Size validation
  if (size && !['raw', 'full', 'regular', 'small', 'thumb'].includes(size)) {
    return {
      success: false,
      error: 'Size must be one of: raw, full, regular, small, thumb',
      statusCode: 400,
      message: 'Invalid size parameter'
    }
  }

  try {
    // Build URL parameters
    const params = new URLSearchParams({
      query: query.trim(),
      per_page: count.toString(),
      client_id: accessKey,
    })

    if (orientation) {
      params.append("orientation", orientation)
    }

    // Make API request
    const response = await fetch(`https://api.unsplash.com/search/photos?${params.toString()}`, {
      headers: {
        "Accept-Version": "v1",
        "User-Agent": "GrabPic-Library/1.0"
      },
    })

    // Handle HTTP errors
    if (!response.ok) {
      if (response.status === 401) {
        return {
          success: false,
          error: 'Invalid Unsplash access key. Please check your API credentials',
          statusCode: 401,
          message: 'Authentication failed'
        }
      }
      
      if (response.status === 403) {
        return {
          success: false,
          error: 'Rate limit exceeded or access denied. Please try again later',
          statusCode: 429,
          message: 'Rate limit exceeded'
        }
      }

      if (response.status === 404) {
        return {
          success: false,
          error: 'Unsplash API endpoint not found',
          statusCode: 404,
          message: 'API endpoint not found'
        }
      }

      return {
        success: false,
        error: `Unsplash API error: ${response.status} ${response.statusText}`,
        statusCode: response.status,
        message: 'API request failed'
      }
    }

    // Parse response
    let data: UnsplashResponse
    try {
      data = await response.json() as UnsplashResponse
    } catch (parseError) {
      return {
        success: false,
        error: 'Failed to parse API response',
        statusCode: 500,
        message: 'Invalid API response format'
      }
    }

    // Validate response structure
    if (!data.results || !Array.isArray(data.results)) {
      return {
        success: false,
        error: 'Invalid response structure from Unsplash API',
        statusCode: 500,
        message: 'Malformed API response'
      }
    }

    // Check if any images were found
    if (data.results.length === 0) {
      return {
        success: false,
        error: `No images found for query: "${query}". Try a different search term`,
        statusCode: 404,
        message: 'No results found'
      }
    }

    // Extract URLs with fallback handling
    const urls = data.results
      .map((photo) => {
        if (!photo.urls || !photo.urls[size]) {
          console.warn(`Missing ${size} URL for photo ${photo.id}`)
          return photo.urls?.regular || photo.urls?.full || null
        }
        return photo.urls[size]
      })
      .filter((url): url is string => url !== null)

    // Final check for valid URLs
    if (urls.length === 0) {
      return {
        success: false,
        error: `No valid image URLs found for size: ${size}`,
        statusCode: 500,
        message: 'No valid URLs extracted'
      }
    }

    // Return success response
    return {
      success: true,
      data: urls,
      statusCode: 200,
      message: `Successfully fetched ${urls.length} image(s)`
    }

  } catch (error) {
    // Handle network and other errors
    if (error instanceof TypeError && error.message.includes('fetch')) {
      return {
        success: false,
        error: 'Network error: Unable to connect to Unsplash API. Please check your internet connection',
        statusCode: 503,
        message: 'Network connection failed'
      }
    }

    return {
      success: false,
      error: error instanceof Error ? error.message : 'An unexpected error occurred while fetching images',
      statusCode: 500,
      message: 'Internal error'
    }
  }
}

// Legacy function for backward compatibility (returns GrabPictureResult)
export async function grabPicLegacy(
  query: string,
  accessKey: string,
  options: GrabPicOptions = {}
): Promise<GrabPictureResult> {
  const { count = 5, orientation, size = "regular" } = options

  if (!query || !accessKey) {
    throw new Error("Query and access key are required")
  }

  if (count < 1 || count > 30) {
    throw new Error("Count must be between 1 and 30")
  }

  try {
    const params = new URLSearchParams({
      query,
      per_page: count.toString(),
      client_id: accessKey,
    })

    if (orientation) {
      params.append("orientation", orientation)
    }

    const response = await fetch(`https://api.unsplash.com/search/photos?${params.toString()}`, {
      headers: {
        "Accept-Version": "v1",
      },
    })

    if (!response.ok) {
      if (response.status === 401) {
        throw new Error("Invalid Unsplash access key")
      }
      if (response.status === 403) {
        throw new Error("Rate limit exceeded or access denied")
      }
      throw new Error(`Unsplash API error: ${response.status} ${response.statusText}`)
    }

    const data = (await response.json()) as UnsplashResponse

    if (!data.results || data.results.length === 0) {
      throw new Error(`No images found for query: "${query}"`)
    }

    const urls = data.results.map((photo) => photo.urls[size])

    return new GrabPictureResult(urls)
  } catch (error) {
    if (error instanceof Error) {
      throw error
    }
    throw new Error("Failed to fetch images from Unsplash")
  }
}

// Export types
export * from './types'

// Default export for convenience
export default grabPic