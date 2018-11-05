import shallowDiffers from '../src/shallow-differs'

it('shallow diffs objects correctly', () => {
  expect(shallowDiffers({ foo: true }, { bar: true })).toBe(true)
  expect(shallowDiffers({ foo: true }, { foo: false })).toBe(true)
  expect(shallowDiffers({ foo: true }, { foo: true })).toBe(false)
})
