// Polyfill CSS.escape for jsdom, which does not provide it natively.
// svg-injector uses CSS.escape in extractSymbol for sprite support.
import 'css.escape'

const originalError = console.error

beforeAll(() => {
  console.error = (...args) => {
    if (/not wrapped in act/.test(args[0])) {
      return
    }
    originalError.call(console, ...args)
  }
})

afterAll(() => {
  console.error = originalError
})
