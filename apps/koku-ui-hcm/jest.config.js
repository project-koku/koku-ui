const baseConfig = require('../../jest.config.base');

/** @type {import('jest').Config} */
module.exports = {
  ...baseConfig,
  roots: ['<rootDir>/src'],
  setupFiles: ['<rootDir>/test/testEnv.ts'],
  setupFilesAfterEnv: ['<rootDir>/test/jest.setup.js'],
};
