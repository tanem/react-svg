# react-svg

[![npm version](https://img.shields.io/npm/v/react-svg.svg?style=flat-square)](https://www.npmjs.com/package/react-svg)
[![build status](https://img.shields.io/travis/tanem/react-svg/master.svg?style=flat-square)](https://travis-ci.org/tanem/react-svg)
[![coverage status](https://img.shields.io/codecov/c/github/tanem/react-svg.svg?style=flat-square)](https://codecov.io/gh/tanem/react-svg)
[![npm downloads](https://img.shields.io/npm/dm/react-svg.svg?style=flat-square)](https://www.npmjs.com/package/react-svg)
[![gzip size](http://img.badgesize.io/https://unpkg.com/react-svg/umd/react-svg.production.min.js?style=flat-square&compression=gzip)](https://unpkg.com/react-svg/umd/react-svg.production.min.js)

> A React component that injects SVG into the DOM.

## Background

Let's say you have an SVG available at some URL, and you'd like to inject it into the DOM [for various reasons](https://github.com/tanem/svg-injector#why). This module does the heavy lifting for you by delegating the process to [SVGInjector](https://github.com/tanem/svg-injector), which makes an AJAX request for the SVG and then swaps in the SVG markup inline. The async loaded SVG is also cached, so multiple uses of an SVG only require a single server request.

## Basic Usage

```jsx
import React from 'react'
import { render } from 'react-dom'
import ReactSVG from 'react-svg'

render(<ReactSVG src="svg.svg" />, document.getElementById('root'))
```

## Live Examples

- Basic Usage: [Source](https://github.com/tanem/react-svg/tree/master/examples/basic-usage) | [Sandbox](https://codesandbox.io/s/github/tanem/react-svg/tree/master/examples/basic-usage)
- API Usage: [Source](https://github.com/tanem/react-svg/tree/master/examples/api-usage) | [Sandbox](https://codesandbox.io/s/github/tanem/react-svg/tree/master/examples/api-usage)
- External Stylesheet: [Source](https://github.com/tanem/react-svg/tree/master/examples/external-stylesheet) | [Sandbox](https://codesandbox.io/s/github/tanem/react-svg/tree/master/examples/external-stylesheet)
- Typescript: [Source](https://github.com/tanem/react-svg/tree/master/examples/typescript) | [Sandbox](https://codesandbox.io/s/github/tanem/react-svg/tree/master/examples/typescript)
- CSS-in-JS: [Source](https://github.com/tanem/react-svg/tree/master/examples/css-in-js) | [Sandbox](https://codesandbox.io/s/github/tanem/react-svg/tree/master/examples/css-in-js)
- UMD Build (Development): [Source](https://github.com/tanem/react-svg/tree/master/examples/umd-dev) | [Sandbox](https://codesandbox.io/s/github/tanem/react-svg/tree/master/examples/umd-dev)
- UMD Build (Production): [Source](https://github.com/tanem/react-svg/tree/master/examples/umd-prod) | [Sandbox](https://codesandbox.io/s/github/tanem/react-svg/tree/master/examples/umd-prod)

## API

**Props**

- `src` - The SVG URL.
- `evalScripts` - _Optional_ Run any script blocks found in the SVG. One of `'always'`, `'once'`, or `'never'`. Defaults to `'never'`.
- `onInjected` - _Optional_ Function to call after the SVG is injected. Receives the injected SVG DOM element as a parameter. Defaults to `() => {}`.
- `renumerateIRIElements` - _Optional_ Boolean indicating whether the SVG IRI addressable elements should be renumerated. Defaults to `true`.
- `svgClassName` - _Optional_ Class name to be added to the injected SVG DOM element. Defaults to `null`.
- `svgStyle` - _Optional_ Inline styles to be added to the injected SVG DOM element. Defaults to `{}`.

Other non-documented properties are applied to the wrapper element.

**Example**

```jsx
<ReactSVG
  src="svg.svg"
  evalScripts="always"
  onInjected={svg => {
    console.log('onInjected', svg)
  }}
  renumerateIRIElements={false}
  svgClassName="svg-class-name"
  svgStyle={{ width: 200 }}
  className="wrapper-class-name"
  onClick={() => {
    console.log('wrapper onClick')
  }}
/>
```

## Installation

```
$ npm install react-svg
```

There are also UMD builds available via [unpkg](https://unpkg.com/):

- https://unpkg.com/react-svg/umd/react-svg.development.js
- https://unpkg.com/react-svg/umd/react-svg.production.min.js

For the non-minified development version, make sure you have already included:

- [`React`](https://unpkg.com/react/umd/react.development.js)
- [`ReactDOM`](https://unpkg.com/react-dom/umd/react-dom.development.js)
- [`ReactDOMServer`](https://unpkg.com/react-dom/umd/react-dom-server.browser.development.js)
- [`PropTypes`](https://unpkg.com/prop-types/prop-types.js)

For the minified production version, make sure you have already included:

- [`React`](https://unpkg.com/react/umd/react.production.min.js)
- [`ReactDOM`](https://unpkg.com/react-dom/umd/react-dom.production.min.js)
- [`ReactDOMServer`](https://unpkg.com/react-dom/umd/react-dom-server.browser.production.min.js)

## Credits

Thanks to the author(s) of [the original SVGInjector](https://github.com/iconic/SVGInjector), without which none of this would have been possible :clap:

## License

MIT
