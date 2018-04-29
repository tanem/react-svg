import React from 'react'
import ReactDOM from 'react-dom'
import ReactSVG from '../../../src'

class Swap extends React.Component {
  state = {
    isHovered: false
  }

  render() {
    return (
      <div
        onMouseEnter={() => this.setState({ isHovered: true })}
        onMouseOut={() => this.setState({ isHovered: false })}
        style={{ display: 'inline-block' }}
      >
        <ReactSVG
          path={this.state.isHovered ? 'atomic-black.svg' : 'atomic-blue.svg'}
          svgClassName="svg-class-name"
          className="wrapper-class-name"
        />
      </div>
    )
  }
}

ReactDOM.render(<Swap />, document.querySelector('.Root'))
