# react-svg

[![npm version](https://img.shields.io/npm/v/react-svg.svg?style=flat-square)](https://www.npmjs.com/package/react-svg)
[![build status](https://img.shields.io/travis/tanem/react-svg/master.svg?style=flat-square)](https://travis-ci.org/tanem/react-svg)
[![coverage status](https://img.shields.io/codecov/c/github/tanem/react-svg.svg?style=flat-square)](https://codecov.io/gh/tanem/react-svg)
[![npm downloads](https://img.shields.io/npm/dm/react-svg.svg?style=flat-square)](https://www.npmjs.com/package/react-svg)
[![size](http://img.badgesize.io/https://unpkg.com/react-svg/dist/react-svg.umd.production.js?label=size&style=flat-square)](https://unpkg.com/react-svg/dist/)
[![gzip-size](http://img.badgesize.io/https://unpkg.com/react-svg/dist/react-svg.umd.production.js?compression=gzip&label=gzip%20size&style=flat-square)](https://unpkg.com/react-svg/dist/)

> A React component that injects SVG into the DOM.

[Background](#background) | [Basic Usage](#basic-usage) | [Live Examples](#live-examples) | [API](#api) | [Installation](#installation) | [FAQ](#faq) | [License](#license)

## Background

Let's say you have an SVG available at some URL, and you'd like to inject it into the DOM [for various reasons](https://github.com/tanem/svg-injector#background). This module does the heavy lifting for you by delegating the process to [@tanem/svg-injector](https://github.com/tanem/svg-injector), which makes an AJAX request for the SVG and then swaps in the SVG markup inline. The async loaded SVG is also cached, so multiple uses of an SVG only require a single server request.

## Basic Usage

```jsx
import React from 'react'
import { render } from 'react-dom'
import { ReactSVG } from 'react-svg'

render(<ReactSVG src="svg.svg" />, document.getElementById('root'))
```

## Live Examples

- Accessibility: [Source](https://github.com/tanem/react-svg/tree/master/examples/accessibility) | [Sandbox](https://codesandbox.io/s/github/tanem/react-svg/tree/master/examples/accessibility)
- API Usage: [Source](https://github.com/tanem/react-svg/tree/master/examples/api-usage) | [Sandbox](https://codesandbox.io/s/github/tanem/react-svg/tree/master/examples/api-usage)
- Basic Usage: [Source](https://github.com/tanem/react-svg/tree/master/examples/basic-usage) | [Sandbox](https://codesandbox.io/s/github/tanem/react-svg/tree/master/examples/basic-usage)
- Before Injection: [Source](https://github.com/tanem/react-svg/tree/master/examples/before-injection) | [Sandbox](https://codesandbox.io/s/github/tanem/react-svg/tree/master/examples/before-injection)
- CSS-in-JS: [Source](https://github.com/tanem/react-svg/tree/master/examples/css-in-js) | [Sandbox](https://codesandbox.io/s/github/tanem/react-svg/tree/master/examples/css-in-js)
- External Stylesheet: [Source](https://github.com/tanem/react-svg/tree/master/examples/external-stylesheet) | [Sandbox](https://codesandbox.io/s/github/tanem/react-svg/tree/master/examples/external-stylesheet)
- Fallbacks: [Source](https://github.com/tanem/react-svg/tree/master/examples/fallbacks) | [Sandbox](https://codesandbox.io/s/github/tanem/react-svg/tree/master/examples/fallbacks)
- Loading: [Source](https://github.com/tanem/react-svg/tree/master/examples/loading) | [Sandbox](https://codesandbox.io/s/github/tanem/react-svg/tree/master/examples/loading)
- Typescript: [Source](https://github.com/tanem/react-svg/tree/master/examples/typescript) | [Sandbox](https://codesandbox.io/s/github/tanem/react-svg/tree/master/examples/typescript)
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

## FAQ

<details>

<summary>
Why are there two wrapping elements?
</summary>

This module delegates it's core behaviour to [@tanem/svg-injector](https://github.com/tanem/svg-injector), which requires the presence of a parent node when swapping in the SVG element. The swapping in occurs outside of React flow, so we don't want React updates to conflict with the DOM nodes `@tanem/svg-injector` is managing.

Example output, assuming a `div` wrapper:

```html
<div> <!-- The wrapper, managed by React -->
  <div> <!-- The parent node, managed by @tanem/svg-injector -->
    <svg>...</svg> <!-- The swapped-in SVG, managed by @tanem/svg-injector -->
  </div>
</div>
```

See:

- [Integrating with Other Libraries](https://reactjs.org/docs/integrating-with-other-libraries.html).

Related issues and PRs:

- [#24](https://github.com/tanem/react-svg/issues/24).
- [#30](https://github.com/tanem/react-svg/issues/30).
- [#36](https://github.com/tanem/react-svg/pull/36).
- [#48](https://github.com/tanem/react-svg/issues/48).

</details>

<details>

<summary>
How can I improve the accessibility of the rendered output?
</summary>

Let's assume we want to add `role` and `aria-label` attributes to the outermost wrapper element, plus `title` and `desc` elements to the SVG.

Since non-documented properties are applied to the outermost wrapper element, and the `beforeInjection` function allows us to modify the SVG DOM, we can do something like the following:

```jsx
<ReactSVG
  src="svg.svg"
  role="img"
  aria-label="Description of the overall image"
  beforeInjection={svg => {
    const desc = document.createElement('desc')
    desc.innerHTML = 'A description'
    svg.prepend(desc)

    const title = document.createElement('title')
    title.innerHTML = 'A title'
    svg.prepend(title)
  }}
/>
```

A live example is available [here](https://codesandbox.io/s/github/tanem/react-svg/tree/master/examples/accessibility).

Related issue:

- [#639](https://github.com/tanem/react-svg/issues/639).

</details>

## License

MIT
