import { render, screen } from '@testing-library/react';
import React from 'react';
import { ReportSummaryItem, ReportSummaryItemProps } from './reportSummaryItem';

const props: ReportSummaryItemProps = {
  label: 'Label',
  intl: {
    formatMessage: jest.fn((m, v) => JSON.stringify(v)),
  } as any,
  totalValue: 1000,
  units: 'units',
  value: 100,
  formatOptions: {},
};

test('formats value', () => {
  render(<ReportSummaryItem {...props} />);
  expect(screen.getByText(/label/i)).not.toBeNull();
  expect(screen.getByText(/{"percent":"10","units":"{}","value":100}/i)).not.toBeNull();
  expect(screen.getByRole("progressbar").getAttribute("aria-valuenow")).toBe("10");
});

test('sets percent to 0 if totalValue is 0', () => {
  render(<ReportSummaryItem {...props} totalValue={0} />);
  expect(screen.getByRole("progressbar").getAttribute("aria-valuenow")).toBe("0");
});
