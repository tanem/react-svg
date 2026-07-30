import { createRoot } from 'react-dom/client'
import { ReactSVG } from 'react-svg'

// A <symbol> carries a viewBox but no width or height, so the extracted SVG
// has no intrinsic size and would stretch to the width of the page.
const setIconSize = (svg) => {
  svg.setAttribute('width', '48')
  svg.setAttribute('height', '48')
}

const container = document.getElementById('root')
const root = createRoot(container)
root.render(
  <div>
    <h1>SVG Sprite Injection</h1>
    <p>
      Each icon below is extracted from a single <code>sprite.svg</code> file
      and injected inline.
    </p>
    <ReactSVG beforeInjection={setIconSize} src="sprite.svg#icon-star" />
    <ReactSVG beforeInjection={setIconSize} src="sprite.svg#icon-heart" />
    <ReactSVG beforeInjection={setIconSize} src="sprite.svg#icon-thumb-up" />
  </div>,
)
