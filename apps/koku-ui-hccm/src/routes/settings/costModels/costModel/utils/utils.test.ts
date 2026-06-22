import { ProviderType } from 'api/providers';

import { getSourceType } from './utils';

describe('costModels/utils', () => {
  test('getSourceType maps known provider labels', () => {
    expect(getSourceType('Amazon Web Services')).toBe(ProviderType.aws);
    expect(getSourceType('Google Cloud')).toBe(ProviderType.gcp);
    expect(getSourceType('Microsoft Azure')).toBe(ProviderType.azure);
    expect(getSourceType('OpenShift Container Platform')).toBe(ProviderType.ocp);
  });

  test('getSourceType returns undefined for unknown label', () => {
    expect(getSourceType('Unknown')).toBeUndefined();
  });
});
