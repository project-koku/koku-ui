import { render, screen } from '@testing-library/react';
import React from 'react';

import { OptimizationsBreakdownChart } from './optimizationsBreakdownChart';

jest.mock('routes/components/charts/theme', () => ({
  __esModule: true,
  default: {},
}));

jest.mock('routes/components/charts/common/chartUtils', () => {
  const actual = jest.requireActual('routes/components/charts/common/chartUtils');
  return {
    ...actual,
    getLegendData: () => [],
    getDomain: () => ({}),
    getResizeObserver: () => () => undefined,
  };
});

jest.mock('@patternfly/react-charts/victory', () => {
  const ReactLib = require('react');
  const Dummy = ({ children }) => ReactLib.createElement('div', null, children);
  return {
    Chart: ({ children, legendAllowWrap }) => {
      ReactLib.useEffect(() => {
        legendAllowWrap?.(12);
      }, [legendAllowWrap]);
      return ReactLib.createElement('div', { 'data-testid': 'chart' }, children);
    },
    ChartArea: ({ name }) => ReactLib.createElement('div', { 'data-testid': name }),
    ChartAxis: Dummy,
    ChartBoxPlot: ({ name }) => ReactLib.createElement('div', { 'data-testid': name }),
    ChartLegend: Dummy,
    ChartLegendTooltip: Dummy,
    ChartScatter: ({ name }) => ReactLib.createElement('div', { 'data-testid': name }),
    createContainer: () => Dummy,
    getInteractiveLegendEvents: () => [],
  };
});

const requestData = [{ key: '2024-01-20', x: '12:00', y: 5, units: 'cores', name: 'request' }];
const limitData = [{ key: '2024-01-20', x: '12:00', y: 7, units: '', name: 'limit' }];
const usageData = [
  { key: '2024-01-20T06', x: '06:00', y: [1, 1, 1, 1, 1], units: 'cores', name: 'cpuUsage' },
  { key: '2024-01-20T12', x: '12:00', y: [0, 2.5, 5, 7.5, 10], units: 'cores', name: 'cpuUsage' },
];

describe('OptimizationsBreakdownChart', () => {
  test('renders request, limit, scatter, and usage series', () => {
    render(
      <OptimizationsBreakdownChart
        baseHeight={200}
        name="cpu-chart"
        requestData={requestData}
        limitData={limitData}
        usageData={usageData}
      />
    );
    expect(screen.getByTestId('chart')).toBeInTheDocument();
    expect(screen.getByTestId('request')).toBeInTheDocument();
    expect(screen.getByTestId('limit')).toBeInTheDocument();
    expect(screen.getByTestId('usage')).toBeInTheDocument();
    expect(screen.getByTestId('scatter')).toBeInTheDocument();
  });

  test('renders without series data and with custom padding', () => {
    render(<OptimizationsBreakdownChart baseHeight={100} name="empty-chart" padding={{ bottom: 10, left: 10 }} />);
    expect(screen.getByTestId('chart')).toBeInTheDocument();
  });
});
