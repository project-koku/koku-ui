import { screen } from '@testing-library/react';
import React from 'react';

// Return predictable formatted strings so assertions are locale-independent
jest.mock('utils/format', () => ({
  formatPercentage: jest.fn((value: number) => `${value ?? 0}%`),
  formatCurrency: jest.fn((value: number, units: string) => `${units ?? 'USD'}${value ?? 0}`),
}));

jest.mock('components/featureToggle', () => ({
  useIsWastedCostToggleEnabled: jest.fn(() => true),
}));

import { renderWithProviders } from 'routes/optimizations/efficiency/testUtils';
import { WorkloadSummary } from './workloadSummary';

const mockReport = {
  meta: {
    total: {
      total_score: {
        usage_efficiency_percent: 75,
        wasted_cost: {
          value: 100,
          units: 'USD',
        },
      },
    },
  },
} as any;

describe('WorkloadSummary', () => {
  describe('rendering', () => {
    it('renders the usage efficiency percentage from report', () => {
      renderWithProviders(<WorkloadSummary report={mockReport} />);
      // messages.percent template is '{value} %', so formatPercentage(75) → '75%' → '75% %'
      expect(screen.getByText(/75%/)).toBeInTheDocument();
    });

    it('renders the wasted cost value from report', () => {
      renderWithProviders(<WorkloadSummary report={mockReport} />);
      // formatCurrency(100, 'USD') → 'USD100'; then '% %' template wraps it
      expect(screen.getByText(/USD100/)).toBeInTheDocument();
    });

    it('renders the Wasted Cost section heading', () => {
      renderWithProviders(<WorkloadSummary report={mockReport} />);
      // messages.wastedCost.defaultMessage = 'Wasted cost'
      expect(screen.getByRole('heading', { name: 'Wasted cost' })).toBeInTheDocument();
    });

    it('renders 0% without crashing when report is null', () => {
      renderWithProviders(<WorkloadSummary report={null as any} />);
      // formatPercentage(0) → '0%'; rendered as '0% %'
      expect(screen.getByText(/0%/)).toBeInTheDocument();
    });

    it('renders USD0 without crashing when report has no score data', () => {
      renderWithProviders(<WorkloadSummary report={{} as any} />);
      // formatCurrency(0, 'USD') → 'USD0'
      expect(screen.getByText(/USD0/)).toBeInTheDocument();
    });
  });
});
