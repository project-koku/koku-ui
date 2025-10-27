import { render } from '@testing-library/react';
import React from 'react';
import DailyCostChart from './dailyCostChart';

const captured: Array<{ comp: string; props: any }> = [];

jest.mock('routes/components/charts/chartTheme', () => ({ __esModule: true, default: {} }));

jest.mock('@patternfly/react-charts/victory', () => ({
  __esModule: true,
  Chart: ({ children, height }: any) => <div data-testid="chart" style={{ height: height || 200 }}>{children}</div>,
  ChartAxis: () => null,
  ChartBar: (props: any) => {
    captured.push({ comp: 'ChartBar', props });
    return null;
  },
  ChartGroup: ({ children }: any) => <div>{children}</div>,
  ChartLegend: () => null,
  ChartLegendTooltip: (props: any) => <div {...props} />,
  ChartLine: (props: any) => {
    captured.push({ comp: 'ChartLine', props });
    return null;
  },
  createContainer: () => (props: any) => <div {...props} />,
  getInteractiveLegendEvents: () => ({}),
}));

jest.mock('routes/components/charts/common/chartUtils', () => ({
  __esModule: true,
  getChartNames: (s: any[]) => s?.map((x, i) => `${x.childName}-${i}`) || [],
  getDomain: () => ({}),
  getLegendData: () => [],
  getResizeObserver: () => (_: any, cb: any) => {
    // Simulate a container width to avoid NaN dependent computations
    cb?.({ clientWidth: 400 });
    return () => {};
  },
  getTooltipLabel: () => 'label',
  initHiddenSeries: (_s: any, hidden: Set<number>, index: number) => {
    const next = new Set(hidden);
    next.has(index) ? next.delete(index) : next.add(index);
    return next;
  },
  isDataAvailable: () => true,
  isSeriesHidden: (hidden: Set<number>, index: number) => hidden.has(index),
}));

describe('DailyCostChart', () => {
  beforeEach(() => {
    captured.length = 0;
  });

  const baseProps = {
    intl: { formatMessage: () => '' } as any,
    currentCostData: [],
    previousCostData: [],
    forecastData: [],
    forecastConeData: [],
    showForecast: true,
    baseHeight: 200,
  } as any;

  test('renders bars and forecast groups', () => {
    render(<DailyCostChart {...baseProps} />);
    expect(captured.some(c => c.comp === 'ChartBar')).toBe(true);
  });
}); 