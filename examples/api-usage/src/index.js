import { createRoot } from 'react-dom/client'
import { ReactSVG } from 'react-svg'

const container = document.getElementById('root')
const root = createRoot(container)
root.render(
  <ReactSVG
    afterInjection={(svg) => {
      console.log(svg)
    }}
    beforeInjection={(svg) => {
      svg.classList.add('svg-class-name')
      svg.setAttribute('style', 'width: 200px')
    }}
    className="wrapper-class-name"
    desc="Description"
    evalScripts="always"
    fallback={() => <span>Error!</span>}
    httpRequestWithCredentials={true}
    loading={() => <span>Loading</span>}
    onClick={() => {
      console.log('wrapper onClick')
    }}
    onError={(error) => {
      console.error(error)
    }}
    renumerateIRIElements={false}
    src="svg.svg"
    title="Title"
    useRequestCache={false}
    wrapper="span"
  />,
)
