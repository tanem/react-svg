# react-svg

[![npm version](https://img.shields.io/npm/v/react-svg.svg?style=flat-square)](https://www.npmjs.com/package/react-svg)
[![build status](https://img.shields.io/travis/tanem/react-svg/master.svg?style=flat-square)](https://travis-ci.org/tanem/react-svg)
[![coverage status](https://img.shields.io/codecov/c/github/tanem/react-svg.svg?style=flat-square)](https://codecov.io/gh/tanem/react-svg)
[![npm downloads](https://img.shields.io/npm/dm/react-svg.svg?style=flat-square)](https://www.npmjs.com/package/react-svg)
[![size](http://img.badgesize.io/https://unpkg.com/react-svg/dist/react-svg.umd.production.js?label=size&style=flat-square)](https://unpkg.com/react-svg/dist/)
[![gzip-size](http://img.badgesize.io/https://unpkg.com/react-svg/dist/react-svg.umd.production.js?compression=gzip&label=gzip%20size&style=flat-square)](https://unpkg.com/react-svg/dist/)

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

- API Usage: [Source](https://github.com/tanem/react-svg/tree/master/examples/api-usage) | [Sandbox](https://codesandbox.io/s/github/tanem/react-svg/tree/master/examples/api-usage)
- Basic Usage: [Source](https://github.com/tanem/react-svg/tree/master/examples/basic-usage) | [Sandbox](https://codesandbox.io/s/github/tanem/react-svg/tree/master/examples/basic-usage)
- Before Injection: [Source](https://github.com/tanem/react-svg/tree/master/examples/before-injection) | [Sandbox](https://codesandbox.io/s/github/tanem/react-svg/tree/master/examples/before-injection)
- CSS-in-JS: [Source](https://github.com/tanem/react-svg/tree/master/examples/css-in-js) | [Sandbox](https://codesandbox.io/s/github/tanem/react-svg/tree/master/examples/css-in-js)
- External Stylesheet: [Source](https://github.com/tanem/react-svg/tree/master/examples/external-stylesheet) | [Sandbox](https://codesandbox.io/s/github/tanem/react-svg/tree/master/examples/external-stylesheet)
- Fallbacks: [Source](https://github.com/tanem/react-svg/tree/master/examples/fallbacks) | [Sandbox](https://codesandbox.io/s/github/tanem/react-svg/tree/master/examples/fallbacks)
- Loading: [Source](https://github.com/tanem/react-svg/tree/master/examples/loading) | [Sandbox](https://codesandbox.io/s/github/tanem/react-svg/tree/master/examples/loading)
- Typescript 2.x: [Source](https://github.com/tanem/react-svg/tree/master/examples/typescript-2.x) | [Sandbox](https://codesandbox.io/s/github/tanem/react-svg/tree/master/examples/typescript-2.x)
- Typescript Latest: [Source](https://github.com/tanem/react-svg/tree/master/examples/typescript-latest) | [Sandbox](https://codesandbox.io/s/github/tanem/react-svg/tree/master/examples/typescript-latest)
- UMD Build (Development): [Source](https://github.com/tanem/react-svg/tree/master/examples/umd-dev) | [Sandbox](https://codesandbox.io/s/github/tanem/react-svg/tree/master/examples/umd-dev)
- UMD Build (Production): [Source](https://github.com/tanem/react-svg/tree/master/examples/umd-prod) | [Sandbox](https://codesandbox.io/s/github/tanem/react-svg/tree/master/examples/umd-prod)

## API

**Props**

- `src` - The SVG URL.
- `afterInjection(err, svg)` - _Optional_ Function to call after the SVG is injected. If an injection error occurs, `err` is an `Error` object. Otherwise, `err` is `null` and `svg` is the injected SVG DOM element. Defaults to `() => {}`.
- `beforeInjection(svg)` - _Optional_ Function to call just before the SVG is injected. `svg` is the SVG DOM element which is about to be injected. Defaults to `() => {}`.
- `evalScripts` - _Optional_ Run any script blocks found in the SVG. One of `'always'`, `'once'`, or `'never'`. Defaults to `'never'`.
- `fallback` - _Optional_ Fallback to use if an injection error occurs. Can be a string, class component, or function component. Defaults to `null`.
- `loading` - _Optional_ Component to use during loading. Can be a string, class component, or function component. Defaults to `null`.
- `renumerateIRIElements` - _Optional_ Boolean indicating if SVG IRI addressable elements should be renumerated. Defaults to `true`.
- `wrapper` - _Optional_ Wrapper element types. One of `'div'` or `'span'`. Defaults to `'div'`.

Other non-documented properties are applied to the outermost wrapper element.

**Example**

```jsx
<ReactSVG
  src="svg.svg"
  afterInjection={(error, svg) => {
    if (error) {
      console.error(error)
      return
    }
    console.log(svg)
  }}
  beforeInjection={svg => {
    svg.classList.add('svg-class-name')
    svg.setAttribute('style', 'width: 200px')
  }}
  evalScripts="always"
  fallback={() => <span>Error!</span>}
  loading={() => <span>Loading</span>}
  renumerateIRIElements={false}
  wrapper="span"
  className="wrapper-class-name"
  onClick={() => {
    console.log('wrapper onClick')
  }}
/>
```

## Installation

> ⚠️This library depends on [@tanem/svg-injector](https://github.com/tanem/svg-injector), which uses [`Array.from()`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/from). If you're targeting [browsers that don't support that method](https://kangax.github.io/compat-table/es6/#test-Array_static_methods), you'll need to ensure an appropriate polyfill is included manually. See [this issue comment](https://github.com/tanem/svg-injector/issues/97#issuecomment-483365473) for further detail.

```
$ npm install react-svg
```

There are also UMD builds available via [unpkg](https://unpkg.com/):

- https://unpkg.com/react-svg/dist/react-svg.umd.development.js
- https://unpkg.com/react-svg/dist/react-svg.umd.production.js

For the non-minified development version, make sure you have already included:

- [`React`](https://unpkg.com/react/umd/react.development.js)
- [`ReactDOM`](https://unpkg.com/react-dom/umd/react-dom.development.js)
- [`ReactDOMServer`](https://unpkg.com/react-dom/umd/react-dom-server.browser.development.js)
- [`PropTypes`](https://unpkg.com/prop-types/prop-types.js)

For the minified production version, make sure you have already included:

- [`React`](https://unpkg.com/react/umd/react.production.min.js)
- [`ReactDOM`](https://unpkg.com/react-dom/umd/react-dom.production.min.js)
- [`ReactDOMServer`](https://unpkg.com/react-dom/umd/react-dom-server.browser.production.min.js)

## License

MIT
