import { AwsDashboardTab } from 'store/dashboard/awsDashboard';

import { getIdKeyForTab } from './awsDashboardWidget'

test('id key for dashboard tab is the tab name in singular form', () => {
  [AwsDashboardTab.services, AwsDashboardTab.accounts, AwsDashboardTab.regions].forEach(value => {
    expect(getIdKeyForTab(value)).toEqual(value.slice(0, -1));
  });

  expect(getIdKeyForTab(AwsDashboardTab.instanceType)).toEqual(AwsDashboardTab.instanceType);
});
