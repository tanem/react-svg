import { createRoot } from 'react-dom/client'
import { ReactSVG } from 'react-svg'

// A "thumb up" icon as a URL-encoded data URL (Vite's default for SVGs without
// <text>).
const thumbUpDataUrl =
  "data:image/svg+xml,%3Csvg%20xmlns%3D'http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg'%20width%3D'8'%20height%3D'8'%20viewBox%3D'0%200%208%208'%3E%3Cpath%20d%3D'M4.47%200c-.19.02-.37.15-.47.34-.13.26-1.09%202.19-1.28%202.38-.19.19-.44.28-.72.28v4h3.5c.21%200%20.39-.13.47-.31%200%200%201.03-2.91%201.03-3.19%200-.28-.22-.5-.5-.5h-1.5c-.28%200-.5-.25-.5-.5s.39-1.58.47-1.84c.08-.26-.05-.54-.31-.63-.07-.02-.12-.04-.19-.03zm-4.47%203v4h1v-4h-1z'%2F%3E%3C%2Fsvg%3E"

// A "volume" icon as a base64-encoded data URL (Vite's default for SVGs
// containing <text>).
const volumeDataUrl =
  'data:image/svg+xml;base64,PHN2ZyB4bWxucz0naHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmcnIHdpZHRoPSc4JyBoZWlnaHQ9JzgnIHZpZXdCb3g9JzAgMCA4IDgnPjxwYXRoIGQ9J001IDFMMyAzSDFWN0gzTDUgOVYxWicvPjwvc3ZnPg=='

// Resize the injected SVG so it's clearly visible.
const setIconSize = (svg) => {
  svg.setAttribute('width', '48')
  svg.setAttribute('height', '48')
}

const container = document.getElementById('root')
const root = createRoot(container)
root.render(
  <div>
    <h1>SVG Data URL Injection</h1>
    <p>
      These icons use <code>data:image/svg+xml</code> URLs in their{' '}
      <code>src</code> prop, as a bundler like Vite would produce. The SVG
      content is parsed directly from the data URL without making a network
      request.
    </p>
    <h2>URL-encoded (thumb up)</h2>
    <ReactSVG beforeInjection={setIconSize} src={thumbUpDataUrl} />
    <h2>Base64-encoded (volume)</h2>
    <ReactSVG beforeInjection={setIconSize} src={volumeDataUrl} />
  </div>,
)
