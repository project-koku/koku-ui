import { FeatureToggleType } from './featureToggleType';

describe('FeatureToggleType', () => {
  it('defines Unleash flag names used by the app and on-prem webpack', () => {
    expect(FeatureToggleType.awsEc2Instances).toBe('cost-management.koku-ui-hccm.aws-ec2-instances');
    expect(FeatureToggleType.debug).toBe('cost-management.koku-ui-hccm.debug');
    expect(FeatureToggleType.display).toBe('cost-management.koku-ui-hccm.display');
    expect(FeatureToggleType.efficiency).toBe('cost-management.koku-ui-hccm.efficiency');
    expect(FeatureToggleType.exactFilter).toBe('cost-management.koku-ui-hccm.exact-filter');
    expect(FeatureToggleType.exports).toBe('cost-management.koku-ui-hccm.exports');
    expect(FeatureToggleType.gpu).toBe('cost-management.koku-ui-hccm.gpu');
    expect(FeatureToggleType.mig).toBe('cost-management.koku-ui-hccm.mig');
    expect(FeatureToggleType.namespace).toBe('cost-management.koku-ui-ros.namespace');
    expect(FeatureToggleType.priceList).toBe('cost-management.koku-ui-hccm.price-list');
    expect(FeatureToggleType.priceListRates).toBe('cost-management.koku-ui-hccm.price-list-rates');
    expect(FeatureToggleType.systems).toBe('cost-management.koku-ui-hccm.systems');
    expect(FeatureToggleType.wastedCost).toBe('cost-management.koku-ui-hccm.wasted-cost');
  });
});
