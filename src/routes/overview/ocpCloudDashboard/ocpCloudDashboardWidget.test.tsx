import { OcpCloudDashboardTab } from 'store/dashboard/ocpCloudDashboard';

import { getIdKeyForTab } from './ocpCloudDashboardWidget';

test('id key for dashboard tab is the tab name in singular form', () => {
  [OcpCloudDashboardTab.accounts, OcpCloudDashboardTab.regions, OcpCloudDashboardTab.services].forEach(value => {
    expect(getIdKeyForTab(value)).toEqual(value.slice(0, -1));
  });

  expect(getIdKeyForTab(OcpCloudDashboardTab.accounts)).toEqual('account');
});
