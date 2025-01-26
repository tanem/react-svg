import { createPrettyHtmlMatchers } from 'jest-prettyhtml-matchers'

expect.extend(
  createPrettyHtmlMatchers({
    singleQuote: true,
    sortAttributes: true,
    wrapAttributes: true,
  }),
)

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
