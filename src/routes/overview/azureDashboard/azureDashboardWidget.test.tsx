import { AzureDashboardTab } from 'store/dashboard/azureDashboard';

import { getIdKeyForTab } from './azureDashboardWidget';

test('id key for dashboard tab is the tab name in singular form', () => {
  [AzureDashboardTab.service_names, AzureDashboardTab.subscription_guids, AzureDashboardTab.resource_locations].forEach(
    value => {
      expect(getIdKeyForTab(value)).toEqual(value.slice(0, -1));
    }
  );

  expect(getIdKeyForTab(AzureDashboardTab.instanceType)).toEqual(AzureDashboardTab.instanceType);
});
