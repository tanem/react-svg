import prettyhtml from '@starptech/prettyhtml'

export const format = (svg: string) =>
  prettyhtml(svg, {
    singleQuote: true,
    sortAttributes: true,
    wrapAttributes: true
  }).contents
