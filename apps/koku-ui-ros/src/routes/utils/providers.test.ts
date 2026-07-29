import { ProviderType } from 'api/providers';
import type { Providers } from 'api/providers';

import { filterProviders, matchesProviderType } from './providers';

describe('matchesProviderType', () => {
  test('matches cloud and local source types', () => {
    expect(matchesProviderType('AWS', ProviderType.aws)).toBe(true);
    expect(matchesProviderType('AWS-local', ProviderType.aws)).toBe(true);
    expect(matchesProviderType('Azure-local', ProviderType.azure)).toBe(true);
    expect(matchesProviderType('GCP-local', ProviderType.gcp)).toBe(true);
    expect(matchesProviderType('OCP', ProviderType.ocp)).toBe(true);
  });

  test('does not cross-match provider types', () => {
    expect(matchesProviderType('AWS-local', ProviderType.azure)).toBe(false);
    expect(matchesProviderType(undefined, ProviderType.aws)).toBe(false);
  });
});

describe('filterProviders', () => {
  const providers = {
    meta: { count: 2 },
    data: [
      { name: 'Test AWS Source', source_type: 'AWS-local' },
      { name: 'Test OCP', source_type: 'OCP' },
    ],
  } as Providers;

  test('includes *-local sources', () => {
    expect(filterProviders(providers, ProviderType.aws).data).toHaveLength(1);
    expect(filterProviders(providers, ProviderType.ocp).data).toHaveLength(1);
  });
});
