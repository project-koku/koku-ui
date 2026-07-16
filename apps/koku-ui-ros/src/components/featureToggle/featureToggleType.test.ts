import { FeatureToggleType } from './featureToggleType';

describe('FeatureToggleType', () => {
  it('defines Unleash flag names used by the app and on-prem webpack', () => {
    expect(FeatureToggleType.boxPlot).toBe('cost-management.koku-ui-ros.box-plot');
    expect(FeatureToggleType.debug).toBe('cost-management.koku-ui-ros.debug');
    expect(FeatureToggleType.namespace).toBe('cost-management.koku-ui-ros.namespace');
    expect(FeatureToggleType.projectLink).toBe('cost-management.koku-ui-ros.project-link');
  });
});
