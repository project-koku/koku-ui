import '@testing-library/jest-dom';
import React from 'react';

// React Router v6 logs one-time future-flag warnings when MemoryRouter/BrowserRouter
// omit v7 opt-in flags. Filter them so test output stays readable.
const consoleWarn = console.warn;
/** @type {jest.SpyInstance | undefined} */
let routerFutureFlagWarnSpy;

beforeAll(() => {
  routerFutureFlagWarnSpy = jest.spyOn(console, 'warn').mockImplementation((msg, ...args) => {
    if (typeof msg === 'string' && msg.includes('React Router Future Flag')) {
      return;
    }
    consoleWarn.call(console, msg, ...args);
  });
});

afterAll(() => {
  routerFutureFlagWarnSpy?.mockRestore();
});

// Avoid Unleash's no-FlagProvider stubs (they console.error on every isEnabled call).
jest.mock('@unleash/proxy-client-react', () => {
  const actual = jest.requireActual('@unleash/proxy-client-react');
  const testClient = {
    isEnabled: jest.fn(() => false),
    getVariant: jest.fn(() => ({ name: 'disabled', enabled: false })),
    getAllToggles: jest.fn(() => []),
    on: jest.fn(),
    off: jest.fn(),
  };
  return {
    __esModule: true,
    ...actual,
    useUnleashClient: jest.fn(() => testClient),
  };
});

// Silence PF Truncate innerRef warning globally in tests
jest.mock('@patternfly/react-core', () => {
  const actual = jest.requireActual('@patternfly/react-core');
  return {
    __esModule: true,
    ...actual,
    Truncate: ({ content }) => <span>{content}</span>,
  };
});
