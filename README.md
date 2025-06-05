# grab-picture

The simplest way to fetch beautiful images from Unsplash in your JavaScript/TypeScript projects.
GrabPicture makes image searching incredibly easy with a clean, intuitive API. Get high-quality images with just one line of code!

## Installation

```bash
npm install grab-picture
```

## Quick Start

### 1. Get Your Unsplash Access Key

1. Go to [Unsplash Developers](https://unsplash.com/developers)
2. Create a new application
3. Copy your Access Key

### 2. Basic Usage

```javascript
import grabPic from 'grab-picture';

// Simple image search
const result = await grabPic('mountains', 'YOUR_UNSPLASH_ACCESS_KEY');

// Get the first image
const imageUrl = result.one();
console.log(imageUrl);
```

That's it! You now have a beautiful mountain image URL ready to use.

## API Reference

```javascript
grabPic(query, accessKey, options?)
```

#### Parameters

| Parameter | Type    | Required | Description                  |
|-----------|---------|----------|------------------------------|
| `query`   |`string` |    ✅    | Search term for images       |
|`accessKey`|`string` |    ✅    | Your Unsplash API access key |

#### Options

| Option        | Type     | Default       | Description                                                      |
|---------------|----------|---------------|------------------------------------------------------------------|
| `count`       | `number` | `5`           | Number of images to fetch (1-30)                                 |
| `orientation` | `string` | `"landscape"` | Image orientation: `"landscape"`, `"portrait"`, `"squarish"`     |
| `size`        | `string` | `"regular"`   | Image size: `"raw"`, `"full"`, `"regular"`, `"small"`, `"thumb"` |

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

javascript
// Simple search - query first, API key second
const pics = await grabPic("mountain landscape", YOUR_ACCESS_KEY);
console.log(pics.one()); // First image URL


### With Options

typescript

// Advanced search with options
const pics = await grabPic("dogs", YOUR_ACCESS_KEY, {
  count: 10,
  orientation: 'landscape',
  size: 'small'
});

console.log(pics.all()); // Array of 10 landscape dog images


### Next.js Example

typescript

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


### Error Handling

typescript

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


## Getting Your Unsplash Access Key

1. Go to [Unsplash Developers](https://unsplash.com/developers)
2. Create a new application
3. Copy your Access Key
4. Add it to your environment variables as `UNSPLASH_ACCESS_KEY`

## Environment Variables


# .env.local
UNSPLASH_ACCESS_KEY=your_access_key_here

## License

MIT

## Contributing

Pull requests are welcome! Please feel free to submit a Pull Request.

## Repository

~ GitHub: [https://github.com/GioGio2004/grab-pic](https://github.com/GioGio2004/grab-pic)