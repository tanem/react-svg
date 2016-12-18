# react-svg

[![npm version](https://img.shields.io/npm/v/react-svg.svg?style=flat-square)](https://www.npmjs.com/package/react-svg)
[![npm downloads](https://img.shields.io/npm/dm/react-svg.svg?style=flat-square)](https://www.npmjs.com/package/react-svg)

> A React component that uses [SVGInjector](https://github.com/iconic/SVGInjector) to add SVG to the DOM.

## Usage

```js
import React from 'react'
import ReactDOM from 'react-dom'
import ReactSVG from 'react-svg'

ReactDOM.render(
  <ReactSVG
    srcPath="atomic.svg"
    callback={svg => console.log(svg)}
    className="example"
  />,
  document.querySelector('.Root')
)
```

There is a working version of the above in the `example` dir. First run `npm start`, then point a browser at `localhost:8080`.

## API

__Props__

- `srcPath` - Path to the SVG.
- `callback` - *Optional* Function to call after the SVG is injected. Receives the newly injected SVG DOM element as a parameter. Defaults to `null`.
- `className` - *Optional* Class name to be added to the SVG. Defaults to `''`.
- `evalScripts` - *Optional* Run any script blocks found in the SVG (`always`, `once`, or `never`). Defaults to `never`.

__Example__

```js
<ReactSVG
  srcPath="atomic.svg"
  callback={(svg) => console.log(svg)}
  className="example"
  evalScript="always"
/>
```

Refer to the SVGInjector [configuration docs](https://github.com/iconic/SVGInjector#configuration) for more information.

## Install

```
$ npm install react-svg --save
```

There are also UMD builds available via [unpkg](https://unpkg.com/):

- https://unpkg.com/react-svg/dist/react-svg.js
- https://unpkg.com/react-svg/dist/react-svg.min.js

If you use these, make sure you have already included React as a dependency.

## License

MIT
