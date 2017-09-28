import { configure } from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';

configure({ adapter: new Adapter() });

if (!global.SVGSVGElement && global.HTMLUnknownElement) {
  global.SVGSVGElement = global.HTMLUnknownElement;
}
