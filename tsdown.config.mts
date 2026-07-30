import { defineConfig } from 'tsdown'

export default defineConfig({
  // The declaration chunk gets a sourceMappingURL comment from the top-level
  // `sourcemap` option regardless, so the map has to be emitted here too or
  // the reference dangles. `src` is published so the map resolves.
  dts: { sourcemap: true },
  entry: { 'react-svg': 'src/index.ts' },
  format: ['cjs', 'esm'],
  outputOptions: {
    // Bundlers strip file-level directives, so `"use client"` has to be
    // re-added to the output.
    banner: `'use client';`,
  },
  sourcemap: true,
  // webpack 4 cannot parse ES2020 syntax such as `?.` / `??` in node_modules,
  // and it's still in use on React 16-era toolchains.
  target: 'es2019',
})
