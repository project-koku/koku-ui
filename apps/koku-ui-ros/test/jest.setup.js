import '@testing-library/jest-dom/jest-globals';

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
