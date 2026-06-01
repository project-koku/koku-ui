import '@testing-library/jest-dom/jest-globals';
import React from 'react';

// React Router v6 logs one-time future-flag warnings when MemoryRouter omits v7 opt-in flags.
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

// Components log pause/resume failures for ops; error-path tests trigger these intentionally.
const consoleError = console.error;
/** @type {jest.SpyInstance | undefined} */
let expectedOpsErrorSpy;

beforeAll(() => {
  expectedOpsErrorSpy = jest.spyOn(console, 'error').mockImplementation((msg, ...args) => {
    if (typeof msg === 'string' && msg.startsWith('Pause or resume integration failed')) {
      return;
    }
    // Async modal handlers (e.g. SourceRemoveModal) update state after the click act boundary ends.
    if (typeof msg === 'string' && msg.includes('not configured to support act')) {
      return;
    }
    consoleError.call(console, msg, ...args);
  });
});

afterAll(() => {
  expectedOpsErrorSpy?.mockRestore();
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
