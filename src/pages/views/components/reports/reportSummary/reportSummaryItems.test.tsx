import { render, screen } from '@testing-library/react';
import React from 'react';
import * as utils from 'utils/computedReport/getComputedReportItems';
import { FetchStatus } from '../../../../../store/common';

import { ReportSummaryItems, ReportSummaryItemsProps } from './reportSummaryItems';

jest.spyOn(utils, 'getComputedReportItems');

const props: ReportSummaryItemsProps = {
  intl: {
    formatMessage: jest.fn((m, v) => JSON.stringify(v)),
  } as any,
  children: jest.fn(() => "children"),
  status: FetchStatus.inProgress,
};

test('contains skeleton readers if in progress', () => {
  render(<ReportSummaryItems {...props} />);
  expect(screen).toMatchSnapshot();
});

test('does not update if the report is unchanged', () => {
  render(<ReportSummaryItems {...props} status={FetchStatus.complete} />);
  expect(screen.getByText(/children/i)).not.toBeNull();
});
