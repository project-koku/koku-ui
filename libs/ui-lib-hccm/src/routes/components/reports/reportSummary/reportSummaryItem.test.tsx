import { render, screen } from '@testing-library/react';
import { intl as defaultIntl } from '@koku-ui/i18n/i18n';
import React from 'react';

import type { ReportSummaryItemProps } from './reportSummaryItem';
import ReportSummaryItem from './reportSummaryItem';

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
      '{value} {units} ({percent} %){"percent":"10","units":"{units, select, byte_ms {Byte-ms} cluster_month {cluster-month} core {core} core_hours {core-hours} gb {GB} gb_hours {GB-hours} gb_month {GB-month} gb_ms {GB-ms} gib {GiB} gib_hours {GiB-hours} gib_month {GiB-month} gibibyte_month {GiB-month} hour {hours} hrs {hours} ms {milliseconds} pvc_month {PVC-month} tag_month {tag-month} vm_hours {VM-hours} other {}}{}","value":100}'
    )
  ).not.toBeNull();
  expect(screen.getByRole('progressbar').getAttribute('aria-valuenow')).toBe('10');
});

test('sets percent to 0 if totalValue is 0', () => {
  render(<ReportSummaryItem {...props} totalValue={0} />);
  expect(screen.getByRole('progressbar').getAttribute('aria-valuenow')).toBe('0');
});
