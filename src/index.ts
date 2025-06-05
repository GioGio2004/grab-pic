// Enhanced GrabPic library with built-in validation and response handling
import { type GrabPicOptions, type UnsplashResponse, GrabPicError, GrabPicErrorType } from "./types"
import { validateQuery, validateAccessKey, validateAndNormalizeOptions } from "./validators"

// Export all types for library users
export * from "./types"
export * from "./validators"

// Enhanced class that wraps image URLs with convenient access methods
export class GrabPictureResult {
  private urls: string[] // Private array storing the fetched image URLs

  // Constructor accepts an array of image URLs
  constructor(urls: string[]) {
    this.urls = urls // Store the URLs in the private property
  }

  // Method to get the first image URL, returns empty string if no images
  one(): string {
    return this.urls[0] || "" // Use logical OR to return empty string if undefined
  }

  // Method to get the second image URL, returns empty string if not available
  two(): string {
    return this.urls[1] || "" // Access second element, fallback to empty string
  }

  // Method to get the third image URL, returns empty string if not available
  three(): string {
    return this.urls[2] || "" // Access third element, fallback to empty string
  }

  // Method to get the fourth image URL, returns empty string if not available
  four(): string {
    return this.urls[3] || "" // Access fourth element, fallback to empty string
  }

  // Method to get the fifth image URL, returns empty string if not available
  five(): string {
    return this.urls[4] || "" // Access fifth element, fallback to empty string
  }

  // Method to get all image URLs as a new array (prevents external modification)
  all(): string[] {
    return [...this.urls] // Use spread operator to create a shallow copy
  }

  // Method to get a random image URL from the available URLs
  random(): string {
    if (this.urls.length === 0) return "" // Return empty string if no URLs available
    const randomIndex = Math.floor(Math.random() * this.urls.length) // Generate random index
    return this.urls[randomIndex] // Return URL at the random index
  }
}

// Enhanced function with comprehensive validation and error handling
export async function grabPic(
  query: string, // Search query string (required)
  accessKey: string, // Unsplash API access key (required)
  options: GrabPicOptions = {}, // Optional configuration object with default empty object
): Promise<GrabPictureResult> {
  try {
    // Validate all input parameters - this happens inside the npm package
    validateQuery(query) // Validate search query
    validateAccessKey(accessKey) // Validate access key
    const validatedOptions = validateAndNormalizeOptions(options) // Validate and normalize options

    // Create URLSearchParams object to build query string
    const params = new URLSearchParams({
      query: query.trim(), // Add trimmed search query parameter
      per_page: validatedOptions.count.toString(), // Convert count to string for URL parameter
      client_id: accessKey.trim(), // Add trimmed Unsplash access key as client_id
    })

    // Add orientation parameter if specified
    if (validatedOptions.orientation) {
      params.append("orientation", validatedOptions.orientation) // Add orientation filter
    }

    // Make HTTP request to Unsplash search API
    const response = await fetch(`https://api.unsplash.com/search/photos?${params.toString()}`, {
      headers: {
        "Accept-Version": "v1", // Specify API version to ensure consistent responses
        "User-Agent": "GrabPic-Library/1.0", // Identify our library in requests
      },
    })

    // Handle different HTTP response status codes with specific error messages
    if (!response.ok) {
      if (response.status === 401) {
        throw new GrabPicError(
          "Invalid Unsplash access key. Please check your API key.",
          GrabPicErrorType.INVALID_ACCESS_KEY,
          401,
        )
      }
      if (response.status === 403) {
        throw new GrabPicError(
          "Rate limit exceeded or access denied. Please try again later.",
          GrabPicErrorType.RATE_LIMIT_EXCEEDED,
          403,
        )
      }
      if (response.status === 404) {
        throw new GrabPicError(
          "Unsplash API endpoint not found. Please check the library version.",
          GrabPicErrorType.API_ERROR,
          404,
        )
      }
      // Generic error for other status codes
      throw new GrabPicError(
        `Unsplash API error: ${response.status} ${response.statusText}`,
        GrabPicErrorType.API_ERROR,
        response.status,
      )
    }

    // Parse JSON response and cast to expected interface type
    const data = (await response.json()) as UnsplashResponse

    // Validate that we received results in the expected format
    if (!data.results || !Array.isArray(data.results)) {
      throw new GrabPicError("Invalid response format from Unsplash API", GrabPicErrorType.API_ERROR, 500)
    }

    // Check if any results were found
    if (data.results.length === 0) {
      throw new GrabPicError(
        `No images found for query: "${query}". Try a different search term.`,
        GrabPicErrorType.NO_RESULTS_FOUND,
        404,
      )
    }

    // Extract URLs of the specified size from each photo object
    const urls = data.results
      .map((photo) => photo.urls[validatedOptions.size]) // Get URL for specified size
      .filter((url) => url && typeof url === "string") // Filter out any invalid URLs

    // Double-check that we have valid URLs
    if (urls.length === 0) {
      throw new GrabPicError("No valid image URLs found in API response", GrabPicErrorType.API_ERROR, 500)
    }

    // Return new GrabPictureResult instance with the extracted URLs
    return new GrabPictureResult(urls)
  } catch (error) {
    // Handle network errors and other unexpected errors
    if (error instanceof GrabPicError) {
      throw error // Re-throw our custom errors as-is
    }

    // Handle fetch/network errors
    if (error instanceof TypeError && error.message.includes("fetch")) {
      throw new GrabPicError(
        "Network error: Unable to connect to Unsplash API. Please check your internet connection.",
        GrabPicErrorType.NETWORK_ERROR,
        503,
        error,
      )
    }

    // Handle JSON parsing errors
    if (error instanceof SyntaxError) {
      throw new GrabPicError(
        "Invalid response from Unsplash API (JSON parsing failed)",
        GrabPicErrorType.API_ERROR,
        500,
        error,
      )
    }

    // Generic error for any other unexpected errors
    throw new GrabPicError(
      "An unexpected error occurred while fetching images",
      GrabPicErrorType.UNKNOWN_ERROR,
      500,
      error instanceof Error ? error : undefined,
    )
  }
}

// Default export - the main grabPic function
export default grabPic
