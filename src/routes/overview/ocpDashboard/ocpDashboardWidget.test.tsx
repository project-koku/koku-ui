import { OcpDashboardTab } from 'store/dashboard/ocpDashboard';

import { getIdKeyForTab } from './ocpDashboardWidget';

test('id key for dashboard tab is the tab name in singular form', () => {
  [OcpDashboardTab.clusters, OcpDashboardTab.nodes, OcpDashboardTab.projects].forEach(value => {
    expect(getIdKeyForTab(value)).toEqual(value.slice(0, -1));
  });

  expect(getIdKeyForTab(OcpDashboardTab.projects)).toEqual('project');
});
