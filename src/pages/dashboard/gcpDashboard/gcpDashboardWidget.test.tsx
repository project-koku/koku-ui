jest.mock('date-fns').mock('date-fns/format');

import { getDate, getMonth, startOfMonth } from 'date-fns';
import formatDate from 'date-fns/format';
import { GcpDashboardTab } from 'store/dashboard/gcpDashboard';
import { mockDate } from 'testUtils';

import { getIdKeyForTab } from './gcpDashboardWidget';

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
  [GcpDashboardTab.services, GcpDashboardTab.projects, GcpDashboardTab.regions].forEach(value => {
    expect(getIdKeyForTab(value)).toEqual(value.slice(0, -1));
  });

  expect(getIdKeyForTab(GcpDashboardTab.instanceType)).toEqual(GcpDashboardTab.instanceType);
});
