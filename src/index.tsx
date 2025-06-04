interface UnsplashPhoto {
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

interface UnsplashResponse {
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
  options: {
    count?: number
    orientation?: "landscape" | "portrait" | "squarish"
    size?: "raw" | "full" | "regular" | "small" | "thumb"
  } = {},
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

// Default export for convenience
export default grabPic
