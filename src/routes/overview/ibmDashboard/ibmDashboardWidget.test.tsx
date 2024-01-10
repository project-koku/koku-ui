import { IbmDashboardTab } from 'store/dashboard/ibmDashboard';

import { getIdKeyForTab } from './ibmDashboardWidget';

test('id key for dashboard tab is the tab name in singular form', () => {
  [IbmDashboardTab.services, IbmDashboardTab.projects, IbmDashboardTab.regions].forEach(value => {
    expect(getIdKeyForTab(value)).toEqual(value.slice(0, -1));
  });

  expect(getIdKeyForTab(IbmDashboardTab.instanceType)).toEqual(IbmDashboardTab.instanceType);
});
