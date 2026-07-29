import { ProviderType } from 'api/providers';
import type { Providers } from 'api/providers';

import { filterProviders, matchesProviderType } from './providers';

describe('matchesProviderType', () => {
  test('matches cloud and local source types without new ProviderType values', () => {
    expect(matchesProviderType('AWS', ProviderType.aws)).toBe(true);
    expect(matchesProviderType('AWS-local', ProviderType.aws)).toBe(true);
    expect(matchesProviderType('Azure-local', ProviderType.azure)).toBe(true);
    expect(matchesProviderType('GCP-local', ProviderType.gcp)).toBe(true);
    expect(matchesProviderType('OCP', ProviderType.ocp)).toBe(true);
  });

  test('does not cross-match provider types', () => {
    expect(matchesProviderType('AWS-local', ProviderType.azure)).toBe(false);
    expect(matchesProviderType('GCP', ProviderType.aws)).toBe(false);
    expect(matchesProviderType(undefined, ProviderType.aws)).toBe(false);
    expect(matchesProviderType('AWS', ProviderType.all)).toBe(false);
  });
});

describe('filterProviders', () => {
  const providers = {
    meta: { count: 4 },
    data: [
      { name: 'Test AWS Source', source_type: 'AWS-local' },
      { name: 'Test Azure Source', source_type: 'Azure-local' },
      { name: 'Test GCP Source', source_type: 'GCP-local' },
      { name: 'Test OCP on AWS', source_type: 'OCP' },
    ],
  } as Providers;

  test('includes *-local sources for aws/azure/gcp filters', () => {
    expect(filterProviders(providers, ProviderType.aws).data).toHaveLength(1);
    expect(filterProviders(providers, ProviderType.aws).data[0].name).toBe('Test AWS Source');
    expect(filterProviders(providers, ProviderType.azure).meta.count).toBe(1);
    expect(filterProviders(providers, ProviderType.gcp).meta.count).toBe(1);
    expect(filterProviders(providers, ProviderType.ocp).meta.count).toBe(1);
  });

  test('returns undefined providers unchanged', () => {
    expect(filterProviders(undefined as unknown as Providers, ProviderType.aws)).toBeUndefined();
  });
});
