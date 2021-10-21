import Adapter from '@wojtekmaj/enzyme-adapter-react-17';
import { StyleSheetTestUtils } from 'aphrodite';
import Enzyme from 'enzyme';

StyleSheetTestUtils.suppressStyleInjection();
Enzyme.configure({ adapter: new Adapter() });

export interface Global {
  insights: any;
}

declare var global: Global;

global.insights = {
  chrome: {
    init: jest.fn(),
    identifyApp: jest.fn(),
    navigation: jest.fn(),
    on: jest.fn(),
  },
};
