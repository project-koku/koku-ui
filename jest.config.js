module.exports = {
  testEnvironment: 'jsdom',
  clearMocks: true,
  timers: 'fake',
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
  snapshotSerializers: ['enzyme-to-json/serializer'],
  testURL: 'http://localhost/',
  testTimeout: 30000,
};
