# React SVG

react-svg is a react component that uses [svg-injector](https://github.com/iconic/SVGInjector) to dynamically add svg to your DOM. This allows you to pass in an svg path ('/path/icon.svg'), and react-svg will fetch the svg object and mutate it into the dom.

Also supports non-svg capable browsers by falling back to images if a fallback path is given.

# Install

`npm install react-svg`

# Usage



```javascript
var SVG = React.createFactory(require('react-svg'));

...

render: function() {
  return SVG({
    path: 'path/to/your/vector.svg',
    // [Required] Local or remote (supports CORS)
    className: 'vectors',
    // [Optional] Binds a class to the svg
    evalScripts: false,
    // [Optional] Evals any javascript in the svg - [always|once|never]
    fallbackPath: 'path/to/your/vector.png',
    // [Optional]
    callback: function(svg) { console.log(svg); }
    // [Optional]
  });
};

```

# Roadmap
Currently, svg-injector does not exist on npm, so we've manually included it in this package. It would be nice to have svg-injector as a npm dependency, hopefully it can be published at some stage.

react-svg does not currently support being rendered in node, this is because svg-injector uses XMLHttpRequest, something that node does not have locally. It would be nice to rewrite svg-injector to use something environment agnostic, like superagent or anything along those lines. This would allow react-svg to be rendered on both client and server.

# License
The MIT License (MIT)

Copyright (c) 2014 Atomic

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
