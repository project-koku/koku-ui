jest.mock('date-fns');

import { format, getDate, getMonth, startOfMonth } from 'date-fns';
import { AzureDashboardTab } from 'store/dashboard/azureDashboard';
import { mockDate } from 'testUtils';

import { getIdKeyForTab } from './azureDashboardWidget';

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
  [AzureDashboardTab.service_names, AzureDashboardTab.subscription_guids, AzureDashboardTab.resource_locations].forEach(
    value => {
      expect(getIdKeyForTab(value)).toEqual(value.slice(0, -1));
    }
  );

  expect(getIdKeyForTab(AzureDashboardTab.instanceType)).toEqual(AzureDashboardTab.instanceType);
});
