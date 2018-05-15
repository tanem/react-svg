const Adapter = require('enzyme-adapter-react-16')
const { configure } = require('enzyme')

configure({ adapter: new Adapter() })

if (global.HTMLUnknownElement) {
  if (!global.SVGDefsElement) {
    global.SVGDefsElement = global.HTMLUnknownElement
  }

  if (!global.SVGTitleElement) {
    global.SVGTitleElement = global.HTMLUnknownElement
  }

  if (!global.SVGDescElement) {
    global.SVGDescElement = global.HTMLUnknownElement
  }
}
