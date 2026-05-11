const transformIgnorePatterns = [
  'node_modules/(?!(@patternfly/react-core/src|@patternfly/react-icons/dist/esm|@patternfly/react-component-groups/dist/esm|uuid/dist/esm-browser|react-intl|intl-messageformat|@formatjs/.*))',
];

/** @type {import('ts-jest').JestConfigWithTsJest} */
module.exports = {
  clearMocks: true,
  collectCoverage: false,
  // Stability: many parallel Jest workers + jsdom can exhaust RAM; the OS then kills a worker and Jest
  // reports "A jest worker process was terminated by another process". Cap parallelism by default and
  // recycle workers that retain too much heap between files.
  // Faster machines / CI with plenty of memory: `JEST_MAX_WORKERS=100% npm test`
  maxWorkers: process.env.JEST_MAX_WORKERS || '50%',
  workerIdleMemoryLimit: process.env.JEST_WORKER_IDLE_MEMORY_LIMIT || '512MB',
  // collectCoverageFrom: ['src/**/*.js'],
  // coverageDirectory: './coverage/',
  fakeTimers: {
    enableGlobally: true,
  },
  moduleDirectories: ['node_modules', '<rootDir>/src'],
  moduleNameMapper: {
    '\\.(css|scss)$': 'identity-obj-proxy',
    '^@koku-ui/ui-lib/(.*)$': '<rootDir>/../../libs/ui-lib/src/$1',
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
