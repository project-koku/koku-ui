import { render } from '@testing-library/react';
import React from 'react';
import DailyCostChart from './dailyCostChart';

const captured: Array<{ comp: string; props: any }> = [];

jest.mock('routes/components/charts/chartTheme', () => ({ __esModule: true, default: {} }));

jest.mock('@patternfly/react-charts/victory', () => ({
  __esModule: true,
  Chart: ({ children }: any) => <div data-testid="chart">{children}</div>,
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
  getResizeObserver: () => () => {},
  getTooltipLabel: () => 'label',
  initHiddenSeries: (_s: any, hidden: Set<number>, index: number) => {
    const next = new Set(hidden);
    next.has(index) ? next.delete(index) : next.add(index);
    return next;
  },
  isDataAvailable: () => true,
  isDataHidden: () => false,
  isSeriesHidden: (hidden: Set<number>, index: number) => hidden.has(index),
}));

describe('DailyCostChart', () => {
  beforeEach(() => {
    captured.length = 0;
  });

  const makeDatum = (childName: string) => [{ x: 1, y: 1, childName }];

  const baseProps = {
    intl: { formatMessage: () => '' } as any,
    currentCostData: makeDatum('currentCost'),
    previousCostData: makeDatum('previousCost'),
    forecastData: makeDatum('forecast'),
    forecastConeData: makeDatum('forecastCone'),
    showForecast: true,
  } as any;

  test('renders bars and forecast groups', () => {
    render(<DailyCostChart {...baseProps} />);
    expect(captured.some(c => c.comp === 'ChartBar')).toBe(true);
  });
}); 