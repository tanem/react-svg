# Data URL

Inject SVGs from `data:image/svg+xml` URLs without making network requests. This is useful when bundlers like Vite inline small SVG files as data URIs during the build process.

```jsx
import { createRoot } from 'react-dom/client'
import { ReactSVG } from 'react-svg'

const thumbUpDataUrl =
  "data:image/svg+xml,%3Csvg%20xmlns%3D'http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg'%20...%3E...%3C%2Fsvg%3E"

const container = document.getElementById('root')
const root = createRoot(container)
root.render(
  <ReactSVG
    beforeInjection={(svg) => {
      svg.setAttribute('width', '48')
      svg.setAttribute('height', '48')
    }}
    src={thumbUpDataUrl}
  />,
)
```

The underlying library detects the `data:image/svg+xml` prefix and parses the SVG content directly using `DOMParser`. No XHR is made, which avoids Content Security Policy violations that would otherwise occur when attempting to fetch a `data:` URI.

## Supported formats

- `data:image/svg+xml,` followed by URL-encoded SVG (percent-encoded).
- `data:image/svg+xml;base64,` followed by base64-encoded SVG.
- `data:image/svg+xml;charset=utf-8,` followed by URL-encoded SVG.

## Caching

Data URLs bypass the request cache entirely since the SVG content is already embedded in the URL. The `useRequestCache` prop has no effect on data URL sources.

## Limitations

- Only `data:image/svg+xml` MIME types are supported. Other image formats (e.g. `data:image/png`) are not handled.
- Parse errors from malformed SVG content are reported through the `onError` callback.

## Running Locally

This project was bootstrapped with [Create React App](https://github.com/facebook/create-react-app).

In the project directory, you can run:

### `npm start`

Runs the app in the development mode. Open [http://localhost:3000](http://localhost:3000) to view it in the browser.
