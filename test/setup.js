import Adapter from 'enzyme-adapter-react-16'
import { configure } from 'enzyme'

configure({ adapter: new Adapter() })

if (!global.SVGSVGElement && global.HTMLUnknownElement) {
  global.SVGSVGElement = global.HTMLUnknownElement
}
