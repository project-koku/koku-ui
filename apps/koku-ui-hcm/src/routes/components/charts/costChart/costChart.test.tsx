import { render, screen } from '@testing-library/react';
import React from 'react';
import CostChart from './costChart';

// Capture calls to area charts
const captured: Array<{ comp: string; props: any }> = [];

jest.mock('routes/components/charts/chartTheme', () => ({ __esModule: true, default: {} }));

jest.mock('@patternfly/react-charts/victory', () => ({
  __esModule: true,
  Chart: ({ children, height }: any) => <div data-testid="chart" style={{ height: height || 200 }}>{children}</div>,
  ChartArea: (props: any) => {
    captured.push({ comp: 'ChartArea', props });
    return null;
  },
  ChartAxis: () => null,
  ChartLegend: () => null,
  ChartLegendTooltip: (props: any) => <div {...props} />,
  createContainer: () => (props: any) => <div {...props} />,
  getInteractiveLegendEvents: () => ({}),
}));

jest.mock('routes/components/charts/common/chartUtils', () => ({
  __esModule: true,
  getChartNames: (s: any[]) => s?.map((x, i) => `${x.childName}-${i}`) || [],
  getDomain: () => ({}),
  getLegendData: () => [],
  getResizeObserver: () => (_: any, cb: any) => {
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

describe('CostChart', () => {
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

  test('renders title when provided', () => {
    render(<CostChart {...baseProps} title="My Title" />);
    expect(screen.getByText('My Title')).toBeInTheDocument();
  });

  test('creates series for previous, current, and forecast variants', () => {
    render(<CostChart {...baseProps} />);
    const areas = captured.filter(c => c.comp === 'ChartArea');
    // previousCost + currentCost + forecast + forecastCone
    expect(areas.length).toBe(4);
    expect(areas.map(a => a.props.name)).toEqual(
      expect.arrayContaining(['previousCost', 'currentCost', 'forecast', 'forecastCone'])
    );
  });
}); 