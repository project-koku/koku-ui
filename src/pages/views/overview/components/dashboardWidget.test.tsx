jest.mock('date-fns').mock('date-fns/format');

import { MessageDescriptor } from '@formatjs/intl/src/types';
import { render } from '@testing-library/react';
import { intl } from 'components/i18n';
import { format, getDate, getMonth, startOfMonth } from 'date-fns';
import { ChartType } from 'pages/views/components/charts/common/chartDatumUtils';
import { DashboardWidgetBase, DashboardWidgetProps } from 'pages/views/overview/components/dashboardWidgetBase';
import React from 'react';
import { defineMessages } from 'react-intl';
import { FetchStatus } from 'store/common';
import { mockDate } from 'testUtils';

const tmessages = defineMessages({
  testTitle: {
    id: 'TestTitle',
    description: 'test title',
    defaultMessage: 'test title',
  },
  testTrendTitle: {
    id: 'TestTrendTitle',
    description: 'test trend title',
    defaultMessage: 'test trend title',
  },
});

const props: DashboardWidgetProps = {
  widgetId: 1,
  id: 1,
  intl,
  current: { data: [] },
  previous: { data: [] },
  tabs: { data: [] },
  fetchReports: jest.fn(),
  updateTab: jest.fn(),
  titleKey: tmessages.testTitle,
  trend: {
    type: ChartType.rolling,
    titleKey: tmessages.testTrendTitle,
    formatOptions: {},
  },
  status: FetchStatus.none,
  currentQuery: '',
  previousQuery: '',
  tabsQuery: '',
  details: {
    breakdownDescKeyRange: 'detail description range',
    breakdownDescKeySingle: 'detail description single',
    formatOptions: {},
  },
  topItems: { formatOptions: {} },
} as any;

const getDateMock = getDate as jest.Mock;
const formatMock = format as jest.Mock;
const startOfMonthMock = startOfMonth as jest.Mock;
const getMonthMock = getMonth as jest.Mock;

beforeEach(() => {
  mockDate();
  getDateMock.mockReturnValue(1);
  formatMock.mockReturnValue('formatted date');
  startOfMonthMock.mockReturnValue(1);
  getMonthMock.mockReturnValue(1);
});

test('reports are fetched on mount', () => {
  render(<DashboardWidgetBase {...props} />);
  expect(props.fetchReports).toBeCalledWith(props.widgetId);
});

test('title is translated', () => {
  render(<DashboardWidgetBase {...props} />);
  expect(getTranslateCallForKey(props.titleKey)).toMatchSnapshot();
});

test('trend title is translated', () => {
  render(<DashboardWidgetBase {...props} />);
  expect(getTranslateCallForKey(props.trend.titleKey)).toMatchSnapshot();
});

function getTranslateCallForKey(key: MessageDescriptor) {
  return intl.formatMessage(key);
}
