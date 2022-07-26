import { StyleSheetTestUtils } from 'aphrodite';

StyleSheetTestUtils.suppressStyleInjection();

export interface Global {
  insights: any;
}

declare var global: Global;

global.insights = {
  chrome: {
    identifyApp: jest.fn(),
    init: jest.fn(),
    isBeta: jest.fn(),
    navigation: jest.fn(),
    on: jest.fn(),
  },
};
