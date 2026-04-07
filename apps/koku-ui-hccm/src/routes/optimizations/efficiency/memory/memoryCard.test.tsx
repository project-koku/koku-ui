import { act, fireEvent, screen } from '@testing-library/react';
import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { ReportType } from 'api/reports/report';
import { FetchStatus } from 'store/common';
import { reportActions, reportSelectors } from 'store/reports';
import * as queryUtils from 'routes/utils/query';

import { renderWithProviders } from '../testUtils';
import { MemoryCard } from './memoryCard';

// --- Module mocks ---

jest.mock('react-redux', () => ({
  ...jest.requireActual('react-redux'),
  useSelector: (selector: any) => selector({}),
  useDispatch: jest.fn(),
}));

jest.mock('store/reports', () => ({
  reportSelectors: {
    selectReport: jest.fn(),
    selectReportFetchStatus: jest.fn(),
    selectReportError: jest.fn(),
  },
  reportActions: {
    fetchReport: jest.fn(() => ({ type: 'FETCH_REPORT' })),
  },
}));

jest.mock('routes/utils/computedReport/getComputedReportItems', () => ({
  getUnsortedComputedReportItems: jest.fn(() => []),
}));

let capturedOnSort: any = null;
jest.mock('../efficiencyTable', () => ({
  EfficiencyTable: (props: any) => {
    capturedOnSort = props.onSort;
    return <div data-testid="efficiency-table" />;
  },
}));

jest.mock('../efficiencySummary', () => ({
  EfficiencySummary: () => <div data-testid="efficiency-summary" />,
}));

jest.mock('routes/components/state/loadingState', () => ({
  LoadingState: () => <div data-testid="loading-state" />,
}));

jest.mock('routes/components/page/notAvailable', () => ({
  NotAvailable: () => <div data-testid="not-available" />,
}));

let capturedExportModalIsOpen = false;
let capturedExportModalOnClose: any = null;
jest.mock('routes/components/export', () => ({
  ExportModal: (props: any) => {
    capturedExportModalIsOpen = props.isOpen;
    capturedExportModalOnClose = props.onClose;
    return <div data-testid="export-modal" />;
  },
}));

jest.mock('routes/components/dataToolbar/utils/actions', () => ({
  getExportButton: jest.fn(({ onExportClicked }) => (
    <button data-testid="export-button" onClick={onExportClicked}>
      Export
    </button>
  )),
}));

jest.mock('routes/utils/query', () => ({
  handleOnSort: jest.fn(q => ({ ...q })),
  handleOnPerPageSelect: jest.fn(q => ({ ...q })),
  handleOnSetPage: jest.fn(q => ({ ...q })),
}));

let capturedBottomPaginationProps: any = null;
jest.mock('@patternfly/react-core', () => {
  const actual = jest.requireActual('@patternfly/react-core');
  return {
    __esModule: true,
    ...actual,
    Truncate: ({ content }: any) => <span>{content}</span>,
    Pagination: (props: any) => {
      if (!props.isCompact) {
        capturedBottomPaginationProps = props;
      }
      return <nav aria-label={props.titles?.paginationAriaLabel || 'pagination'} />;
    },
  };
});

jest.mock('utils/dates', () => ({
  getSinceDateRangeString: jest.fn(() => 'Jan 1 – Dec 31'),
}));

// --- Test data ---

const mockDispatch = jest.fn();

const mockReport = {
  data: [],
  meta: {
    count: 3,
    filter: { limit: 10, offset: 0 },
    total: {
      total_score: {
        usage_efficiency_percent: 40,
        wasted_cost: { value: 200, units: 'USD' },
      },
    },
  },
} as any;

const defaultProps = {
  currency: 'USD',
  groupBy: 'cluster',
  timeScopeValue: -1,
};

// --- Tests ---

describe('MemoryCard', () => {
  beforeEach(() => {
    (useDispatch as jest.Mock).mockReturnValue(mockDispatch);
    (reportSelectors.selectReport as jest.Mock).mockReturnValue(null);
    (reportSelectors.selectReportFetchStatus as jest.Mock).mockReturnValue(FetchStatus.none);
    (reportSelectors.selectReportError as jest.Mock).mockReturnValue(null);
    (reportActions.fetchReport as jest.Mock).mockReturnValue({ type: 'FETCH_REPORT' });
  });

  describe('loading state', () => {
    it('renders LoadingState when fetch is in progress', () => {
      (reportSelectors.selectReportFetchStatus as jest.Mock).mockReturnValue(FetchStatus.inProgress);
      renderWithProviders(<MemoryCard {...defaultProps} />);
      expect(screen.getByTestId('loading-state')).toBeInTheDocument();
    });

    it('does not render card content while loading', () => {
      (reportSelectors.selectReportFetchStatus as jest.Mock).mockReturnValue(FetchStatus.inProgress);
      renderWithProviders(<MemoryCard {...defaultProps} />);
      expect(screen.queryByTestId('efficiency-table')).not.toBeInTheDocument();
    });
  });

  describe('error state', () => {
    it('renders NotAvailable when reportError is set', () => {
      (reportSelectors.selectReportError as jest.Mock).mockReturnValue(new Error('network error'));
      renderWithProviders(<MemoryCard {...defaultProps} />);
      expect(screen.getByTestId('not-available')).toBeInTheDocument();
    });

    it('does not render card content when there is an error', () => {
      (reportSelectors.selectReportError as jest.Mock).mockReturnValue(new Error('network error'));
      renderWithProviders(<MemoryCard {...defaultProps} />);
      expect(screen.queryByTestId('efficiency-table')).not.toBeInTheDocument();
    });
  });

  describe('populated state', () => {
    beforeEach(() => {
      (reportSelectors.selectReport as jest.Mock).mockReturnValue(mockReport);
      (reportSelectors.selectReportFetchStatus as jest.Mock).mockReturnValue(FetchStatus.complete);
    });

    it('renders the memory efficiency card title heading', () => {
      renderWithProviders(<MemoryCard {...defaultProps} />);
      expect(screen.getByRole('heading', { level: 2 })).toBeInTheDocument();
    });

    it('renders EfficiencySummary with the report', () => {
      renderWithProviders(<MemoryCard {...defaultProps} />);
      expect(screen.getByTestId('efficiency-summary')).toBeInTheDocument();
    });

    it('renders EfficiencyTable', () => {
      renderWithProviders(<MemoryCard {...defaultProps} />);
      expect(screen.getByTestId('efficiency-table')).toBeInTheDocument();
    });
  });

  describe('data fetching', () => {
    it('dispatches fetchReport on mount when status is not inProgress', () => {
      (reportSelectors.selectReportFetchStatus as jest.Mock).mockReturnValue(FetchStatus.none);
      renderWithProviders(<MemoryCard {...defaultProps} />);
      expect(reportActions.fetchReport).toHaveBeenCalled();
      expect(mockDispatch).toHaveBeenCalledWith(expect.objectContaining({ type: 'FETCH_REPORT' }));
    });

    it('dispatches with ReportType.memory (not cpu)', () => {
      renderWithProviders(<MemoryCard {...defaultProps} />);
      expect(reportActions.fetchReport).toHaveBeenCalledWith(
        expect.anything(),
        ReportType.memory,
        expect.any(String)
      );
    });

    it('does not dispatch fetchReport when fetch is already in progress', () => {
      (reportSelectors.selectReportFetchStatus as jest.Mock).mockReturnValue(FetchStatus.inProgress);
      renderWithProviders(<MemoryCard {...defaultProps} />);
      expect(reportActions.fetchReport).not.toHaveBeenCalled();
    });
  });

  describe('export modal', () => {
    beforeEach(() => {
      (reportSelectors.selectReport as jest.Mock).mockReturnValue(mockReport);
      (reportSelectors.selectReportFetchStatus as jest.Mock).mockReturnValue(FetchStatus.complete);
    });

    it('opens the export modal when the export button is clicked', () => {
      renderWithProviders(<MemoryCard {...defaultProps} />);
      expect(capturedExportModalIsOpen).toBe(false);
      fireEvent.click(screen.getByTestId('export-button'));
      expect(capturedExportModalIsOpen).toBe(true);
    });

    it('closes the export modal when onClose is called', () => {
      renderWithProviders(<MemoryCard {...defaultProps} />);
      fireEvent.click(screen.getByTestId('export-button'));
      expect(capturedExportModalIsOpen).toBe(true);
      act(() => {
        capturedExportModalOnClose();
      });
      expect(capturedExportModalIsOpen).toBe(false);
    });
  });

  describe('sort and pagination', () => {
    beforeEach(() => {
      (reportSelectors.selectReport as jest.Mock).mockReturnValue(mockReport);
      (reportSelectors.selectReportFetchStatus as jest.Mock).mockReturnValue(FetchStatus.complete);
    });

    it('handleOnSort delegates to queryUtils when EfficiencyTable onSort is called', () => {
      renderWithProviders(<MemoryCard {...defaultProps} />);
      act(() => {
        capturedOnSort('cost', false);
      });
      expect(queryUtils.handleOnSort).toHaveBeenCalled();
    });

    it('handleOnSetPage delegates to queryUtils when pagination page changes', () => {
      renderWithProviders(<MemoryCard {...defaultProps} />);
      act(() => {
        capturedBottomPaginationProps.onSetPage({}, 2);
      });
      expect(queryUtils.handleOnSetPage).toHaveBeenCalled();
    });

    it('handleOnPerPageSelect delegates to queryUtils when per-page changes', () => {
      renderWithProviders(<MemoryCard {...defaultProps} />);
      act(() => {
        capturedBottomPaginationProps.onPerPageSelect({}, 20);
      });
      expect(queryUtils.handleOnPerPageSelect).toHaveBeenCalled();
    });
  });
});
