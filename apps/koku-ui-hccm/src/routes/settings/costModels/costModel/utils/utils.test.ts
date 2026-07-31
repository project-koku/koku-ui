import { ProviderType } from 'api/providers';

import { getSourceType } from './utils';

describe('costModels/utils', () => {
  test('getSourceType maps known provider labels', () => {
    expect(getSourceType('Amazon Web Services')).toBe(ProviderType.aws);
    expect(getSourceType('AWS')).toBe(ProviderType.aws);
    expect(getSourceType('Google Cloud')).toBe(ProviderType.gcp);
    expect(getSourceType('GCP')).toBe(ProviderType.gcp);
    expect(getSourceType('Microsoft Azure')).toBe(ProviderType.azure);
    expect(getSourceType('Azure')).toBe(ProviderType.azure);
    expect(getSourceType('OpenShift Container Platform')).toBe(ProviderType.ocp);
    expect(getSourceType('OCP')).toBe(ProviderType.ocp);
  });

  test('getSourceType maps local koku source types', () => {
    expect(getSourceType('AWS-local')).toBe(ProviderType.aws);
    expect(getSourceType('Azure-local')).toBe(ProviderType.azure);
    expect(getSourceType('GCP-local')).toBe(ProviderType.gcp);
  });

  test('getSourceType returns undefined for unknown label', () => {
    expect(getSourceType('Unknown')).toBeUndefined();
  });
});
