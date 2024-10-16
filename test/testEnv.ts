export interface Global {
  insights: any;
}

declare let global: Global;

global.insights = {
  chrome: {
    auth: { getToken: () => '' },
    identifyApp: jest.fn(),
    init: jest.fn(),
    isBeta: jest.fn(),
    navigation: jest.fn(),
    on: jest.fn(),
  },
};
