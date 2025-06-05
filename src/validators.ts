// Input validation functions for the GrabPic library
import { type GrabPicOptions, GrabPicError, GrabPicErrorType } from "./types"

// Validates the search query parameter
export function validateQuery(query: string): void {
  // Check if query is provided and not empty
  if (!query || typeof query !== "string") {
    throw new GrabPicError(
      "Query parameter is required and must be a non-empty string",
      GrabPicErrorType.MISSING_QUERY,
      400,
    )
  }

  // Check if query is not just whitespace
  if (query.trim().length === 0) {
    throw new GrabPicError(
      "Query parameter cannot be empty or contain only whitespace",
      GrabPicErrorType.MISSING_QUERY,
      400,
    )
  }

  // Check query length (reasonable limits)
  if (query.length > 200) {
    throw new GrabPicError("Query parameter is too long (maximum 200 characters)", GrabPicErrorType.MISSING_QUERY, 400)
  }
}

// Validates the Unsplash access key parameter
export function validateAccessKey(accessKey: string): void {
  // Check if access key is provided
  if (!accessKey || typeof accessKey !== "string") {
    throw new GrabPicError(
      "Unsplash access key is required and must be a string",
      GrabPicErrorType.MISSING_ACCESS_KEY,
      400,
    )
  }

  // Check if access key is not just whitespace
  if (accessKey.trim().length === 0) {
    throw new GrabPicError(
      "Unsplash access key cannot be empty or contain only whitespace",
      GrabPicErrorType.MISSING_ACCESS_KEY,
      400,
    )
  }

  // Basic format validation (Unsplash access keys are typically 64 characters)
  if (accessKey.length < 20) {
    throw new GrabPicError(
      "Unsplash access key appears to be invalid (too short)",
      GrabPicErrorType.INVALID_ACCESS_KEY,
      400,
    )
  }
}

// Validates the options parameter and returns validated options with defaults
export function validateAndNormalizeOptions(options: GrabPicOptions = {}): Required<GrabPicOptions> {
  const { count = 5, orientation, size = "regular" } = options

  // Validate count parameter
  if (typeof count !== "number" || !Number.isInteger(count)) {
    throw new GrabPicError("Count parameter must be an integer", GrabPicErrorType.INVALID_COUNT, 400)
  }

  // Check count range (Unsplash API limits)
  if (count < 1 || count > 30) {
    throw new GrabPicError(
      "Count parameter must be between 1 and 30 (Unsplash API limitation)",
      GrabPicErrorType.INVALID_COUNT,
      400,
    )
  }

  // Validate orientation if provided
  const validOrientations = ["landscape", "portrait", "squarish"] as const
  if (orientation && !validOrientations.includes(orientation)) {
    throw new GrabPicError(
      `Invalid orientation "${orientation}". Must be one of: ${validOrientations.join(", ")}`,
      GrabPicErrorType.INVALID_COUNT,
      400,
    )
  }

  // Validate size parameter
  const validSizes = ["raw", "full", "regular", "small", "thumb"] as const
  if (!validSizes.includes(size)) {
    throw new GrabPicError(
      `Invalid size "${size}". Must be one of: ${validSizes.join(", ")}`,
      GrabPicErrorType.INVALID_COUNT,
      400,
    )
  }

  // Return validated and normalized options
  return {
    count,
    orientation: orientation || "landscape", // Default to landscape if not provided
    size,
  }
}
