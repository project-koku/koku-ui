module.exports = {
  testEnvironment: 'jsdom',
  clearMocks: true,
  timers: 'fake',
  transform: {
    '^.+\\.(ts|tsx)$': '<rootDir>/test/transformTS.js',
    '^.+\\.(jpg)$': '<rootDir>/test/transformFile.js',
  },
  setupFiles: ['./test/test.env.ts'],
  testRegex: '\\.test\\.(jsx?|tsx?)$',
  moduleFileExtensions: ['ts', 'tsx', 'js'],
  moduleDirectories: ['node_modules', '<rootDir>/src'],
  moduleNameMapper: {
    '\\.(css|less|sass|scss)$': '<rootDir>/test/styleMock.js',
  },
  snapshotSerializers: ['enzyme-to-json/serializer'],
  testPathIgnorePatterns: ['<rootDir>/archive/'],
  testURL: 'http://localhost/',
};
