// Export interfaces for TypeScript users
export interface GrabPicOptions {
  count?: number
  orientation?: "landscape" | "portrait" | "squarish"
  size?: "raw" | "full" | "regular" | "small" | "thumb"
}

export interface UnsplashPhoto {
  id: string
  urls: {
    raw: string
    full: string
    regular: string
    small: string
    thumb: string
  }
  alt_description: string | null
  description: string | null
}

export interface UnsplashResponse {
  results: UnsplashPhoto[]
  total: number
  total_pages: number
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

export async function grabPic(
  query: string,
  accessKey: string,
  options: GrabPicOptions = {},
): Promise<GrabPictureResult> {
  const { count = 5, orientation, size = "regular" } = options

  // Internal validations - users don't need to handle these
  if (!query || typeof query !== "string" || query.trim() === "") {
    console.warn('GrabPic: Empty or invalid query provided, using default "nature"')
    query = "nature"
  }

  if (!accessKey || typeof accessKey !== "string" || accessKey.trim() === "") {
    console.error("GrabPic: No valid Unsplash access key provided")
    // Return empty result instead of throwing
    return new GrabPictureResult([])
  }

  if (count < 1 || count > 30) {
    console.warn("GrabPic: Count must be between 1 and 30, adjusting to valid range")
    const adjustedCount = Math.max(1, Math.min(30, count))
    return grabPic(query, accessKey, { ...options, count: adjustedCount })
  }

  try {
    const params = new URLSearchParams({
      query: query.trim(),
      per_page: count.toString(),
      client_id: accessKey.trim(),
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
        console.error("GrabPic: Invalid Unsplash access key")
        return new GrabPictureResult([])
      }
      if (response.status === 403) {
        console.warn("GrabPic: Rate limit exceeded or access denied")
        return new GrabPictureResult([])
      }
      console.error(`GrabPic: Unsplash API error: ${response.status} ${response.statusText}`)
      return new GrabPictureResult([])
    }

    const data = (await response.json()) as UnsplashResponse

    if (!data.results || data.results.length === 0) {
      console.warn(`GrabPic: No images found for query: "${query}"`)
      return new GrabPictureResult([])
    }

    const urls = data.results.map((photo) => photo.urls[size])

    return new GrabPictureResult(urls)
  } catch (error) {
    console.error("GrabPic: Failed to fetch images from Unsplash:", error)
    // Return empty result instead of throwing
    return new GrabPictureResult([])
  }
}

// Default export - this is crucial for auto-suggestions
export default grabPic
