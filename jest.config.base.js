const transformIgnorePatterns = [
  'node_modules/(?!(@patternfly/react-core/src|@patternfly/react-icons/dist/esm|@patternfly/react-component-groups/dist/esm|uuid/dist/esm-browser))',
];

/** @type {import('ts-jest').JestConfigWithTsJest} */
module.exports = {
  clearMocks: true,
  collectCoverage: false,
  // collectCoverageFrom: ['src/**/*.js'],
  // coverageDirectory: './coverage/',
  fakeTimers: {
    enableGlobally: true,
  },
  moduleDirectories: ['node_modules', '<rootDir>/src'],
  moduleNameMapper: {
    '\\.(css|scss)$': 'identity-obj-proxy',
  },
  preset: 'ts-jest',
  roots: ['<rootDir>/src/'],
  testEnvironment: 'jsdom',
  // testEnvironment: 'jest-environment-jsdom',
  transformIgnorePatterns,
  transform: {
    '^.+\\.svg$': 'jest-transform-stub',
    '^.+\\.(ts|js)x?$': [
      '@swc/jest',
      {
        $schema: 'http://json.schemastore.org/swcrc',
        jsc: {
          experimental: {
            plugins: [['swc_mut_cjs_exports', {}]],
          },
          parser: {
            jsx: true,
            syntax: 'typescript',
            tsx: true,
          },
          transform: {
            react: {
              runtime: 'automatic',
            },
          },
        },
      },
    ],
  },
};
