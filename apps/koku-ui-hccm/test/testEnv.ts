// Keep this file free of TypeScript 'declare' or interface exports to avoid SWC plugin issues.
// Attach insights to the global object for tests.
const g = globalThis as any;
g.insights = {
  chrome: {
    auth: { getToken: () => '' },
    identifyApp: jest.fn(),
    init: jest.fn(),
    isBeta: jest.fn(),
    navigation: jest.fn(),
    on: jest.fn(),
  },
};
