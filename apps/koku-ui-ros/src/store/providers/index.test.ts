import * as providers from './index';

test('re-exports provider store helpers', () => {
  expect(providers.providersActions).toBeDefined();
  expect(providers.providersReducer).toBeDefined();
  expect(providers.providersSelectors).toBeDefined();
  expect(providers.providersQuery).toBeDefined();
  expect(providers.awsProvidersQuery).toBeDefined();
  expect(providers.azureProvidersQuery).toBeDefined();
  expect(providers.gcpProvidersQuery).toBeDefined();
  expect(providers.ibmProvidersQuery).toBeDefined();
  expect(providers.ociProvidersQuery).toBeDefined();
  expect(providers.ocpProvidersQuery).toBeDefined();
  expect(providers.providersStateKey).toBeDefined();
});
