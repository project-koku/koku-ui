import type { MessageDescriptor } from '@formatjs/intl/src/types';
import { render } from '@testing-library/react';
import { intl } from 'components/i18n';
import React from 'react';
import { defineMessages } from 'react-intl';
import { DatumType } from 'routes/components/charts/common/chartDatum';
import { DashboardWidgetBase } from 'routes/overview/components';
import type { DashboardWidgetProps } from 'routes/overview/components/dashboardWidgetBase';
import { FetchStatus } from 'store/common';

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
    datumType: DatumType.cumulative,
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
