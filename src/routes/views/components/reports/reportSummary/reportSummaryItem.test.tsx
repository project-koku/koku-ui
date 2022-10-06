import { render, screen } from '@testing-library/react';
import { intl as defaultIntl } from 'components/i18n';
import React from 'react';

import ReportSummaryItem, { ReportSummaryItemProps } from './reportSummaryItem';

const props: ReportSummaryItemProps = {
  label: 'Label',
  intl: defaultIntl,
  totalValue: 1000,
  units: 'units',
  value: 100,
  formatOptions: {},
};

test('formats value', () => {
  render(<ReportSummaryItem {...props} />);
  expect(screen.getByText(/label/i)).not.toBeNull();
  expect(
    screen.getByText(
      '{value} {units} ({percent} %){"percent":"10","units":"{units, select, core_hours {core-hours} gb {GB} gb_hours {GB-hours} gb_mo {GB-month} gibibyte_month {GiB-month} hour {hours} hrs {hours} vm_hours {VM-hours} other {}}{}","value":100}'
    )
  ).not.toBeNull();
  expect(screen.getByRole('progressbar').getAttribute('aria-valuenow')).toBe('10');
});

test('sets percent to 0 if totalValue is 0', () => {
  render(<ReportSummaryItem {...props} totalValue={0} />);
  expect(screen.getByRole('progressbar').getAttribute('aria-valuenow')).toBe('0');
});
