module.exports = {
  testEnvironment: 'jsdom',
  clearMocks: true,
  fakeTimers: {
    enableGlobally: true,
  },
  transform: {
    '^.+\\.[jt]sx?$': '<rootDir>/test/transformTS.js',
    '^.+\\.(jpg)$': '<rootDir>/test/transformFile.js',
  },
  transformIgnorePatterns: ['node_modules/(?!@patternfly/react-icons/dist/esm)'],
  setupFiles: ['./test/testEnv.ts'],
  testRegex: '\\.test\\.(jsx?|tsx?)$',
  moduleFileExtensions: ['ts', 'tsx', 'js'],
  moduleDirectories: ['node_modules', '<rootDir>/src'],
  moduleNameMapper: {
    '\\.(css|less|sass|scss)$': '<rootDir>/test/styleMock.js',
  },
  roots: ['<rootDir>/src'],
  testEnvironmentOptions: {
    url: 'http://localhost/',
  },
  testTimeout: 30000,
};
