jest.mock('date-fns').mock('date-fns/format');

import { getDate, getMonth, startOfMonth } from 'date-fns';
import formatDate from 'date-fns/format';
import { OcpCloudDashboardTab } from 'store/dashboard/ocpCloudDashboard';
import { mockDate } from 'testUtils';

import { getIdKeyForTab } from './ocpCloudDashboardWidget';

const getDateMock = getDate as jest.Mock;
const formatDateMock = formatDate as jest.Mock;
const startOfMonthMock = startOfMonth as jest.Mock;
const getMonthMock = getMonth as jest.Mock;

beforeEach(() => {
  mockDate();
  getDateMock.mockReturnValue(1);
  formatDateMock.mockReturnValue('formated date');
  startOfMonthMock.mockReturnValue(1);
  getMonthMock.mockReturnValue(1);
});

test('id key for dashboard tab is the tab name in singular form', () => {
  [OcpCloudDashboardTab.accounts, OcpCloudDashboardTab.regions, OcpCloudDashboardTab.services].forEach(value => {
    expect(getIdKeyForTab(value)).toEqual(value.slice(0, -1));
  });

  expect(getIdKeyForTab(OcpCloudDashboardTab.accounts)).toEqual('account');
});
