import { css } from 'glamor'
import React from 'react'
import { render } from 'react-dom'
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

render(<ReactSVG src="svg.svg" {...styles} />, document.getElementById('root'))
