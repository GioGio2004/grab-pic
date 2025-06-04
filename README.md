# grab-picture

A simple and lightweight wrapper for the Unsplash API that makes grabbing pictures effortless.

## Installation

\`\`\`bash
npm install grab-picture
\`\`\`

## Quick Start

\`\`\`typescript
import { grabPic } from 'grab-picture';

// Basic usage - query first, API key second
const pictures = await grabPic("cats and dogs", process.env.UNSPLASH_ACCESS_KEY);

// Access individual images
const firstImage = pictures.one();
const secondImage = pictures.two();
const randomImage = pictures.random();
const allImages = pictures.all();
\`\`\`

## Usage in Next.js API Route

\`\`\`typescript
// app/api/images/route.ts
import { NextRequest, NextResponse } from "next/server";
import { grabPic } from "grab-picture";

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const query = searchParams.get('q') || 'nature';
    
    const data = await grabPic(query, process.env.UNSPLASH_ACCESS_KEY!);
    
    return NextResponse.json({
      success: true,
      images: {
        first: data.one(),
        second: data.two(),
        third: data.three(),
        fourth: data.four(),
        fifth: data.five(),
        all: data.all(),
        random: data.random()
      }
    });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}
\`\`\`

## API Reference

### `grabPic(query, apiKey, options?)`

Fetches images from Unsplash based on your search query.

#### Parameters

1. `query` (string): Search term for images - **FIRST PARAMETER**
2. `apiKey` (string): Your Unsplash access key - **SECOND PARAMETER**  
3. `options` (object, optional): Configuration options
   - `count` (number): Number of images to fetch (1-30, default: 5)
   - `orientation` ('landscape' | 'portrait' | 'squarish'): Image orientation
   - `size` ('raw' | 'full' | 'regular' | 'small' | 'thumb'): Image size (default: 'regular')

#### Returns

Returns a `GrabPictureResult` object with the following methods:

- `one()`: Returns the first image URL
- `two()`: Returns the second image URL
- `three()`: Returns the third image URL
- `four()`: Returns the fourth image URL
- `five()`: Returns the fifth image URL
- `all()`: Returns array of all image URLs
- `random()`: Returns a random image URL from the results

## Examples

### Basic Usage

\`\`\`typescript
// Simple search - query first, API key second
const pics = await grabPic("mountain landscape", YOUR_ACCESS_KEY);
console.log(pics.one()); // First image URL
\`\`\`

### With Options

\`\`\`typescript
// Advanced search with options
const pics = await grabPic("dogs", YOUR_ACCESS_KEY, {
  count: 10,
  orientation: 'landscape',
  size: 'small'
});

console.log(pics.all()); // Array of 10 landscape dog images
\`\`\`

### Real-world Next.js Example

\`\`\`typescript
// app/api/random-image/route.ts
import { grabPic } from "grab-picture";

export async function GET() {
  try {
    const pics = await grabPic("nature", process.env.UNSPLASH_ACCESS_KEY!);
    return Response.json({ imageUrl: pics.random() });
  } catch (error) {
    return Response.json({ error: "Failed to fetch image" }, { status: 500 });
  }
}
\`\`\`

### Error Handling

\`\`\`typescript
try {
  const pics = await grabPic("cats", YOUR_ACCESS_KEY);
  console.log(pics.all());
} catch (error) {
  if (error.message.includes("Invalid Unsplash access key")) {
    console.error("Check your API key");
  } else if (error.message.includes("No images found")) {
    console.error("Try a different search term");
  } else {
    console.error("Failed to fetch images:", error.message);
  }
}
\`\`\`

## Getting Your Unsplash Access Key

1. Go to [Unsplash Developers](https://unsplash.com/developers)
2. Create a new application
3. Copy your Access Key
4. Add it to your environment variables as `UNSPLASH_ACCESS_KEY`

## Environment Variables

\`\`\`bash
# .env.local
UNSPLASH_ACCESS_KEY=your_access_key_here
\`\`\`

## TypeScript Support

This package is written in TypeScript and includes full type definitions:

\`\`\`typescript
import { grabPic, GrabPictureResult } from 'grab-picture';

// Full type safety
const result: GrabPictureResult = await grabPic("dogs", apiKey);
const imageUrl: string = result.one();
const allUrls: string[] = result.all();
\`\`\`

## License

MIT

## Contributing

Pull requests are welcome! Please feel free to submit a Pull Request.

## Repository

- **GitHub**: [https://github.com/GioGio2004/grab-picture](https://github.com/GioGio2004/grab-picture)
- **Issues**: [https://github.com/GioGio2004/grab-picture/issues](https://github.com/GioGio2004/grab-picture/issues)
- **Author**: Giorgi khvichia
