import { createRoot } from 'react-dom/client'
import { ReactSVG } from 'react-svg'

const container = document.getElementById('root')
const root = createRoot(container)
root.render(
  <div>
    <h1>SVG Sprite Injection</h1>
    <p>
      Each icon below is extracted from a single <code>sprite.svg</code> file
      and injected inline.
    </p>
    <ReactSVG src="sprite.svg#icon-star" />
    <ReactSVG src="sprite.svg#icon-heart" />
    <ReactSVG src="sprite.svg#icon-thumb-up" />
  </div>,
)
