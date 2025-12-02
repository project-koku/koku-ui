const baseConfig = require('../../jest.config.base');

/** @type {import('jest').Config} */
module.exports = {
  ...baseConfig,
  setupFiles: ['<rootDir>/test/testEnv.js'],
  setupFilesAfterEnv: ['<rootDir>/test/jest.setup.js'],
};
