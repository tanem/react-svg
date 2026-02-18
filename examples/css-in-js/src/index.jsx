import { css } from 'glamor'
import { createRoot } from 'react-dom/client'
import { ReactSVG } from 'react-svg'

css.global('body', {
  alignItems: 'center',
  backgroundColor: 'gray',
  display: 'flex',
  height: '100vh',
  justifyContent: 'center',
  margin: 0,
})

const styles = css({
  ' rect': {
    fill: 'aqua',
    height: 190,
    stroke: 'darkmagenta',
    width: 190,
  },
  ' svg': {
    height: 200,
    width: 200,
  },
})

const container = document.getElementById('root')
const root = createRoot(container)
root.render(<ReactSVG src="svg.svg" {...styles} />)
