# Migrating

Details relating to major changes that aren't presently in `CHANGELOG.md`, due to limitations with how that file is being generated.

## v18.0.0

**Added**

- An `exports` map. `react-svg` and `react-svg/package.json` are the only entry points; paths into `dist` are no longer reachable, even though the top-level `main`, `module` and `types` fields are still set for webpack 4 and TypeScript `node10` resolution. Node ESM consumers now get the ES module build rather than falling back to CommonJS.
- `sideEffects: false`, so bundlers can drop the package entirely when nothing is imported from it.

**Changed**

- The minimum supported React version is now 16.8, up from 16.0. The peer dependency range is `^16.8.0 || ^17.0.0 || ^18.0.0 || ^19.0.0`. React's support unit is the major, and fixes for the 16.x line only ever land on 16.14.x, so individual pre-16.8 minors were never separately supported.
- `ReactSVG` is a function component built on hooks, rather than a class component. `defaultProps` is gone (React 19 ignores it on function components); prop defaults are unchanged and are now applied by destructuring.
- `ReactSVG` is a value only, so it can no longer be used in a type position. A class declaration doubles as a type describing its instances, which made `Omit<ReactSVG, 'src'>` and similar valid; the same code now fails with `TS2749: 'ReactSVG' refers to a value, but is being used as a type here`. Use the exported `Props` type instead: `Omit<Props, 'src'>`.
- `ref` now resolves to the outermost wrapper DOM element - an `HTMLDivElement`, `HTMLSpanElement` or `SVGSVGElement`, depending on `wrapper` - instead of the `ReactSVG` class instance. The class instance had no documented methods, so the DOM node is the useful thing to hand back. Type the ref as the exported `WrapperType` if you need it.
- Re-injection now only happens when a prop that affects the injected SVG changes: `src`, `wrapper`, `title`, `desc`, `evalScripts`, `httpRequestWithCredentials`, `renumerateIRIElements` or `useRequestCache`. Previously any prop change re-fetched and re-injected, including ones that only apply to the React wrapper (`className`, `style`, event handlers) and inline `beforeInjection` / `afterInjection` / `onError` functions, whose identity changes on every render. Those callbacks are still always invoked in their latest form; they just no longer trigger an injection by themselves. If you were relying on a wrapper prop change to force a re-injection, change `src` instead.
- Build output filenames. The CommonJS build is `dist/react-svg.cjs` (was `dist/react-svg.cjs.js`) and the ES module build is `dist/react-svg.mjs` (was `dist/react-svg.esm.js`). Type declarations are `dist/react-svg.d.cts` and `dist/react-svg.d.mts` (was `dist/index.d.ts` plus one file per source module). Importing `react-svg` is unaffected.
- The build pipeline moved from TypeScript plus Rollup and Babel to [tsdown](https://tsdown.dev). Output still targets ES2019. `@babel/runtime` is no longer a runtime dependency, leaving `@tanem/svg-injector` as the only one.
- `src` is now published alongside `dist` so the declaration maps resolve.

**Removed**

- The `State` type export. It described the internal state shape of the class component, which no longer exists.
- `propTypes` validation. TypeScript types are the supported contract for props. React 19 ignores `propTypes` entirely, so this only changes behaviour for React 18 and earlier in development mode, where invalid props previously logged a console warning. `prop-types` and `@types/prop-types` are no longer dependencies.
- The separate development and production CommonJS builds. `dist/react-svg.cjs.development.js`, `dist/react-svg.cjs.production.js` and the `dist/index.js` shim that switched between them on `process.env.NODE_ENV` are replaced by a single unminified CommonJS build. With `propTypes` gone the two builds differed only by minification, which bundlers apply themselves.
- UMD builds. `dist/react-svg.umd.development.js` and `dist/react-svg.umd.production.js` are no longer published, and the `ReactSVG` browser global is gone. React itself stopped shipping UMD builds in v19, so script-tag usage already required pinning React 18 or earlier. If you load `react-svg` via a script tag, pin `react-svg@^17`, or switch to the ES module build with an import map or a bundler.

## v17.0.0

**Changed**

- [`@tanem/svg-injector`](https://github.com/tanem/svg-injector) updated to v11 (see [migration notes](https://github.com/tanem/svg-injector/blob/master/MIGRATION.md#v1100)). This drops explicit IE / legacy browser support. The library may still work in older browsers, but compatibility is no longer tested or guaranteed. If you need IE support, pin `@tanem/svg-injector@^10` and `react-svg@^16`.

## v16.0.0

**Added**

- `onError` prop.

**Changed**

- `afterInjection` is no longer an error-first callback.

## v15.0.0

**Removed**

- Dropped support for React 15. 

## v14.0.0

**Changed**

- Restored extra wrapper element in rendered output.

## v13.0.0

**Changed**

- Fetch errors are no longer cached (see [tanem/svg-injector#692](https://github.com/tanem/svg-injector/issues/692)).

## v12.0.0

**Changed**

- Removed extra wrapper element in rendered output.

## v11.0.0

**Added**

- Named type definition exports.

**Changed**

- `ReactSVG` is now a named export.

## v10.0.0

**Added**

- `beforeInjection` prop.

**Changed**

- `onInjected` prop renamed to `afterInjection`.

**Removed**

- `svgClassName` prop has been removed. Instead, use `beforeInjection` to add the class name to the SVG DOM element.
- `svgStyle` prop has been removed. Instead, use `beforeInjection` to add the style attribute to the SVG DOM element.

## v8.0.0

**Changed**

- [`@tanem/svg-injector`](https://github.com/tanem/svg-injector) updated to its latest version. The dependency was significantly refactored. There were no breaking API changes to `react-svg`, but the major version was bumped to reduce the risk of unexpected breakage in consuming code.

## v7.0.0

**Added**

- `fallback` prop.

**Changed**

- `onInjected` is now an error-first callback.

## v6.0.0

**Changed**

- `path` prop renamed to `src`.

## v3.0.0

**Added**

- All additional non-documented props will now be spread onto the wrapper element.

**Changed**

- `callback` prop renamed to `onInjected`.
- `className` prop renamed to `svgClassName`.
- `style` prop renamed to `svgStyle`.

**Removed**

- `wrapperClassName` has been removed. Instead, pass `className` since it will be spread onto the wrapper element.
