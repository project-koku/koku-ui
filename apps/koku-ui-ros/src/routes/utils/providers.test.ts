import { ProviderType } from 'api/providers';
import type { Providers } from 'api/providers';

import {
  filterProviders,
  hasCloudCurrentMonthData,
  hasCloudData,
  hasCloudPreviousMonthData,
  hasCloudProvider,
  hasCurrentMonthData,
  hasData,
  hasPreviousMonthData,
  matchesProviderType,
} from './providers';

const aws = { uuid: 'aws-1', source_type: 'AWS', has_data: true, current_month_data: true, previous_month_data: false };
const ocpOnAws = {
  uuid: 'ocp-1',
  source_type: 'OCP',
  infrastructure: { uuid: 'aws-1' },
  has_data: true,
  current_month_data: true,
  previous_month_data: true,
};
const azure = { uuid: 'azure-1', source_type: 'Azure-local', has_data: false };

const providers = {
  meta: { count: 2 },
  data: [aws, azure],
} as Providers;

const ocpProviders = {
  meta: { count: 1 },
  data: [ocpOnAws],
} as Providers;

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
  test('includes matching sources and updates the count', () => {
    expect(filterProviders(providers, ProviderType.aws).data).toHaveLength(1);
    expect(filterProviders(providers, ProviderType.azure).meta.count).toBe(1);
    expect(filterProviders(providers, ProviderType.ocp).meta.count).toBe(0);
  });

  test('returns undefined providers unchanged', () => {
    expect(filterProviders(undefined as unknown as Providers, ProviderType.aws)).toBeUndefined();
  });
});

describe('provider data helpers', () => {
  test('reports when any source has data', () => {
    expect(hasData(providers)).toBe(true);
    expect(hasCurrentMonthData(providers)).toBe(true);
    expect(hasPreviousMonthData(providers)).toBe(false);
    expect(hasPreviousMonthData(ocpProviders)).toBe(true);
    expect(hasData({ data: [] } as Providers)).toBe(false);
    expect(hasData(undefined as unknown as Providers)).toBe(false);
  });

  test('reports cloud sources that are filtered by OpenShift', () => {
    expect(hasCloudProvider(providers, ocpProviders)).toBe(true);
    expect(hasCloudData(providers, ocpProviders)).toBe(true);
    expect(hasCloudCurrentMonthData(providers, ocpProviders)).toBe(true);
    expect(hasCloudPreviousMonthData(providers, ocpProviders)).toBe(true);
    expect(hasCloudProvider(providers, { data: [] } as Providers)).toBe(false);
    expect(hasCloudData(undefined as unknown as Providers, ocpProviders)).toBe(false);
  });
});
