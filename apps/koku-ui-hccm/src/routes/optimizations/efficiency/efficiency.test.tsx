import { screen } from '@testing-library/react';
import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { FetchStatus } from 'store/common';
import { providersActions, providersSelectors } from 'store/providers';
import { filterProviders, hasCurrentMonthData, hasPreviousMonthData } from 'routes/utils/providers';

import { renderWithProviders } from './testUtils';
import Efficiency from './efficiency';

// --- Module mocks ---

jest.mock('react-redux', () => ({
  ...jest.requireActual('react-redux'),
  useSelector: (selector: any) => selector({}),
  useDispatch: jest.fn(),
}));

jest.mock('store/providers', () => ({
  providersSelectors: {
    selectProviders: jest.fn(),
    selectProvidersFetchStatus: jest.fn(),
    selectProvidersError: jest.fn(),
  },
  providersActions: {
    fetchProviders: jest.fn(() => ({ type: 'FETCH_PROVIDERS' })),
  },
  providersQuery: {},
}));

jest.mock('store/ui', () => ({
  uiActions: {
    openProvidersModal: jest.fn(),
  },
}));

jest.mock('routes/utils/providers', () => ({
  filterProviders: jest.fn(providers => providers),
  hasCurrentMonthData: jest.fn(() => true),
  hasPreviousMonthData: jest.fn(() => true),
}));

jest.mock('routes/utils/queryState', () => ({
  // Return a queryState with time_scope_value defined to prevent setQuery-during-render
  getQueryState: jest.fn(() => ({ filter: { time_scope_value: -1 } })),
}));

jest.mock('routes/utils/computedReport/getComputedOcpReportItems', () => ({
  getIdKeyForGroupBy: jest.fn(() => 'cluster'),
}));

jest.mock('routes/components/charts/common', () => ({
  getResizeObserver: jest.fn(() => jest.fn()),
}));

jest.mock('utils/sessionStorage', () => ({
  getCurrency: jest.fn(() => 'USD'),
  deleteOperatorAvailable: jest.fn(),
  isOperatorAvailableValid: jest.fn(() => false),
  setOperatorAvailable: jest.fn(),
}));

jest.mock('utils/dates', () => ({
  getSinceDateRangeString: jest.fn(() => 'Jan 1 – Dec 31'),
}));

jest.mock('./compute', () => ({
  ComputeCard: () => <div data-testid="compute-card" />,
}));

jest.mock('./memory', () => ({
  MemoryCard: () => <div data-testid="memory-card" />,
}));

jest.mock('./efficiencyHeader', () => ({
  EfficiencyHeader: () => <div data-testid="efficiency-header" />,
}));

jest.mock('routes/components/page/loading', () => ({
  Loading: () => <div data-testid="loading" />,
}));

jest.mock('routes/components/page/notAvailable', () => ({
  NotAvailable: () => <div data-testid="not-available" />,
}));

jest.mock('routes/components/page/noProviders', () => ({
  NoProviders: () => <div data-testid="no-providers" />,
}));

jest.mock('routes/components/page/noData', () => ({
  NoData: () => <div data-testid="no-data" />,
}));

jest.mock('routes/details/components/providerStatus', () => ({
  ProviderStatus: () => <div data-testid="provider-status" />,
}));

// --- Helpers ---

const mockDispatch = jest.fn();

const emptyProviders = { data: [], meta: { count: 0 } } as any;
const populatedProviders = {
  data: [{ additional_context: { operator_update_available: false } }],
  meta: { count: 1 },
} as any;

function setupDefaults() {
  (useDispatch as jest.Mock).mockReturnValue(mockDispatch);
  (providersSelectors.selectProviders as jest.Mock).mockReturnValue(emptyProviders);
  (providersSelectors.selectProvidersFetchStatus as jest.Mock).mockReturnValue(FetchStatus.none);
  (providersSelectors.selectProvidersError as jest.Mock).mockReturnValue(null);
  (providersActions.fetchProviders as jest.Mock).mockReturnValue({ type: 'FETCH_PROVIDERS' });
  (filterProviders as jest.Mock).mockReturnValue(emptyProviders);
  (hasCurrentMonthData as jest.Mock).mockReturnValue(true);
  (hasPreviousMonthData as jest.Mock).mockReturnValue(true);
}

// --- Tests ---

describe('Efficiency', () => {
  beforeEach(() => {
    setupDefaults();
  });

  describe('loading state', () => {
    it('renders Loading when providers fetch is in progress', () => {
      (providersSelectors.selectProvidersFetchStatus as jest.Mock).mockReturnValue(FetchStatus.inProgress);
      renderWithProviders(<Efficiency />);
      expect(screen.getByTestId('loading')).toBeInTheDocument();
    });

    it('does not render the main content while loading', () => {
      (providersSelectors.selectProvidersFetchStatus as jest.Mock).mockReturnValue(FetchStatus.inProgress);
      renderWithProviders(<Efficiency />);
      expect(screen.queryByTestId('compute-card')).not.toBeInTheDocument();
    });
  });

  describe('error state', () => {
    it('renders NotAvailable when providersError is set', () => {
      (providersSelectors.selectProvidersError as jest.Mock).mockReturnValue(new Error('API unavailable'));
      renderWithProviders(<Efficiency />);
      expect(screen.getByTestId('not-available')).toBeInTheDocument();
    });

    it('does not render the main content when there is an error', () => {
      (providersSelectors.selectProvidersError as jest.Mock).mockReturnValue(new Error('API unavailable'));
      renderWithProviders(<Efficiency />);
      expect(screen.queryByTestId('compute-card')).not.toBeInTheDocument();
    });
  });

  describe('no providers', () => {
    it('renders NoProviders when providers count is 0', () => {
      (providersSelectors.selectProvidersFetchStatus as jest.Mock).mockReturnValue(FetchStatus.complete);
      (filterProviders as jest.Mock).mockReturnValue({ data: [], meta: { count: 0 } });
      renderWithProviders(<Efficiency />);
      expect(screen.getByTestId('no-providers')).toBeInTheDocument();
    });

    it('does not render the main content when there are no providers', () => {
      (providersSelectors.selectProvidersFetchStatus as jest.Mock).mockReturnValue(FetchStatus.complete);
      (filterProviders as jest.Mock).mockReturnValue({ data: [], meta: { count: 0 } });
      renderWithProviders(<Efficiency />);
      expect(screen.queryByTestId('compute-card')).not.toBeInTheDocument();
    });
  });

  describe('no data', () => {
    it('renders NoData when neither current nor previous month data is available', () => {
      (providersSelectors.selectProvidersFetchStatus as jest.Mock).mockReturnValue(FetchStatus.complete);
      (filterProviders as jest.Mock).mockReturnValue({ data: [{}], meta: { count: 1 } });
      (hasCurrentMonthData as jest.Mock).mockReturnValue(false);
      (hasPreviousMonthData as jest.Mock).mockReturnValue(false);
      renderWithProviders(<Efficiency />);
      expect(screen.getByTestId('no-data')).toBeInTheDocument();
    });
  });

  describe('populated state', () => {
    beforeEach(() => {
      (providersSelectors.selectProvidersFetchStatus as jest.Mock).mockReturnValue(FetchStatus.complete);
      (filterProviders as jest.Mock).mockReturnValue(populatedProviders);
      (hasCurrentMonthData as jest.Mock).mockReturnValue(true);
    });

    it('renders ComputeCard and MemoryCard side-by-side', () => {
      renderWithProviders(<Efficiency />);
      expect(screen.getByTestId('compute-card')).toBeInTheDocument();
      expect(screen.getByTestId('memory-card')).toBeInTheDocument();
    });

    it('renders the EfficiencyHeader', () => {
      renderWithProviders(<Efficiency />);
      expect(screen.getByTestId('efficiency-header')).toBeInTheDocument();
    });

    it('shows the operator update alert when a provider has operator_update_available: true', () => {
      (filterProviders as jest.Mock).mockReturnValue({
        data: [{ additional_context: { operator_update_available: true } }],
        meta: { count: 1 },
      });
      renderWithProviders(<Efficiency />);
      // The PatternFly Alert title renders as visible text
      expect(
        screen.getByText('New version of the Cost Management operator available.')
      ).toBeInTheDocument();
    });

    it('does not show the operator alert when no provider has operator_update_available', () => {
      (filterProviders as jest.Mock).mockReturnValue(populatedProviders);
      renderWithProviders(<Efficiency />);
      expect(
        screen.queryByText('New version of the Cost Management operator available.')
      ).not.toBeInTheDocument();
    });
  });
});
