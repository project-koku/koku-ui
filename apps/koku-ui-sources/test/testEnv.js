// Let React 18 know RTL will wrap updates in act() (avoids spurious act warnings on async setState).
globalThis.IS_REACT_ACT_ENVIRONMENT = true;

globalThis.insights = {
  chrome: {
    auth: { getToken: () => '' },
    identifyApp: jest.fn(),
    init: jest.fn(),
    isBeta: jest.fn(),
    navigation: jest.fn(),
    on: jest.fn(),
  },
};
