import { render, screen } from '@testing-library/react';
import React from 'react';
import ReportSummaryItems from './reportSummaryItems';
import { FetchStatus } from '../../../../store/common';

jest.mock('routes/utils/computedReport/getComputedReportItems', () => ({
  __esModule: true,
  getComputedReportItems: jest.fn(() => [
    { id: 'A', label: 'A', cost: { total: { value: 1 } } },
    { id: 'Other', label: 'Other', cost: { total: { value: 2 } } },
    { id: 'B', label: 'B', cost: { total: { value: 3 } } },
  ]),
}));

const Child = ({ items }: any) => (
  <>
    {items.map(item => (
      <li key={item.id}>{item.label}</li>
    ))}
  </>
);

describe('ReportSummaryItems', () => {
  test('shows skeleton when loading', () => {
    render(
      <ReportSummaryItems idKey="id" report={{} as any} status={FetchStatus.inProgress as any}>
        {props => <Child {...props} />}
      </ReportSummaryItems>
    );
    // PF v6 skeleton class
    const nodes = document.querySelectorAll('.pf-v6-c-skeleton');
    expect(nodes.length).toBeGreaterThan(0);
  });

  test('renders children with items and moves Other to end', () => {
    render(
      <ReportSummaryItems idKey="id" report={{} as any}>
        {props => <Child {...props} />}
      </ReportSummaryItems>
    );
    const items = screen.getAllByRole('listitem');
    expect(items.map(li => li.textContent)).toEqual(['A', 'B', 'Other']);
  });
});
