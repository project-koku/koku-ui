import '@testing-library/jest-dom';
import React from 'react';

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
