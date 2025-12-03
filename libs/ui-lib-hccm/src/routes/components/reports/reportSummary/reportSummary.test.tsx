import { render, screen } from '@testing-library/react';
import React from 'react';
import { FetchStatus } from '../../../../store/common';

import type { ReportSummaryProps } from './reportSummary';
import ReportSummary from './reportSummary';

const props: ReportSummaryProps = {
  intl: null,
  title: 'report title',
  status: FetchStatus.complete,
};

test('on fetch status complete display reports', () => {
  render(<ReportSummary {...props}>hello world</ReportSummary>);
  expect(screen.getByText(/report title/i)).not.toBeNull();
  expect(screen.getByText(/hello world/i)).not.toBeNull();
});

test('show subtitle if given', () => {
  render(<ReportSummary {...props} subTitle={'sub-title'} />);
  expect(screen.getByText(/sub-title/i)).not.toBeNull();
});

test('show details link in card footer if given', () => {
  render(<ReportSummary {...props} detailsLink={<a href="#/">a link</a>} />);
  expect(screen.getByRole('link', { name: 'a link' }).getAttribute('href')).toBe('#/');
});
