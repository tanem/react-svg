// Polyfill CSS.escape for jsdom, which does not provide it natively.
// svg-injector uses CSS.escape in extractSymbol for sprite support.
import 'css.escape'

// Polyfill TextDecoder for the same reason: jsdom does not expose it on
// window. svg-injector uses it in parseDataUrl to decode base64 data URLs as
// UTF-8, so without it a base64 data URL fails to parse.
import { TextDecoder } from 'node:util'

globalThis.TextDecoder ??= TextDecoder as typeof globalThis.TextDecoder

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
