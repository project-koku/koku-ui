import { OciDashboardTab } from 'store/dashboard/ociDashboard';

import { getIdKeyForTab } from './ociDashboardWidget';

test('id key for dashboard tab is the tab name in singular form', () => {
  [OciDashboardTab.product_services, OciDashboardTab.payer_tenant_ids, OciDashboardTab.regions].forEach(value => {
    expect(getIdKeyForTab(value)).toEqual(value.slice(0, -1));
  });

  expect(getIdKeyForTab(OciDashboardTab.instanceType)).toEqual(OciDashboardTab.instanceType);
});
