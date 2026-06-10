import { fireEvent, render, screen } from '@testing-library/react';
import React from 'react';
import { IntlProvider } from 'react-intl';

import { FetchStatus } from 'store/common';

import { TimelineChart } from './timelineChart';

const mockFullPriceList = {
  data: [
    {
      uuid: 'pl-1',
      name: 'List A',
      effective_start_date: '2024-01-01',
      effective_end_date: '2024-06-30',
    },
    {
      uuid: 'pl-2',
      name: 'List B',
      effective_start_date: '2024-07-01',
      effective_end_date: '2024-12-31',
    },
  ],
};

jest.mock('../../utils', () => ({
  useFetchPriceLists: jest.fn(() => ({
    priceList: mockFullPriceList,
    priceListError: null,
    priceListFetchStatus: FetchStatus.complete,
  })),
}));

jest.mock('@patternfly/react-tokens/dist/esm/t_chart_color_black_500', () => ({
  __esModule: true,
  default: '#000',
}));

jest.mock('@patternfly/react-charts/victory', () => ({
  __esModule: true,
  Chart: ({ children }: any) => <div data-testid="chart">{children}</div>,
  ChartAxis: () => null,
  ChartBar: () => null,
  ChartGroup: ({ children }: any) => <div>{children}</div>,
  ChartLabel: () => null,
  ChartLine: () => null,
  ChartThemeColor: { gray: 'gray', multiUnordered: 'multi' },
  ChartTooltip: () => null,
  ChartVoronoiContainer: () => null,
}));

jest.mock('routes/components/charts/common/chartUtils', () => ({
  __esModule: true,
  getResizeObserver: () => (_: any, cb: any) => {
    cb?.({ clientWidth: 400 });
    return () => {};
  },
}));

const priceLists = [
  {
    name: 'List A',
    priority: 1,
    effective_start_date: '2024-01-01',
    effective_end_date: '2024-06-30',
    uuid: 'pl-1',
  },
  {
    name: 'List B',
    priority: 2,
    effective_start_date: '2024-07-01',
    effective_end_date: '2024-12-31',
    uuid: 'pl-2',
  },
] as any;

describe('TimelineChart', () => {
  test('renders chart with price lists', () => {
    render(
      <IntlProvider locale="en">
        <TimelineChart priceLists={priceLists} />
      </IntlProvider>
    );
    expect(screen.getByTestId('chart')).toBeInTheDocument();
  });

  test('shows empty state when no price lists', () => {
    render(
      <IntlProvider locale="en">
        <TimelineChart isReset onResetClick={jest.fn()} priceLists={[]} />
      </IntlProvider>
    );
    expect(screen.getByText(/no price lists selected/i)).toBeInTheDocument();
  });

  test('reset button calls onResetClick', () => {
    const onResetClick = jest.fn();
    render(
      <IntlProvider locale="en">
        <TimelineChart isReset onResetClick={onResetClick} priceLists={priceLists} />
      </IntlProvider>
    );
    fireEvent.click(screen.getByRole('button', { name: /reset/i }));
    expect(onResetClick).toHaveBeenCalled();
  });
});
