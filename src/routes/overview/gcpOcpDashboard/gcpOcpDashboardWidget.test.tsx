import { GcpOcpDashboardTab } from 'store/dashboard/gcpOcpDashboard';

import { getIdKeyForTab } from './gcpOcpDashboardWidget';

test('id key for dashboard tab is the tab name in singular form', () => {
  [GcpOcpDashboardTab.services, GcpOcpDashboardTab.gcpProjects, GcpOcpDashboardTab.regions].forEach(value => {
    expect(getIdKeyForTab(value)).toEqual(value.slice(0, -1));
  });

  expect(getIdKeyForTab(GcpOcpDashboardTab.instanceType)).toEqual(GcpOcpDashboardTab.instanceType);
});
