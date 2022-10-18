jest.mock('date-fns');

import { format, getDate, getMonth, startOfMonth } from 'date-fns';
import { IbmDashboardTab } from 'store/dashboard/ibmDashboard';
import { mockDate } from 'testUtils';

import { getIdKeyForTab } from './ibmDashboardWidget';

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
  [IbmDashboardTab.services, IbmDashboardTab.projects, IbmDashboardTab.regions].forEach(value => {
    expect(getIdKeyForTab(value)).toEqual(value.slice(0, -1));
  });

  expect(getIdKeyForTab(IbmDashboardTab.instanceType)).toEqual(IbmDashboardTab.instanceType);
});
