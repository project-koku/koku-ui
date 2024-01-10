import { GcpDashboardTab } from 'store/dashboard/gcpDashboard';

import { getIdKeyForTab } from './gcpDashboardWidget';

test('id key for dashboard tab is the tab name in singular form', () => {
  [GcpDashboardTab.services, GcpDashboardTab.gcpProjects, GcpDashboardTab.regions].forEach(value => {
    expect(getIdKeyForTab(value)).toEqual(value.slice(0, -1));
  });

  expect(getIdKeyForTab(GcpDashboardTab.instanceType)).toEqual(GcpDashboardTab.instanceType);
});
