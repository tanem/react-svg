# react-svg

[![build status](https://img.shields.io/travis/tanem/react-svg/master.svg?style=flat-square)](https://travis-ci.org/tanem/react-svg)
[![coverage status](https://img.shields.io/codecov/c/github/tanem/react-svg.svg?style=flat-square)](https://codecov.io/gh/tanem/react-svg)
[![npm version](https://img.shields.io/npm/v/react-svg.svg?style=flat-square)](https://www.npmjs.com/package/react-svg)
[![npm downloads](https://img.shields.io/npm/dm/react-svg.svg?style=flat-square)](https://www.npmjs.com/package/react-svg)

> A React component that uses [SVGInjector](https://github.com/tanem/SVGInjector) to add SVG to the DOM.

## Usage

```js
import React from 'react'
import ReactDOM from 'react-dom'
import ReactSVG from 'react-svg'

ReactDOM.render(
  <ReactSVG
    path="atomic.svg"
    onInjected={svg => {
      console.log('onInjected', svg)
    }}
    svgClassName="svg-class-name"
    className="wrapper-class-name"
    onClick={() => {
      console.log('wrapper onClick')
    }}
  />,
  document.querySelector('.Root')
)
```

There is a working version of the above in the `examples/basic` dir. First run `npm start`, then point a browser at `localhost:8080/basic`.

## API

:eyes: See [MIGRATING.md](MIGRATING.md) for moving between major versions of this component.

**Props**

* `path` - Path to the SVG.
* `evalScripts` - _Optional_ Run any script blocks found in the SVG (`always`, `once`, or `never`). Defaults to `never`.
* `onInjected` - _Optional_ Function to call after the SVG is injected. Receives the injected SVG DOM element as a parameter. Defaults to `null`.
* `svgClassName` - _Optional_ Class name to be added to the injected SVG DOM element. Defaults to `null`.
* `svgStyle` - _Optional_ Inline styles to be added to the injected SVG DOM element. Defaults to `{}`.

Other non-documented properties are applied to the wrapper element.

**Example**

```js
<ReactSVG
  path="atomic.svg"
  evalScripts="always"
  onInjected={svg => {
    console.log('onInjected', svg)
  }}
  svgClassName="svg-class-name"
  svgStyle={{ width: 200 }}
  className="wrapper-class-name"
  onClick={() => {
    console.log('wrapper onClick')
  }}
/>
```

Refer to the SVGInjector [configuration docs](https://github.com/tanem/SVGInjector#configuration) for more information.

## Install

```
$ npm install react-svg --save
```

There are also UMD builds available via [unpkg](https://unpkg.com/):

* https://unpkg.com/react-svg/umd/ReactSVG.js
* https://unpkg.com/react-svg/umd/ReactSVG.min.js

For the non-minified development version, make sure you have already included:

* [`React`](https://unpkg.com/react/umd/react.development.js)
* [`ReactDOM`](https://unpkg.com/react-dom/umd/react-dom.development.js)
* [`ReactDOMServer`](https://unpkg.com/react-dom/umd/react-dom-server.browser.development.js)
* [`PropTypes`](https://unpkg.com/prop-types/prop-types.js)

For the minified production version, make sure you have already included:

* [`React`](https://unpkg.com/react/umd/react.production.min.js)
* [`ReactDOM`](https://unpkg.com/react-dom/umd/react-dom.production.min.js)
* [`ReactDOMServer`](https://unpkg.com/react-dom/umd/react-dom-server.browser.production.min.js)

## License

MIT
