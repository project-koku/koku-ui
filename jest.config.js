module.exports = {
  testEnvironment: 'jsdom',
  clearMocks: true,
  timers: 'fake',
  transform: {
    '^.+\\.(css)$':
      '<rootDir>/node_modules/@patternfly/react-styles/jest-transform.js',
    '^.+\\.(ts|tsx)$': '<rootDir>/test/transformTS.js',
    '^.+\\.(jpg)$': '<rootDir>/test/transformFile.js',
  },
  setupFiles: ['./test/test.env.ts'],
  testRegex: '\\.test\\.(jsx?|tsx?)$',
  moduleFileExtensions: ['ts', 'tsx', 'js'],
  moduleDirectories: ['node_modules', '<rootDir>/src'],
  moduleNameMapper: {
    '\\.(css|less)$': '<rootDir>/test/styleMock.js',
  },
  snapshotSerializers: ['enzyme-to-json/serializer'],
  testPathIgnorePatterns: ['/archive/'],
};
