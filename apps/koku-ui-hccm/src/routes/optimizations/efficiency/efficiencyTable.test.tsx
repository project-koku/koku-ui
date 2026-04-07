import { fireEvent, screen } from '@testing-library/react';
import React from 'react';
import { useLocation } from 'react-router-dom';

import { renderWithProviders } from './testUtils';
import { EfficiencyTable } from './efficiencyTable';

// Capture the rows/columns/onSort that EfficiencyTable passes to DataTable
let capturedRows: any[] = [];
let capturedOnSort: any;

jest.mock('routes/components/dataTable', () => ({
  DataTable: ({ rows, columns, onSort }: any) => {
    capturedRows = rows;
    capturedOnSort = onSort;
    return (
      <div data-testid="data-table">
        {columns?.map((col: any, i: number) => (
          <span key={i} data-testid={`column-${i}`}>
            {col.name}
          </span>
        ))}
        {rows?.map((row: any, i: number) => (
          <div key={i} data-testid={`row-${i}`}>
            {row.cells[0]?.value}
          </div>
        ))}
      </div>
    );
  },
}));

jest.mock('routes/utils/computedReport/getComputedReportItems', () => ({
  getUnsortedComputedReportItems: jest.fn(() => [
    {
      label: 'cluster-1',
      id: 'cluster-1',
      cost: { total: { value: 100, units: 'USD' } },
      score: { usage_efficiency_percent: 75, wasted_cost: { value: 25, units: 'USD' } },
    },
    {
      label: 'cluster-2',
      id: 'cluster-2',
      cost: { total: { value: 200, units: 'USD' } },
      score: { usage_efficiency_percent: 60, wasted_cost: { value: 50, units: 'USD' } },
    },
  ]),
}));

// Capture the location state set by the Link's navigation
let capturedState: any = null;

function LocationCapture() {
  const location = useLocation();
  capturedState = location.state;
  return null;
}

const mockOnSort = jest.fn();

const defaultProps = {
  basePath: '/optimizations',
  groupBy: 'cluster',
  onSort: mockOnSort,
  report: {} as any,
};

describe('EfficiencyTable', () => {
  beforeEach(() => {
    capturedRows = [];
    capturedState = null;
  });

  describe('rendering', () => {
    it('renders DataTable without crashing when report is undefined', () => {
      renderWithProviders(<EfficiencyTable {...defaultProps} report={undefined as any} />);
      expect(screen.getByTestId('data-table')).toBeInTheDocument();
    });

    it('renders 5 column headers', () => {
      renderWithProviders(<EfficiencyTable {...defaultProps} />);
      expect(screen.getAllByTestId(/^column-/)).toHaveLength(5);
    });

    it('renders one row per computed item', () => {
      renderWithProviders(<EfficiencyTable {...defaultProps} />);
      expect(screen.getAllByTestId(/^row-/)).toHaveLength(2);
    });

    it('renders item labels as links', () => {
      renderWithProviders(<EfficiencyTable {...defaultProps} />);
      expect(screen.getByRole('link', { name: 'cluster-1' })).toBeInTheDocument();
      expect(screen.getByRole('link', { name: 'cluster-2' })).toBeInTheDocument();
    });
  });

  describe('navigation state', () => {
    it('sets efficiencyState.activeTabKey to 1 so the optimizations tab activates on click', () => {
      renderWithProviders(
        <>
          <LocationCapture />
          <EfficiencyTable {...defaultProps} />
        </>
      );
      fireEvent.click(screen.getByRole('link', { name: 'cluster-1' }));
      expect(capturedState?.efficiencyState?.activeTabKey).toBe(1);
    });

    it('sets optimizationsDetailsState.filter_by keyed by groupBy with the item label', () => {
      renderWithProviders(
        <>
          <LocationCapture />
          <EfficiencyTable {...defaultProps} groupBy="cluster" />
        </>
      );
      fireEvent.click(screen.getByRole('link', { name: 'cluster-1' }));
      expect(capturedState?.optimizationsDetailsState?.filter_by?.cluster).toEqual(['cluster-1']);
    });

    it('preserves existing location state when building the link state', () => {
      renderWithProviders(
        <>
          <LocationCapture />
          <EfficiencyTable {...defaultProps} />
        </>
      );
      fireEvent.click(screen.getByRole('link', { name: 'cluster-2' }));
      // efficiencyState.activeTabKey must be 1 and filter_by has the second item
      expect(capturedState?.efficiencyState?.activeTabKey).toBe(1);
      expect(capturedState?.optimizationsDetailsState?.filter_by?.cluster).toEqual(['cluster-2']);
    });
  });

  describe('sorting', () => {
    it('passes the onSort callback directly to DataTable', () => {
      renderWithProviders(<EfficiencyTable {...defaultProps} />);
      expect(capturedOnSort).toBe(mockOnSort);
    });

    it('calling capturedOnSort invokes the onSort prop', () => {
      renderWithProviders(<EfficiencyTable {...defaultProps} />);
      capturedOnSort('cost', true);
      expect(mockOnSort).toHaveBeenCalledWith('cost', true);
    });
  });
});
