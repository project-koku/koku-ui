import { FeatureToggleType } from './featureToggleType';

describe('FeatureToggleType', () => {
  it('defines Unleash flag names used by the app and on-prem webpack', () => {
    expect(FeatureToggleType.awsEc2Instances).toBe('cost-management.koku-ui-hccm.aws-ec2-instances');
    expect(FeatureToggleType.debug).toBe('cost-management.koku-ui-hccm.debug');
    expect(FeatureToggleType.exchangeRate).toBe('cost-management.koku-ui-hccm.exchange-rate');
    expect(FeatureToggleType.exports).toBe('cost-management.koku-ui-hccm.exports');
    expect(FeatureToggleType.namespace).toBe('cost-management.koku-ui-ros.namespace');
    expect(FeatureToggleType.priceListRates).toBe('cost-management.koku-ui-hccm.price-list-rates');
    expect(FeatureToggleType.systems).toBe('cost-management.koku-ui-hccm.systems');
  });
});
