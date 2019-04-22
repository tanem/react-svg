import { createPrettyHtmlMatchers } from 'jest-prettyhtml-matchers'

expect.extend(
  createPrettyHtmlMatchers({
    singleQuote: true,
    sortAttributes: true,
    wrapAttributes: true
  })
)
