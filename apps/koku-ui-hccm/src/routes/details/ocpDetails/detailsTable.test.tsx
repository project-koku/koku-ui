import { render, screen } from '@testing-library/react';
import { intl } from 'components/i18n';
import React from 'react';
import { IntlProvider } from 'react-intl';
import { MemoryRouter } from 'react-router-dom';

import { DetailsTable } from './detailsTable';

jest.mock('@redhat-cloud-services/frontend-components/AsyncComponent', () => () => (
  <span data-testid="optimizations-link">ROS link</span>
));

jest.mock('routes/details/components/actions', () => ({
  Actions: () => null,
}));

let capturedColumns: any[] = [];
let capturedRows: any[] = [];

jest.mock('routes/components/dataTable', () => ({
  DataTable: (props: { columns?: any[]; rows?: any[] }) => {
    capturedColumns = props.columns || [];
    capturedRows = props.rows || [];
    return (
      <div data-testid="data-table">
        {capturedRows.map((row, rowIndex) => (
          <div key={rowIndex}>
            {row.cells.map((cell: any, cellIndex: number) => (
              <span key={cellIndex}>{cell.value}</span>
            ))}
          </div>
        ))}
      </div>
    );
  },
}));

const report = {
  data: [
    {
      values: [
        {
          project: 'web',
          cluster: 'cluster-1',
          cost: { total: { value: 100, units: 'USD' } },
          infrastructure: { total: { value: 40, units: 'USD' } },
          supplementary: { total: { value: 60, units: 'USD' } },
          delta_percent: 10,
          delta_value: 10,
        },
      ],
    },
  ],
  meta: {
    total: {
      cost: { total: { value: 100, units: 'USD' } },
    },
  },
} as any;

const makeProps = (over: Record<string, unknown> = {}) =>
  ({
    groupBy: 'project',
    hiddenColumns: new Set<string>(),
    intl,
    onSelect: jest.fn(),
    onSort: jest.fn(),
    report,
    reportQueryString: 'group_by[project]=*',
    isRosAvailable: undefined,
    selectedItems: [],
    ...over,
  }) as any;

const renderTable = (over: Record<string, unknown> = {}) =>
  render(
    <MemoryRouter future={{ v7_relativeSplatPath: true, v7_startTransition: true }}>
      <IntlProvider locale="en">
        <DetailsTable {...makeProps(over)} />
      </IntlProvider>
    </MemoryRouter>
  );

const hasOptimizationsColumn = () => capturedColumns.some(column => column.name === 'Optimizations');

describe('DetailsTable ROS availability', () => {
  beforeEach(() => {
    capturedColumns = [];
    capturedRows = [];
  });

  test('shows the optimizations column when grouped by project and ROS is available', () => {
    renderTable({
      isRosAvailable: true,
    });
    expect(hasOptimizationsColumn()).toBe(true);
    expect(screen.getByTestId('optimizations-link')).toBeInTheDocument();
  });

  test('hides the optimizations column and ROS link when ROS is unavailable', () => {
    renderTable({
      isRosAvailable: false,
    });
    expect(hasOptimizationsColumn()).toBe(false);
    expect(screen.queryByTestId('optimizations-link')).not.toBeInTheDocument();
  });

  test('hides the optimizations column until ROS availability is known', () => {
    const { rerender } = renderTable();
    expect(hasOptimizationsColumn()).toBe(false);

    rerender(
      <MemoryRouter future={{ v7_relativeSplatPath: true, v7_startTransition: true }}>
        <IntlProvider locale="en">
          <DetailsTable {...makeProps({ isRosAvailable: true })} />
        </IntlProvider>
      </MemoryRouter>
    );

    expect(hasOptimizationsColumn()).toBe(true);
    expect(screen.getByTestId('optimizations-link')).toBeInTheDocument();
  });

  test('does not show the optimizations column when grouped by cluster', () => {
    renderTable({
      groupBy: 'cluster',
      report: {
        ...report,
        data: [
          {
            values: [
              {
                cluster: 'cluster-1',
                cost: { total: { value: 100, units: 'USD' } },
                infrastructure: { total: { value: 40, units: 'USD' } },
                supplementary: { total: { value: 60, units: 'USD' } },
                delta_percent: 10,
                delta_value: 10,
              },
            ],
          },
        ],
      },
    });
    expect(hasOptimizationsColumn()).toBe(false);
  });
});
