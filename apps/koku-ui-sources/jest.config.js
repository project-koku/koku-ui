const baseConfig = require('../../jest.config.base');

/** @type {import('jest').Config} */
module.exports = {
  ...baseConfig,
  roots: ['<rootDir>/src'],
  setupFiles: ['<rootDir>/test/testEnv.js'],
  setupFilesAfterEnv: ['<rootDir>/test/jest.setup.js'],
  moduleNameMapper: {
    ...baseConfig.moduleNameMapper,
    '^redux/(.*)$': '<rootDir>/src/redux/$1',
    '^@koku-ui/ui-lib/(.*)$': '<rootDir>/../../libs/ui-lib/src/$1',
  },
  transform: {
    '^.+\\.svg$': 'jest-transform-stub',
    '^.+\\.(ts|js)x?$': [
      '@swc/jest',
      {
        $schema: 'http://json.schemastore.org/swcrc',
        jsc: {
          parser: { jsx: true, syntax: 'typescript', tsx: true },
          transform: { react: { runtime: 'automatic' } },
        },
      },
    ],
  },
};
