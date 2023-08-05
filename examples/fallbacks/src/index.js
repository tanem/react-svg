import { Component, Fragment } from 'react'
import { createRoot } from 'react-dom/client'
import { ReactSVG } from 'react-svg'

class ClassFallback extends Component {
  render() {
    return <img alt="nyan" src="nyan.jpg" />
  }
}
const FunctionFallback = () => <img alt="doge" src="doge.png" />
const StringFallback = 'div'

const container = document.getElementById('root')
const root = createRoot(container)
root.render(
  <Fragment>
    <ReactSVG fallback={ClassFallback} src="notfound.svg" />
    <ReactSVG fallback={FunctionFallback} src="notfound.svg" />
    <ReactSVG fallback={StringFallback} src="notfound.svg" />
    <ReactSVG
      beforeInjection={() => {
        throw new Error('boom!')
      }}
      fallback={<span>beforeInjection fallback</span>}
      src="svg.svg"
    />
    <ReactSVG
      afterInjection={() => {
        throw new Error('boom!')
      }}
      fallback={<span>afterInjection fallback</span>}
      src="svg.svg"
    />
  </Fragment>,
)
