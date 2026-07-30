/**
 * @jest-environment node
 */

describe('when loaded in a non-browser environment', () => {
  it('should not throw an error', () => {
    // Argument-less, so that a missing or unresolvable build fails here rather
    // than passing vacuously: `require('..')` goes through the `exports` map
    // into `dist`, and any error other than the SSR one would still satisfy
    // `not.toThrow('ReferenceError: window is not defined')`.
    expect(() => {
      require('..')
    }).not.toThrow()
  })
})
