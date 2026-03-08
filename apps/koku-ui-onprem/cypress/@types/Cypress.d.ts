declare namespace Cypress {
  interface Chainable {
    /**
     * Load API interceptors to mock the Cost Management API calls.
     * This is required for the federated modules to work properly.
     */
    loadApiInterceptors(): Chainable<void>;

    /**
     * Override the sources API interceptor to return an empty list.
     * Useful for testing the Sources empty state with type tiles.
     */
    interceptSourcesEmpty(): Chainable<void>;

    /**
     * Override the sources API interceptor to return a specific list.
     * Also intercepts POST/PATCH/DELETE for source CRUD operations.
     */
    interceptSourcesCRUD(): Chainable<void>;

    /**
     * Wait for the federated module to load and render
     */
    waitForFederatedModule(): Chainable<void>;
  }
}
