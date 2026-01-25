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
