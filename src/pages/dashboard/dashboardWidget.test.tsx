import { ReportType } from 'api/reports';
import { ReportSummary, ReportSummaryDetails } from 'components/reportSummary';
import { shallow } from 'enzyme';
import React from 'react';
import { FetchStatus } from 'store/common';
import { DashboardWidgetBase, DashboardWidgetProps } from './dashboardWidget';

const props: DashboardWidgetProps = {
  reportType: ReportType.cost,
  fetchReport: jest.fn(),
  currentMonthFetchStatus: FetchStatus.complete,
  currentMonthError: null,
  currentMonth: { data: [] },
  currentMonthQuery: 'currentMonthQuery',
  prevMonthFetchStatus: FetchStatus.complete,
  prevMonth: { data: [] },
  prevMonthError: null,
  prevMonthQuery: 'previousMonthQuery',
  formatDetailsValue: jest.fn(),
  formatTrendValue: jest.fn(),
  title: 'Title',
  trendTitle: 'trend title',
  detailDescription: 'detail description',
  detailLabel: 'detail label',
};

test('previous and current month reports are fetched on mount', () => {
  shallow(<DashboardWidgetBase {...props} />);
  expect(props.fetchReport).toBeCalledWith(
    props.reportType,
    props.currentMonthQuery
  );
  expect(props.fetchReport).toBeCalledWith(
    props.reportType,
    props.prevMonthQuery
  );
});

test('title is passed to ReportSummary', () => {
  const view = shallow(<DashboardWidgetBase {...props} />);
  expect(view.find(ReportSummary).props().title).toBe(props.title);
});

test('current report and strings are passed to ReportSummaryDetails', () => {
  const view = shallow(<DashboardWidgetBase {...props} />);
  const detailProps = view.find(ReportSummaryDetails).props();
  expect(detailProps.report).toBe(props.currentMonth);
  expect(detailProps.formatValue).toBe(props.formatDetailsValue);
  expect(detailProps.description).toBe(props.detailDescription);
  expect(detailProps.label).toBe(props.detailLabel);
});
