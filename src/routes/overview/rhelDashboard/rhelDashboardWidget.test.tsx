import { RhelDashboardTab } from 'store/dashboard/rhelDashboard';

import { getIdKeyForTab } from './rhelDashboardWidget';

test('id key for dashboard tab is the tab name in singular form', () => {
  [RhelDashboardTab.clusters, RhelDashboardTab.nodes, RhelDashboardTab.projects].forEach(value => {
    expect(getIdKeyForTab(value)).toEqual(value.slice(0, -1));
  });

  expect(getIdKeyForTab(RhelDashboardTab.projects)).toEqual('project');
});
