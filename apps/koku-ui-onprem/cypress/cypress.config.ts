import { defineConfig } from 'cypress';

export default defineConfig({
  e2e: {
    specPattern: 'cypress/e2e/integration/**/*.cy.ts',
    supportFile: 'cypress/support/index.ts',
    baseUrl: 'http://localhost:9001',
    experimentalRunAllSpecs: true,
    experimentalMemoryManagement: true,
    numTestsKeptInMemory: 5,
    defaultCommandTimeout: 10000,
    viewportWidth: 1280,
    viewportHeight: 720,
    screenshotsFolder: 'cypress/screenshots',
    video: Boolean(process.env.CI),
  },
});
