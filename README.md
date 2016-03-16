# react-svg

[![npm version](https://img.shields.io/npm/v/react-svg.svg?style=flat-square)](https://www.npmjs.com/package/react-svg)
[![npm downloads](https://img.shields.io/npm/dm/react-svg.svg?style=flat-square)](https://www.npmjs.com/package/react-svg)

A React component that uses [SVGInjector](https://github.com/iconic/SVGInjector) to dynamically add SVG to the DOM. 

## table of contents

- [react-svg](#react-svg)
- [table of contents](#table-of-contents)
- [installation](#installation)
- [example](#example)
- [api](#api)
- [tests](#tests)
- [releasing](#releasing)
- [roadmap](#roadmap)
- [license](#license)

## installation

```
$ npm install react-svg --save
```

There are also UMD builds available in the `dist` directory. If you use these, make sure you have already included React as a dependency.

## example

```js
import React from 'react';
import ReactDOM from 'react-dom';

import ReactSVG from '../src/index.js';

ReactDOM.render(
  <ReactSVG
    path={'atomic.svg'}
    className={'example'}
    callback={(svg) => console.log(svg)}
  />,
  document.querySelector('.Root')
);
```

To run the above example:

```
$ npm start
```

Then open a browser at `localhost:8080`.

## api

__Props__

- `path` - Path to the SVG.
- `className` - *Optional* Class name to be added to the SVG.
- `evalScripts` - *Optional* Run any script blocks found in the SVG (`always`, `once`, or `never`). Defaults to `never`.
- `fallbackPath` - *Optional* Path to the fallback PNG.
- `callback` - *Optional* Function to call after the SVG is injected. Receives the newly injected SVG DOM element as a parameter. Defaults to `null`.

__Example__

```js
<ReactSVG
  path={'atomic.svg'}
  className={'example'}
  evalScript={'always'}
  fallbackPath={'atomic.png'}
  callback={(svg) => console.log(svg)}
/>
```

Refer to the SVGInjector [configuration docs](https://github.com/iconic/SVGInjector#configuration) for more information.

## tests

```
$ npm test
```

## releasing

The release script for this module uses [npm-version](https://docs.npmjs.com/cli/version) under the hood, so you should pass a semver string or release type as an argument.

For example, to publish a `patch` release:

```
$ npm run release -- patch
```

## roadmap

react-svg does not currently support being rendered in Node. This is because SVGInjector uses XMLHttpRequest, something that Node does not have locally. It would be nice to rewrite SVGInjector to use something environment agnostic, like superagent or anything along those lines. This would allow react-svg to be rendered on both client and server.

## license

MIT
