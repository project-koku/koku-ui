declare namespace Cypress {
  interface Chainable {
    /**
     * Load API interceptors to mock the Cost Management API calls.
     * This is required for the federated modules to work properly.
     */
    loadApiInterceptors(): Chainable<void>;

    /**
     * Intercept the /logout navigation so the browser stays in a testable state.
     */
    interceptLogout(): Chainable<void>;

    /**
     * Wait for the federated module to load and render
     */
    waitForFederatedModule(): Chainable<void>;

    /**
     * Live e2e: spy console.error for Maximum update depth (use before visit).
     */
    setupLiveConsoleGuard(): Chainable<void>;

    /**
     * Live e2e: fail if setupLiveConsoleGuard recorded depth errors.
     */
    assertNoDepthConsoleErrors(): Chainable<void>;

    /** Live parity: full-page screenshot for visual-compare (basename without .png). */
    captureIamScreenshot(basename: string): Chainable<void>;
  }
}
