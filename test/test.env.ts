import { StyleSheetTestUtils } from 'aphrodite';
import Enzyme from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';

StyleSheetTestUtils.suppressStyleInjection();
Enzyme.configure({ adapter: new Adapter() });
