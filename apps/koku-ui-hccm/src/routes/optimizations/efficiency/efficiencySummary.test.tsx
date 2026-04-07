import { render, screen } from '@testing-library/react';
import React from 'react';

// Mock injectIntl to inject a stub intl that returns the {value} argument or the message's defaultMessage.
// This is the established pattern in this codebase (see currency.test.tsx).
jest.mock('react-intl', () => {
  const actual = jest.requireActual('react-intl');
  return {
    __esModule: true,
    ...actual,
    injectIntl: (Comp: any) => (props: any) =>
      React.createElement(Comp, {
        ...props,
        intl: {
          formatMessage: (msg: any, values?: any) => values?.value ?? msg?.defaultMessage ?? '',
        },
      }),
  };
});

// withRouter is not used in the render method; mock it to identity to avoid router context.
jest.mock('utils/router', () => ({
  withRouter: (Component: any) => Component,
}));

// Return predictable formatted strings
jest.mock('utils/format', () => ({
  formatPercentage: jest.fn((value: number) => `${value ?? 0}%`),
  formatCurrency: jest.fn((value: number, units: string) => `${units ?? 'USD'}${value ?? 0}`),
}));

// Import after mocks so the mocked injectIntl is used
import { EfficiencySummary } from './efficiencySummary';

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

describe('EfficiencySummary', () => {
  describe('rendering', () => {
    it('renders the usage efficiency percentage from report', () => {
      render(<EfficiencySummary report={mockReport} />);
      // intl stub: formatMessage(messages.percent, { value: '75%' }) → '75%'
      expect(screen.getByText('75%')).toBeInTheDocument();
    });

    it('renders the wasted cost value from report', () => {
      render(<EfficiencySummary report={mockReport} />);
      // intl stub: formatMessage(messages.percent, { value: 'USD100' }) → 'USD100'
      expect(screen.getByText('USD100')).toBeInTheDocument();
    });

    it('renders the Wasted Cost section heading', () => {
      render(<EfficiencySummary report={mockReport} />);
      // intl stub: formatMessage(messages.wastedCost) → defaultMessage 'Wasted cost'
      expect(screen.getByRole('heading', { name: 'Wasted cost' })).toBeInTheDocument();
    });

    it('renders 0% without crashing when report is null', () => {
      render(<EfficiencySummary report={null as any} />);
      // formatPercentage(0) → '0%' ; formatMessage(messages.percent, { value: '0%' }) → '0%'
      expect(screen.getByText('0%')).toBeInTheDocument();
    });

    it('renders USD0 without crashing when report has no score data', () => {
      render(<EfficiencySummary report={{} as any} />);
      // formatCurrency(0, 'USD') → 'USD0'; formatMessage(messages.percent, { value: 'USD0' }) → 'USD0'
      expect(screen.getByText('USD0')).toBeInTheDocument();
    });
  });
});
