const baseConfig = require('../../jest.config.base');

/** @type {import('jest').Config} */
module.exports = {
  ...baseConfig,
  testEnvironment: 'node',
  transform: {
    '^.+\\.(ts|js)x?$': [
      '@swc/jest',
      {
        jsc: {
          parser: { syntax: 'typescript', tsx: true },
        },
      },
    ],
  },
};
