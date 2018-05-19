import Adapter from 'enzyme-adapter-react-16'
import { configure } from 'enzyme'

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
