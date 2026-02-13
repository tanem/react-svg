# Migrating

Details relating to major changes that aren't presently in `CHANGELOG.md`, due to limitations with how that file is being generated.

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
