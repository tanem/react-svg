/**
 * @jest-environment node
 */

import fs from 'fs'
import path from 'path'

const entryPoints = [
  'index.js',
  'react-svg.cjs.development.js',
  'react-svg.cjs.production.js',
  'react-svg.esm.js',
]

describe.each(entryPoints)('%s', (entryPoint) => {
  it('should start with the "use client" directive', () => {
    const contents = fs.readFileSync(
      path.join(process.cwd(), 'dist', entryPoint),
      'utf8',
    )
    expect(contents).toMatch(/^["']use client["']/)
  })
})
