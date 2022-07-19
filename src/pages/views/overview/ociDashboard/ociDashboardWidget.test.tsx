jest.mock('date-fns');

import { format, getDate, getMonth, startOfMonth } from 'date-fns';
import { OciDashboardTab } from 'store/dashboard/ociDashboard';
import { mockDate } from 'testUtils';

import { getIdKeyForTab } from './ociDashboardWidget';

const getDateMock = getDate as jest.Mock;
const formatMock = format as jest.Mock;
const startOfMonthMock = startOfMonth as jest.Mock;
const getMonthMock = getMonth as jest.Mock;

beforeEach(() => {
  mockDate();
  getDateMock.mockReturnValue(1);
  formatMock.mockReturnValue('formated date');
  startOfMonthMock.mockReturnValue(1);
  getMonthMock.mockReturnValue(1);
});

test('id key for dashboard tab is the tab name in singular form', () => {
  [OciDashboardTab.product_services, OciDashboardTab.payer_tenant_ids, OciDashboardTab.regions].forEach(value => {
    expect(getIdKeyForTab(value)).toEqual(value.slice(0, -1));
  });

  expect(getIdKeyForTab(OciDashboardTab.instanceType)).toEqual(OciDashboardTab.instanceType);
});
