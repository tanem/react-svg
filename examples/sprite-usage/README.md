# Sprite Usage

You can inject individual symbols from an SVG sprite sheet by appending a fragment identifier to the `src` URL. The underlying library will fetch the sprite file, extract the `<symbol>` matching the fragment ID, and inject it as a standalone inline `<svg>`.

```jsx
import { createRoot } from 'react-dom/client'
import { ReactSVG } from 'react-svg'

const container = document.getElementById('root')
const root = createRoot(container)
root.render(
  <div>
    <ReactSVG src="sprite.svg#icon-star" />
    <ReactSVG src="sprite.svg#icon-heart" />
  </div>,
)
```

When `useRequestCache` is `true` (the default), the sprite file is fetched once and reused for all symbol extractions, so multiple icons from the same sprite result in only a single HTTP request.

**Limitations:**

- Each `<symbol>` must be self-contained. Shared `<defs>` at the root level of the sprite (e.g. gradients or filters referenced by multiple symbols) are **not** copied into the extracted SVG.
- Only `<symbol>` elements are supported for extraction. The fragment ID must match the `id` of a `<symbol>` in the sprite.

## Running Locally

This project was bootstrapped with [Create React App](https://github.com/facebook/create-react-app).

In the project directory, you can run:

### `npm start`

Runs the app in the development mode. Open [http://localhost:3000](http://localhost:3000) to view it in the browser.
