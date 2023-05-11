import { render, screen } from '@testing-library/react';
import React from 'react';
import * as utils from 'routes/views/utils/computedReport/getComputedReportItems';
import { FetchStatus } from 'store/common';

import type { ReportSummaryItemsProps } from './reportSummaryItems';
import ReportSummaryItems from './reportSummaryItems';

jest.spyOn(utils, 'getComputedReportItems');

const props: ReportSummaryItemsProps = {
  children: jest.fn(() => 'children'),
  status: FetchStatus.inProgress,
  idKey: 'date',
  report: { data: [] },
};

test('contains skeleton readers if in progress', () => {
  const view = render(<ReportSummaryItems {...props} />);
  expect(view.container).toMatchSnapshot();
});

test('renders the children if complete', () => {
  render(<ReportSummaryItems {...props} status={FetchStatus.complete} />);
  expect(screen.getByText(/children/i)).not.toBeNull();
});

test('renders the children if complete', () => {
  render(<ReportSummaryItems {...props} status={FetchStatus.complete} />);
  expect(utils.getComputedReportItems).toBeCalledWith({
    report: props.report,
    idKey: props.idKey,
  });
});

test('does not update if the report is unchanged', () => {
  const { rerender } = render(<ReportSummaryItems {...props} status={FetchStatus.complete} />);
  rerender(<ReportSummaryItems {...props} status={FetchStatus.complete} />);
  expect(utils.getComputedReportItems).toHaveBeenCalledTimes(1);
  /* eslint-disable-next-line testing-library/no-node-access */
  expect(props.children).toHaveBeenCalledTimes(1);
});
