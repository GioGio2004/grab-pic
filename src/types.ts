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
