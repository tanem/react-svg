# Migrating

## v3 API Changes

**Naming**

- `callback` -> `onInjected`
- `className` -> `svgClassName`
- `style` -> `svgStyle`

**Additions**

All additional non-documented props will now be spread onto the wrapper element.

**Removals**

`wrapperClassName` has been removed. Instead, just pass `className` since it will be spread onto the wrapper element.
