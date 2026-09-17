import { FeatureToggleType } from './featureToggleType';

describe('FeatureToggleType', () => {
  it('defines Unleash flag names used by the app', () => {
    expect(FeatureToggleType.debug).toBe('cost-management.koku-ui-ros.debug');
    expect(FeatureToggleType.namespace).toBe('cost-management.koku-ui-ros.namespace');
  });
});
